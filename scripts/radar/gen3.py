"""Genera el corte v3 (JSON + media) para /radar. Uso: python3 gen3.py <scratchpad>"""
import sys,json,os,re,shutil,statistics as st,datetime as dt,collections
S=sys.argv[1]; C=S+"/corte"; OUT="/home/claude/radar-test"
sys.path.insert(0,C)
import an3
from an3 import P,OK,R,RO,N,NO,ALLO,SOC,mr,mn,mi,accts,NOW,ts
prof={p['username']:p for p in json.load(open(S+"/runs/corte-2026-11-12.json"))}
NAME={"piso.ikpali":"Piso ikpali","onoracasa":"Onora","utilitariomexicano":"Utilitario Mexicano","lagolatam":"LAGO","happeningstore":"Happening Store","originario.originario":"Originario","seleccionmarsella":"Selección Marsella","escalina_":"Escalina","pisotresg56":"PisoTres","bartesanalconceptstore":"B Artesanal","casamandarine":"Casa Mandarine","shop__vena":"Vena","mumedi_oficial":"MUMEDI Shop","g_mexicana":"Galería Mexicana de Diseño","agoprojects":"AGO Projects","casacler":"Casa Cler","casatho.concepthouse":"Casa T'HŌ","marchantastore":"Marchanta","1050grados":"Cooperativa 1050°","tonton.textil":"Ton Ton Textil","doce18concepthouse":"Dôce 18","taxonomiamx":"Taxonomía"}
CITY={"casacler":"Monterrey","casatho.concepthouse":"Mérida","marchantastore":"Oaxaca","1050grados":"Oaxaca","tonton.textil":"San Cristóbal de las Casas","doce18concepthouse":"San Miguel de Allende"}
PARES={"onoracasa","utilitariomexicano","originario.originario","seleccionmarsella","g_mexicana","escalina_","taxonomiamx"}
def circ(u): return "yo" if u=="piso.ikpali" else "pares" if u in PARES else "estados" if u in CITY else "audiencia"
PANT={"E":"En escena","S":"Espacio","H":"Manos","C":"A cámara","G":"Portada con título o gráfico","O":"Objeto solo","M":"Modelo"}
PIL={"D":"Persona","R":"Proceso","E":"Evento","S":"Espacio","P":"Producto","A":"Aviso","N":"Prensa"}
def row(nombre,qs,key='ix'):
    v=[q[key] for q in qs if q.get(key)]
    return dict(nombre=nombre,ix=round(st.median(v),2) if v else None,n=len(v),arriba=sum(x>1 for x in v),ctas=len({q['acct'] for q in qs if q.get(key)}))
ROx=[q for q in RO if q['ix']]; NOx=[q for q in NO if q['ix']]; OWN=ROx+NOx; Rx=[q for q in R if q['ix']]
def cat(q): return 'voz' if q.get('voz') else 'musica' if q.get('musica') else 'orig'
idx={}
idx['pantReel']=[row("Con gente: en escena, manos o a cámara",[q for q in ROx if q['pant'] in 'EHC'])]+[row(PANT[k] if k!='G' else "Gráfico",[q for q in ROx if q['pant']==k]) for k in 'ESOMG']
idx['pantPost']=[row(PANT[k],[q for q in NOx if q['pant']==k]) for k in 'CGSMEO']
idx['pilReel']=[row(PIL[k],[q for q in Rx if q['pilar']==k]) for k in 'RDEPSA']
idx['pilPost']=[row(PIL[k],[q for q in NOx if q['pilar']==k]) for k in 'ESDPA']
idx['dur']=[row(n,[q for q in ROx if lo<=(q['dur'] or 0)<hi]) for n,lo,hi in [("Menos de 15 s",0,15),("15 a 30 s",15,30),("30 a 60 s",30,60),("Más de 60 s",60,1e9)]]
idx['audio']=[row("Audio original, sin voz",[q for q in ROx if cat(q)=='orig']),row("Música con licencia",[q for q in ROx if cat(q)=='musica']),row("Con voz",[q for q in ROx if cat(q)=='voz'])]
AL=[q for q in ALLO if q.get('ixi')]
idx['formato']=[row(n,[q for q in AL if q['kind']==k],'ixi') for n,k in [("Reel","reel"),("Carrusel","carrusel"),("Foto suelta","foto")]]
B=[("Socio al menos 4 veces más grande",4,1e9),("Socio de tamaño parecido",0.5,4),("Socio mucho más chico",0,0.5)]
idx['socioReel']=[row(n,[q for q in Rx if q['collab'] and q['tam'] is not None and lo<=q['tam']<hi]) for n,lo,hi in B]+[row("Reel propio, sin compartir",ROx)]
Nx=[q for q in N if q['ix']]
idx['socioPost']=[row(n,[q for q in Nx if q['collab'] and q['tam'] is not None and lo<=q['tam']<hi]) for n,lo,hi in B]+[row("Foto o carrusel propio",NOx)]
idx['hora']=[row(n,[q for q in OWN if lo<=q['hr']<hi]) for n,lo,hi in [("Antes de las 9",0,9),("De 9 a 12",9,12),("De 12 a 3",12,15),("De 3 a 6",15,18),("De 6 a 9 de la noche",18,21),("Después de las 9",21,24)]]
idx['texto']=[row(n,[q for q in OWN if lo<=q['capn']<hi]) for n,lo,hi in [("Menos de 80 caracteres",0,80),("De 80 a 300",80,300),("De 300 a 800",300,800),("Más de 800",800,1e9)]]
# gráficas
tot=collections.Counter(q['kind'] for q in P if q['acct']!='piso.ikpali'); nt=sum(tot.values())
mezcla=[]
for a in accts:
    qs=[q for q in P if q['acct']==a]; c=collections.Counter(q['kind'] for q in qs)
    mezcla.append(dict(h=a,n=NAME[a],ci=circ(a),seg=prof[a]['followersCount'],total=len(qs),reel=c['reel'],carrusel=c['carrusel'],foto=c['foto'],sem=round(len(qs)/12.9,1),comp=sum(q['collab'] for q in qs)))
