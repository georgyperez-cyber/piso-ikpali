# Exporta las fotos finales de producto para web (WebP con transparencia).
# Uso, desde la carpeta piso ikpali:
#   python3 web/scripts/fotos-producto/optimizar.py "fotos productos finales/noviembre 13" web/public/productos \
#     "fotos productos finales/noviembre 13 web" web/scripts/fotos-producto/manifest.json web/scripts/fotos-producto/mapa.json
# Por foto: <id>-800.webp y <id>-1600.webp para el sitio, y una copia a 2160 px con el mismo nombre en la carpeta de export.
# mapa.json dice qué id lleva cada foto; las que ya están en manifest.json se saltan (bórralas de ahí para rehacerlas).
import sys, os, json, unicodedata, glob, time
from PIL import Image
src, pub, exp, man, mapa = sys.argv[1:6]
os.makedirs(pub, exist_ok=True)
nfc = lambda s: unicodedata.normalize('NFC', s)
reales = {nfc(os.path.relpath(f, src)): f for f in glob.glob(os.path.join(src, '*', '*.png'))}
salida = json.load(open(man)) if os.path.exists(man) else {}
for foto, slug in json.load(open(mapa)):
    if slug in salida: continue
    t = time.time()
    f = reales[nfc(foto)]
    im = Image.open(f).convert('RGBA')
    W, H = im.size
    a = im.getchannel('A').point(lambda v: 255 if v > 25 else 0)
    bb = a.getbbox()
    pre = im.convert('RGBa')
    info = {'fondo': round(bb[3] / H, 3), 'arriba': round(bb[1] / H, 3), 'kb': {}}
    for w, q in ((800, 84), (1600, 86)):
        out = os.path.join(pub, f'{slug}-{w}.webp')
        pre.resize((w, round(H * w / W)), Image.LANCZOS).convert('RGBA').save(out, 'WEBP', quality=q, method=6, alpha_quality=95)
        info['kb'][w] = os.path.getsize(out) // 1024
    # copia completa para Georgy: mismo nombre y carpeta, 2160 px
    rel = os.path.relpath(f, src)
    dest = os.path.join(exp, os.path.splitext(rel)[0] + '.webp')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    im.save(dest, 'WEBP', quality=88, method=6, alpha_quality=95)
    info['kb']['full'] = os.path.getsize(dest) // 1024
    info['kb']['png'] = os.path.getsize(f) // 1024
    salida[slug] = info
    json.dump(salida, open(man, 'w'), indent=1)
    print(slug, info, round(time.time() - t, 1), 's', flush=True)
print('LISTO', len(salida), flush=True)
