from fastapi import FastAPI

from backend.app.api.retrieve import (
    router as retrieve_router
)

from backend.app.api.predict import (
    router as predict_router
)

from backend.app.api.explain import (
    router as explain_router
)

app = FastAPI(
    title="Skin Disease RAG API",
    version="0.1.0"
)

app.include_router(
    retrieve_router
)

app.include_router(
    predict_router
)

app.include_router(
    explain_router
)


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
