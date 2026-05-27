from src.models.schemas import AnalysisResponse
from src.services.dataset_service import DatasetService
from src.services.groq_service import GroqService
from src.utils.heuristics import analyze_with_heuristics


def _default_metrics() -> dict[str, int]:
    return {
        "atualizacao": 50,
        "clareza": 50,
        "precisao": 50,
        "confiabilidade": 50,
    }


class AnalysisService:
    def __init__(self) -> None:
        self.dataset_service = DatasetService()
        self.groq_service = GroqService()

    async def analyze(self, text: str) -> AnalysisResponse:
        dataset_context = await self.dataset_service.get_context(text)
        groq_result = await self.groq_service.analyze(text=text, dataset_context=dataset_context)

        if groq_result is None:
            groq_result = analyze_with_heuristics(text)
            groq_result.setdefault("metrics", _default_metrics())

        groq_result.setdefault("metrics", _default_metrics())

        return AnalysisResponse(**groq_result)