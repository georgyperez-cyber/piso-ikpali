"""Arma el corte del radar de Piso ikpali: cifras, tablas y piezas en un JSON, y copia la media.
Uso: python3 gen.py <scratchpad>
Todas las cifras que citan los textos salen impresas al final para cotejarlas con textos.json.
"""
import json, sys, os, shutil, statistics as st, datetime as dt, re

S = sys.argv[1]; C = S + "/corte"; OUT = "/home/claude/radar-test"
P = json.load(open(C + "/pieces.json"))
prof = {p["username"]: p for p in json.load(open(S + "/runs/corte-2026-11-12.json"))}
socios = {p["username"]: p.get("followersCount") for p in json.load(open(S + "/runs/partners-2026-11-12.json"))}
NOW = dt.datetime(2026, 11, 13, 0, 13, 43, tzinfo=dt.timezone.utc)

NAME = {"piso.ikpali": "Piso ikpali", "onoracasa": "Onora", "utilitariomexicano": "Utilitario Mexicano", "lagolatam": "LAGO", "happeningstore": "Happening Store", "originario.originario": "Originario", "seleccionmarsella": "Selección Marsella", "escalina_": "Escalina", "pisotresg56": "PisoTres", "bartesanalconceptstore": "B Artesanal", "casamandarine": "Casa Mandarine", "shop__vena": "Vena", "mumedi_oficial": "MUMEDI Shop", "g_mexicana": "Galería Mexicana de Diseño", "agoprojects": "AGO Projects", "casacler": "Casa Cler", "casatho.concepthouse": "Casa T'HŌ", "marchantastore": "Marchanta", "1050grados": "Cooperativa 1050°", "tonton.textil": "Ton Ton Textil", "doce18concepthouse": "Dôce 18", "taxonomiamx": "Taxonomía"}
CITY = {"casacler": "Monterrey", "casatho.concepthouse": "Mérida", "marchantastore": "Oaxaca", "1050grados": "Oaxaca", "tonton.textil": "San Cristóbal de las Casas", "doce18concepthouse": "San Miguel de Allende"}
PARES = {"onoracasa", "utilitariomexicano", "originario.originario", "seleccionmarsella", "g_mexicana", "escalina_", "taxonomiamx"}
PANT = {"E": "En escena", "S": "Espacio", "H": "Manos", "C": "A cámara", "G": "Gráfico", "O": "Objeto solo", "M": "Modelo"}
PIL = {"D": "Persona", "R": "Proceso", "E": "Evento", "S": "Espacio", "P": "Producto", "A": "Aviso", "N": "Prensa"}


def circ(u):
    return "yo" if u == "piso.ikpali" else "pares" if u in PARES else "estados" if u in CITY else "audiencia"


def ts(s):
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00"))


def med(v, r=0):
    v = [x for x in v if x is not None]
    if not v:
        return None
    m = st.median(v)
    return round(m, r) if r else int(round(m))


for q in P:
    q["horas"] = (NOW - ts(q["ts"])).total_seconds() / 3600
    q["fresca"] = q["horas"] < 3  # sin tiempo de juntar respuesta: fuera de las medianas

R = [q for q in P if q["kind"] == "reel"]
OW = [q for q in R if not q["collab"]]            # reels propios
NR = [q for q in P if q["kind"] != "reel"]
NRV = [q for q in NR if not q["collab"] and q["inter"] is not None and q["circ"] != "yo" and not q["fresca"]]

# Índice contra la cuenta: la pieza entre la mediana propia de su cuenta (3 o más propias)
med_reel = {}
for a in {q["acct"] for q in OW}:
    v = [q["plays"] for q in OW if q["acct"] == a]
    if len(v) >= 3:
        med_reel[a] = st.median(v)
med_post = {}
for a in {q["acct"] for q in NRV}:
    v = [q["inter"] for q in NRV if q["acct"] == a]
    if len(v) >= 3 and st.median(v) > 0:
        med_post[a] = st.median(v)
for q in P:
    q["ix"] = None
    if q["kind"] == "reel" and q["acct"] in med_reel:
        q["ix"] = q["plays"] / med_reel[q["acct"]]
    elif q["kind"] != "reel" and q["inter"] is not None and q["acct"] in med_post and not q["fresca"]:
        q["ix"] = q["inter"] / med_post[q["acct"]]
OK = [q for q in OW if q["ix"] is not None]      # reels propios con índice


def fila(nombre, k, sel):
    a = [q for q in R if sel(q)]
    o = [q for q in OK if sel(q)]
    b = [q for q in NRV if sel(q)]
    return dict(k=k, nombre=nombre, reels=len(a), plays=med([q["plays"] for q in a]),
                propios=len(o), ix=med([q["ix"] for q in o], 2), arriba=sum(q["ix"] > 1 for q in o),
                posts=len(b), er=med([q["inter"] / q["fol"] * 100 for q in b], 2) if len(b) >= 4 else None)


