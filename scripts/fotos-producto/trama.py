"""Trama de líneas (roja y negra) de las piezas ícono del sitio, a partir de las fotos finales.

Reproduce el tratamiento de los íconos del pitch: líneas diagonales finas (\\) cuyo grueso
sigue lo oscuro de la pieza, sobre fondo transparente, en rojo ikpali o en negro.

Uso:  python3 trama.py <carpeta public/productos> <id> [<id> ...]
Sale: <carpeta>/trama/rojo/<id>-600.webp, -400.webp  y  <carpeta>/trama/negro/<id>-600.webp, -400.webp
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter

S = 1200            # se dibuja al doble y se reduce: líneas suaves
PERIODO = 6.5       # separación entre líneas a 1200 px (≈3.25 px en la versión de 600)
CAJA = (0.60, 0.72) # la pieza cabe en 60 % del ancho y 72 % del alto, como los íconos anteriores
COLORES = {"rojo": (241, 53, 37), "negro": (0, 0, 0)}


def cargar(ruta):
    im = Image.open(ruta).convert("RGBA")
    a = np.array(im)[..., 3]
    ys, xs = np.where(a > 8)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    k = min(CAJA[0] * S / im.width, CAJA[1] * S / im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    lienzo = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    lienzo.paste(im, ((S - im.width) // 2, (S - im.height) // 2), im)
    return lienzo


def trama(lienzo):
    arr = np.asarray(lienzo.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
    alfa = np.asarray(lienzo).astype(np.float32)[..., 3] / 255
    lum = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    # Fondo transparente: el color premultiplicado engaña la luminancia, se corrige con la alfa
    lum = np.where(arr[..., 3] > 0.01, lum / np.maximum(arr[..., 3], 0.01), 1.0).clip(0, 1)
    # Contraste por pieza: se estira su rango de luces y sombras (percentil 4 a 96) para que
    # la trama marque volumen, como en los íconos anteriores
    dentro = alfa > 0.5
    if dentro.any():
        lo, hi = np.percentile(lum[dentro], [4, 96])
        lum = np.clip((lum - lo) / max(hi - lo, 0.08), 0, 1) * 0.85 + lum * 0.15
    oscuro = np.clip(1 - lum, 0, 1) ** 0.85
    cobertura = np.clip(0.18 + 0.76 * oscuro, 0.16, 0.94)
    y, x = np.mgrid[0:S, 0:S].astype(np.float32)
    t = (x - y) / np.sqrt(2)
    frac = (t / PERIODO) % 1.0
    dist = np.abs(frac - 0.5)
    tinta = np.clip((cobertura / 2 - dist) * PERIODO + 0.5, 0, 1)
    return tinta * alfa


def guardar(mascara, color, destino_base):
    rgba = np.zeros((S, S, 4), np.uint8)
    rgba[..., :3] = COLORES[color]
    rgba[..., 3] = (mascara * 255).round().astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")
    for tam in (600, 400):
        im.resize((tam, tam), Image.LANCZOS).save(f"{destino_base}-{tam}.webp", "WEBP", quality=86, method=6)


if __name__ == "__main__":
    carpeta, ids = sys.argv[1], sys.argv[2:]
    for color in COLORES:
        os.makedirs(os.path.join(carpeta, "trama", color), exist_ok=True)
    for i in ids:
        origen = os.path.join(carpeta, f"{i}-1600.webp")
        if not os.path.exists(origen):
            origen = os.path.join(carpeta, f"{i}-800.webp")
        m = trama(cargar(origen))
        for color in COLORES:
            guardar(m, color, os.path.join(carpeta, "trama", color, i))
        print("ok", i)
