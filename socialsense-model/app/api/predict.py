import pandas as pd
import numpy as np
from scipy.sparse import hstack
from fastapi import APIRouter, HTTPException # type: ignore
from app.schemas.input import PredictionRequest, PredictionResponse
from app.model.load_model import xgb_model, tfidf, encoder, scaler

router = APIRouter()

def preprocess_data(df):
    X_text = tfidf.transform(df['text'].astype(str))
    X_encoded = encoder.transform(df[["Gender", "Age Category"]])
    X_scaled = scaler.transform(df[["Age"]])
    X_final = hstack([X_text, X_encoded, X_scaled])
    return X_final

@router.post("/stage-one", response_model=PredictionResponse)
def predict_binary(request: PredictionRequest):
    try:
        df = pd.DataFrame([{
            "text": request.text,
            "Age": request.age,
            "Gender": request.gender,
            "Age Category": request.age_category
        }])

        X = preprocess_data(df)
        y_pred = xgb_model.predict(X)[0]

        if hasattr(xgb_model, "predict_proba"):
            proba = xgb_model.predict_proba(X)[0]
            confidence = float(np.max(proba))
        else:
            confidence = float(xgb_model.predict(X)[0])

        prediction = int(y_pred)
        return PredictionResponse(prediction=prediction, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {e}")