pant = [fila(n, k, lambda q, k=k: q["pant"] == k) for k, n in PANT.items()]
pil = [fila(n, k, lambda q, k=k: q["pilar"] == k) for k, n in PIL.items()]
DUR = [("Menos de 15 s", 0, 15), ("15 a 30 s", 15, 30), ("30 a 60 s", 30, 60), ("Más de 60 s", 60, 1e9)]
dur = []
for n, lo, hi in DUR:
    o = [q for q in OW if lo <= q["dur"] < hi]
    oi = [q for q in o if q["ix"] is not None]
    dur.append(dict(nombre=n, reels=len(o), plays=med([q["plays"] for q in o]), ix=med([q["ix"] for q in oi], 2), arriba=sum(q["ix"] > 1 for q in oi), propios=len(oi)))

# Colaboraciones en reel: una fila por pareja cuenta-socio
pares = {}
for q in R:
    if q["collab"]:
        pares.setdefault((q["acct"], q["owner"]), []).append(q)
colabs = []
for (a, o), v in pares.items():
    propia = med_reel.get(a)
    m = st.median([q["plays"] for q in v])
    colabs.append(dict(h=a, n=NAME[a], seg=prof[a]["followersCount"], socio=o, segSocio=socios.get(o), reels=len(v), plays=int(round(m)),
                       propia=None if propia is None else int(round(propia)), veces=None if propia is None else round(m / propia, 1),
                       tam=round(socios[o] / prof[a]["followersCount"], 2) if socios.get(o) else None, top=max(v, key=lambda q: q["plays"])["code"]))
colabs.sort(key=lambda c: -(c["tam"] or 0))

cuentas = []
for u, p in prof.items():
    a = [q for q in P if q["acct"] == u]
    rr = [q for q in a if q["kind"] == "reel" and not q["collab"]]
    last = max([ts(x["timestamp"]) for x in p.get("latestPosts") or [] if x.get("timestamp") and not x.get("isPinned")], default=None)
    vis = [q["inter"] for q in a if not q["collab"] and q["inter"] is not None and not q["fresca"]]
    cuentas.append(dict(h=u, n=NAME[u], ci=circ(u), city=CITY.get(u, "CDMX"), seg=p["followersCount"], piezas=len(a),
                        p28=sum(1 for q in a if (NOW - ts(q["ts"])).days < 28), reels=sum(1 for q in a if q["kind"] == "reel"),
                        plays=med([q["plays"] for q in rr]), inter=(med(vis, 1) if vis and st.median(vis) < 10 else med(vis)),
                        ocultos=sum(1 for q in a if not q["collab"] and q["likes"] is None), visibles=len(vis), colab=sum(q["collab"] for q in a),
                        dias=(NOW - last).days if last else None, desde=last.strftime("%Y-%m") if last else None))
cuentas.sort(key=lambda c: -c["seg"])

os.makedirs(OUT + "/public/radar-media", exist_ok=True)
piezas = []
for q in P:
    c = q["code"]
    shutil.copy(f"{C}/cov/{c}.jpg", f"{OUT}/public/radar-media/{c}.jpg")
    if q["kind"] == "reel":
        shutil.copy(f"{C}/strip/{c}.jpg", f"{OUT}/public/radar-media/{c}_s.jpg")
    cap = re.sub(r"\s+", " ", q["cap"]).strip()
    tr = re.sub(r"\s+", " ", q["tr"] or "").strip() if q["voz"] else ""
    piezas.append(dict(c=c, h=q["acct"], ci=q["circ"], ts=q["ts"], k=q["kind"], l=q["likes"], cm=q["com"], p=q["plays"],
                       pps=None if q["pps"] is None else round(q["pps"], 2), d=int(q["dur"]) if q.get("dur") else None,
                       ix=None if q["ix"] is None else round(q["ix"], 2),
                       cap=cap[:700] + ("…" if len(cap) > 700 else ""), pa=q["pant"], pi=q["pilar"], dm=bool(q["dm"]), n=q["nota"],
                       tr=tr[:900] + ("…" if len(tr) > 900 else ""), ow=q["owner"] if q["collab"] else None,
                       sg=socios.get(q["owner"]) if q["collab"] else None))

code = {q["i"]: q["code"] for q in P}
T = json.load(open(C + "/textos.json"))
for j in T["jugadas"]:
    j["ej"] = [code[i] for i in j["ej"]]
top = [q["code"] for q in sorted(R, key=lambda q: -q["plays"])[:6]]
out = dict(meta=dict(fecha="2026-11-12", periodo="15 de agosto al 12 de noviembre de 2026", piezas=len(P), reels=len(R),
                     carruseles=sum(q["kind"] == "carrusel" for q in P), fotos=sum(q["kind"] == "foto" for q in P),
                     cuentas=len({q["acct"] for q in P}), total=len(prof)),
           top=top, pant=pant, pil=[r for r in pil if r["reels"] or r["posts"]], dur=dur, colabs=colabs, cuentas=cuentas, piezas=piezas,
           nombres=NAME, PANT=PANT, PIL=PIL, **T)
