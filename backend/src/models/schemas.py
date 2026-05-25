from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalysisResponse(BaseModel):
    classification: str
    confidence: float
    indicators: list[str]