from __future__ import annotations

import httpx

from src.core.settings import settings


class DatasetService:
    async def get_context(self, text: str) -> dict:
        if not settings.dataset_api_url:
            return {"source": "local", "items": []}

        request_url = f"{settings.dataset_api_url.rstrip('/')}{settings.dataset_api_path}"
        params = {settings.dataset_query_param: text}
        headers = self._build_headers()

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(request_url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()

    def _build_headers(self) -> dict[str, str]:
        if not settings.dataset_api_key:
            return {}

        return {"Authorization": f"Bearer {settings.dataset_api_key}"}