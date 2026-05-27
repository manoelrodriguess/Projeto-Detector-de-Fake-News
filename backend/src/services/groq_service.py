from __future__ import annotations

import json
import re

import httpx

from src.core.settings import settings
from src.utils.heuristics import analyze_with_heuristics

try:
    from src.prompts import ANALYSIS_PROMPT
except ModuleNotFoundError:
    from backend.src.prompts import ANALYSIS_PROMPT


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
            parsed = self.clean_and_parse_json(content)
        except (json.JSONDecodeError, ValueError):
            fallback = analyze_with_heuristics(text)
            fallback.setdefault("suspicious_spans", [])
            fallback.setdefault(
                "metrics",
                {
                    "atualizacao": 50,
                    "clareza": 50,
                    "precisao": 50,
                    "confiabilidade": 50,
                },
            )
            return fallback

        expected_keys = {"classification", "confidence", "metrics", "indicators", "suspicious_spans"}
        if set(parsed.keys()) != expected_keys:
            raise ValueError(f"A resposta da Groq precisa conter exatamente as chaves: {', '.join(sorted(expected_keys))}.")

        classification = str(parsed.get("classification", "")).strip().lower()
        if classification not in {"true", "fake"}:
            raise ValueError('Campo "classification" precisa ser "true" ou "fake".')

        confidence = float(parsed.get("confidence", 0.0))
        if confidence < 0.0 or confidence > 1.0:
            raise ValueError('Campo "confidence" precisa estar entre 0.0 e 1.0.')

        indicators = parsed.get("indicators", [])
        if not isinstance(indicators, list) or not all(isinstance(item, str) for item in indicators):
            raise ValueError('Campo "indicators" precisa ser uma lista de strings.')

        metrics = self._validate_metrics(parsed.get("metrics"))

        suspicious_spans = parsed.get("suspicious_spans", [])
        if not isinstance(suspicious_spans, list):
            raise ValueError('Campo "suspicious_spans" precisa ser uma lista.')

        return {
            "classification": classification,
            "confidence": confidence,
            "metrics": metrics,
            "indicators": indicators,
            "suspicious_spans": suspicious_spans,
        }

    def clean_and_parse_json(self, raw_content: str) -> dict:
        cleaned = raw_content.strip()

        fence_pattern = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE | re.DOTALL)
        cleaned = fence_pattern.sub("", cleaned).strip()

        return json.loads(cleaned)

    def _validate_metrics(self, metrics: object) -> dict[str, int]:
        if not isinstance(metrics, dict):
            raise ValueError('Campo "metrics" precisa ser um objeto JSON.')

        required_keys = {"atualizacao", "clareza", "precisao", "confiabilidade"}
        if set(metrics.keys()) != required_keys:
            raise ValueError(f"Campo \"metrics\" precisa conter exatamente: {', '.join(sorted(required_keys))}.")

        validated: dict[str, int] = {}
        for key in required_keys:
            value = metrics.get(key)
            if not isinstance(value, int):
                raise ValueError(f'Campo "metrics.{key}" precisa ser um inteiro.')
            if value < 0 or value > 100:
                raise ValueError(f'Campo "metrics.{key}" precisa estar entre 0 e 100.')
            validated[key] = value

        return validated

    def _build_payload(self, text: str, dataset_context: dict) -> dict:
        user_prompt = {
            "text": text,
            "dataset_context": dataset_context,
        }

        return {
            "model": settings.groq_model,
            "messages": [
                {"role": "system", "content": ANALYSIS_PROMPT},
                {"role": "user", "content": json.dumps(user_prompt, ensure_ascii=False)},
            ],
            "temperature": 0.2,
        }