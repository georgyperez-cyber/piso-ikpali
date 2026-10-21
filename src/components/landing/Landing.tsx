"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { PRODUCTOS, SITIO, formatoPrecio, type Producto } from "./productos";
import WakeSlider from "./WakeSlider";
import GlassBar from "./GlassBar";
import "./landing.css";

gsap.registerPlugin(Draggable, InertiaPlugin, Flip);

/* ───────────────────────── tablero: geometría ───────────────────────── */

const ZOOM_MIN = 0.55;
const ZOOM_MAX = 1.6;
const zoomDeValor = (v: number) => ZOOM_MIN + v * (ZOOM_MAX - ZOOM_MIN);
const valorDeZoom = (z: number) => (z - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN);

type Layout = {
  cell: number;
  cols: number;
  W: number;
  H: number;
  pos: { x: number; y: number; w: number }[];
};

// ruido determinista en [-1, 1): la misma pieza siempre cae en el mismo lugar
const ruido = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

function calcularTablero(items: Producto[], vw: number, vh: number): Layout {
  const n = items.length;
  const movil = vw < 768;
  const cell = movil ? Math.round(vw * 0.36) : Math.round(gsap.utils.clamp(170, 250, vw * 0.15));
  const gap = Math.round(cell * 0.42);
  const step = cell + gap;

  // columnas: la proporción del bloque se acerca a la del viewport
  let cols = 1;
  let mejor = Infinity;
  for (let c = 1; c <= n; c++) {
    const r = Math.ceil(n / c);
    const d = Math.abs((c * step) / (r * step) - vw / vh);
    if (d < mejor) {
      mejor = d;
      cols = c;
    }
  }
  const rows = Math.ceil(n / cols);
  const padX = vw * 0.5;
  const padY = vh * 0.5;

  const pos = items.map((p, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = padX + c * step + step / 2 + ruido(i, 1) * step * 0.08;
    const y = padY + r * step + step / 2 + (c % 2 ? step * 0.5 : 0) + ruido(i, 2) * step * 0.08;
    return { x, y, w: Math.round(cell * p.tam) };
  });

  return {
    cell,
    cols,
    W: padX * 2 + cols * step,
    H: padY * 2 + rows * step + step / 2,
    pos,
  };
}

/* ───────────────────────── intro: la secuencia del pitch ───────────────────────── */

const INTRO_FOTOS = [23, 15, 35, 26, 40, 7, 14, 36, 8, 13, 10, 24].map(
  (n) => `/assets-optimized/hero-icono-foto-${n}-720.webp`
);

