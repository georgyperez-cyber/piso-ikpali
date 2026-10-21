"use client";

import { gsap } from "gsap";

// Contraste adaptativo, letra por letra.
//
// El texto rojo de la interfaz pasa sobre las piezas. Cuando una letra cae
// sobre una zona oscura de una pieza, se vuelve blanca; el resto se queda
// rojo. Para saberlo sin leer píxeles de la pantalla, cada foto se reduce una
// vez a un mapa de 32 × 32 (alfa + luminancia) y cada letra consulta el mapa
// de las piezas que tiene debajo.

const N = 32;
const mapas = new Map<string, { a: Float32Array; l: Float32Array }>();
const cargando = new Set<string>();

function mapaDe(img: HTMLImageElement) {
  const src = img.currentSrc || img.src;
  const m = mapas.get(src);
  if (m) return m;
  if (cargando.has(src) || !img.complete || !img.naturalWidth) return null;
  cargando.add(src);
  try {
    const c = document.createElement("canvas");
    c.width = N;
    c.height = N;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, N, N);
    const d = ctx.getImageData(0, 0, N, N).data;
    const a = new Float32Array(N * N);
    const l = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) {
      a[i] = d[i * 4 + 3] / 255;
      l[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    }
    const r = { a, l };
    mapas.set(src, r);
    return r;
  } catch {
    return null;
  }
}

// Texto que se parte en letras para que cada una decida su color.
export function Adapt({ children }: { children: string }) {
  return (
    <>
      {Array.from(children).map((ch, i) => (
        <span key={i} className="ad">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

// Revisa las letras de `root` contra las piezas en `items`. Llamar cada pocos frames.
export function revisarContraste(root: HTMLElement, items: HTMLElement[], umbral = 0.5) {
  const letras = root.querySelectorAll<HTMLElement>(".ad");
  if (!letras.length) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // solo las piezas visibles y con mapa listo
  const piezas: { r: DOMRect; m: { a: Float32Array; l: Float32Array } }[] = [];
  for (const el of items) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.right < 0 || r.left > vw || r.bottom < 0 || r.top > vh) continue;
    if (getComputedStyle(el).visibility === "hidden") continue;
    const img = el.querySelector("img");
    if (!img) continue;
    const m = mapaDe(img);
    if (!m) continue;
    piezas.push({ r, m });
  }

  letras.forEach((s) => {
    const b = s.getBoundingClientRect();
    if (!b.width) return;
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    let oscuro = false;
    // la última en el DOM queda encima; se recorre al revés
    for (let k = piezas.length - 1; k >= 0; k--) {
      const { r, m } = piezas[k];
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) continue;
      const u = gsap.utils.clamp(0, N - 1, Math.floor(((cx - r.left) / r.width) * N));
      const v = gsap.utils.clamp(0, N - 1, Math.floor(((cy - r.top) / r.height) * N));
      const i = v * N + u;
      if (m.a[i] < 0.5) continue;
      oscuro = m.l[i] < umbral;
      break;
    }
    s.classList.toggle("is-neg", oscuro);
  });
}
