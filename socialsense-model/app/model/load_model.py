import pickle
from pathlib import Path
import xgboost as xgb  # type: ignore
from transformers import BertTokenizer, BertModel # type: ignore

BASE_DIR = Path(__file__).resolve().parent

def load_model():
    model_path = BASE_DIR / "bin_model.pkl"
    with open(model_path, 'rb') as file:
        return pickle.load(file=file)

def load_pickle(filename):
    path = BASE_DIR / filename
    with open(path, "rb") as f:
        return pickle.load(f)

xgb_model = load_pickle('bert_xgb_model.pkl')
label_encoder = load_pickle('label_encoder.pkl')
scaler = load_pickle('scaler.pkl')

MODEL_NAME = 'bert-base-uncased'
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
bert_model = BertModel.from_pretrained(MODEL_NAME)
bert_model.eval()

