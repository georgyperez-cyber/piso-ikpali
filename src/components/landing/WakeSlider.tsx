"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Slider sin perilla hecho de barras delgadas. Las barras que la mano barre al
// arrastrar rápido se levantan en estela detrás del cursor y regresan con
// un rebote elástico. Devuelve un valor entre 0 y 1.

type Props = {
  value: number;
  onChange: (v: number) => void;
  bars?: number;
  label?: (v: number) => string;
};

export default function WakeSlider({ value, onChange, bars = 36, label }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; t: number } | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const root = rootRef.current!;
    const wrap = barsRef.current!;
    const els = Array.from(wrap.children) as HTMLElement[];

    const valueFromX = (clientX: number) => {
      const r = wrap.getBoundingClientRect();
      return gsap.utils.clamp(0, 1, (clientX - r.left) / r.width);
    };

    const wake = (clientX: number, speed: number, dir: number) => {
      const r = wrap.getBoundingClientRect();
      const pos = ((clientX - r.left) / r.width) * els.length;
      els.forEach((el, i) => {
        // distancia en barras, solo hacia atrás de la mano
        const d = (pos - i) * dir;
        if (d < -0.5 || d > 9) return;
        const boost = Math.min(1.6, speed * 0.9) * Math.exp(-Math.max(0, d) / 3.2);
        if (boost < 0.04) return;
        gsap.killTweensOf(el);
        gsap
          .timeline()
          .to(el, { scaleY: 1 + boost, duration: 0.08, ease: "power2.out" })
          .to(el, { scaleY: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" });
      });
    };

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      root.setPointerCapture(e.pointerId);
      last.current = { x: e.clientX, t: performance.now() };
      onChange(valueFromX(e.clientX));
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const now = performance.now();
      const prev = last.current;
      if (prev) {
        const dt = Math.max(8, now - prev.t);
        const dx = e.clientX - prev.x;
        const speed = Math.abs(dx) / dt; // px por ms
        if (Math.abs(dx) > 0.5) wake(e.clientX, speed, Math.sign(dx));
      }
      last.current = { x: e.clientX, t: now };
      onChange(valueFromX(e.clientX));
    };
    const onUp = () => {
      dragging.current = false;
      last.current = null;
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, [onChange]);

  const on = Math.round(value * bars);

  return (
    <div
      ref={rootRef}
      className="ld-wake"
      role="slider"
      aria-label="Zoom"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(1, value + 0.05));
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(0, value - 0.05));
      }}
    >
      <div ref={barsRef} className="ld-wake__bars" aria-hidden>
        {Array.from({ length: bars }, (_, i) => (
          <span key={i} className={`ld-wake__bar${i < on ? " is-on" : ""}`} />
        ))}
      </div>
      {label && <span className="ld-wake__val">{label(value)}</span>}
    </div>
  );
}
