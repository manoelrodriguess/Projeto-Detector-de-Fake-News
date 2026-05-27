from pydantic import BaseModel, Field


class AnalysisMetrics(BaseModel):
    atualizacao: int = Field(..., ge=0, le=100)
    clareza: int = Field(..., ge=0, le=100)
    precisao: int = Field(..., ge=0, le=100)
    confiabilidade: int = Field(..., ge=0, le=100)


class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalysisResponse(BaseModel):
    classification: str
    confidence: float
    metrics: AnalysisMetrics
    indicators: list[str]