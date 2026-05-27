from __future__ import annotations

import json
import os
import random
import base64
from mimetypes import guess_type
from io import BytesIO
from pathlib import Path
from typing import Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from PIL import Image
from pypdf import PdfReader
from pydantic import BaseModel, Field

try:
    from src.prompts import ANALYSIS_PROMPT
except ModuleNotFoundError:
    from backend.src.prompts import ANALYSIS_PROMPT

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")
APP_NAME = os.getenv("APP_NAME", "Detector de Fake News API")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_VISION_MODEL = os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
GROQ_VISION_MODELS = [
    candidate.strip()
    for candidate in os.getenv(
        "GROQ_VISION_MODELS",
        "meta-llama/llama-4-scout-17b-16e-instruct,llama-3.2-90b-vision-preview,llama-3.2-11b-vision-preview",
    ).split(",")
    if candidate.strip()
]
# Pesos de calibração ajustáveis via .env
try:
    W_MODEL = float(os.getenv("W_MODEL", "0.8"))
except Exception:
    W_MODEL = 0.8

try:
    W_DATA = float(os.getenv("W_DATA", "0.2"))
except Exception:
    W_DATA = 0.2
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
] or ["*"]


app = FastAPI(title=APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NoticiaInput(BaseModel):
    text: str = Field(..., min_length=1, description="Texto da notícia enviado pelo frontend")


class AnaliseResposta(BaseModel):
    classification: str
    confidence: float
    indicators: list[str]
    suspicious_spans: list[dict[str, str]] = Field(default_factory=list)
    confidence_raw: float | None = None


class AnaliseArquivoResposta(AnaliseResposta):
    extracted_text: str


def _resolve_dataset_file(possible_paths: list[Path], label: str) -> Path:
    for path in possible_paths:
        if path.is_file():
            return path

    searched = " | ".join(str(path) for path in possible_paths)
    raise FileNotFoundError(f"Arquivo CSV do dataset '{label}' não encontrado. Caminhos verificados: {searched}")


def _candidate_paths(filename: str) -> list[Path]:
    return [
        BASE_DIR / "data" / filename,
        BASE_DIR / "dataset" / filename,
        BASE_DIR / "dataset" / filename / filename,
        BASE_DIR / filename,
    ]


def _load_dataframe(file_path: Path, label: str) -> pd.DataFrame:
    dataframe = pd.read_csv(file_path)
    dataframe = dataframe.copy()
    dataframe["__gabarito__"] = label
    return dataframe


def _pick_column(dataframe: pd.DataFrame, candidates: list[str], fallback_index: int = 0) -> str:
    normalized = {str(column).strip().lower(): column for column in dataframe.columns}

    for candidate in candidates:
        if candidate.lower() in normalized:
            return normalized[candidate.lower()]

    if len(dataframe.columns) == 0:
        raise ValueError("O CSV não possui colunas.")

    return dataframe.columns[fallback_index]


def _build_random_item(dataframe: pd.DataFrame, label: str) -> dict[str, Any]:
    row = dataframe.sample(n=1).iloc[0]
    title_column = _pick_column(dataframe, ["title", "titulo", "headline", "subject"])
    text_column = _pick_column(
        dataframe,
        ["text", "texto", "content", "body"],
        fallback_index=min(1, len(dataframe.columns) - 1),
    )

    title_value = row.get(title_column, "")
    text_value = row.get(text_column, "")

    return {
        "title": "" if pd.isna(title_value) else str(title_value),
        "text": "" if pd.isna(text_value) else str(text_value),
        "gabarito": label,
    }


def _load_datasets() -> tuple[pd.DataFrame, pd.DataFrame]:
    true_file = _resolve_dataset_file(_candidate_paths("True.csv"), "true")
    fake_file = _resolve_dataset_file(_candidate_paths("Fake.csv"), "fake")
    df_true = _load_dataframe(true_file, "true")
    df_fake = _load_dataframe(fake_file, "fake")
    return df_true, df_fake


def _build_groq_client() -> Groq:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY não configurada no arquivo .env")
    return Groq(api_key=GROQ_API_KEY)


def _extract_json_content(raw_content: str, expected_keys: set[str] | None = None) -> dict[str, Any]:
    try:
        parsed = json.loads(raw_content)
    except json.JSONDecodeError as exc:
        raise ValueError(f"A resposta da Groq não veio em JSON válido: {exc}") from exc

    if not isinstance(parsed, dict):
        raise ValueError("A resposta da Groq precisa ser um objeto JSON.")

    if expected_keys is not None and set(parsed.keys()) != expected_keys:
        expected = ", ".join(sorted(expected_keys))
        raise ValueError(f"A resposta da Groq precisa conter exatamente as chaves: {expected}.")

    return parsed


def _normalize_suspicious_spans(spans: Any) -> list[dict[str, str]]:
    if not isinstance(spans, list):
        return []

    normalized: list[dict[str, str]] = []
    for item in spans:
        if not isinstance(item, dict):
            continue

        excerpt = str(item.get("excerpt", item.get("text", ""))).strip()
        reason = str(item.get("reason", item.get("why", ""))).strip()

        if not excerpt:
            continue

        normalized.append(
            {
                "excerpt": excerpt,
                "reason": reason or "Trecho apontado pela análise como possivelmente falso.",
            }
        )

    return normalized


def _compute_dataset_similarity_scores(text: str, samples: int = 40) -> tuple[float, float]:
    """Retorna (mean_true_similarity, mean_fake_similarity) usando TF-IDF + cosine similarity.

    Se os vetores do dataset foram pré-construídos em app.state, usa-os para computar similaridades.
    """
    df_true = getattr(app.state, "df_true", None)
    df_fake = getattr(app.state, "df_fake", None)

    if df_true is None or df_fake is None:
        return 0.0, 0.0

    # Usa vetores pré-computados quando disponíveis
    vec_true = getattr(app.state, "_tfidf_true_vectors", None)
    vec_fake = getattr(app.state, "_tfidf_fake_vectors", None)
    vect = getattr(app.state, "_tfidf_vectorizer", None)

    try:
        if vect is None or (vec_true is None and vec_fake is None):
            # fallback simples: sem vetor, retorna zeros
            return 0.0, 0.0

        text_vec = vect.transform([text])

        mean_true = 0.0
        mean_fake = 0.0

        if vec_true is not None and vec_true.shape[0] > 0:
            sims = cosine_similarity(text_vec, vec_true)
            mean_true = float(sims.mean())

        if vec_fake is not None and vec_fake.shape[0] > 0:
            sims = cosine_similarity(text_vec, vec_fake)
            mean_fake = float(sims.mean())

        return mean_true, mean_fake
    except Exception:
        return 0.0, 0.0


def _extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    extracted_parts: list[str] = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text.strip():
            extracted_parts.append(page_text.strip())

    return "\n\n".join(extracted_parts).strip()


def _supported_image_suffixes() -> set[str]:
    return {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".gif"}


def _validate_image_upload(file: UploadFile, file_bytes: bytes) -> tuple[str, str]:
    filename = file.filename or "imagem"
    suffix = Path(filename).suffix.lower()
    content_type = (file.content_type or guess_type(filename)[0] or "").lower()

    if suffix not in _supported_image_suffixes() and not content_type.startswith("image/"):
        raise ValueError("Tipo de arquivo não suportado. Envie uma imagem PNG, JPG, JPEG, WEBP, BMP, TIFF ou GIF.")

    try:
        image = Image.open(BytesIO(file_bytes))
        image.verify()
    except Exception as exc:
        raise ValueError(f"O arquivo enviado não parece ser uma imagem válida: {exc}") from exc

    mime_type = content_type if content_type.startswith("image/") else (guess_type(filename)[0] or "image/png")
    return suffix or ".png", mime_type


def _image_bytes_to_data_url(file_bytes: bytes, mime_type: str) -> str:
    encoded = base64.b64encode(file_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def _analyze_image_with_groq(file_bytes: bytes, mime_type: str) -> tuple[AnaliseResposta, str]:
    if app.state.groq_error:
        raise HTTPException(status_code=500, detail=f"Groq indisponível: {app.state.groq_error}")

    if app.state.groq_client is None:
        raise HTTPException(status_code=500, detail="Cliente da Groq não inicializado.")

    data_url = _image_bytes_to_data_url(file_bytes, mime_type)

    prompt_user = (
        "Analise a imagem abaixo e retorne apenas o JSON solicitado. "
        "Leia o conteúdo textual da imagem com atenção e classifique a notícia."
    )

    last_error: Exception | None = None

    for model_name in [GROQ_VISION_MODEL, *GROQ_VISION_MODELS]:
        if not model_name:
            continue

        try:
            response = app.state.groq_client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": ANALYSIS_PROMPT},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt_user},
                            {"type": "image_url", "image_url": {"url": data_url}},
                        ],
                    },
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )

            raw_content = response.choices[0].message.content or "{}"
            parsed = _extract_json_content(raw_content, {"classification", "confidence", "indicators", "suspicious_spans"})

            classification = str(parsed.get("classification", "")).strip().lower()
            if classification not in {"true", "fake"}:
                raise ValueError('Campo "classification" precisa ser "true" ou "fake".')

            confidence = float(parsed.get("confidence", 0.0))
            if confidence < 0.0 or confidence > 1.0:
                raise ValueError('Campo "confidence" precisa estar entre 0.0 e 1.0.')

            indicators = parsed.get("indicators", [])
            if not isinstance(indicators, list) or not all(isinstance(item, str) for item in indicators):
                raise ValueError('Campo "indicators" precisa ser uma lista de strings.')

            suspicious_spans = _normalize_suspicious_spans(parsed.get("suspicious_spans", []))
            extracted_text = ""

            return (
                AnaliseResposta(
                    classification=classification,
                    confidence=confidence,
                    confidence_raw=confidence,
                    indicators=indicators,
                    suspicious_spans=suspicious_spans,
                ),
                extracted_text,
            )

        except HTTPException:
            raise
        except Exception as exc:
            last_error = exc
            error_message = str(exc).lower()
            if "decommissioned" in error_message or "not supported" in error_message or "unsupported" in error_message:
                continue

    if last_error is not None:
        raise HTTPException(status_code=502, detail=f"Falha ao consultar a Groq Vision: {last_error}") from last_error

    raise HTTPException(status_code=502, detail="Falha ao consultar a Groq Vision: nenhum modelo de visão disponível.")


