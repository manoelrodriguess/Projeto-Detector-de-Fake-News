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
            "classification deve ser true ou fake. confidence deve ser um número entre 0 e 1."
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