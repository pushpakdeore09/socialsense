import torch  # type: ignore
from pathlib import Path
from transformers import AutoModel, AutoTokenizer  # type: ignore
import joblib
from tensorflow.keras.models import load_model # type: ignore

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "bert_model"
TOKENIZER_PATH = BASE_DIR / "bert_tokenizer"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
LSTM_MODEL_PATH = BASE_DIR / "lstm_model.h5"

label_encoder = joblib.load(BASE_DIR / "label_encoder.joblib")
age_encoder = joblib.load(BASE_DIR / "age_encoder.joblib")
lstm_model = load_model(LSTM_MODEL_PATH)

bert_tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH)
bert_model = AutoModel.from_pretrained(MODEL_PATH)
bert_model.to(DEVICE)
bert_model.eval()