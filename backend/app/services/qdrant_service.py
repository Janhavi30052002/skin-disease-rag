from pathlib import Path
from qdrant_client import QdrantClient

ROOT_DIR = Path(__file__).resolve().parents[3]

QDRANT_PATH = ROOT_DIR / "qdrant_db"

COLLECTION_NAME = "skin_lesions"

client = QdrantClient(
    path=str(QDRANT_PATH)
)


def search_similar(
    embedding,
    limit=5
):
    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=limit
    )

    results = []

    for point in response.points:

        payload = point.payload or {}

        results.append(
            {
                "score": round(float(point.score), 4),
                "diagnosis": payload.get("dx"),
                "image_id": payload.get("image_id"),
                "lesion_id": payload.get("lesion_id"),
                "age": payload.get("age"),
                "sex": payload.get("sex"),
                "localization": payload.get("localization")
            }
        )

    return results
