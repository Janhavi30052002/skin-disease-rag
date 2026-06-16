from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    ROOT_DIR /
    "models" /
    "checkpoints" /
    "best_vit.pth"
)
