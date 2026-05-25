from src.models.schemas import AnalysisRequest, AnalysisResponse
from src.services.analysis_service import AnalysisService


class AnalysisController:
    def __init__(self, service: AnalysisService | None = None) -> None:
        self.service = service or AnalysisService()

    async def analyze(self, payload: AnalysisRequest) -> AnalysisResponse:
        return await self.service.analyze(payload.text)


def get_analysis_controller() -> AnalysisController:
    return AnalysisController()