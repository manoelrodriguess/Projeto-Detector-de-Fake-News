from fastapi import APIRouter, Depends

from src.controllers.analysis_controller import AnalysisController, get_analysis_controller
from src.models.schemas import AnalysisRequest, AnalysisResponse


router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_news(
    payload: AnalysisRequest,
    controller: AnalysisController = Depends(get_analysis_controller),
) -> AnalysisResponse:
    return await controller.analyze(payload)


@router.post("/analisar", response_model=AnalysisResponse, include_in_schema=False)
async def analyze_news_pt(
    payload: AnalysisRequest,
    controller: AnalysisController = Depends(get_analysis_controller),
) -> AnalysisResponse:
    return await controller.analyze(payload)