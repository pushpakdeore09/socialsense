from fastapi import FastAPI # type: ignore

app = FastAPI(
    title='SocialSense Model Deployment'
)

app.include_router()

@app.get("/")
def root():
    return {"message": "Welcome to the ML Model API"}