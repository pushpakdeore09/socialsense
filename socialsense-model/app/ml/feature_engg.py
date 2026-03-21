from textblob import TextBlob # type: ignore
from nltk.sentiment.vader import SentimentIntensityAnalyzer # type: ignore
import nltk # type: ignore
import spacy # type: ignore
import textstat # type: ignore
import numpy as np
from app.services.helper import abs_words

nlp = spacy.load("en_core_web_sm")
nltk.download('vader_lexicon')
analyzer = SentimentIntensityAnalyzer()

def get_sentiment(text):
    return TextBlob(text).sentiment.polarity

def get_subjectivity(text):
    return TextBlob(text).sentiment.subjectivity

def get_vader_negative(text):
    return analyzer.polarity_scores(text)['neg']

def get_absolutist_count(text):
    words = text.lower().split()
    return sum(word in abs_words for word in words)

def calculate_hedonic_score(text):
    blob = TextBlob(text)
    return (abs(blob.sentiment.polarity) + blob.sentiment.subjectivity) / 2

def calculate_flesch_reading_ease(text):
    return textstat.flesch_reading_ease(text)

def calculate_pronoun_ratio(text):
    doc = nlp(text)
    pronouns = [token for token in doc if token.pos_ == 'PRON']
    total_words = len([token.text for token in doc if not token.is_stop and not token.is_punct])
    return len(pronouns) / total_words if total_words > 0 else 0

def calculate_punctuation_density(text):
    doc = nlp(text)
    punctuation_marks = [token for token in doc if token.is_punct]
    total_tokens = len([token.text for token in doc if not token.is_stop])
    return len(punctuation_marks) / total_tokens if total_tokens > 0 else 0

def calculate_lexical_diversity(text):
    words = [token.text.lower() for token in nlp(text) if not token.is_stop and not token.is_punct]
    return len(set(words)) / len(words) if len(words) > 0 else 0

def calculate_pos_ratio(text):
    doc = nlp(text)
    verbs = [token for token in doc if token.pos_ == 'VERB']
    total_pos = len([token for token in doc if not token.is_stop and not token.is_punct])
    return len(verbs) / total_pos if total_pos > 0 else 0

def get_bm2_features(text: str) -> np.ndarray:
    features = [
        calculate_flesch_reading_ease(text),
        calculate_pronoun_ratio(text),
        calculate_punctuation_density(text),
        calculate_lexical_diversity(text),
        calculate_pos_ratio(text)
    ]
    return np.array(features).reshape(1, -1)

def get_bm1_features(text: str) -> np.ndarray:
    sentiment = get_sentiment(text)
    subjectivity = get_subjectivity(text)
    abs_cnt = get_absolutist_count(text)
    neg_vader = get_vader_negative(text)
    hedonic_score = calculate_hedonic_score(text)
    features = np.array([[sentiment, subjectivity, abs_cnt, neg_vader, hedonic_score]])
    return features

    