mezcla.sort(key=lambda r:(r['ci']!='yo',-r['total']))
semanas=[]
for w in range(12,-1,-1):
    qs=[q for q in P if q['sem']==w]; o=[q for q in qs if q['acct']!='piso.ikpali']
    c=collections.Counter(q['kind'] for q in o); semanas.append(dict(w=w,reel=c['reel'],carrusel=c['carrusel'],foto=c['foto'],piso=len(qs)-len(o)))
def hloc(q): t=ts(q['ts'])-dt.timedelta(hours=6); return round(t.hour+t.minute/60,2)
puntos=[dict(c=q['code'],h=q['acct'],k=q['kind'],hr=hloc(q),dw=q['dow'],ix=round(q['ix'],2)) for q in OWN]
pisoH=[dict(hr=hloc(q),dw=q['dow']) for q in P if q['acct']=='piso.ikpali']
alcance=sorted([dict(h=a,n=NAME[a],seg=prof[a]['followersCount'],plays=int(round(v)),reels=sum(1 for q in RO if q['acct']==a)) for a,v in mr.items()],key=lambda r:-r['plays'])
colab=[dict(c=q['code'],h=q['acct'],k=q['kind'],tam=round(q['tam'],3),ix=round(q['ix'],2),s=max(q['socios'],key=lambda s:SOC.get(s) or 0)) for q in OK if q['collab'] and q['ix'] and q['tam']]
cuentas=[]
for u,p in prof.items():
    a=[q for q in P if q['acct']==u]; last=max([ts(q['ts']) for q in a],default=None)
    if last is None: last=max([ts(x['timestamp']) for x in p.get('latestPosts') or [] if x.get('timestamp') and not x.get('isPinned')],default=None)
    vis=[q['inter'] for q in a if not q['collab'] and q['inter'] is not None and not q['fresca']]
    cuentas.append(dict(h=u,n=NAME[u],ci=circ(u),city=CITY.get(u,"CDMX"),seg=p['followersCount'],piezas=len(a),sem=round(len(a)/12.9,1),reels=sum(q['kind']=='reel' for q in a),
        plays=int(round(mr[u])) if u in mr else None,inter=(round(st.median(vis),1) if st.median(vis)<10 else int(round(st.median(vis)))) if len(vis)>=3 else None,
        ocultos=sum(1 for q in a if q['likes'] is None),comp=sum(q['collab'] for q in a),dias=(NOW-last).days if last else None,desde=last.strftime("%Y-%m") if last else None))
