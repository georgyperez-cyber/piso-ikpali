import json,sys,statistics as st,datetime as dt,collections,math
S=sys.argv[1]; C=S+"/corte"
P=json.load(open(C+"/pieces3.json"))
SOC={p['username']:p.get('followersCount') for p in json.load(open(S+"/runs/partners-all.json"))}
NOW=dt.datetime(2026,11,13,5,12,tzinfo=dt.timezone.utc)
def ts(s): return dt.datetime.fromisoformat(s.replace('Z','+00:00'))
med=lambda v: st.median(v) if v else None
def m(v,r=2):
    v=[x for x in v if x is not None]
    return (len(v), round(st.median(v),r) if v else None)
for q in P:
    t=ts(q['ts']); q['horas']=(NOW-t).total_seconds()/3600; q['fresca']=q['horas']<24
    loc=t-dt.timedelta(hours=6); q['dow']=loc.weekday(); q['hr']=loc.hour; q['sem']=int((NOW-t).days//7)
    q['inter']=None if q['likes'] is None else q['likes']+(q['com'] or 0)
    sg=[SOC.get(s) for s in q['socios'] if SOC.get(s)]; q['sgmax']=max(sg) if sg else None
    q['tam']=None if not q['sgmax'] else q['sgmax']/q['fol']
    q['capn']=len(q['cap'] or '')
OK=[q for q in P if not q['fresca'] and q['acct']!='piso.ikpali']
R=[q for q in OK if q['kind']=='reel']; RO=[q for q in R if not q['collab']]
N=[q for q in OK if q['kind']!='reel']; NO=[q for q in N if not q['collab'] and q['inter'] is not None]
accts=sorted({q['acct'] for q in P})
mr={a:st.median([q['plays'] for q in RO if q['acct']==a]) for a in accts if sum(1 for q in RO if q['acct']==a)>=3}
mn={a:st.median([q['inter'] for q in NO if q['acct']==a]) for a in accts if sum(1 for q in NO if q['acct']==a)>=3}
mn={a:v for a,v in mn.items() if v>0}
ALLO=[q for q in OK if not q['collab'] and q['inter'] is not None]
mi={a:st.median([q['inter'] for q in ALLO if q['acct']==a]) for a in accts if sum(1 for q in ALLO if q['acct']==a)>=3}
mi={a:v for a,v in mi.items() if v>0}
for q in P:
    q['ix']=None; q['ixi']=None
    if q['fresca']: continue
    if q['kind']=='reel' and q['acct'] in mr and q['plays'] is not None: q['ix']=q['plays']/mr[q['acct']]
    if q['kind']!='reel' and q['inter'] is not None and q['acct'] in mn: q['ix']=q['inter']/mn[q['acct']]
    if q['inter'] is not None and q['acct'] in mi: q['ixi']=q['inter']/mi[q['acct']]
if __name__=='__main__':
    k=collections.Counter
    print('piezas',len(P),'| en análisis',len(OK),'| frescas',sum(q['fresca'] for q in P),'| reels',len(R),'propios',len(RO),'| no-reel',len(N),'propios visibles',len(NO))
    print('medianas reel',{a[:8]:int(v) for a,v in mr.items()})
    print('medianas post',{a[:8]:v for a,v in mn.items()})
    print('\n== MEZCLA DE FORMATOS (todas las piezas, 90 d)')
    tot=k(q['kind'] for q in P if q['acct']!='piso.ikpali'); n=sum(tot.values()); print(' set',{f:(c,round(100*c/n)) for f,c in tot.items()})
    for a in accts:
        c=k(q['kind'] for q in P if q['acct']==a); n=sum(c.values()); sh=sum(q['collab'] for q in P if q['acct']==a)
        print(f"  {a[:14]:14} n={n:>2} reel={round(100*c['reel']/n):>3}% carr={round(100*c['carrusel']/n):>3}% foto={round(100*c['foto']/n):>3}% compartidas={round(100*sh/n):>3}% por semana={n/12.9:.1f}")
    print('\n== FORMATO vs RESPUESTA dentro de la cuenta (propias, likes visibles): mediana likes+com')
    w=wn=0
    for a in accts:
        x={f:[q['inter'] for q in ALLO if q['acct']==a and q['kind']==f] for f in ('reel','carrusel','foto')}
        if len(x['reel'])>=2 and len(x['carrusel'])>=2:
            wn+=1; w+= st.median(x['reel'])>st.median(x['carrusel'])
        print(f"  {a[:14]:14} reel {m(x['reel'],0)} carr {m(x['carrusel'],0)} foto {m(x['foto'],0)}")
    print('  reel > carrusel en',w,'de',wn)
    print('  índice ixi por formato (propias):',{f:m([q['ixi'] for q in ALLO if q['kind']==f and q['ixi']]) for f in ('reel','carrusel','foto')})
    print('\n== COMPARTIDAS')
    print(' reels: compartidos',m([q['plays'] for q in R if q['collab']],0),'propios',m([q['plays'] for q in RO],0))
    print(' reels compartidos ix:',m([q['ix'] for q in R if q['collab'] and q['ix']]), 'arriba',sum(1 for q in R if q['collab'] and q['ix'] and q['ix']>1),'de',sum(1 for q in R if q['collab'] and q['ix']))
    for lo,hi,lab in [(0,0.5,'socio <0.5x'),(0.5,2,'0.5-2x'),(2,4,'2-4x'),(4,1e9,'>=4x')]:
        x=[q for q in R if q['collab'] and q['ix'] and q['tam'] is not None and lo<=q['tam']<hi]; print('  reel',lab,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'cuentas',len({q['acct'] for q in x}))
    Ns=[q for q in N if q['collab'] and q['ix']]
    print(' posts compartidos ix:',m([q['ix'] for q in Ns]),'arriba',sum(q['ix']>1 for q in Ns),'de',len(Ns),'cuentas',len({q['acct'] for q in Ns}))
    for lo,hi,lab in [(0,0.5,'socio <0.5x'),(0.5,2,'0.5-2x'),(2,4,'2-4x'),(4,1e9,'>=4x')]:
        x=[q for q in Ns if q['tam'] is not None and lo<=q['tam']<hi]; print('  post',lab,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'cuentas',len({q['acct'] for q in x}))
    print(' compartidas por cuenta:',{a[:8]:(sum(q['collab'] for q in P if q['acct']==a)) for a in accts})
    t10=sorted(R,key=lambda q:-q['plays'])[:10]; print(' top10 reels: compartidos',sum(q['collab'] for q in t10),[ (q['acct'][:6],q['plays'],q['collab']) for q in t10])
    print('\n== AUDIO (reels propios, ix)')
    def cat(q): return 'voz' if q.get('voz') else 'musica' if q.get('musica') else 'original sin voz'
    for c in ('voz','musica','original sin voz'):
        x=[q for q in RO if cat(q)==c and q['ix']]; print(' ',c,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'cuentas',len({q['acct'] for q in x}),'plays',m([q['plays'] for q in x],0))
    w=wn=0
    for a in mr:
        x=[q['plays'] for q in RO if q['acct']==a and q.get('voz')]; y=[q['plays'] for q in RO if q['acct']==a and not q.get('voz')]
        if x and y: wn+=1; w+=st.median(x)>st.median(y)
    print('  voz gana dentro de la cuenta',w,'de',wn)
    w=wn=0
    for a in mr:
        x=[q['plays'] for q in RO if q['acct']==a and q.get('musica') and not q.get('voz')]; y=[q['plays'] for q in RO if q['acct']==a and not q.get('musica') and not q.get('voz')]
        if x and y: wn+=1; w+=st.median(x)>st.median(y); print('   ',a[:10],len(x),st.median(x),len(y),st.median(y))
    print('  música gana a original sin voz en',w,'de',wn)
    print('\n== DURACIÓN (reels propios)')
    for lo,hi in [(0,15),(15,30),(30,60),(60,1e9)]:
        x=[q for q in RO if q['ix'] and lo<=(q['dur'] or 0)<hi]; print(' ',lo,hi,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'cuentas',len({q['acct'] for q in x}))
    print('\n== PANTALLA reels propios ix | posts propios ix')
    for c,nm in [('E','En escena'),('S','Espacio'),('H','Manos'),('C','A cámara'),('G','Gráfico'),('O','Objeto solo'),('M','Modelo')]:
        x=[q for q in RO if q['pant']==c and q['ix']]; y=[q for q in NO if q['pant']==c and q['ix']]
        print(f"  {nm:12} reels {m([q['ix'] for q in x])} arriba {sum(q['ix']>1 for q in x)} ctas {len({q['acct'] for q in x})} | posts {m([q['ix'] for q in y])} arriba {sum(q['ix']>1 for q in y)} ctas {len({q['acct'] for q in y})} | reels todos plays {m([q['plays'] for q in R if q['pant']==c],0)}")
    x=[q for q in RO if q['pant'] in 'EHC' and q['ix']]; print('  gente EHC reels',m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x))
    x=[q for q in NO if q['pant'] in 'EHC' and q['ix']]; print('  gente EHC posts',m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x))
    print('\n== PILAR reels propios ix | posts propios ix')
    for c,nm in [('D','Persona'),('R','Proceso'),('E','Evento'),('S','Espacio'),('P','Producto'),('A','Aviso'),('N','Prensa')]:
        x=[q for q in RO if q['pilar']==c and q['ix']]; y=[q for q in NO if q['pilar']==c and q['ix']]
        print(f"  {nm:9} reels {m([q['ix'] for q in x])} arriba {sum(q['ix']>1 for q in x)} ctas {len({q['acct'] for q in x})} | posts {m([q['ix'] for q in y])} arriba {sum(q['ix']>1 for q in y)} ctas {len({q['acct'] for q in y})}")
    print('\n== DÍA y HORA (ix, propias, reels+posts)')
    OWN=[q for q in OK if not q['collab'] and q['ix']]
    D=['lun','mar','mié','jue','vie','sáb','dom']
    for d in range(7):
        x=[q for q in OWN if q['dow']==d]; print(' ',D[d],m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'| piezas totales',sum(1 for q in P if q['dow']==d))
    for lo,hi in [(0,9),(9,12),(12,15),(15,18),(18,21),(21,24)]:
        x=[q for q in OWN if lo<=q['hr']<hi]; print(f'  {lo:02}-{hi:02}h',m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'ctas',len({q['acct'] for q in x}),'| piezas totales',sum(1 for q in P if lo<=q['hr']<hi))
    print('  piso publica:',sorted((D[q['dow']],q['hr']) for q in P if q['acct']=='piso.ikpali'))
    print('\n== CARRUSEL: número de imágenes (posts propios ix)')
    for lo,hi in [(2,4),(4,7),(7,11),(11,99)]:
        x=[q for q in NO if q['kind']=='carrusel' and q['ix'] and lo<=(q['n'] or 0)<hi]; print(' ',lo,hi,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x),'ctas',len({q['acct'] for q in x}))
    print(' foto vs carrusel ix:',m([q['ix'] for q in NO if q['kind']=='foto' and q['ix']]),m([q['ix'] for q in NO if q['kind']=='carrusel' and q['ix']]))
    print('\n== TEXTO: largo del caption y hashtags (propias ix)')
    for lo,hi in [(0,80),(80,300),(300,800),(800,1e9)]:
        x=[q for q in OWN if lo<=q['capn']<hi]; print(' cap',lo,hi,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x))
    for lo,hi in [(0,1),(1,4),(4,10),(10,99)]:
        x=[q for q in OWN if lo<=q['tags']<hi]; print(' hashtags',lo,hi,m([q['ix'] for q in x]),'arriba',sum(q['ix']>1 for q in x))
    print('\n== DM',m([q['ix'] for q in OWN if q['dm']]),m([q['ix'] for q in OWN if not q['dm']]))
    print('\n== FRECUENCIA vs respuesta por seguidor (cuentas)')
    for a in accts:
        n=sum(1 for q in P if q['acct']==a); f=[q['fol'] for q in P if q['acct']==a][0]
        e=[q['inter']/q['fol']*100 for q in ALLO if q['acct']==a]
        print(f"  {a[:14]:14} seg={f:>6} por semana={n/12.9:.1f} ER propio mediana={round(st.median(e),2) if e else None} n={len(e)} ocultos={sum(1 for q in P if q['acct']==a and q['likes'] is None)}")
