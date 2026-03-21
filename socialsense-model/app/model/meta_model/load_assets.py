from pathlib import Path
import pickle
from tensorflow.keras.models import load_model # type: ignore

BASE_DIR = Path(__file__).resolve().parent

def load_meta_model(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)

def load_meta_scaler(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)

def load_meta_tokenizer(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)

def load_class_names(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)
    
meta_model = load_meta_model("meta_model.pkl")
meta_scaler = load_meta_scaler("meta_scaler.pkl")
meta_tokenizer = load_meta_tokenizer("tokenizer.pkl")
class_names = load_class_names("class_names.pkl")
