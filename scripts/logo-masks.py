"""
Saca máscaras con fondo transparente de los recortes del logo (JPG/WebP con fondo menta).

Cada píxel se proyecta sobre la línea entre el fondo menta y la tinta dorada: así los bordes
suavizados del JPG quedan como transparencia parcial y no como un halo menta.
Solo se usa en la variante B; cuando el negocio mande el logo en SVG o PNG transparente,
se reemplazan estas máscaras.

Uso: python3 scripts/logo-masks.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

IMG_DIR = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'img'
SOURCES = ['logo-honey-dipper-hero.webp', 'logo-honey-dipper-wordmark.jpg']
BACKGROUND = np.array([190, 215, 202], float)  # menta del JPG (≈ #BFD7CA)
INK_THRESHOLD = 80  # distancia al fondo a partir de la cual un píxel es tinta
LOW, HIGH = 0.08, 0.92  # recorta el ruido del JPG en los dos extremos


def build_mask(path: Path) -> Image.Image:
    pixels = np.asarray(Image.open(path).convert('RGB')).astype(float)
    distance = np.linalg.norm(pixels - BACKGROUND, axis=2)
    ink = np.median(pixels[distance > INK_THRESHOLD], axis=0)
    ink_distance = np.linalg.norm(ink - BACKGROUND)
    direction = (ink - BACKGROUND) / ink_distance
    progress = ((pixels - BACKGROUND) @ direction) / ink_distance
    alpha = np.clip((progress - LOW) / (HIGH - LOW), 0, 1)
    rgba = np.zeros(pixels.shape[:2] + (4,), np.uint8)
    rgba[..., 3] = (alpha * 255).round()
    return Image.fromarray(rgba, 'RGBA')


for name in SOURCES:
    source = IMG_DIR / name
    target = IMG_DIR / f'{source.stem}-mask.webp'
    build_mask(source).save(target, lossless=True)
    print(f'{target.name} listo')
