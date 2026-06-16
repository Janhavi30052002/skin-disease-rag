import numpy as np
import pandas as pd

from pathlib import Path
from tqdm import tqdm

from qdrant_client import QdrantClient

from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)


# ==========================================
# Paths
# ==========================================

ROOT_DIR = Path(__file__).resolve().parent.parent

EMBEDDINGS_PATH = (
    ROOT_DIR /
    "embeddings" /
    "image_embeddings.npy"
)

METADATA_PATH = (
    ROOT_DIR /
    "embeddings" /
    "metadata.csv"
)

QDRANT_PATH = (
    ROOT_DIR /
    "qdrant_db"
)


# ==========================================
# Load Data
# ==========================================

print("\nLoading embeddings...")

embeddings = np.load(
    EMBEDDINGS_PATH
)

print(
    f"Embeddings Shape: {embeddings.shape}"
)

print("\nLoading metadata...")

metadata = pd.read_csv(
    METADATA_PATH
)

print(
    f"Metadata Rows: {len(metadata)}"
)


# ==========================================
# Initialize Qdrant
# ==========================================

print("\nInitializing Qdrant...")

client = QdrantClient(
    path=str(QDRANT_PATH)
)

COLLECTION_NAME = "skin_lesions"


# ==========================================
# Delete Existing Collection
# ==========================================

existing = [
    c.name
    for c in client.get_collections().collections
]

if COLLECTION_NAME in existing:

    print(
        f"\nDeleting existing collection: {COLLECTION_NAME}"
    )

    client.delete_collection(
        collection_name=COLLECTION_NAME
    )


# ==========================================
# Create Collection
# ==========================================

print("\nCreating collection...")

client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        size=768,
        distance=Distance.COSINE
    )
)

print("Collection created.")


# ==========================================
# Build Points
# ==========================================

print("\nPreparing points...")

points = []

for idx in tqdm(
    range(len(metadata)),
    desc="Creating Points"
):

    row = metadata.iloc[idx]

    payload = {
        "image_id":
            str(row.get("image_id", "")),

        "lesion_id":
            str(row.get("lesion_id", "")),

        "dx":
            str(row.get("dx", "")),

        "age":
            str(row.get("age", "")),

        "sex":
            str(row.get("sex", "")),

        "localization":
            str(row.get("localization", ""))
    }

    points.append(
        PointStruct(
            id=idx,
            vector=embeddings[idx].tolist(),
            payload=payload
        )
    )

print(
    f"\nPrepared {len(points)} points."
)


# ==========================================
# Upload In Batches
# ==========================================

print("\nUploading to Qdrant...")

batch_size = 500

for start_idx in tqdm(
    range(0, len(points), batch_size),
    desc="Uploading"
):

    batch = points[
        start_idx:start_idx + batch_size
    ]

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=batch
    )


# ==========================================
# Verify Upload
# ==========================================

count = client.count(
    collection_name=COLLECTION_NAME
)

print("\n=================================")
print("QDRANT SETUP COMPLETE")
print("=================================")

print(
    f"Collection: {COLLECTION_NAME}"
)

print(
    f"Vector Count: {count.count}"
)

print(
    f"Embedding Dimension: {embeddings.shape[1]}"
)

print("=================================\n")