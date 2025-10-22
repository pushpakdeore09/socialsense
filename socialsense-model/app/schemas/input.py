from pydantic import BaseModel # type: ignore
from typing import List

class PredictionRequest(BaseModel):
    text: str
    age: int
    gender: str
    age_category: str


class PredictionResponse(BaseModel):
    prediction: int
    confidence: float