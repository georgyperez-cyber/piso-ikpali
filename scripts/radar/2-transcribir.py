import json,sys,os,time
from faster_whisper import WhisperModel
C=sys.argv[1]+"/corte"; P=json.load(open(C+"/pieces.json"))
out=C+"/tr.json"; T=json.load(open(out)) if os.path.exists(out) else {}
m=WhisperModel("base", device="cpu", compute_type="int8", cpu_threads=4)
for q in P:
    if q['kind']!='reel' or q['code'] in T: continue
    f=f"{C}/vid/{q['code']}.mp4"; t0=time.time()
    try:
        import subprocess,numpy as np
        raw=subprocess.run(['ffmpeg','-v','error','-t','75','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout
        audio=np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
        segs,info=m.transcribe(audio, vad_filter=True, beam_size=2, condition_on_previous_text=False)
        segs=list(segs); text=" ".join(s.text.strip() for s in segs if s.no_speech_prob<0.6).strip()
        T[q['code']]=dict(text=text, lang=info.language, lp=round(info.language_probability,2), speech=round(sum(s.end-s.start for s in segs),1), dur=round(info.duration,1))
    except Exception as e:
        T[q['code']]=dict(text="", err=str(e)[:80])
    json.dump(T,open(out,"w"),ensure_ascii=False); print(q["code"],round(time.time()-t0,1),flush=True)
print("listo",len(T))
