"""Corte v3: censo de 90 días (apify~instagram-scraper, posts) + piezas del corte anterior.
Uso: python3 build3.py <scratchpad>"""
import json,re,os,subprocess,sys,datetime as dt,collections
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
S=sys.argv[1]; C=S+"/corte"
os.makedirs(C+"/cstrip",exist_ok=True)
prof=json.load(open(S+"/runs/corte-2026-11-12.json")); F={p['username']:p['followersCount'] for p in prof}
new=[x for x in json.load(open(S+"/runs/posts-2026-11-13.json")) if x.get('shortCode')]
old={q['code']:q for q in json.load(open(C+"/pieces.json"))}
def acct(x): return (x.get('inputUrl') or '').rstrip('/').split('/')[-1]
KEEP=['pant','pilar','dm','nota','voz','tr','i','cover','strip']
P={}
for x in new:
    u=acct(x); c=x['shortCode']
    if u not in F: continue
    co=[w.get('username') for w in (x.get('coauthorProducers') or []) if w.get('username')]
    owner=x.get('ownerUsername') or u
    socios=[w for w in ([owner]+co) if w!=u]
    mi=x.get('musicInfo') or {}
    kind={'Video':'reel','Sidecar':'carrusel'}.get(x.get('type'),'foto')
    imgs=x.get('images') or [ch.get('displayUrl') for ch in (x.get('childPosts') or []) if ch.get('displayUrl')]
    lk=x.get('likesCount'); cm=x.get('commentsCount')
    q=dict(code=c,acct=u,owner=owner,socios=socios,collab=bool(socios),ts=x['timestamp'],kind=kind,
        likes=None if lk is None or lk<0 else lk, com=None if cm is None or cm<0 else cm, plays=x.get('videoPlayCount') if kind=='reel' else None,
        dur=x.get('videoDuration'),cap=x.get('caption') or '',n=len(x.get('childPosts') or []) or None,pin=bool(x.get('isPinned')),
        audio=None if kind!='reel' else ('original' if mi.get('uses_original_audio') else ((mi.get('song_name') or '')+' · '+(mi.get('artist_name') or '')).strip(' ·') or None),
        musica=bool(mi) and not mi.get('uses_original_audio'), tags=len(x.get('hashtags') or []), menc=len(x.get('mentions') or []), pauta=bool(x.get('paidPartnership')),
        img=x.get('displayUrl'),vid=x.get('videoUrl'),imgs=imgs,fol=F[u],grid=True)
    if c in old:
        for k in KEEP:
            if k in old[c]: q[k]=old[c][k]
    P[c]=q
for c,o in old.items():
    if c not in P:
        o=dict(o); o['socios']=[o['owner']] if o['collab'] else []; o['grid']=False; o['musica']=bool(o.get('audio')) and o.get('audio')!='original'; o['tags']=len(re.findall(r'#\w+',o.get('cap') or '')); o['menc']=len(re.findall(r'@[\w.]+',o.get('cap') or '')); o['pauta']=False; o['imgs']=[]
        P[c]=o
pieces=sorted(P.values(),key=lambda q:q['ts'],reverse=True)
nxt=max(q['i'] for q in pieces if 'i' in q)+1
for q in sorted([q for q in pieces if 'i' not in q],key=lambda q:(q['acct'],q['ts'])):
    q['i']=nxt; nxt+=1; q['nueva']=True
def get(url,out):
    if os.path.exists(out) and os.path.getsize(out)>2000: return True
    r=subprocess.run(['curl','-s','-L','--max-time','90','-o',out,'-w','%{http_code}',url],capture_output=True,text=True)
    ok=r.stdout.strip()=='200' and os.path.exists(out) and os.path.getsize(out)>2000
    if not ok and os.path.exists(out): os.remove(out)
    return ok
def do(q):
    c=q['code']
    if not os.path.exists(f"{C}/cov/{c}.jpg") and q.get('img') and get(q['img'],f"{C}/cov/{c}.raw"):
        try:
            im=Image.open(f"{C}/cov/{c}.raw").convert('RGB'); im.thumbnail((480,640)); im.save(f"{C}/cov/{c}.jpg",quality=72)
        except Exception: pass
    q['cover']=os.path.exists(f"{C}/cov/{c}.jpg")
    if q['kind']=='reel':
        if not os.path.exists(f"{C}/strip/{c}.jpg") and q.get('vid') and get(q['vid'],f"{C}/vid/{c}.mp4"):
            try:
                d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f"{C}/vid/{c}.mp4"],capture_output=True,text=True).stdout or 0)
                fr=[]
                for i in range(4):
                    o=f"{C}/vid/{c}_{i}.jpg"; subprocess.run(['ffmpeg','-v','error','-y','-ss',str(round(d*(i+0.5)/4,2)),'-i',f"{C}/vid/{c}.mp4",'-frames:v','1','-vf','scale=240:-2',o])
                    if os.path.exists(o): fr.append(Image.open(o).convert('RGB'))
                if fr:
                    h=max(f.size[1] for f in fr); st=Image.new('RGB',(240*len(fr),h),'white')
                    for i,f in enumerate(fr): st.paste(f,(240*i,0))
                    st.save(f"{C}/strip/{c}.jpg",quality=72); q['dur']=q.get('dur') or d
            except Exception: pass
        q['strip']=os.path.exists(f"{C}/strip/{c}.jpg")
    elif q['kind']=='carrusel':
        out=f"{C}/cstrip/{c}.jpg"
        if not os.path.exists(out) and len(q.get('imgs') or [])>1:
            fr=[]
            for k,u in enumerate(q['imgs'][1:5]):
                raw=f"{C}/cstrip/{c}_{k}.raw"
                if get(u,raw):
                    try: fr.append(ImageOps.fit(Image.open(raw).convert('RGB'),(240,300)))
                    except Exception: pass
                    os.remove(raw)
            if fr:
                st=Image.new('RGB',(240*len(fr),300),'white')
                for k,f in enumerate(fr): st.paste(f,(240*k,0))
                st.save(out,quality=68)
        q['strip']=os.path.exists(out)
    else: q['strip']=False
    return q
with ThreadPoolExecutor(10) as ex: pieces=list(ex.map(do,pieces))
for q in pieces:
    for k in ('img','vid','imgs'): q.pop(k,None)
json.dump(pieces,open(C+"/pieces3.json","w"),ensure_ascii=False)
k=collections.Counter
print(len(pieces),'piezas |',dict(k(q['kind'] for q in pieces)),'| nuevas',sum(1 for q in pieces if q.get('nueva')),dict(k(q['kind'] for q in pieces if q.get('nueva'))))
print('portadas',sum(q['cover'] for q in pieces),'| tiras reel',sum(q['strip'] for q in pieces if q['kind']=='reel'),'de',sum(q['kind']=='reel' for q in pieces),'| tiras carrusel',sum(q['strip'] for q in pieces if q['kind']=='carrusel'),'de',sum(q['kind']=='carrusel' for q in pieces))
print('compartidas',sum(q['collab'] for q in pieces),'| likes ocultos',sum(q['likes'] is None for q in pieces),'| fuera del grid',sum(not q['grid'] for q in pieces))
print(dict(k(q['acct'] for q in pieces)))
