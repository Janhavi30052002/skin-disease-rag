from qdrant_client import QdrantClient
import numpy as np

client = QdrantClient(
    path="qdrant_db"
)

query = np.random.rand(768).tolist()

results = client.query_points(
    collection_name="skin_lesions",
    query=query,
    limit=5
)

print(results)