type Fase = "intro" | "tablero" | "foco" | "grid";

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
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
  const zoomRef = useRef(1);
  const faseRef = useRef<Fase>("intro");
  const reveladoRef = useRef<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const origenRef = useRef<DOMRect | null>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const wheelRaf = useRef(0);
  const wheelDelta = useRef({ x: 0, y: 0 });
  const hintVisto = useRef(false);

  // refs a las últimas versiones de los callbacks para los listeners globales
  const cerrarFocoRef = useRef<() => void>(() => {});
  const terminarIntroRef = useRef<() => void>(() => {});

  const [fase, setFaseState] = useState<Fase>("intro");
  const [zoomVal, setZoomVal] = useState(valorDeZoom(1));
  const [foco, setFoco] = useState<{ p: Producto; i: number } | null>(null);
  const [formAbierto, setFormAbierto] = useState(false);

  const setFase = (f: Fase) => {
    faseRef.current = f;
    setFaseState(f);
  };

  /* ───────── límites y posición del tablero ───────── */

  const limites = useCallback((z: number) => {
    const L = layoutRef.current!;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = L.W * z;
    const bh = L.H * z;
    const minX = bw > vw ? vw - bw : (vw - bw) / 2;
    const maxX = bw > vw ? 0 : (vw - bw) / 2;
    const minY = bh > vh ? vh - bh : (vh - bh) / 2;
    const maxY = bh > vh ? 0 : (vh - bh) / 2;
    return { minX, maxX, minY, maxY };
  }, []);

  const colocarItems = useCallback(() => {
    const L = layoutRef.current!;
    itemsRef.current.forEach((el, i) => {
      const p = L.pos[i];
      gsap.set(el, { left: p.x - p.w / 2, top: p.y - p.w / 2, width: p.w, height: p.w });
    });
  }, []);

  const centrar = useCallback(() => {
    const L = layoutRef.current!;
    const z = zoomRef.current;
    gsap.set(boardRef.current, {
      x: (window.innerWidth - L.W * z) / 2,
      y: (window.innerHeight - L.H * z) / 2,
      scale: z,
    });
    dragRef.current?.applyBounds(limites(z));
  }, [limites]);

  /* ───────── zoom alrededor del centro de la pantalla ───────── */

  const aplicarZoom = useCallback(
    (v: number, animar = true) => {
      if (faseRef.current !== "tablero") return;
      const z1 = zoomDeValor(gsap.utils.clamp(0, 1, v));
      const z0 = zoomRef.current;
      if (Math.abs(z1 - z0) < 0.0005) return;
      const b = boardRef.current!;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const x0 = gsap.getProperty(b, "x") as number;
      const y0 = gsap.getProperty(b, "y") as number;
      const lim = limites(z1);
      const x1 = gsap.utils.clamp(lim.minX, lim.maxX, cx - ((cx - x0) / z0) * z1);
      const y1 = gsap.utils.clamp(lim.minY, lim.maxY, cy - ((cy - y0) / z0) * z1);
      zoomRef.current = z1;
      dragRef.current?.applyBounds(lim);
      gsap.to(b, {
        x: x1,
        y: y1,
        scale: z1,
        duration: animar ? 0.45 : 0,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => dragRef.current?.update(),
      });
    },
    [limites]
  );

  const onZoom = useCallback(
    (v: number) => {
      setZoomVal(v);
      aplicarZoom(v);
    },
    [aplicarZoom]
  );

  /* ───────── revelado: las piezas aparecen al entrar a la pantalla ───────── */

  const marcarMovimiento = useCallback((on: boolean) => {
    wrapRef.current?.classList.toggle("is-moving", on);
  }, []);

  const esconderHint = useCallback(() => {
    if (hintVisto.current) return;
    hintVisto.current = true;
    gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.5, delay: 0.3 });
  }, []);

  const revelar = useCallback((i: number, delay = 0) => {
    if (reveladoRef.current.has(i)) return;
    reveladoRef.current.add(i);
    gsap.to(itemsRef.current[i], {
      scale: 1,
      duration: 0.7,
      delay,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });
  }, []);

  const iniciarRevelado = useCallback(() => {
    // Primera tanda: del centro hacia afuera, con un ritmo que se sienta.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    const visibles: { i: number; d: number }[] = [];
    itemsRef.current.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      if (ex > -r.width && ex < vw + r.width && ey > -r.height && ey < vh + r.height) {
        visibles.push({ i, d: Math.hypot(ex - cx, ey - cy) });
      }
    });
    const maxD = Math.max(1, ...visibles.map((v) => v.d));
    visibles.forEach((v) => revelar(v.i, (v.d / maxD) * 0.9));

    // Después, lo que vaya entrando al arrastrar.
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          revelar(i, 0.05);
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "12%" }
    );
    itemsRef.current.forEach((el, i) => {
      if (!reveladoRef.current.has(i)) obs.observe(el);
    });
    observerRef.current = obs;
  }, [revelar]);

  /* ───────── pieza enfocada ───────── */

  const abrirFoco = useCallback((i: number) => {
    if (faseRef.current !== "tablero") return;
    const el = itemsRef.current[i];
    const img = el.querySelector("img")!;
    origenRef.current = img.getBoundingClientRect();
    setFase("foco");
    dragRef.current?.disable();
    wrapRef.current?.classList.add("is-focus");
    setFormAbierto(false);
    setFoco({ p: PRODUCTOS[i], i });
  }, []);

  const ordenDesde = useCallback((i: number) => {
    // orden de las demás piezas por distancia a la pieza i (en pantalla)
    const r0 = itemsRef.current[i].getBoundingClientRect();
    const cx = r0.left + r0.width / 2;
    const cy = r0.top + r0.height / 2;
    const otros = itemsRef.current
      .map((el, j) => {
        const r = el.getBoundingClientRect();
        return { el, j, d: Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy) };
      })
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d);
    return otros;
  }, []);

  useLayoutEffect(() => {
    if (!foco) return;
    const { i } = foco;
    const clone = cloneRef.current!;
    const box = boxRef.current!.getBoundingClientRect();
    const r = origenRef.current!;
    const original = itemsRef.current[i];
    const otros = ordenDesde(i);

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

  const cerrarFoco = useCallback(() => {
    if (faseRef.current !== "foco" || !foco) return;
    const { i } = foco;
    const clone = cloneRef.current!;
    const r = origenRef.current!;
    const original = itemsRef.current[i];
    const otros = ordenDesde(i);
    otros.forEach((o) => reveladoRef.current.add(o.j));

    const tl = gsap.timeline({
      onComplete: () => {
        setFoco(null);
        setFase("tablero");
        wrapRef.current?.classList.remove("is-focus");
        dragRef.current?.enable();
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

  /* ───────── modo grid ───────── */

  const toggleGrid = useCallback(() => {
    const wrap = wrapRef.current!;
    const board = boardRef.current!;
    const items = itemsRef.current;
    const L = layoutRef.current!;
    const flipVars = {
      duration: 0.95,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      stagger: { amount: 0.22, from: "start" as const },
    };

    if (faseRef.current === "tablero") {
      setFase("grid");
      dragRef.current?.disable();
      observerRef.current?.disconnect();
      items.forEach((_, i) => reveladoRef.current.add(i));
      const state = Flip.getState(items);
      const vw = window.innerWidth;
      board.style.setProperty("--grid-cols", String(vw < 768 ? 3 : vw < 1200 ? 5 : 7));
      wrap.classList.add("is-grid");
      wrap.scrollTop = 0;
      gsap.set(board, { clearProps: "transform,width,height" });
      items.forEach((el) => gsap.set(el, { clearProps: "left,top,width,height" }));
      gsap.set(items, { scale: 1 });
      gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3 });
      Flip.from(state, flipVars);
    } else if (faseRef.current === "grid") {
      const state = Flip.getState(items);
      wrap.classList.remove("is-grid");
      wrap.scrollTop = 0;
      colocarItems();
      // el tablero regresa centrado en el zoom actual
      const z = zoomRef.current;
      gsap.set(board, {
        width: L.W,
        height: L.H,
        x: (window.innerWidth - L.W * z) / 2,
        y: (window.innerHeight - L.H * z) / 2,
        scale: z,
      });
      Flip.from(state, {
        ...flipVars,
        onComplete: () => {
          setFase("tablero");
          dragRef.current?.applyBounds(limites(z));
          dragRef.current?.update();
          dragRef.current?.enable();
        },
      });
    }
  }, [colocarItems, limites]);

  /* ───────── montaje: layout, drag, wheel, resize ───────── */

  useEffect(() => {
    const root = rootRef.current!;
    const wrap = wrapRef.current!;
    const board = boardRef.current!;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    layoutRef.current = calcularTablero(PRODUCTOS, window.innerWidth, window.innerHeight);
    gsap.set(board, { width: layoutRef.current.W, height: layoutRef.current.H });
    colocarItems();
    gsap.set(itemsRef.current, { scale: 0 });
    centrar();

    const drag = Draggable.create(board, {
      type: "x,y",
      inertia: true,
      bounds: limites(zoomRef.current),
      edgeResistance: 0.85,
      throwResistance: 2500,
      minimumMovement: 3,
      dragClickables: true,
      zIndexBoost: false,
      onPress: () => wrap.classList.add("is-dragging"),
      onDragStart: () => {
        marcarMovimiento(true);
        esconderHint();
      },
      onRelease: () => wrap.classList.remove("is-dragging"),
      onDragEnd: () => {
        if (!dragRef.current?.isThrowing) marcarMovimiento(false);
      },
      onThrowComplete: () => marcarMovimiento(false),
      onClick: (e: PointerEvent) => {
        const hit = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
        if (hit && faseRef.current === "tablero") abrirFoco(Number(hit.dataset.i));
      },
    })[0];
    drag.disable();
    dragRef.current = drag;

    // rueda y trackpad: desplaza el tablero; con ctrl (pinch) hace zoom
    const onWheel = (e: WheelEvent) => {
      if (faseRef.current === "grid") return;
      if (faseRef.current !== "tablero") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (e.ctrlKey) {
        const v = gsap.utils.clamp(0, 1, valorDeZoom(zoomRef.current) - e.deltaY * 0.004);
        setZoomVal(v);
        aplicarZoom(v, false);
        return;
      }
      wheelDelta.current.x += e.deltaX;
      wheelDelta.current.y += e.deltaY;
      esconderHint();
      marcarMovimiento(true);
      cancelAnimationFrame(wheelRaf.current);
      wheelRaf.current = requestAnimationFrame(() => {
        const lim = limites(zoomRef.current);
        const x = gsap.utils.clamp(lim.minX, lim.maxX, drag.x - wheelDelta.current.x);
        const y = gsap.utils.clamp(lim.minY, lim.maxY, drag.y - wheelDelta.current.y);
        wheelDelta.current = { x: 0, y: 0 };
        gsap.to(board, {
          x,
          y,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: () => drag.update(),
          onComplete: () => marcarMovimiento(false),
        });
      });
    };
    root.addEventListener("wheel", onWheel, { passive: false });

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
        layoutRef.current = calcularTablero(PRODUCTOS, window.innerWidth, window.innerHeight);
        gsap.set(board, { width: layoutRef.current.W, height: layoutRef.current.H });
        if (faseRef.current !== "grid") {
          colocarItems();
          centrar();
        } else {
          const vw = window.innerWidth;
          board.style.setProperty("--grid-cols", String(vw < 768 ? 3 : vw < 1200 ? 5 : 7));
        }
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      html.style.overflow = prevOverflow;
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      observerRef.current?.disconnect();
      drag.kill();
      introTl.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  cerrarFocoRef.current = cerrarFoco;

  /* ───────── intro ───────── */

  useEffect(() => {
    const intro = introRef.current!;
    const wrapper = intro.querySelector<HTMLElement>("[data-wrapper]")!;
    const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", intro);
    const title = intro.querySelector<HTMLElement>("[data-title]")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const yaVisto = (() => {
      try {
        return sessionStorage.getItem("pi-landing-intro") === "1";
      } catch {
        return false;
      }
    })();

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

    const HOLD = 0.34;
    const OPEN = 0.6;
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.35 });
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
      .add(() => {
        try {
          sessionStorage.setItem("pi-landing-intro", "1");
        } catch {}
        arrancarTablero();
      });
    introTl.current = tl;

    // cualquier gesto salta al final
    const terminar = () => {
      if (faseRef.current !== "intro" || !tl.isActive()) return;
      tl.kill();
      gsap.timeline()
        .to(slides, { autoAlpha: 0, duration: 0.2, overwrite: true }, 0)
        .to(wrapper, { width: 0, duration: 0.45, ease: "power3.inOut" }, 0)
        .to(title, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: "power2.inOut" }, 0.2)
        .add(() => {
          try {
            sessionStorage.setItem("pi-landing-intro", "1");
          } catch {}
          arrancarTablero();
        });
    };
    terminarIntroRef.current = terminar;
    const onGesto = () => terminar();
    window.addEventListener("pointerdown", onGesto);
    window.addEventListener("wheel", onGesto, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onGesto);
      window.removeEventListener("wheel", onGesto);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const esGrid = fase === "grid";

  return (
    <div ref={rootRef} className="ld">
      {/* esquinas, como en el pitch */}
      <div
        ref={(el) => {
          if (el) cornersRef.current[0] = el;
        }}
        className="ld-corner top-5 left-5 md:top-8 md:left-10"
        style={{ opacity: 0 }}
      >
        piso ikpali · est. 2026 · cdmx
      </div>
      <div
        ref={(el) => {
          if (el) cornersRef.current[1] = el;
        }}
        className="ld-corner top-5 right-5 md:top-8 md:right-10"
        style={{ opacity: 0 }}
      >
        dentro de fayet
      </div>

      {/* zoom + grid */}
      <div ref={topRef} className="ld-glass ld-top" style={{ opacity: 0 }}>
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
          {esGrid ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="3" cy="4" r="1.6" />
              <circle cx="10.5" cy="2.8" r="1.6" />
              <circle cx="7" cy="8.2" r="1.6" />
              <circle cx="2.6" cy="11.4" r="1.6" />
              <circle cx="11.2" cy="10.6" r="1.6" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="1" y="1" width="4.5" height="4.5" rx="0.8" />
              <rect x="8.5" y="1" width="4.5" height="4.5" rx="0.8" />
              <rect x="1" y="8.5" width="4.5" height="4.5" rx="0.8" />
              <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="0.8" />
            </svg>
          )}
        </button>
      </div>

      {/* tablero */}
      <div
        ref={wrapRef}
        className="ld-wrap"
        onClick={(e) => {
          if (faseRef.current === "foco" && !(e.target as HTMLElement).closest(".ld-item")) cerrarFoco();
        }}
      >
        <div ref={boardRef} className="ld-board">
          {PRODUCTOS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className="ld-item"
              data-i={i}
            >
              <div className="ld-item__hit" role="button" tabIndex={-1} aria-label={p.nombre}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ld-item__img" src={p.src} alt={p.nombre} draggable={false} loading="lazy" decoding="async" />
                <span className="ld-item__label" style={{ top: `${(p.fondo ?? 1) * 100}%` }}>
                  {p.nombre}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* pieza enfocada */}
      {foco && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={cloneRef} className="ld-focus__clone" src={foco.p.src} alt="" aria-hidden style={{ opacity: 0 }} />
          <div className="ld-focus">
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
                      <span className="ld-form__nota">
                        te contestamos nosotros · <a href="/landing/privacidad">privacidad</a>
                      </span>
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

      <div ref={hintRef} className="ld-hint" style={{ opacity: 0 }} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M6 1v10M1 6h10M4 2.5 6 1l2 1.5M4 9.5 6 11l2-1.5M2.5 4 1 6l1.5 2M9.5 4 11 6l-1.5 2" />
        </svg>
        arrastra para explorar
      </div>

      <GlassBar visible={fase !== "intro"} />

      {/* intro: la misma secuencia del pitch, una sola vez */}
      <div ref={introRef} className="ld-intro" aria-hidden>
        <link rel="preload" as="image" href="/logo.svg" />
        <link rel="preload" as="image" href={INTRO_FOTOS[0]} />
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
              {["/logo.svg", ...INTRO_FOTOS].map((src, i) => (
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
