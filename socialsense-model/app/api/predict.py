import pandas as pd
import numpy as np
from textblob import TextBlob  # type: ignore
from scipy.sparse import hstack, csr_matrix
from fastapi import APIRouter, HTTPException  # type: ignore
import re
from app.schemas.input import PredictionRequest, PredictionResponse
from app.model.load_model import xgb_model, tfidf, encoder, scaler, sbert_model

router = APIRouter()

def handle_negation(text: str):
    """Handles negations like 'not happy' -> 'not_happy'."""
    return re.sub(r'\bnot (\w+)\b', r'not_\1', text.lower())

def safe_encode(df, encoder, columns):
    """Safely one-hot encodes categorical data with unknowns handled."""
    try:
        encoded = encoder.transform(df[columns])
    except Exception:
        df_copy = df.copy()
        for col in columns:
            known = list(encoder.categories_[columns.index(col)])
            df_copy[col] = df_copy[col].apply(lambda x: x if x in known else known[0])
        encoded = encoder.transform(df_copy[columns])
    return encoded

def preprocess_data(df):
    df["Gender"] = df["Gender"].astype(str).str.lower().str.strip()
    df["Age Category"] = df["Age Category"].astype(str).str.lower().str.strip()
    df['text'] = df['text'].astype(str).apply(handle_negation)
    df["sentiment"] = df["text"].apply(lambda x: TextBlob(str(x)).sentiment.polarity)

    X_text = tfidf.transform(df['text'])
    X_embed = sbert_model.encode(df["text"].tolist())
    X_embed_sparse = csr_matrix(X_embed)
    X_encoded = safe_encode(df, encoder, ["Gender", "Age Category"])
    X_scaled = scaler.transform(df[["Age", "sentiment"]])
    X_final = hstack([X_text, X_encoded, X_scaled, X_embed_sparse])
    if np.isnan(X_final.data).any():
        print("⚠️ Warning: NaN detected in feature matrix — replacing with zeros.")
        X_final.data = np.nan_to_num(X_final.data)

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
            confidence = 1.0 

        prediction = int(y_pred)

        return PredictionResponse(prediction=prediction, confidence=confidence)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
