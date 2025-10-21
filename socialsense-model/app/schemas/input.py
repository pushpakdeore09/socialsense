from pydantic import BaseModel # type: ignore
from typing import List

class PredictionRequest(BaseModel):
    features: List[float]


class PredictionResponse(BaseModel):
    prediction: int
    confidence: float