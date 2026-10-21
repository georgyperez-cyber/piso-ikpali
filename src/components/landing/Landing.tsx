"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Lenis from "lenis";
import { PRODUCTOS, SITIO, formatoPrecio, type Producto } from "./productos";
import WakeSlider from "./WakeSlider";
import GlassBar from "./GlassBar";
import { Adapt, revisarContraste } from "./contraste";
import "./landing.css";

gsap.registerPlugin(Draggable, InertiaPlugin, Flip, MorphSVGPlugin);

// iconos del botón grid / tablero (un solo path, para el morph)
const ICONO_GRID = "M1 1h4.5v4.5H1zM8.5 1h4.5v4.5H8.5zM1 8.5h4.5V13H1zM8.5 8.5h4.5V13H8.5z";
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
const ICONO_TABLERO = circ(3, 4, 1.6) + circ(10.5, 2.8, 1.6) + circ(7, 8.2, 1.6) + circ(2.6, 11.4, 1.6) + circ(11.2, 10.6, 1.6);

/* ───────────────────────── tablero: geometría ───────────────────────── */

const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.7;
const zoomDeValor = (v: number) => ZOOM_MIN + v * (ZOOM_MAX - ZOOM_MIN);
const valorDeZoom = (z: number) => (z - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN);

// El tablero es un bloque que se repite en las dos direcciones (3 × 3 copias);
// al arrastrar, el desplazamiento se envuelve dentro del bloque y nunca se acaba.
const TILES = [-1, 0, 1].flatMap((ty) => [-1, 0, 1].map((tx) => ({ tx, ty })));

type Layout = {
  cell: number;
  cols: number;
  step: number;
  celdas: number; // cols × rows; si sobran celdas se repiten piezas para no dejar huecos
  BW: number; // ancho del bloque
  BH: number; // alto del bloque
  pos: { x: number; y: number; w: number }[]; // una por celda
};

const ruido = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

function calcularTablero(items: Producto[], vw: number, vh: number): Layout {
  const n = items.length;
  const movil = vw < 768;
  const cell = movil ? Math.round(vw * 0.38) : Math.round(gsap.utils.clamp(180, 260, vw * 0.16));
  let step = cell + Math.round(cell * 0.3);

  let cols = 1;
  let mejor = Infinity;
  for (let c = 1; c <= n; c++) {
    const r = Math.ceil(n / c);
    const d = Math.abs(c / r - vw / vh);
    if (d < mejor) {
      mejor = d;
      cols = c;
    }
  }
  const rows = Math.ceil(n / cols);
  // el bloque tiene que cubrir la pantalla aun con el zoom mínimo
  step = Math.max(step, Math.ceil(vw / (cols * ZOOM_MIN)) + 1, Math.ceil(vh / (rows * ZOOM_MIN)) + 1);

  const celdas = cols * rows;
  const pos = Array.from({ length: celdas }, (_, k) => {
    const p = items[k % n];
    const c = k % cols;
    const r = Math.floor(k / cols);
    const x = c * step + step / 2 + ruido(k, 1) * step * 0.08;
    const y = r * step + step / 2 + (c % 2 ? step * 0.5 : 0) + ruido(k, 2) * step * 0.08;
    return { x, y, w: Math.round(cell * p.tam) };
  });

  return { cell, cols, step, celdas, BW: cols * step, BH: rows * step, pos };
}

// la intro enseña 4 piezas al azar, distintas en cada carga
const elegirIntro = () => {
  const idx = PRODUCTOS.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 4);
  return idx.map((i) => PRODUCTOS[i].src);
};

type Fase = "intro" | "tablero" | "foco" | "grid";

const CATEGORIAS = ["todo", ...Array.from(new Set(PRODUCTOS.map((p) => p.categoria)))];
const MARCAS = ["todas", ...Array.from(new Set(PRODUCTOS.map((p) => p.marca)))];

type PiezaProps = {
  p: Producto;
  i: number; // producto
  k?: number; // celda del bloque (solo tablero)
  t?: number; // tile
  registrar: (el: HTMLDivElement | null, i: number, t?: number) => void;
  onClick?: (i: number, el: HTMLElement) => void;
};

