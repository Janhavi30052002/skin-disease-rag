from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[3]

KNOWLEDGE_DIR = (
    ROOT_DIR /
    "backend" /
    "knowledge_base"
)


def get_knowledge(
    diagnosis: str
):
    file_path = (
        KNOWLEDGE_DIR /
        f"{diagnosis}.txt"
    )

    if not file_path.exists():
        return "No knowledge available."

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as f:
        return f.read()