async def _extract_text_from_upload(file: UploadFile) -> str:
    file_bytes = await file.read()
    if not file_bytes:
        raise ValueError("O arquivo enviado está vazio.")

    suffix = Path(file.filename or "").suffix.lower()
    text_extensions = {".txt", ".md", ".csv", ".json"}

    if suffix in text_extensions:
        try:
            return file_bytes.decode("utf-8-sig").strip()
        except UnicodeDecodeError:
            return file_bytes.decode("latin-1", errors="ignore").strip()

    if suffix == ".pdf":
        return _extract_text_from_pdf(file_bytes)

    try:
        return file_bytes.decode("utf-8-sig").strip()
    except UnicodeDecodeError:
        raise ValueError("Tipo de arquivo não suportado. Envie TXT, PDF ou uma imagem compatível para análise via Groq Vision.")


@app.on_event("startup")
def startup_event() -> None:
    try:
        app.state.df_true, app.state.df_fake = _load_datasets()
        app.state.dataset_error = None
    except Exception as exc:
        app.state.df_true = None
        app.state.df_fake = None
        app.state.dataset_error = str(exc)

    try:
        app.state.groq_client = _build_groq_client()
        app.state.groq_error = None
    except Exception as exc:
        app.state.groq_client = None
        app.state.groq_error = str(exc)

    # Construir TF-IDF vectorizer e vetores do dataset para similaridade
    try:
        if app.state.df_true is not None and app.state.df_fake is not None:
            # detectar colunas de texto
            try:
                col_true = _pick_column(app.state.df_true, ["text", "texto", "content", "body"], fallback_index=1)
            except Exception:
                col_true = app.state.df_true.columns[0] if len(app.state.df_true.columns) > 0 else None

            try:
                col_fake = _pick_column(app.state.df_fake, ["text", "texto", "content", "body"], fallback_index=1)
            except Exception:
                col_fake = app.state.df_fake.columns[0] if len(app.state.df_fake.columns) > 0 else None

            texts = []
            if col_true is not None:
                texts.extend(app.state.df_true[col_true].dropna().astype(str).tolist())
            if col_fake is not None:
                texts.extend(app.state.df_fake[col_fake].dropna().astype(str).tolist())

            if texts:
                vectorizer = TfidfVectorizer(max_features=20000)
                vectorizer.fit(texts)
                app.state._tfidf_vectorizer = vectorizer

                if col_true is not None and len(app.state.df_true) > 0:
                    true_texts = app.state.df_true[col_true].dropna().astype(str).tolist()
                    if true_texts:
                        app.state._tfidf_true_vectors = vectorizer.transform(true_texts)
                    else:
                        app.state._tfidf_true_vectors = None
                else:
                    app.state._tfidf_true_vectors = None

                if col_fake is not None and len(app.state.df_fake) > 0:
                    fake_texts = app.state.df_fake[col_fake].dropna().astype(str).tolist()
                    if fake_texts:
                        app.state._tfidf_fake_vectors = vectorizer.transform(fake_texts)
                    else:
                        app.state._tfidf_fake_vectors = None
                else:
                    app.state._tfidf_fake_vectors = None
            else:
                app.state._tfidf_vectorizer = None
                app.state._tfidf_true_vectors = None
                app.state._tfidf_fake_vectors = None
        else:
            app.state._tfidf_vectorizer = None
            app.state._tfidf_true_vectors = None
            app.state._tfidf_fake_vectors = None
    except Exception:
        app.state._tfidf_vectorizer = None
        app.state._tfidf_true_vectors = None
        app.state._tfidf_fake_vectors = None


