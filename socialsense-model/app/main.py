from fastapi import FastAPI # type: ignore
from app.api import predict
from fastapi.middleware.cors import CORSMiddleware # type: ignore

app = FastAPI(
    title='SocialSense Model Deployment'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.include_router(predict.router, prefix="/predict")

@app.get("/")
def root():
    return {"message": "Welcome to the ML Model API"}