from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.retrieve import router as retrieve_router
from backend.app.api.predict import router as predict_router
from backend.app.api.explain import router as explain_router

app = FastAPI(
    title="Skin Disease RAG API",
    version="0.1.0"
)

# Allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(retrieve_router)
app.include_router(predict_router)
app.include_router(explain_router)


@app.get("/")
def root():
    return {
        "message": "Skin Disease RAG API is running",
        "endpoints": [
            "/retrieve",
            "/predict",
            "/explain"
        ]
    }
