from pathlib import Path
import joblib
from tensorflow.keras.models import load_model # type: ignore

BASE_DIR = Path(__file__).resolve().parent

def load_bm1_model():
    model_path = BASE_DIR / "best_bigru_model_bm1.keras"
    model = load_model(model_path)
    return model

def load_bm1_scaler():
    scaler_path = BASE_DIR / "scaler_bm1.joblib"
    scaler = joblib.load(scaler_path)
    return scaler