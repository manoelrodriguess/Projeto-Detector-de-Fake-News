from __future__ import annotations

import json

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
            parsed = json.loads(content)
        except json.JSONDecodeError:
            fallback = analyze_with_heuristics(text)
            fallback.setdefault("suspicious_spans", [])
            return fallback

        expected_keys = {"classification", "confidence", "indicators", "suspicious_spans"}
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

        suspicious_spans = parsed.get("suspicious_spans", [])
        if not isinstance(suspicious_spans, list):
            raise ValueError('Campo "suspicious_spans" precisa ser uma lista.')

        return {
            "classification": classification,
            "confidence": confidence,
            "indicators": indicators,
            "suspicious_spans": suspicious_spans,
        }

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