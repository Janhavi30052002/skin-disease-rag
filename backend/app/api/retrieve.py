from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from PIL import Image

from backend.app.services.embedding_service import (
    generate_embedding
)

from backend.app.services.qdrant_service import (
    search_similar
)

router = APIRouter()


@router.post("/retrieve")
async def retrieve(
    file: UploadFile = File(...)
):

    image = Image.open(
        file.file
    ).convert("RGB")

    embedding = generate_embedding(
        image
    )

    results = search_similar(
        embedding,
        limit=5
    )

    return {
        "similar_cases": results
    }
