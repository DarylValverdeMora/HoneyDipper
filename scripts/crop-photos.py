"""Recorta las fotos del negocio desde los archivos originales y las exporta a WebP.

Los originales son capturas de Instagram y Google Maps: cada recorte deja solo la foto y quita barra de estado,
usuarios, "me gusta", comentarios, texto de la publicación, avisos de copyright e íconos de reel.
Uso: python3 scripts/crop-photos.py [carpeta de originales]
"""
import sys
from pathlib import Path

from PIL import Image

ORIGINALS = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/mnt/project-files/HoneyDipper')
OUT = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'img'
QUALITY = 82

# nombre de salida: (archivo original, (izquierda, arriba, derecha, abajo), anchos extra para srcset)
CROPS = {
    'logo-honey-dipper': ('334567232_128492653313998_3196433340749445455_n.jpg', (0, 0, 1080, 1080), ()),
    'evento-1': ('IMG_2352(1).PNG', (0, 460, 1170, 2008), (600,)),
    'evento-2': ('IMG_2353.PNG', (0, 470, 1170, 1910), (600,)),
    'interior-arco': ('IMG_2354.PNG', (0, 438, 1170, 1995), (480, 800)),
    'interior-mostrador': ('IMG_2354.PNG', (420, 960, 1170, 1660), (480,)),
    'terraza-noche': ('Screenshot 2026-11-06 161846.png', (3, 3, 229, 453), ()),
    'ensalada': ('Screenshot 2026-11-06 162126.png', (3, 60, 187, 244), ()),
    'pastel-cumpleanos': ('Screenshot 2026-11-06 162222.png', (2, 2, 469, 646), ()),
    'pastel-chorreado': ('Screenshot 2026-11-06 162253.png', (2, 2, 455, 648), ()),
    'pancakes-helado': ('Screenshot 2026-11-06 162626.png', (2, 26, 250, 355), ()),
    'pizzas': ('Screenshot 2026-11-06 162644.png', (2, 22, 254, 348), ()),
    'rollos-canela': ('Screenshot 2026-11-06 162653.png', (2, 22, 246, 350), ()),
    'galletas': ('Screenshot 2026-11-06 162820.png', (3, 3, 267, 334), ()),
    'sandwich-papas-waffle': ('Screenshot 2026-11-06 162856.png', (3, 3, 323, 539), ()),
    'hamburguesa-pollo': ('Screenshot 2026-11-06 162926.png', (258, 35, 779, 603), ()),
    'hamburguesa-papas-waffle': ('Screenshot 2026-11-06 162937.png', (2, 62, 408, 512), ()),
}


def export(image: Image.Image, name: str) -> None:
    image.save(OUT / f'{name}.webp', 'WEBP', quality=QUALITY, method=6)
    print(f'{name}.webp {image.width}x{image.height}')


for name, (source, box, widths) in CROPS.items():
    crop = Image.open(ORIGINALS / source).convert('RGB').crop(box)
    export(crop, name)
    for width in widths:
        height = round(crop.height * width / crop.width)
        export(crop.resize((width, height), Image.LANCZOS), f'{name}-{width}')
