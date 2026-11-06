"""Convierte las fotos aptas de la carpeta de referencias a WebP, con recortes que quitan
íconos de Instagram (reel, flechas del carrusel) y la interfaz de las capturas.
Uso: python3 -I scripts/convert-photos.py <carpeta_referencias> <carpeta_salida>"""
import json
import sys
from pathlib import Path

from PIL import Image

PHOTOS = [
    # (archivo original, nombre de salida, caja de recorte (izq, arriba, der, abajo) o None)
    ("IMG_2354.PNG", "interior-arco", (0, 438, 1170, 1998)),
    ("Screenshot 2026-11-06 162926.png", "hamburguesa-pollo", (0, 28, 787, 606)),
    ("Screenshot 2026-11-06 162937.png", "hamburguesa-papas-waffle", None),
    ("Screenshot 2026-11-06 162856.png", "sandwich-papas-waffle", None),
    ("Screenshot 2026-11-06 162626.png", "pancakes-helado", (0, 24, 265, 358)),
    ("Screenshot 2026-11-06 162644.png", "pizzas", (0, 24, 277, 351)),
    ("Screenshot 2026-11-06 162253.png", "pastel-chorreado", (0, 0, 455, 650)),
    ("Screenshot 2026-11-06 162222.png", "pastel-cumpleanos", (0, 0, 471, 645)),
    ("Screenshot 2026-11-06 162653.png", "rollos-canela", (0, 24, 276, 353)),
    ("Screenshot 2026-11-06 162820.png", "galletas", (0, 0, 270, 337)),
]


def convert(source_dir: Path, out_dir: Path) -> list[dict]:
    out_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for source_name, out_name, box in PHOTOS:
        image = Image.open(source_dir / source_name).convert("RGB")
        if box:
            image = image.crop(box)
        out_path = out_dir / f"{out_name}.webp"
        image.save(out_path, "WEBP", quality=82, method=6)
        results.append({"file": out_path.name, "width": image.width, "height": image.height,
                        "bytes": out_path.stat().st_size})
    return results


if __name__ == "__main__":
    print(json.dumps(convert(Path(sys.argv[1]), Path(sys.argv[2])), indent=1))
