from pydantic import BaseModel # type: ignore
from typing import List, Dict, Any

class Stage1PredictionRequest(BaseModel):
    text: str
    age_group: str
    gender: str

class Stage2PredictionRequest(BaseModel):
    statement: str
    age_group: str
    gender: str
    profession: str

class Stage1PredictionResponse(BaseModel):
    prediction: int
    confidence: float


class Stage2PredictionResponse(BaseModel):
    predicted_class: str
    predicted_class_index: int
    confidence: float
    probabilities: List[float]
    recommendation: Dict[str, Any]