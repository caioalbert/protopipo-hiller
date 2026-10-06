"""Extract the prototype's local images from the client catalog. Coordinates refer to a 1000px-wide page."""
from pathlib import Path
import pypdfium2 as pdfium
ROOT = Path(__file__).resolve().parents[1]
pdf = pdfium.PdfDocument(ROOT / 'CATALOGO_FRB_DISTRIBUIDORA_VERSAO_2026.pdf')
assets = {
    'logo-ra-araujo.webp': (1, (235, 112, 767, 700)),
    'products/pano-multiuso.webp': (6, (130, 620, 450, 1040)),
    'products/saco-kraft.webp': (39, (88, 510, 501, 1028)),
    'products/queijo-parmesao.webp': (50, (127, 465, 510, 815)),
    'products/azeite-hecke.webp': (56, (30, 165, 325, 1105)),
    'products/luva-nitrilica.webp': (15, (193, 708, 660, 1053)),
    'products/toalha-compacta.webp': (34, (93, 263, 259, 517)),
    'products/assadeira-aluminio.webp': (28, (467, 453, 885, 944)),
}
for name, (number, box) in assets.items():
    page = pdf[number-1]
    scale = 1.5
    image = page.render(scale=1500/page.get_width()).to_pil()
    image = image.crop(tuple(round(c*scale) for c in box))
    image.thumbnail((800, 1000))
    target = ROOT / 'assets' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, 'WEBP', quality=88)
    print(name, image.size)
