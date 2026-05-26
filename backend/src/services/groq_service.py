from __future__ import annotations

import json

import httpx

from src.core.settings import settings
from src.utils.heuristics import analyze_with_heuristics


class GroqService:
    async def analyze(self, text: str, dataset_context: dict | None = None) -> dict | None:
        if not settings.groq_api_key:
            return None

        payload = self._build_payload(text=text, dataset_context=dataset_context or {})
        headers = {
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(settings.groq_api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()

        content = data["choices"][0]["message"]["content"]

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            return analyze_with_heuristics(text)

        return {
            "classification": parsed.get("classification", "fake"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "indicators": parsed.get("indicators", []),
        }

    def _build_payload(self, text: str, dataset_context: dict) -> dict:
        system_prompt = (
            "Você analisa notícias e retorna apenas JSON com classification, confidence e indicators. "
            "classification deve ser true ou fake. confidence deve ser um número entre 0 e 1.\n"
            "Regras obrigatórias de ceticismo (siga rigorosamente):\n"
            "1) NÃO confie cegamente em formatação jornalística, templates de portais ou menções a veículos famosos (ex.: G1, CNN, Globo, BBC, Folha, UOL, Estadão) — essas são sinais a serem verificados, NÃO provas.\n"
            "2) NÃO aceite citações genéricas de 'especialistas' como prova. Exija fontes verificáveis; se não houver fonte, trate como suspeito.\n"
            "3) AVALIE a plausibilidade das alegações: notícias sobre alienígenas, OVNIs, Terra Plana, curas milagrosas, fenômenos sobrenaturais ou teorias da conspiração devem ter a confiabilidade drasticamente reduzida e, salvo evidência verificável explicitamente citada, classificar como fake.\n"
            "4) Se o texto imitar um portal, incluir cabeçalhos/timestamps ou copiar estilo jornalístico sem links verificáveis, considere isso um indicador de risco e reduza a confiança.\n"
            "5) Sempre justifique a decisão no campo 'indicators' listando as evidências textuais (ex.: 'imita formato do G1', 'alegação extraordinária sem fonte', 'cita especialistas sem link').\n"
            "6) Saída estrita: retorne somente JSON com as chaves 'classification' ('true' ou 'fake'), 'confidence' (float entre 0 e 1) e 'indicators' (lista de strings)."
        )

        user_prompt = {
            "text": text,
            "dataset_context": dataset_context,
        }

        return {
            "model": settings.groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_prompt, ensure_ascii=False)},
            ],
            "temperature": 0.2,
        }