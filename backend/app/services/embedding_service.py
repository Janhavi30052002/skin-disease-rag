import torch
import timm

from PIL import Image
from pathlib import Path

from torchvision import transforms


# ==========================================
# Paths
# ==========================================

ROOT_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    ROOT_DIR
    / "models"
    / "checkpoints"
    / "best_vit.pth"
)


# ==========================================
# Device
# ==========================================

device = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(f"Using device: {device}")


# ==========================================
# Image Transform
# ==========================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# Load Model
# ==========================================

model = timm.create_model(
    "vit_base_patch16_224",
    pretrained=False,
    num_classes=7
)

print(f"Loading model from: {MODEL_PATH}")

state_dict = torch.load(
    MODEL_PATH,
    map_location=device
)

model.load_state_dict(state_dict)

model.eval()
model.to(device)

print("ViT model loaded successfully")


# ==========================================
# Generate Embedding
# ==========================================

def generate_embedding(
    image: Image.Image
):
    """
    Generate 768-dimensional embedding
    from an uploaded skin lesion image.
    """

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        features = model.forward_features(
            image
        )

        embedding = (
            features[:, 0]
            .cpu()
            .numpy()
            .flatten()
        )

    return embedding.tolist()


# ==========================================
# Optional Local Test
# ==========================================

if __name__ == "__main__":

    test_image_path = (
        ROOT_DIR
        / "data"
        / "raw"
        / "HAM10000_images_part_1"
    )

    print("Embedding service loaded.")
