import pandas as pd
import numpy as np
from textblob import TextBlob # type: ignore
from scipy.sparse import hstack, csr_matrix
from fastapi import APIRouter, HTTPException # type: ignore
import re
from app.schemas.input import PredictionRequest, PredictionResponse
from app.model.load_model import xgb_model, tfidf, encoder, scaler, sbert_model

router = APIRouter()

def handle_negation(text: str):
    return re.sub(r'\bnot (\w+)\b', r'not_\1', text.lower())

def preprocess_data(df):
    df['text'] = df['text'].astype(str).apply(handle_negation)
    df["sentiment"] = df["text"].apply(lambda x: TextBlob(str(x)).sentiment.polarity)
    X_text = tfidf.transform(df['text'].astype(str))
    X_embed = sbert_model.encode(df["text"].tolist())
    X_embed_sparse = csr_matrix(X_embed)
    X_encoded = encoder.transform(df[["Gender", "Age Category"]])
    X_scaled = scaler.transform(df[["Age", "sentiment"]])
    X_final = hstack([X_text, X_encoded, X_scaled, X_embed_sparse])
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
