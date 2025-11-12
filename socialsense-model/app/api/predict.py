import pandas as pd
import numpy as np
import torch # type: ignore
from fastapi import APIRouter, HTTPException # type: ignore
from app.schemas.input import PredictionRequest, PredictionResponse
from app.model.load_model import xgb_model, tokenizer, bert_model, scaler, label_encoder

router = APIRouter()

def get_bert_embeddings(text: str):
    inputs = tokenizer(
        text,
        padding=True,
        truncation=True,
        return_tensors="pt",
        max_length=128
    )
    with torch.no_grad():
        outputs = bert_model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :].numpy()
    return cls_embedding  


@router.post("/stage-one", response_model=PredictionResponse)
def predict_binary(request: PredictionRequest):
    try:
        gender_map = {"male": 0, "female": 1}
        gender_str = request.gender.strip().lower()
        if gender_str not in gender_map:
            raise ValueError(f"Invalid gender: {request.gender}")
        gender_val = gender_map[gender_str]

        text_embeddings = get_bert_embeddings(request.text)  

        age_scaled = scaler.transform(pd.DataFrame([[request.age]], columns=["Age"]))[0][0]

        extra_features = np.array([[age_scaled, gender_val]]) 
        features = np.concatenate([text_embeddings, extra_features], axis=1) 

        probs = xgb_model.predict_proba(features)[0]
        pred_idx = np.argmax(probs)
        pred_label = label_encoder.inverse_transform([pred_idx])[0]

        return PredictionResponse(
            prediction=pred_label,
            confidence=float(probs[pred_idx])
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction Error: {str(e)}")
