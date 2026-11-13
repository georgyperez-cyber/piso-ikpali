import json,re,os,subprocess,sys,datetime as dt
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
S=sys.argv[1]; C=S+"/corte"
prof=json.load(open(S+"/runs/corte-2026-11-12.json")); reels=[x for x in json.load(open(S+"/runs/reels-2026-11-12.json")) if x.get('shortCode')]
F={p['username']:p['followersCount'] for p in prof}
NOW=dt.datetime(2026,11,13,0,13,43,tzinfo=dt.timezone.utc); SINCE=dt.datetime(2026,8,15,tzinfo=dt.timezone.utc)
def ts(s): return dt.datetime.fromisoformat(s.replace('Z','+00:00'))
P={}
for p in prof:
    u=p['username']
    for x in p.get('latestPosts') or []:
        if not x.get('timestamp') or ts(x['timestamp'])<SINCE: continue
        P[x['shortCode']]=dict(code=x['shortCode'],acct=u,owner=x.get('ownerUsername') or u,ts=x['timestamp'],kind={'Video':'reel','Sidecar':'carrusel'}.get(x.get('type'),'foto'),
            likes=x.get('likesCount'),com=x.get('commentsCount'),plays=None,dur=x.get('videoDuration'),cap=x.get('caption') or '',img=x.get('displayUrl'),vid=x.get('videoUrl'),
            n=len(x.get('childPosts') or []) or None,pin=bool(x.get('isPinned')),audio=None)
for x in reels:
    if ts(x['timestamp'])<SINCE: continue
    u=re.sub(r'.*instagram\.com/|/.*','',x.get('inputUrl') or '') or x.get('ownerUsername')
    if u not in F: u=x.get('ownerUsername')
    if u not in F: continue
    q=P.get(x['shortCode']) or dict(code=x['shortCode'],acct=u,owner=x.get('ownerUsername') or u,ts=x['timestamp'],kind='reel',cap=x.get('caption') or '',n=None,pin=bool(x.get('isPinned')))
    mi=x.get('musicInfo') or {}
    q.update(likes=x.get('likesCount'),com=x.get('commentsCount'),plays=x.get('videoPlayCount'),dur=x.get('videoDuration'),img=x.get('displayUrl'),vid=x.get('videoUrl'),
             audio=('original' if mi.get('uses_original_audio') else ((mi.get('song_name') or '')+' · '+(mi.get('artist_name') or '')).strip(' ·') or None))
    P[x['shortCode']]=q
pieces=sorted(P.values(),key=lambda q:q['ts'],reverse=True)
for q in pieces:
    q['likes']=None if q['likes'] is None or q['likes']<0 else q['likes']; q['com']=None if q['com'] is None or q['com']<0 else q['com']
    q['collab']=q['owner']!=q['acct']; q['fol']=F[q['acct']]
def get(url,out):
    if os.path.exists(out) and os.path.getsize(out)>2000: return True
    r=subprocess.run(['curl','-s','-L','--max-time','90','-o',out,'-w','%{http_code}',url],capture_output=True,text=True)
    ok=r.stdout.strip()=='200' and os.path.getsize(out)>2000
    if not ok and os.path.exists(out): os.remove(out)
    return ok
def do(q):
    c=q['code']; q['cover']=False; q['strip']=False
    if q.get('img') and get(q['img'],f"{C}/cov/{c}.raw"):
        try:
            im=Image.open(f"{C}/cov/{c}.raw").convert('RGB'); im.thumbnail((480,640)); im.save(f"{C}/cov/{c}.jpg",quality=72); q['cover']=True
        except Exception: pass
    if q['kind']=='reel' and q.get('vid') and get(q['vid'],f"{C}/vid/{c}.mp4"):
        try:
            d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f"{C}/vid/{c}.mp4"],capture_output=True,text=True).stdout or 0)
            fr=[]
            for i in range(4):
                o=f"{C}/vid/{c}_{i}.jpg"; subprocess.run(['ffmpeg','-v','error','-y','-ss',str(round(d*(i+0.5)/4,2)),'-i',f"{C}/vid/{c}.mp4",'-frames:v','1','-vf','scale=240:-2',o])
                if os.path.exists(o): fr.append(Image.open(o).convert('RGB'))
            if fr:
                h=max(f.size[1] for f in fr); st=Image.new('RGB',(240*len(fr),h),'white')
                for i,f in enumerate(fr): st.paste(f,(240*i,0))
                st.save(f"{C}/strip/{c}.jpg",quality=72); q['strip']=True; q['dur']=q.get('dur') or d
        except Exception as e: pass
    return q
with ThreadPoolExecutor(8) as ex: pieces=list(ex.map(do,pieces))
for q in pieces: q.pop('img',None); q.pop('vid',None)
json.dump(pieces,open(C+"/pieces.json","w"),ensure_ascii=False)
import collections
print(len(pieces),'piezas desde 15 ago |',dict(collections.Counter(q['kind'] for q in pieces)),'| portadas',sum(q['cover'] for q in pieces),'| tiras',sum(q['strip'] for q in pieces),'de',sum(q['kind']=='reel' for q in pieces),'reels | con plays',sum(q['plays'] is not None for q in pieces))
print(dict(collections.Counter(q['acct'] for q in pieces)))