cuentas.sort(key=lambda c:-c['seg'])
M=OUT+"/public/radar-media"
if os.path.isdir(M): shutil.rmtree(M)
os.makedirs(M)
piezas=[]
for q in P:
    c=q['code']; shutil.copy(f"{C}/cov/{c}.jpg",f"{M}/{c}.jpg")
    s=f"{C}/strip/{c}.jpg" if q['kind']=='reel' else f"{C}/cstrip/{c}.jpg"
    has=os.path.exists(s)
    if has: shutil.copy(s,f"{M}/{c}_s.jpg")
    cap=re.sub(r"\s+"," ",q['cap'] or '').strip(); tr=re.sub(r"\s+"," ",q.get('tr') or '').strip() if q.get('voz') else ''
    au=None
    if q['kind']=='reel': au='voz' if q.get('voz') else 'música' if q.get('musica') else 'original'
    piezas.append(dict(c=c,h=q['acct'],ci=circ(q['acct']),ts=q['ts'],k=q['kind'],l=q['likes'],cm=q['com'],p=q['plays'],d=int(q['dur']) if q.get('dur') else None,
        ix=None if q['ix'] is None else round(q['ix'],2),cap=cap[:700]+("…" if len(cap)>700 else ""),pa=q['pant'],pi=q['pilar'],dm=bool(q['dm']),n=q['nota'],
        tr=tr[:900]+("…" if len(tr)>900 else ""),so=[dict(u=s,sg=SOC.get(s)) for s in sorted(q['socios'],key=lambda s:-(SOC.get(s) or 0))][:3],au=au,
        mu=q['audio'] if au=='música' else None,ni=q.get('n'),st=has,hr=hloc(q),dw=q['dow']))
code={q['i']:q['code'] for q in P}
T=json.load(open(C+"/textos3.json"))
for j in T['jugadas']: j['ej']=[code[i] for i in j['ej']]
# Ligas a publicaciones: [texto](i:N) -> [texto](CODIGO)
T=json.loads(re.sub(r"\]\(i:(\d+)\)",lambda m:"]("+code[int(m.group(1))]+")",json.dumps(T,ensure_ascii=False)))
top=[q['code'] for q in sorted([q for q in P if q['kind']=='reel'],key=lambda q:-q['plays'])[:6]]
k=collections.Counter(q['kind'] for q in P)
out=dict(meta=dict(fecha="2026-11-13",periodo="15 de agosto al 12 de noviembre de 2026",piezas=len(P),reels=k['reel'],carruseles=k['carrusel'],fotos=k['foto'],cuentas=len(accts),total=len(prof)),
    top=top,graf=dict(mezcla=mezcla,mix={f:round(100*c/nt) for f,c in tot.items()},semanas=semanas,puntos=puntos,pisoH=pisoH,alcance=alcance,colab=colab,idx=idx),
    cuentas=cuentas,piezas=piezas,nombres=NAME,PANT=PANT,PIL=PIL,**T)
dst=OUT+"/src/lib/radar/corte-2026-11-13.json"
json.dump(out,open(dst,"w"),ensure_ascii=False)
print("JSON KB",os.path.getsize(dst)//1024,"| media",len(os.listdir(M)),"archivos",round(sum(os.path.getsize(M+'/'+f) for f in os.listdir(M))/1e6,1),"MB")
for kk,v in idx.items(): print(kk,[(r['nombre'][:22],r['ix'],r['n'],r['arriba']) for r in v])
print("mix",out['graf']['mix'],"| puntos",len(puntos),"| colab",len(colab))
# superlativos en notas: revisar
print("\nNOTAS CON 'más' (revisar contra datos):")
for q in P:
    if re.search(r"\bmás (?:visto|vista|fuerte|respuesta|likes|baja)|veces",q['nota']):
        own=[x for x in P if x['acct']==q['acct']]
        if q['kind']=='reel':
            rk=sorted([x for x in own if x['kind']=='reel'],key=lambda x:-(x['plays'] or 0)); pos=rk.index(q)+1; ro=sorted([x for x in rk if not x['collab']],key=lambda x:-(x['plays'] or 0)); po=ro.index(q)+1 if q in ro else None
            print(f" {q['i']:>3} {q['acct'][:9]:9} reel plays={q['plays']} lugar={pos} propio_lugar={po} ix={q['ix'] and round(q['ix'],1)} pps={q['plays']/q['fol']:.1f} | {q['nota'][-90:]}")
        else:
            rk=sorted([x for x in own if x['kind']!='reel' and x['likes'] is not None],key=lambda x:-x['inter']); pos=rk.index(q)+1 if q in rk else None
            ro=[x for x in rk if not x['collab']]; po=ro.index(q)+1 if q in ro else None
            print(f" {q['i']:>3} {q['acct'][:9]:9} {q['kind'][:4]} likes={q['likes']} lugar={pos} propio_lugar={po} colab={q['collab']} ix={q['ix'] and round(q['ix'],1)} | {q['nota'][-90:]}")