// Una pieza del tablero (t = copia del bloque) o del grid (sin t).
const Pieza = memo(function Pieza({ p, i, k, t, registrar, onClick }: PiezaProps) {
  return (
    <div
      ref={(el) => registrar(el, t === undefined ? i : (k as number), t)}
      className="ld-item"
      data-i={i}
      data-flip-id={t === undefined ? `p${i}` : undefined}
      onClick={onClick ? (e) => onClick(i, e.currentTarget) : undefined}
    >
      <div className="ld-item__hit" role="button" tabIndex={-1} aria-label={p.nombre}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ld-item__img" src={p.src} alt={p.nombre} draggable={false} loading="lazy" decoding="async" />
        <span className="ld-item__label" style={t === undefined ? undefined : { top: `${(p.fondo ?? 1) * 100}%` }}>
          {p.nombre}
        </span>
      </div>
    </div>
  );
});

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const gridBoxRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<HTMLDivElement[][]>(TILES.map(() => [])); // [tile][celda]
  const iconoRef = useRef<SVGPathElement>(null);
  const gridElsRef = useRef<HTMLDivElement[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);

  const cloneRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const layoutRef = useRef<Layout | null>(null);
  const dragRef = useRef<Draggable | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const zoomRef = useRef(0.88);
  const shiftRef = useRef({ x: 0, y: 0 });
  const faseRef = useRef<Fase>("intro");
  const faseAntesRef = useRef<Fase>("tablero");
  const reveladoRef = useRef<Set<HTMLElement>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const origenRef = useRef<DOMRect | null>(null);
  const origenElRef = useRef<HTMLElement | null>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const hintVisto = useRef(false);
  const elegidosRef = useRef<HTMLDivElement[]>([]); // instancias que viajan al grid
  const cerrarFocoRef = useRef<() => void>(() => {});
  const terminarIntroRef = useRef<() => void>(() => {});

  // desplazamiento suave del tablero (la rueda acumula; cada frame se acerca)
  const scrollObjetivo = useRef({ x: 0, y: 0 });
  const scrollActual = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: -9999, y: -9999, activo: false });

  const [fase, setFaseState] = useState<Fase>("intro");
  const [zoomVal, setZoomVal] = useState(valorDeZoom(0.88));
  const [celdas, setCeldas] = useState(0);
  const [introFotos, setIntroFotos] = useState<string[]>([]);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [foco, setFoco] = useState<{ p: Producto; i: number } | null>(null);
  const [formAbierto, setFormAbierto] = useState(false);
  const [filtro, setFiltro] = useState({ categoria: "todo", marca: "todas" });

  const setFase = (f: Fase) => {
    faseRef.current = f;
    setFaseState(f);
  };

  const todos = useCallback(() => elsRef.current.flat().filter(Boolean), []);
  // todas las copias (en todas las celdas y tiles) de un producto
  const copiasDe = useCallback((i: number) => todos().filter((el) => Number(el.dataset.i) === i), [todos]);

  /* ───────── posición del tablero (infinito) ───────── */

  const colocarItems = useCallback(() => {
    const L = layoutRef.current!;
    elsRef.current.forEach((lista, t) => {
      const { tx, ty } = TILES[t];
      lista.forEach((el, k) => {
        if (!el) return;
        const p = L.pos[k];
        gsap.set(el, {
          left: tx * L.BW + p.x - p.w / 2,
          top: ty * L.BH + p.y - p.w / 2,
          width: p.w,
          height: p.w,
        });
      });
    });
  }, []);

  // lleva el tablero a (x, y) envolviendo dentro del bloque
  const pintar = useCallback((x: number, y: number) => {
    const L = layoutRef.current!;
    const z = zoomRef.current;
    const bx = gsap.utils.wrap(-L.BW * z, 0, x);
    const by = gsap.utils.wrap(-L.BH * z, 0, y);
    // ¿cambió el bloque que está en pantalla? Entonces la copia que entra
    // hereda el tamaño de la que sale, para que no se note el salto.
    const sx = Math.round((bx - x) / (L.BW * z));
    const sy = Math.round((by - y) / (L.BH * z));
    const dx = sx - shiftRef.current.x;
    const dy = sy - shiftRef.current.y;
    if (dx || dy) {
      shiftRef.current = { x: sx, y: sy };
      transferir(dx, dy);
    }
    gsap.set(boardRef.current, { x: bx, y: by, scale: z });
    return { bx, by };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // copia las escalas entre tiles cuando el tablero se envuelve.
  // dx = +1: el contenido se movió un bloque a la derecha, new(tx) = old(tx+1).
  const transferir = (dx: number, dy: number) => {
    const L = layoutRef.current!;
    const idx = (tx: number, ty: number) => (ty + 1) * 3 + (tx + 1);
    const leer = () => elsRef.current.map((lista) => lista.map((el) => (el ? ((gsap.getProperty(el, "scale") as number) || 1) : 1)));
    const paso = (ax: number, ay: number) => {
      const esc = leer();
      for (let ty = -1; ty <= 1; ty++) {
        for (let tx = -1; tx <= 1; tx++) {
          const sx = tx + ax;
          const sy = ty + ay;
          if (sx < -1 || sx > 1 || sy < -1 || sy > 1) continue;
          const dest = elsRef.current[idx(tx, ty)];
          const src = esc[idx(sx, sy)];
          for (let k = 0; k < L.celdas; k++) {
            const el = dest[k];
            if (!el) continue;
            gsap.killTweensOf(el, "scale");
            gsap.set(el, { scale: src[k] });
          }
        }
      }
    };
    if (dx) paso(Math.sign(dx), 0);
    if (dy) paso(0, Math.sign(dy));
  };

  const posActual = useCallback(() => {
    const b = boardRef.current!;
    return { x: gsap.getProperty(b, "x") as number, y: gsap.getProperty(b, "y") as number };
  }, []);

  /* ───────── zoom alrededor del centro de la pantalla ───────── */

  const aplicarZoom = useCallback(
    (v: number, animar = true) => {
      if (faseRef.current !== "tablero") return;
      const z1 = zoomDeValor(gsap.utils.clamp(0, 1, v));
      const z0 = zoomRef.current;
      if (Math.abs(z1 - z0) < 0.0005) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const { x: x0, y: y0 } = posActual();
      // punto del tablero que está bajo el centro: se queda quieto
      const px = (cx - x0) / z0;
      const py = (cy - y0) / z0;
      const estado = { z: z0 };
      gsap.to(estado, {
        z: z1,
        duration: animar ? 0.5 : 0,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          zoomRef.current = estado.z;
          const { bx, by } = pintar(cx - px * estado.z, cy - py * estado.z);
          gsap.set(proxyRef.current, { x: bx, y: by });
          scrollObjetivo.current = { x: bx, y: by };
          scrollActual.current = { x: bx, y: by };
          dragRef.current?.update();
        },
      });
    },
    [pintar, posActual]
  );

  const onZoom = useCallback(
    (v: number) => {
      setZoomVal(v);
      aplicarZoom(v);
    },
    [aplicarZoom]
  );

  /* ───────── revelado ───────── */

  const marcarMovimiento = useCallback((on: boolean) => {
    wrapRef.current?.classList.toggle("is-moving", on);
  }, []);

  const esconderHint = useCallback(() => {
    if (hintVisto.current) return;
    hintVisto.current = true;
    gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.5, delay: 0.3 });
  }, []);

  const revelar = useCallback(
    (el: HTMLElement, delay = 0) => {
      if (reveladoRef.current.has(el)) return;
      // se revela la pieza, no la copia: sus copias en los otros bloques
      // quedan listas en silencio para que el envolvimiento no las delate
      copiasDe(Number(el.dataset.i)).forEach((c) => {
        if (c === el || reveladoRef.current.has(c)) return;
        reveladoRef.current.add(c);
        gsap.set(c, { scale: 1 });
      });
      reveladoRef.current.add(el);
      gsap.to(el, { scale: 1, duration: 0.7, delay, ease: "back.out(1.5)", overwrite: "auto" });
    },
    [copiasDe]
  );

  const iniciarRevelado = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    const visibles: { el: HTMLElement; d: number }[] = [];
    todos().forEach((el) => {
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      if (ex > -r.width && ex < vw + r.width && ey > -r.height && ey < vh + r.height) {
        visibles.push({ el, d: Math.hypot(ex - cx, ey - cy) });
      }
    });
    const maxD = Math.max(1, ...visibles.map((v) => v.d));
    visibles.forEach((v) => revelar(v.el, (v.d / maxD) * 0.9));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          revelar(e.target as HTMLElement, 0.05);
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "12%" }
    );
    todos().forEach((el) => {
      if (!reveladoRef.current.has(el)) obs.observe(el);
    });
    observerRef.current = obs;
  }, [revelar, todos]);

  /* ───────── proximidad del mouse: las piezas cercanas crecen ───────── */

  const proximidad = useCallback(() => {
    if (faseRef.current !== "tablero" || !mouse.current.activo) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const L = layoutRef.current!;
    // alcanza dos anillos de vecinas; la que está bajo el mouse es la más grande
    const RADIO = L.step * zoomRef.current * 1.9;
    const PICO = 0.38;
    const { x: mx, y: my } = mouse.current;
    todos().forEach((el) => {
      if (!reveladoRef.current.has(el)) return;
      const r = el.getBoundingClientRect();
      if (r.right < -RADIO || r.left > vw + RADIO || r.bottom < -RADIO || r.top > vh + RADIO) return;
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height / 2;
      const d = Math.hypot(mx - ox, my - oy);
      const cerca = d < RADIO ? 0.5 + 0.5 * Math.cos((Math.PI * d) / RADIO) : 0; // 1 bajo el mouse, 0 lejos
      const objetivo = 1 + PICO * cerca;
      const actual = (gsap.getProperty(el, "scale") as number) || 1;
      if (actual < 0.95 && gsap.isTweening(el)) return; // todavía está apareciendo
      // la sombra huye del mouse (la luz) y se encoge cuando la pieza se levanta
      const ux = d > 1 ? (ox - mx) / d : 0;
      const uy = d > 1 ? (oy - my) / d : 1;
      const largo = 5 + 4 * cerca;
      const sombra = {
        "--sx": `${(ux * largo * (1 - 0.3 * cerca)).toFixed(1)}px`,
        "--sy": `${((cerca > 0 ? uy * largo : 5) * (1 - 0.3 * cerca)).toFixed(1)}px`,
        "--sb": `${(1.5 + 1 * cerca).toFixed(1)}px`,
        "--sa": (0.09 - 0.03 * cerca).toFixed(3),
      };
      if (Math.abs(actual - objetivo) < 0.004 && cerca === 0 && el.dataset.lejos === "1") return;
      el.dataset.lejos = cerca === 0 ? "1" : "0";
      gsap.to(el, { scale: objetivo, ...sombra, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    });
  }, [todos]);

  /* ───────── pieza enfocada ───────── */

  const abrirFoco = useCallback((i: number, el: HTMLElement) => {
    if (faseRef.current !== "tablero" && faseRef.current !== "grid") return;
    faseAntesRef.current = faseRef.current;
    const img = el.querySelector("img")!;
    origenRef.current = img.getBoundingClientRect();
    origenElRef.current = el;
    setFase("foco");
    dragRef.current?.disable();
    lenisRef.current?.stop();
    rootRef.current?.classList.add("is-focus");
    setFormAbierto(false);
    setFoco({ p: PRODUCTOS[i], i });
  }, []);

  // las demás piezas visibles, ordenadas por cercanía a la enfocada
  const ordenDesde = useCallback(
    (el: HTMLElement) => {
      const r0 = el.getBoundingClientRect();
      const cx = r0.left + r0.width / 2;
      const cy = r0.top + r0.height / 2;
      const fuente = faseAntesRef.current === "grid" ? gridElsRef.current : todos();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return fuente
        .filter((e) => e !== el && getComputedStyle(e).display !== "none")
        .map((e) => {
          const r = e.getBoundingClientRect();
          const ex = r.left + r.width / 2;
          const ey = r.top + r.height / 2;
          const fuera = ex < -vw * 0.5 || ex > vw * 1.5 || ey < -vh * 0.5 || ey > vh * 1.5;
          return { el: e, d: Math.hypot(ex - cx, ey - cy), fuera };
        })
        .filter((o) => !o.fuera)
        .sort((a, b) => a.d - b.d);
    },
    [todos]
  );

  useLayoutEffect(() => {
    if (!foco) return;
    const clone = cloneRef.current!;
    const box = boxRef.current!.getBoundingClientRect();
    const r = origenRef.current!;
    const original = origenElRef.current!;
    const otros = ordenDesde(original);

    gsap.set(clone, { left: r.left, top: r.top, width: r.width, height: r.height, autoAlpha: 1 });
    gsap.set(original, { visibility: "hidden" });

    const tl = gsap.timeline();
    tl.to(
      otros.map((o) => o.el),
      { scale: 0, duration: 0.5, ease: "back.in(1.3)", stagger: (idx) => idx * 0.014, overwrite: "auto" },
      0
    );
    tl.to([topRef.current, cornersRef.current[1]], { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in" }, 0);
    tl.to(hintRef.current, { autoAlpha: 0, duration: 0.3 }, 0);
    tl.to(
      clone,
      { left: box.left, top: box.top, width: box.width, height: box.height, duration: 1.05, ease: "expo.inOut" },
      0.12
    );
    tl.fromTo(
      infoRef.current!.children,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07 },
      0.8
    );
    tl.fromTo(
      closeRef.current,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      0.9
    );
    return () => {
      tl.kill();
    };
  }, [foco, ordenDesde]);

  // al abrir el formulario la caja de la pieza cambia de tamaño: la copia la sigue
  useLayoutEffect(() => {
    if (!foco || !boxRef.current || !cloneRef.current) return;
    const box = boxRef.current.getBoundingClientRect();
    gsap.to(cloneRef.current, {
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      duration: 0.7,
      ease: "expo.inOut",
      delay: 0.05,
      overwrite: "auto",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAbierto]);

  const cerrarFoco = useCallback(() => {
    if (faseRef.current !== "foco" || !foco) return;
    const clone = cloneRef.current!;
    const r = origenRef.current!;
    const original = origenElRef.current!;
    const otros = ordenDesde(original);
    const regresaA = faseAntesRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setFoco(null);
        setFase(regresaA);
        rootRef.current?.classList.remove("is-focus");
        if (regresaA === "tablero") dragRef.current?.enable();
        else lenisRef.current?.start();
      },
    });
    tl.to(infoRef.current!.children, { autoAlpha: 0, y: 10, duration: 0.3, ease: "power2.in", stagger: 0.03 }, 0);
    tl.to(closeRef.current, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, 0);
    tl.to(
      clone,
      { left: r.left, top: r.top, width: r.width, height: r.height, duration: 0.9, ease: "expo.inOut" },
      0.15
    );
    tl.add(() => {
      gsap.set(original, { visibility: "visible" });
      gsap.set(clone, { autoAlpha: 0 });
    });
    tl.to(
      otros.map((o) => o.el),
      { scale: 1, duration: 0.7, ease: "back.out(1.5)", stagger: (idx) => idx * 0.016, overwrite: "auto" },
      0.75
    );
    tl.to([topRef.current, cornersRef.current[1]], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1);
  }, [foco, ordenDesde]);
  cerrarFocoRef.current = cerrarFoco;

  /* ───────── modo grid ───────── */

  const flipVars = useMemo(
    () => ({ duration: 0.95, ease: "expo.inOut", absolute: true, scale: true, stagger: { amount: 0.22, from: "start" as const } }),
    []
  );

  const toggleGrid = useCallback(() => {
    const board = boardRef.current!;
    if (iconoRef.current) {
      gsap.to(iconoRef.current, {
        morphSVG: { shape: faseRef.current === "grid" ? ICONO_GRID : ICONO_TABLERO, shapeIndex: "auto" },
        duration: 0.7,
        ease: "expo.inOut",
      });
    }
    const gridWrap = gridWrapRef.current!;
    const gridEls = gridElsRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;

    if (faseRef.current === "tablero") {
      setFase("grid");
      dragRef.current?.disable();
      observerRef.current?.disconnect();
      // de cada pieza viaja la copia más cercana al centro de la pantalla
      const elegidos = PRODUCTOS.map((_, i) => {
        const copias = copiasDe(i);
        let mejor = copias[0];
        let dm = Infinity;
        copias.forEach((el) => {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
          if (d < dm) {
            dm = d;
            mejor = el;
          }
        });
        return mejor;
      });
      elegidosRef.current = elegidos;
      todos().forEach((el) => el.removeAttribute("data-flip-id"));
      elegidos.forEach((el, i) => el.setAttribute("data-flip-id", `p${i}`));
      const state = Flip.getState(elegidos);
      const resto = todos().filter((el) => !elegidos.includes(el));
      gsap.to(resto, { scale: 0, duration: 0.4, ease: "back.in(1.3)", stagger: { amount: 0.15 }, overwrite: "auto" });
      gsap.set(elegidos, { visibility: "hidden" });
      gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3 });

      gsap.set(gridWrap, { display: "block" });
      gridWrap.scrollTop = 0;
      gsap.set(gridEls, { clearProps: "transform", display: "block" });
      lenisRef.current?.resize();
      Flip.from(state, {
        ...flipVars,
        targets: gridEls,
        onComplete: () => {
          gsap.set(board, { autoAlpha: 0 });
          lenisRef.current?.start();
        },
      });
    } else if (faseRef.current === "grid") {
      lenisRef.current?.stop();
      lenisRef.current?.scrollTo(0, { immediate: true });
      gridWrap.scrollTop = 0;
      // el filtro se limpia: todas las piezas regresan al tablero
      setFiltro({ categoria: "todo", marca: "todas" });
      gsap.set(gridEls, { display: "block", clearProps: "transform" });
      const state = Flip.getState(gridEls);
      const elegidos = elegidosRef.current;
      gsap.set(board, { autoAlpha: 1 });
      gsap.set(elegidos, { visibility: "visible", scale: 1 });
      Flip.from(state, {
        ...flipVars,
        targets: elegidos,
        onComplete: () => {
          gsap.set(gridWrap, { display: "none" });
          const resto = todos().filter((el) => !elegidos.includes(el));
          resto.forEach((el) => reveladoRef.current.add(el));
          gsap.to(resto, { scale: 1, duration: 0.6, ease: "back.out(1.5)", stagger: { amount: 0.25 }, overwrite: "auto" });
          setFase("tablero");
          dragRef.current?.enable();
        },
      });
    }
  }, [flipVars, todos, copiasDe]);

  // filtro del grid con Flip: lo que no coincide se va, lo demás se reacomoda
  const filtrar = useCallback((f: { categoria: string; marca: string }) => {
    setFiltro(f);
    const gridEls = gridElsRef.current;
    const state = Flip.getState(gridEls);
    gridEls.forEach((el, i) => {
      const p = PRODUCTOS[i];
      const ok = (f.categoria === "todo" || p.categoria === f.categoria) && (f.marca === "todas" || p.marca === f.marca);
      el.style.display = ok ? "block" : "none";
    });
    lenisRef.current?.scrollTo(0, { duration: 0.8 });
    Flip.from(state, {
      duration: 0.8,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      stagger: { amount: 0.12 },
      onEnter: (els) => gsap.fromTo(els, { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(1.5)", stagger: 0.02 }),
      onLeave: (els) => gsap.to(els, { scale: 0, duration: 0.35, ease: "back.in(1.3)" }),
      onComplete: () => lenisRef.current?.resize(),
    });
  }, []);

  /* ───────── montaje ───────── */

  useEffect(() => {
    const root = rootRef.current!;
    const wrap = wrapRef.current!;
    const board = boardRef.current!;
    const proxy = proxyRef.current!;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const L = (layoutRef.current = calcularTablero(PRODUCTOS, window.innerWidth, window.innerHeight));
    setCeldas(L.celdas);
    setIntroFotos(elegirIntro());
    gsap.set(board, { width: L.BW, height: L.BH });
    const ini = pintar((window.innerWidth - L.BW) / 2, (window.innerHeight - L.BH) / 2);
    gsap.set(proxy, { x: ini.bx, y: ini.by });
    scrollObjetivo.current = { x: ini.bx, y: ini.by };
    scrollActual.current = { x: ini.bx, y: ini.by };

    // arrastre sobre un proxy invisible; el tablero se pinta envuelto
    const render = () => {
      const x = gsap.getProperty(proxy, "x") as number;
      const y = gsap.getProperty(proxy, "y") as number;
      pintar(x, y);
      scrollObjetivo.current = { x, y };
      scrollActual.current = { x, y };
    };
    const drag = Draggable.create(proxy, {
      type: "x,y",
      trigger: wrap,
      inertia: true,
      throwResistance: 2000,
      minimumMovement: 3,
      dragClickables: true,
      zIndexBoost: false,
      onPress: () => wrap.classList.add("is-dragging"),
      onDragStart: () => {
        marcarMovimiento(true);
        esconderHint();
      },
      onDrag: render,
      onThrowUpdate: render,
      onRelease: () => wrap.classList.remove("is-dragging"),
      onDragEnd: () => {
        if (!dragRef.current?.isThrowing) marcarMovimiento(false);
      },
      onThrowComplete: () => marcarMovimiento(false),
      onClick: (e: PointerEvent) => {
        const hit = (e.target as HTMLElement).closest<HTMLElement>(".ld-item");
        if (hit && faseRef.current === "tablero") abrirFoco(Number(hit.dataset.i), hit);
      },
    })[0];
    drag.disable();
    dragRef.current = drag;

    // rueda: acumula y se acerca suave cada frame (sin tirones)
    let moviendo = false;
    let quieto = 0;
    let frame = 0;
    const tick = () => {
      if (++frame % 6 === 0) {
        const fuente = faseRef.current === "grid" ? gridElsRef.current : todos();
        revisarContraste(root, fuente);
      }
      if (faseRef.current !== "tablero") return;
      const o = scrollObjetivo.current;
      const a = scrollActual.current;
      const dx = o.x - a.x;
      const dy = o.y - a.y;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        if (moviendo && ++quieto > 8) {
          moviendo = false;
          marcarMovimiento(false);
        }
      } else {
        quieto = 0;
        a.x += dx * 0.12;
        a.y += dy * 0.12;
        gsap.set(proxy, { x: a.x, y: a.y });
        pintar(a.x, a.y);
        drag.update();
      }
      if (frame % 2 === 0) proximidad();
    };
    gsap.ticker.add(tick);

    // nombre en hover: aparece letra por letra, con un parpadeo de glifos
    const GLIFOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/—";
    let scrambleRaf = 0;
    let hovered: HTMLElement | null = null;
    const onOver = (e: PointerEvent) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(".ld-item");
      if (!item || item === hovered) return;
      hovered = item;
      const label = item.querySelector<HTMLElement>(".ld-item__label");
      if (!label) return;
      const real = label.dataset.t || (label.dataset.t = label.textContent || "");
      let k = 0;
      let t0 = performance.now();
      cancelAnimationFrame(scrambleRaf);
      const paso = (t: number) => {
        if (hovered !== item) return;
        if (t - t0 > 22) {
          t0 = t;
          k++;
        }
        const ruidoTxt = k < real.length ? GLIFOS[Math.floor(Math.random() * GLIFOS.length)] : "";
        label.textContent = real.slice(0, k) + ruidoTxt;
        if (k < real.length) scrambleRaf = requestAnimationFrame(paso);
        else label.textContent = real;
      };
      scrambleRaf = requestAnimationFrame(paso);
    };
    const onOut = (e: PointerEvent) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(".ld-item");
      if (!item || item !== hovered) return;
      const to = e.relatedTarget as HTMLElement | null;
      if (to && item.contains(to)) return;
      hovered = null;
      const label = item.querySelector<HTMLElement>(".ld-item__label");
      if (label && label.dataset.t) label.textContent = label.dataset.t;
    };
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerout", onOut);

    const onWheel = (e: WheelEvent) => {
      if (faseRef.current === "grid") return; // lo maneja Lenis
      e.preventDefault();
      if (faseRef.current !== "tablero") return;
      if (e.ctrlKey) {
        const v = gsap.utils.clamp(0, 1, valorDeZoom(zoomRef.current) - e.deltaY * 0.004);
        setZoomVal(v);
        aplicarZoom(v, false);
        return;
      }
      if (drag.isDragging || drag.isThrowing) return;
      scrollObjetivo.current.x -= e.deltaX;
      scrollObjetivo.current.y -= e.deltaY;
      moviendo = true;
      marcarMovimiento(true);
      esconderHint();
    };
    root.addEventListener("wheel", onWheel, { passive: false });

    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, activo: e.pointerType === "mouse" };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999, activo: true };
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    // scroll suave del grid
    const lenis = new Lenis({
      wrapper: gridWrapRef.current!,
      content: gridBoxRef.current!,
      lerp: 0.1,
      smoothWheel: true,
    });
    lenis.stop();
    const lenisTick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(lenisTick);
    lenisRef.current = lenis;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (faseRef.current === "foco") cerrarFocoRef.current();
        else if (faseRef.current === "intro") terminarIntroRef.current();
      }
    };
    window.addEventListener("keydown", onKey);

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (faseRef.current === "foco") return;
        const L2 = (layoutRef.current = calcularTablero(PRODUCTOS, window.innerWidth, window.innerHeight));
        gsap.set(board, { width: L2.BW, height: L2.BH });
        colocarItems();
        shiftRef.current = { x: 0, y: 0 };
        const p = pintar((window.innerWidth - L2.BW * zoomRef.current) / 2, (window.innerHeight - L2.BH * zoomRef.current) / 2);
        gsap.set(proxy, { x: p.bx, y: p.by });
        scrollObjetivo.current = { x: p.bx, y: p.by };
        scrollActual.current = { x: p.bx, y: p.by };
        lenis.resize();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      html.style.overflow = prevOverflow;
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(scrambleRaf);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      gsap.ticker.remove(lenisTick);
      lenis.destroy();
      observerRef.current?.disconnect();
      drag.kill();
      introTl.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // las celdas existen hasta el segundo render: entonces se colocan y se esconden
  useLayoutEffect(() => {
    if (!celdas) return;
    colocarItems();
    gsap.set(todos(), { scale: 0 });
    const L = layoutRef.current!;
    const z = zoomRef.current;
    shiftRef.current = { x: 0, y: 0 };
    const ini = pintar((window.innerWidth - L.BW * z) / 2, (window.innerHeight - L.BH * z) / 2);
    gsap.set(proxyRef.current, { x: ini.bx, y: ini.by });
    scrollObjetivo.current = { x: ini.bx, y: ini.by };
    scrollActual.current = { x: ini.bx, y: ini.by };
    dragRef.current?.update();
  }, [celdas, colocarItems, pintar, todos]);

  /* ───────── intro ───────── */

  useEffect(() => {
    if (!celdas || introFotos.length < 4) return;
    const intro = introRef.current!;
    const wrapper = intro.querySelector<HTMLElement>("[data-wrapper]")!;
    const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", intro);
    const title = intro.querySelector<HTMLElement>("[data-title]")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const yaVisto = false; // la intro corre en cada carga

    const arrancarTablero = () => {
      gsap.set(intro, { display: "none" });
      setFase("tablero");
      dragRef.current?.enable();
      iniciarRevelado();
      gsap.fromTo(
        [topRef.current, hintRef.current, ...cornersRef.current],
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05, delay: 0.5 }
      );
    };

    if (yaVisto || reduced) {
      arrancarTablero();
      return;
    }

    gsap.set(wrapper, { width: 0 });
    gsap.set(slides, { autoAlpha: 0, scale: 0.9 });
    const medir = () => {
      gsap.set(wrapper, { width: "auto" });
      const w = wrapper.getBoundingClientRect().width;
      gsap.set(wrapper, { width: 0 });
      return w;
    };
    const natural = medir();

    const HOLD = 0.42;
    const OPEN = 0.6;
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.35, paused: true });
    // arranca cuando las 4 fotos ya cargaron (o a los 1.5 s, lo que pase primero)
    const imgs = slides.slice(1) as HTMLImageElement[];
    const listo = Promise.all(imgs.map((im) => (im.complete ? null : new Promise((r) => (im.onload = im.onerror = r)))));
    let arrancado = false;
    const arrancar = () => {
      if (!arrancado) {
        arrancado = true;
        tl.play();
      }
    };
    listo.then(arrancar);
    const tope = setTimeout(arrancar, 1500);
    tl.to(wrapper, { width: natural, duration: OPEN, ease: "power3.inOut" }, "open")
      .to(slides[0], { autoAlpha: 1, scale: 0.55, duration: 0.4, ease: "power2.out" }, "open+=0.25")
      .to({}, { duration: 0.6 });
    for (let i = 1; i < slides.length; i++) {
      tl.set(slides[i - 1], { autoAlpha: 0, scale: 0.9 }, ">")
        .set(slides[i], { autoAlpha: 1, scale: 1 }, "<")
        .to({}, { duration: HOLD });
    }
    const last = slides[slides.length - 1];
    tl.to(last, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: "power2.in" }, "close")
      .to(wrapper, { width: 0, duration: OPEN, ease: "power3.inOut" }, "close+=0.05")
      .to({}, { duration: 0.35 })
      .to(title, { autoAlpha: 0, scale: 0.96, duration: 0.6, ease: "power2.inOut" }, "fade")
      .add(() => arrancarTablero());
    introTl.current = tl;

    const terminar = () => {
      if (faseRef.current !== "intro" || (!tl.isActive() && !tl.paused())) return;
      clearTimeout(tope);
      tl.kill();
      gsap.timeline()
        .to(slides, { autoAlpha: 0, duration: 0.2, overwrite: true }, 0)
        .to(wrapper, { width: 0, duration: 0.45, ease: "power3.inOut" }, 0)
        .to(title, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: "power2.inOut" }, 0.2)
        .add(() => arrancarTablero());
    };
    terminarIntroRef.current = terminar;
    const onGesto = () => terminar();
    window.addEventListener("pointerdown", onGesto);
    window.addEventListener("wheel", onGesto, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onGesto);
      window.removeEventListener("wheel", onGesto);
      clearTimeout(tope);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celdas, introFotos]);

  /* ───────── formulario ───────── */

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!foco) return;
    const fd = new FormData(e.currentTarget);
    const nombre = String(fd.get("nombre") || "").trim();
    const contacto = String(fd.get("contacto") || "").trim();
    const mensaje = String(fd.get("mensaje") || "").trim();
    const texto = `Hola, me interesa ${foco.p.nombre} (${foco.p.marca}). ${mensaje}`.trim();
    if (SITIO.whatsapp) {
      const t = `${texto}\n\n${nombre}${contacto ? ` · ${contacto}` : ""}`;
      window.open(`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
    } else {
      const cuerpo = `${texto}\n\n${nombre}\n${contacto}`;
      window.location.href = `mailto:${SITIO.email}?subject=${encodeURIComponent(
        `Me interesa: ${foco.p.nombre}`
      )}&body=${encodeURIComponent(cuerpo)}`;
    }
  };

  const esGrid = fase === "grid" || (fase === "foco" && faseAntesRef.current === "grid");

  const registrar = useCallback((el: HTMLDivElement | null, i: number, t?: number) => {
    if (!el) return;
    if (t === undefined) gridElsRef.current[i] = el;
    else elsRef.current[t][i] = el;
  }, []);
  const clickGrid = useCallback((i: number, el: HTMLElement) => abrirFoco(i, el), [abrirFoco]);

  return (
    <div ref={rootRef} className="ld">
      <div
        ref={(el) => {
          if (el) cornersRef.current[0] = el;
        }}
        className="ld-corner top-5 left-5 md:top-8 md:left-10"
        style={{ opacity: 0 }}
      >
        <Adapt>piso ikpali</Adapt>
      </div>
      <div
        ref={(el) => {
          if (el) cornersRef.current[1] = el;
        }}
        className="ld-corner top-5 right-5 md:top-8 md:right-10"
        style={{ opacity: 0 }}
      >
        <Adapt>cdmx</Adapt>
      </div>

      {/* zoom + grid (+ filtros en grid) */}
      <div ref={topRef} className={`ld-glass ld-top${esGrid ? " is-grid" : ""}`} style={{ opacity: 0 }}>
        <div className="ld-top__row">
          {!esGrid && (
            <>
              <WakeSlider value={zoomVal} onChange={onZoom} bars={30} label={(v) => `${Math.round(zoomDeValor(v) * 100)}`} />
              <span className="ld-top__sep" aria-hidden />
            </>
          )}
          <button
            type="button"
            className="ld-iconbtn"
            onClick={toggleGrid}
            aria-label={esGrid ? "Ver tablero" : "Ver en cuadrícula"}
            aria-pressed={esGrid}
            title={esGrid ? "tablero" : "cuadrícula"}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path ref={iconoRef} d={ICONO_GRID} />
            </svg>
          </button>
          {esGrid && (
            <>
              <span className="ld-top__sep" aria-hidden />
              <button
                type="button"
                className={`ld-filtro ld-filtro--toggle${filtrosAbiertos ? " is-open" : ""}`}
                onClick={() => setFiltrosAbiertos((v) => !v)}
                aria-expanded={filtrosAbiertos}
              >
                <Adapt>{filtrosAbiertos ? "cerrar" : "filtrar"}</Adapt>
              </button>
            </>
          )}
        </div>
        {esGrid && filtrosAbiertos && (
          <div className="ld-top__row ld-top__row--marcas">
              <div className="ld-filtros" role="group" aria-label="Filtrar por categoría">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`ld-filtro${filtro.categoria === c ? " is-on" : ""}`}
                    onClick={() => filtrar({ ...filtro, categoria: c })}
                  >
                    <Adapt>{c.toLowerCase()}</Adapt>
                  </button>
                ))}
              </div>
          </div>
        )}
        {esGrid && filtrosAbiertos && (
          <div className="ld-top__row ld-top__row--marcas">
            <div className="ld-filtros" role="group" aria-label="Filtrar por marca">
              {MARCAS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`ld-filtro${filtro.marca === m ? " is-on" : ""}`}
                  onClick={() => filtrar({ ...filtro, marca: m })}
                >
                  <Adapt>{m.toLowerCase()}</Adapt>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* tablero infinito */}
      <div ref={wrapRef} className="ld-wrap" onClick={(e) => {
        if (faseRef.current === "foco" && !(e.target as HTMLElement).closest(".ld-item")) cerrarFoco();
      }}>
        <div ref={proxyRef} className="ld-proxy" aria-hidden />
        <div ref={boardRef} className="ld-board">
          {celdas > 0 &&
            TILES.map((_, t) =>
              Array.from({ length: celdas }, (_, k) => (
                <Pieza key={`${t}-${k}`} p={PRODUCTOS[k % PRODUCTOS.length]} i={k % PRODUCTOS.length} k={k} t={t} registrar={registrar} />
              ))
            )}
        </div>
      </div>

      {/* grid con scroll suave */}
      <div
        ref={gridWrapRef}
        className="ld-gridwrap"
        style={{ display: "none" }}
        onClick={(e) => {
          if (faseRef.current === "foco" && !(e.target as HTMLElement).closest(".ld-item")) cerrarFoco();
        }}
      >
        <div ref={gridBoxRef} className="ld-gridbox">
          {PRODUCTOS.map((p, i) => (
            <Pieza key={p.id} p={p} i={i} registrar={registrar} onClick={clickGrid} />
          ))}
        </div>
      </div>

      {/* pieza enfocada */}
      {foco && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={cloneRef} className="ld-focus__clone" src={foco.p.src} alt="" aria-hidden style={{ opacity: 0 }} />
          <div className={`ld-focus${formAbierto ? " is-form" : ""}`}>
            <div ref={boxRef} className="ld-focus__box" aria-hidden />
            <div ref={infoRef} className="ld-focus__info">
              <p className="ld-focus__marca" style={{ opacity: 0 }}>{foco.p.marca}</p>
              <h2 className="ld-focus__nombre" style={{ opacity: 0 }}>{foco.p.nombre}</h2>
              <p className="ld-focus__precio" style={{ opacity: 0 }}>{formatoPrecio(foco.p.precio)}</p>
              <div style={{ opacity: 0 }}>
                {!formAbierto ? (
                  <button type="button" className="ld-focus__cta" onClick={() => setFormAbierto(true)}>
                    me interesa <span className="arrow">→</span>
                  </button>
                ) : (
                  <form className="ld-form" onSubmit={enviar}>
                    <input name="nombre" placeholder="nombre" autoComplete="name" required />
                    <input name="contacto" placeholder="correo o whatsapp" autoComplete="email" required />
                    <textarea name="mensaje" placeholder="¿algo que quieras preguntar?" rows={2} />
                    <div className="ld-form__row">
                      <span className="ld-form__nota">te contestamos nosotros</span>
                      <button type="submit" className="ld-focus__cta" style={{ marginTop: 0 }}>
                        enviar <span className="arrow">→</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <button ref={closeRef} type="button" className="ld-close" onClick={cerrarFoco} aria-label="Cerrar" style={{ opacity: 0 }} />
        </>
      )}

      <a className="ld-side ld-side--izq ad" href={`https://instagram.com/${SITIO.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a className="ld-side ld-side--der ad" href="/" aria-label="Piso ikpali">
        <svg width="16" height="16" viewBox="0 0 123.66 116.93" fill="currentColor" aria-hidden>
          <path d="M110.14,86.06c-1.66,0-3.13-1.07-3.64-2.64l-5.94-18.26s-1.82-5.08-2.76-7.7c-.32-.91-1.19-1.49-2.16-1.43-6.22.36-36.39,1.67-52.47,2.6-1.17.07-2.17-.8-2.28-1.96l-4.29-39.41c-.11-1.11-1.04-1.97-2.16-1.97h-9.34c-1.12,0-2.06.85-2.16,1.97l-6.56,65.33c-.18,1.97-1.83,3.47-3.81,3.47h-7.2c-2.11,0-3.83,1.71-3.83,3.83v2.82c0,2.11,1.71,3.83,3.83,3.83h112.91c2.11,0,3.83-1.71,3.83-3.83v-2.82c0-2.11-1.71-3.83-3.83-3.83h-8.15ZM43.47,74.15c-.12-1.32.96-2.45,2.29-2.37l31.16,1.43c1.45.08,2.41,1.53,1.92,2.9l-2.1,7.2c-.48,1.63-1.97,2.76-3.67,2.76h-25.11c-1.99,0-3.65-1.53-3.81-3.52l-.67-8.39Z" />
          <circle cx="83.11" cy="14.25" r="14.25" />
          <rect y="106.46" width="123.66" height="10.47" rx="3.51" ry="3.51" />
        </svg>
      </a>

      <div ref={hintRef} className="ld-hint" style={{ opacity: 0 }} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M6 1v10M1 6h10M4 2.5 6 1l2 1.5M4 9.5 6 11l2-1.5M2.5 4 1 6l1.5 2M9.5 4 11 6l-1.5 2" />
        </svg>
        arrastra para explorar
      </div>

      <GlassBar visible={fase !== "intro"} />

      {/* intro */}
      <div ref={introRef} className="ld-intro" aria-hidden>
        <link rel="preload" as="image" href="/logo.svg" />
        <h1
          data-title
          className="relative flex items-center justify-center font-sans font-medium select-none whitespace-nowrap leading-none will-change-transform"
          style={{ fontSize: "clamp(40px, 9vw, 120px)", letterSpacing: "-0.02em" }}
        >
          <span className="inline-block">piso</span>
          <span
            data-wrapper
            className="relative inline-flex items-center justify-center overflow-hidden mx-[0.1em] will-change-[width]"
            style={{ width: 0, height: "clamp(100px, 14vw, 210px)" }}
          >
            <span className="inline-block leading-none px-1 md:px-2">(</span>
            <span
              className="relative inline-flex items-center justify-center"
              style={{ width: "clamp(100px, 14vw, 210px)", height: "clamp(100px, 14vw, 210px)", flex: "0 0 auto" }}
            >
              {["/logo.svg", ...introFotos].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  data-slide
                  src={src}
                  alt=""
                  aria-hidden
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 m-auto object-contain will-change-[opacity,transform]"
                  style={{ width: "clamp(100px, 14vw, 210px)", height: "clamp(100px, 14vw, 210px)" }}
                />
              ))}
            </span>
            <span className="inline-block leading-none px-1 md:px-2">)</span>
          </span>
          <span className="inline-block">ikpali</span>
        </h1>
      </div>
    </div>
  );
}