json.dump(out, open(OUT + "/src/lib/radar/corte-2026-11-12.json", "w"), ensure_ascii=False)

# ---- Cotejo de cifras ----
print("corte.json KB:", os.path.getsize(OUT + "/src/lib/radar/corte-2026-11-12.json") // 1024, "| media:", len(os.listdir(OUT + "/public/radar-media")))
print("cuentas con índice:", len(med_reel), "| reels propios con índice:", len(OK), "de", len(OW))
print("\nPANTALLA  reels  mediana | propios  índice  arriba | posts  ER")
for r in pant: print(f"  {r['nombre']:12}{r['reels']:>4}{str(r['plays']):>8} |{r['propios']:>4}{str(r['ix']):>7}{r['arriba']:>4} |{r['posts']:>4}{str(r['er']):>7}")
print("PILAR")
for r in pil: print(f"  {r['nombre']:12}{r['reels']:>4}{str(r['plays']):>8} |{r['propios']:>4}{str(r['ix']):>7}{r['arriba']:>4} |{r['posts']:>4}{str(r['er']):>7}")
print("DURACIÓN (propios)")
for r in dur: print(f"  {r['nombre']:14}{r['reels']:>4}{str(r['plays']):>8}{str(r['ix']):>7}{r['arriba']:>4} de {r['propios']}")
g = [q["ix"] for q in OK if q["pant"] in "EHC"]; s = [q["ix"] for q in OK if q["pant"] in "OSG"]
print("gente E/H/C:", len(g), round(st.median(g), 2), "| objeto solo:", [(r["propios"], r["ix"]) for r in pant if r["k"] == "O"])
print("voz:", med([q["ix"] for q in OK if q["voz"]], 2), sum(1 for q in OK if q["voz"]), "| sin voz:", med([q["ix"] for q in OK if not q["voz"]], 2))
print("COLABS")
for c in colabs: print(f"  {c['n']:20}{c['seg']:>7} x {c['socio']:22}{str(c['segSocio']):>7} tam={c['tam']} n={c['reels']} plays={c['plays']} propia={c['propia']} veces={c['veces']}")
t10 = sorted(R, key=lambda q: -q["plays"])[:10]
print("top10: compartidos", sum(q["collab"] for q in t10), "| E:", sum(q["pant"] == "E" for q in t10), "H:", sum(q["pant"] == "H" for q in t10), "| proceso:", sum(q["pilar"] == "R" for q in t10))
tops = {a: max([q for q in OW if q["acct"] == a], key=lambda q: q["plays"]) for a in med_reel}
peor = {a: min([q for q in OW if q["acct"] == a], key=lambda q: q["plays"]) for a in med_reel}
print("reel propio más visto por cuenta:", {NAME[a][:10]: PANT[q["pant"]] for a, q in tops.items()})
print("menos visto:", {NAME[a][:10]: PANT[q["pant"]] for a, q in peor.items()}, "| objeto solo:", sum(q["pant"] == "O" for q in peor.values()))
cs = [q for q in NR if q["collab"] and q["inter"] is not None and q["acct"] in med_post]
print("foto/carrusel compartidas con likes visibles:", len(cs), "arriba de su mediana:", sum(q["ix"] > 1 for q in cs), "cuentas:", len({q["acct"] for q in cs}))
w = n = 0
for a in {q["acct"] for q in NRV}:
    o = [q["inter"] for q in NRV if q["acct"] == a and q["pant"] == "O"]; e = [q["inter"] for q in NRV if q["acct"] == a and q["pant"] == "S"]
    if o and e: n += 1; w += st.median(e) > st.median(o)
print("espacio > objeto dentro de la cuenta (foto/carrusel):", w, "de", n)
ou = [q["inter"] / q["fol"] * 100 for q in NRV if q["pant"] == "O" and q["acct"] != "utilitariomexicano"]
print("ER objeto solo sin Utilitario:", len(ou), round(st.median(ou), 2))
w = n = 0
for a in med_reel:
    x = [q["plays"] for q in OW if q["acct"] == a and q["dur"] < 15]; y = [q["plays"] for q in OW if q["acct"] == a and q["dur"] >= 15]
    if x and y: n += 1; w += st.median(y) > st.median(x)
print("15 s o más ganan dentro de la cuenta:", w, "de", n)
print("comentarios mediana reels propios objeto solo:", med([q["com"] for q in OW if q["pant"] == "O"]), "| en escena:", med([q["com"] for q in OW if q["pant"] == "E"]))
for c in cuentas: print(f"  {c['n'][:22]:22} {c['ci']:9} seg={c['seg']:>6} piezas={c['piezas']:>2} p28={c['p28']:>2} reels={c['reels']:>2} plays={c['plays']} inter={c['inter']} ocultos={c['ocultos']} colab={c['colab']} dias={c['dias']} desde={c['desde']}")
