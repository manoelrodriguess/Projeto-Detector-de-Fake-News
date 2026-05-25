from dataclasses import dataclass, field
from os import getenv

from dotenv import load_dotenv


load_dotenv()


def _parse_cors_origins(raw_value: str | None) -> list[str]:
    if not raw_value or raw_value.strip() == "*":
        return ["*"]

    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = getenv("APP_NAME", "Detector de Fake News API")
    cors_origins: list[str] = field(default_factory=lambda: _parse_cors_origins(getenv("CORS_ORIGINS", "*")))
    groq_api_key: str = getenv("GROQ_API_KEY", "")
    groq_api_url: str = getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
    groq_model: str = getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    dataset_api_url: str = getenv("DATASET_API_URL", "")
    dataset_api_key: str = getenv("DATASET_API_KEY", "")
    dataset_api_path: str = getenv("DATASET_API_PATH", "/search")
    dataset_query_param: str = getenv("DATASET_QUERY_PARAM", "query")


settings = Settings()