@app.get("/")
def health_check() -> dict[str, str]:
    return {"message": "Detector de Fake News API está rodando!"}


@app.get("/api/noticia-aleatoria")
def obter_noticia_aleatoria() -> dict[str, str]:
    if app.state.dataset_error:
        raise HTTPException(status_code=500, detail=f"Falha ao carregar dataset: {app.state.dataset_error}")

    if app.state.df_true is None or app.state.df_fake is None:
        raise HTTPException(status_code=500, detail="Datasets não carregados corretamente.")

    source_name = random.choice(["true", "fake"])
    dataframe = app.state.df_true if source_name == "true" else app.state.df_fake

    try:
        return _build_random_item(dataframe, source_name)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro ao selecionar notícia aleatória: {exc}") from exc


@app.post("/api/analisar", response_model=AnaliseResposta)
def analisar_noticia(payload: NoticiaInput) -> AnaliseResposta:
    return _analyze_text(payload.text)


def _analyze_text(text: str) -> AnaliseResposta:
    if app.state.groq_error:
        raise HTTPException(status_code=500, detail=f"Groq indisponível: {app.state.groq_error}")

    if app.state.groq_client is None:
        raise HTTPException(status_code=500, detail="Cliente da Groq não inicializado.")

    prompt_user = (
        "Analise a notícia abaixo e retorne apenas o JSON solicitado.\n\n"
        f"NOTÍCIA:\n{text.strip()}"
    )

    try:
        response = app.state.groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": ANALYSIS_PROMPT},
                {"role": "user", "content": prompt_user},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = _extract_json_content(raw_content, {"classification", "confidence", "indicators", "suspicious_spans"})

        classification = str(parsed.get("classification", "")).strip().lower()
        if classification not in {"true", "fake"}:
            raise ValueError('Campo "classification" precisa ser "true" ou "fake".')

        confidence = float(parsed.get("confidence", 0.0))
        if confidence < 0.0 or confidence > 1.0:
            raise ValueError('Campo "confidence" precisa estar entre 0.0 e 1.0.')

        indicators = parsed.get("indicators", [])
        if not isinstance(indicators, list) or not all(isinstance(item, str) for item in indicators):
            raise ValueError('Campo "indicators" precisa ser uma lista de strings.')

        suspicious_spans = _normalize_suspicious_spans(parsed.get("suspicious_spans", []))

        # Calibração da confiança: combina confiança do modelo com similaridade ao dataset
        try:
            mean_true, mean_fake = _compute_dataset_similarity_scores(text)
            # evita divisão por zero
            denom = mean_true + mean_fake + 1e-9
            dataset_fake_ratio = mean_fake / denom
        except Exception:
            mean_true = mean_fake = dataset_fake_ratio = 0.0

        # Se o modelo classificou como 'fake', apoiamos em dataset_fake_ratio; se 'true', usamos 1 - dataset_fake_ratio
        data_support = dataset_fake_ratio if classification == 'fake' else (1.0 - dataset_fake_ratio)

        # Pesos: ler do env (W_MODEL, W_DATA)
        w_model = W_MODEL
        w_data = W_DATA

        adjusted_confidence = float(max(0.0, min(1.0, (w_model * confidence) + (w_data * data_support))))

        # Penaliza confiança se texto muito curto
        if len(text.strip()) < 80:
            adjusted_confidence *= 0.9

        adjusted_confidence = round(adjusted_confidence, 3)

        return AnaliseResposta(
            classification=classification,
            confidence=adjusted_confidence,
            confidence_raw=confidence,
            indicators=indicators,
            suspicious_spans=suspicious_spans,
        )

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao consultar a Groq: {exc}") from exc


@app.post("/api/analisar-arquivo", response_model=AnaliseArquivoResposta)
async def analisar_arquivo(file: UploadFile = File(...)) -> AnaliseArquivoResposta:
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="O arquivo enviado está vazio.")

    suffix = Path(file.filename or "").suffix.lower()
    is_image = suffix in _supported_image_suffixes() or (file.content_type or "").lower().startswith("image/")

    if is_image:
        try:
            _, mime_type = _validate_image_upload(file, file_bytes)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        analysis, extracted_text = _analyze_image_with_groq(file_bytes, mime_type)
        return AnaliseArquivoResposta(**analysis.model_dump(), extracted_text=extracted_text)

    await file.seek(0)
    try:
        extracted_text = await _extract_text_from_upload(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Não foi possível ler o arquivo enviado: {exc}") from exc

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto suficiente do arquivo enviado.")

    analysis = _analyze_text(extracted_text)
    return AnaliseArquivoResposta(**analysis.model_dump(), extracted_text=extracted_text)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")), reload=True)