import pandas as pd
import numpy as np
import torch # type: ignore
import re
from fastapi import APIRouter, HTTPException # type: ignore
from tensorflow.keras.preprocessing.sequence import pad_sequences # type: ignore
from app.schemas.input import Stage1PredictionRequest, Stage1PredictionResponse, Stage2PredictionRequest, Stage2PredictionResponse
from app.model.binary_model.load_model import bert_tokenizer, bert_model, age_encoder, label_encoder, lstm_model
from app.model.bm1.load_assets import load_bm1_model, load_bm1_scaler 
from app.model.bm2.load_assets import load_bm2_model, load_bm2_scaler 
from app.model.meta_model.load_assets import meta_model, meta_scaler, meta_tokenizer, class_names
from app.services.recommendation_service import recommendation_service
from app.ml.feature_engg import get_bm1_features, get_bm2_features
router = APIRouter()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_bert_embeddings(text, bert_model, tokenizer):
    encodings = tokenizer(
        text,
        truncation=True,
        padding='max_length',
        max_length=64,
        return_tensors='pt'
    )
    with torch.no_grad():
        outputs = bert_model(
            input_ids=encodings['input_ids'],
            attention_mask=encodings['attention_mask'],
            token_type_ids=encodings['token_type_ids']
        )

    embeddings = outputs.last_hidden_state.cpu().numpy()
    return embeddings

def get_entropy(probs):
    return -np.sum(probs * np.log(probs + 1e-9), axis=1)

def get_margin(probs):
    sorted_probs = np.sort(probs, axis=1)
    return sorted_probs[:, -1] - sorted_probs[:, -2]

@router.post("/stage-one", response_model=Stage1PredictionResponse)
def predict_binary(request: Stage1PredictionRequest):
    try:
        cleaned_text = clean_text(request.text)
        gender_encoded = label_encoder.transform([request.gender])[0]
        df = pd.DataFrame({'Age_Group': [request.age_group]})
        age_encoded = age_encoder.transform(df[['Age_Group']])[0]
        embeddings = get_bert_embeddings(cleaned_text, bert_model, bert_tokenizer)
        features = np.array([[float(gender_encoded)] + list(age_encoded)]).astype('float32').reshape(1, -1)
        prediction_proba = lstm_model.predict({
            'text_input': embeddings,
            'tabular_input': features
        })[0][0]
        probs = [1-prediction_proba, prediction_proba]
        predicted_class = int(prediction_proba > 0.5)
        return Stage1PredictionResponse(
            prediction=predicted_class,
            confidence=float(probs[predicted_class])
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction Error: {str(e)}")
@router.post("/stage-two", response_model=Stage2PredictionResponse)
def predict_multi_class(request: Stage2PredictionRequest):
    try:
        sequence = meta_tokenizer.texts_to_sequences([request.statement])
        padded_text = pad_sequences(sequence, maxlen=100)

        bm1_features = get_bm1_features(request.statement)
        bm2_features = get_bm2_features(request.statement)

        bm1_scaler = load_bm1_scaler()
        bm2_scaler = load_bm2_scaler()

        bm1_features_scaled = bm1_scaler.transform(bm1_features)
        bm2_features_scaled = bm2_scaler.transform(bm2_features)

        bm1_model = load_bm1_model()
        bm2_model = load_bm2_model()

        bm1_pred = bm1_model.predict([padded_text, bm1_features_scaled], verbose=0)
        bm2_pred = bm2_model.predict([padded_text, bm2_features_scaled], verbose=0)

        bm1_margin = get_margin(bm1_pred).reshape(1, -1)
        bm2_margin = get_margin(bm2_pred).reshape(1, -1)
        bm1_entropy = get_entropy(bm1_pred).reshape(1, -1)
        bm2_entropy = get_entropy(bm2_pred).reshape(1, -1)

        meta_input = np.hstack([bm1_pred, bm2_pred, bm1_margin, bm2_margin, bm1_entropy, bm2_entropy, bm1_features_scaled, bm2_features_scaled])

        meta_input_scaled = meta_scaler.transform(meta_input)

        meta_pred = meta_model.predict_proba(meta_input_scaled)[0]
        pred_idx = int(np.argmax(meta_pred))
        predicted_class_name = class_names[pred_idx]

        recommendation_input = {
            "text": request.statement,
            "predicted_class": predicted_class_name,
            "age_group": request.age_group,
            "gender": request.gender,
            "profession": request.profession
        }
        recommendations = recommendation_service(recommendation_input)
        return Stage2PredictionResponse(
            predicted_class=class_names[pred_idx],
            predicted_class_index=pred_idx,
            confidence=round(float(meta_pred[pred_idx]), 4),
            probabilities=meta_pred.tolist(),
            recommendation=recommendations  
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Prediction Error: {str(e)}")