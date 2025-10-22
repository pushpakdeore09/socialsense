from fastapi import FastAPI # type: ignore
from app.api import predict
app = FastAPI(
    title='SocialSense Model Deployment'
)

app.include_router(predict.router, prefix="/predict")

@app.get("/")
def root():
    return {"message": "Welcome to the ML Model API"}