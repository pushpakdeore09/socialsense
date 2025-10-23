import pickle
from pathlib import Path
import xgboost as xgb  # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore

BASE_DIR = Path(__file__).resolve().parent

def load_model():
    model_path = BASE_DIR / "bin_model.pkl"
    with open(model_path, 'rb') as file:
        model = pickle.load(file=file)
    return model

def load_pickle(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)

xgb_model = load_model()
tfidf = load_pickle("bin_tfidf.pkl")         
encoder = load_pickle("bin_encoder.pkl")     
scaler = load_pickle("bin_scaler.pkl")   
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')   
