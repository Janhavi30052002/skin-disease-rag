from collections import Counter

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

from PIL import Image

from backend.app.services.embedding_service import (
    generate_embedding
)

from backend.app.services.qdrant_service import (
    search_similar
)

from backend.app.services.knowledge_service import (
    get_knowledge
)

router = APIRouter()


@router.post("/explain")
async def explain(
    file: UploadFile = File(...)
):
    image = Image.open(
        file.file
    ).convert("RGB")

    embedding = generate_embedding(
        image
    )

    similar_cases = search_similar(
        embedding,
        limit=5
    )

    diagnoses = [
        case["diagnosis"]
        for case in similar_cases
    ]

    prediction = Counter(
        diagnoses
    ).most_common(1)[0][0]

    confidence = (
        diagnoses.count(prediction)
        / len(diagnoses)
    )

    knowledge = get_knowledge(
        prediction
    )

    return {
        "prediction": prediction,
        "confidence": round(
            confidence,
            2
        ),
        "knowledge": knowledge,
        "similar_cases": similar_cases
    }
