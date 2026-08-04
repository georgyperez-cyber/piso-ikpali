"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Deck shell — versión para la comunidad de Fayet.
// Reutiliza portada, plantillas y átomos del deck a marcas, sin modelo de
// negocio, sin "por qué entrar", sin seis pasos, sin explicar Fayet.
// ─────────────────────────────────────────────────────────────────────────────

export default function Deck() {
  const [i, setI] = useState(0);
  const TOTAL = SLIDES.length;

  const go = useCallback(
    (n: number) => setI(() => Math.min(SLIDES.length - 1, Math.max(0, n))),
    []
  );
  const next = useCallback(() => setI((c) => Math.min(SLIDES.length - 1, c + 1)), []);
  const prev = useCallback(() => setI((c) => Math.max(0, c - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(SLIDES.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go]);

  const Slide = SLIDES[i];
  // Slides on red bg flip chrome to white text.
  const chromeIsLight = RED_SLIDES.has(i);

  return (
    <div
      className="fixed inset-0 bg-blanco text-rojo overflow-hidden cursor-pointer select-none"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-advance]")) return;
        const x = e.clientX / window.innerWidth;
        if (x < 0.18) prev();
        else next();
      }}
      role="application"
      aria-label="piso ikpali presentación a fayet"
    >
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 pt-5 md:pt-7 pointer-events-none">
        <span
          className={`text-[9px] md:text-[11px] tracking-[0.22em] uppercase ${
            chromeIsLight ? "text-blanco/85" : "text-rojo/70"
          }`}
        >
          piso ikpali · fayet · 2026
        </span>
        <span
          className={`text-[9px] md:text-[11px] tracking-[0.22em] uppercase tabular-nums ${
            chromeIsLight ? "text-blanco/85" : "text-rojo/70"
          }`}
        >
          {String(i + 1).padStart(2, "0")}{" "}
          <span className={chromeIsLight ? "text-blanco/45" : "text-rojo/40"}>/ {TOTAL}</span>
        </span>
      </div>

      <div className="relative h-full w-full">
        <div key={i} className="absolute inset-0 animate-[deckIn_320ms_ease-out]">
          <Slide />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-10 pb-5 md:pb-7 pointer-events-none">
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className="h-[2px] transition-all duration-300"
              style={{
                width: idx === i ? 28 : 10,
                background: chromeIsLight
                  ? idx <= i
                    ? "var(--blanco)"
                    : "rgba(255,255,255,0.3)"
                  : idx <= i
                    ? "var(--rojo)"
                    : "rgba(237,52,36,0.2)",
              }}
            />
          ))}
        </div>
        <span
          className={`text-[9px] md:text-[10px] tracking-[0.22em] uppercase ${
            chromeIsLight ? "text-blanco/70" : "text-rojo/50"
          }`}
        >
          ← →  ·  click
        </span>
      </div>

      <style>{`
        @keyframes deckIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset helpers
// ─────────────────────────────────────────────────────────────────────────────

const A = "/assets-optimized";
const ico = (n: number, size: 400 | 600 = 400) => `${A}/hero-icono-${n}-${size}.webp`;
const icoNegro = (n: number, size: 400 | 600 = 400) => `${A}/hero-icono-negro-${n}-${size}.webp`;

// Icons that have both red and black versions available
const ICONS_BOTH = [1, 2, 3, 4, 5, 6, 8];

// ─────────────────────────────────────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`text-[10px] md:text-[11px] tracking-[0.28em] uppercase ${
        light ? "text-blanco/75" : "text-rojo/60"
      }`}
    >
      {children}
    </span>
  );
}

function SlideShell({
  eyebrow,
  children,
  bg = "blanco",
}: {
  eyebrow?: string;
  children: React.ReactNode;
  bg?: "blanco" | "rojo";
}) {
  const isRed = bg === "rojo";
  return (
    <section
      className={`h-full w-full flex flex-col ${
        isRed ? "bg-rojo text-blanco" : "bg-blanco text-rojo"
      }`}
    >
      <div className="px-6 md:px-16 pt-16 md:pt-20">
        {eyebrow ? <Eyebrow light={isRed}>{eyebrow}</Eyebrow> : null}
      </div>
      <div className="flex-1 min-h-0 px-6 md:px-16 pb-20 md:pb-24">{children}</div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 — Portada: reutilizada tal cual del deck a marcas.
// ─────────────────────────────────────────────────────────────────────────────

function S01Cover() {
  const COLS = 8;
  const ROWS = 5;
  const total = COLS * ROWS;

  const [icons, setIcons] = useState<number[] | null>(null);

  useEffect(() => {
    const arr: number[] = [];
    for (let i = 0; i < total; i++) {
      arr.push(ICONS_BOTH[Math.floor(Math.random() * ICONS_BOTH.length)]);
    }
    setIcons(arr);
  }, [total]);

  const PISO = { row: 1, col: 1, colSpan: 2 };
  const IKPALI = { row: 3, col: 4, colSpan: 3 };

  const absorbed = useMemo(() => {
    const s = new Set<number>();
    [PISO, IKPALI].forEach((span) => {
      for (let c = span.col; c < span.col + span.colSpan; c++) {
        s.add(span.row * COLS + c);
      }
    });
    return s;
  }, []);

  const flipCandidates = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < total; i++) if (!absorbed.has(i)) arr.push(i);
    return arr;
  }, [absorbed, total]);

  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);

  useEffect(() => {
    let onTimeout: ReturnType<typeof setTimeout> | null = null;
    const tick = () => {
      const idx = flipCandidates[Math.floor(Math.random() * flipCandidates.length)];
      setFlippedIdx(idx);
      onTimeout = setTimeout(() => setFlippedIdx(null), 750);
    };
    tick();
    const interval = setInterval(tick, 1500);
    return () => {
      clearInterval(interval);
      if (onTimeout) clearTimeout(onTimeout);
    };
  }, [flipCandidates]);

  const cells: React.ReactNode[] = [];
  if (icons) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        if (absorbed.has(idx)) continue;
        const iconNum = icons[idx];
        const isFlipped = flippedIdx === idx;
        const src = isFlipped ? ico(iconNum, 400) : icoNegro(iconNum, 400);
        cells.push(
          <div
            key={idx}
            style={{ gridRow: r + 1, gridColumn: c + 1 }}
            className="flex items-center justify-center p-3 md:p-5 lg:p-6"
          >
            <img
              src={src}
              alt=""
              aria-hidden
              className="max-w-[78%] max-h-[78%] w-auto h-auto object-contain"
            />
          </div>
        );
      }
    }
  }

  return (
    <section className="h-full w-full bg-blanco overflow-hidden relative">
      <div
        className="h-full w-full grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {/* piso */}
        <div
          style={{
            gridRow: PISO.row + 1,
            gridColumn: `${PISO.col + 1} / span ${PISO.colSpan}`,
          }}
          className="flex items-center justify-center"
        >
          <span
            className="text-rojo font-medium leading-none"
            style={{ fontSize: "clamp(72px, 11vw, 180px)", letterSpacing: "-0.03em" }}
          >
            piso
          </span>
        </div>

        {/* ikpali */}
        <div
          style={{
            gridRow: IKPALI.row + 1,
            gridColumn: `${IKPALI.col + 1} / span ${IKPALI.colSpan}`,
          }}
          className="flex items-center justify-center"
        >
          <span
            className="text-rojo font-medium leading-none"
            style={{ fontSize: "clamp(72px, 11vw, 180px)", letterSpacing: "-0.03em" }}
          >
            ikpali
          </span>
        </div>

        {cells}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 — Qué es. Misma plantilla de intro, reencuadrada hacia la casa.
// ─────────────────────────────────────────────────────────────────────────────

function S02Intro() {
  return (
    <SlideShell eyebrow="01 · piso ikpali">
      <div className="h-full flex flex-col items-center justify-center text-center gap-7 md:gap-10 max-w-[1100px] mx-auto">
        <h2
          className="font-medium leading-[0.96]"
          style={{ fontSize: "clamp(28px, 4.4vw, 64px)", letterSpacing: "-0.02em" }}
        >
          Un concept room de diseño doméstico mexicano contemporáneo.
        </h2>

        <div className="flex flex-col items-center gap-3 py-2">
          <img
            src="/logo.svg"
            alt="ikpali Studio"
            className="h-[16vh] max-h-[150px] min-h-[80px] w-auto"
          />
        </div>

        <p
          className="font-medium leading-[1.04] max-w-[36ch]"
          style={{ fontSize: "clamp(18px, 2.4vw, 36px)", letterSpacing: "-0.014em" }}
        >
          ikpali Studio comenzó nombrando la silla.{" "}
          <span className="text-rojo/55">piso nombra aquello que esa pieza presupone.</span>
        </p>

        <p
          className="font-light text-rojo/80 max-w-[58ch]"
          style={{ fontSize: "clamp(13px, 1.15vw, 18px)" }}
        >
          Una selección curada, dispuesta para habitarse — no para exhibirse. Todo lo que está
          puede comprarse. La selección es la garantía.
        </p>

        <span className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-rojo/55 pt-2">
          la nueva expresión de objeto que se suma a la casa
        </span>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Nuestro equipo — reutilizada tal cual.
// ─────────────────────────────────────────────────────────────────────────────

function S03Equipo() {
  return (
    <section className="h-full w-full bg-blanco text-rojo flex flex-col">
      <div className="px-6 md:px-16 pt-16 md:pt-20">
        <Eyebrow>02 · nuestro equipo</Eyebrow>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-0">
        <div className="col-span-12 md:col-span-6 px-6 md:px-16 pb-20 md:pb-24 flex flex-col justify-center">
          <h2
            className="font-medium leading-[0.88]"
            style={{ fontSize: "clamp(48px, 7.5vw, 130px)", letterSpacing: "-0.028em" }}
          >
            nuestro
            <br />
            equipo.
          </h2>
        </div>

        <div className="hidden md:block col-span-6 relative">
          <img
            src="/assets-optimized/equipo-1600.webp"
            alt="ikpali Studio — nuestro equipo"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(1) contrast(1.03)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 — Los vecinos — misma plantilla, reencuadrada como pertenencia.
// ─────────────────────────────────────────────────────────────────────────────

function S04Vecinos() {
  const items = [
    { name: "goya taller", note: "cocina · panadería · comedor" },
    { name: "com com com", note: "sound bar" },
    { name: "punto ácido", note: "showroom editorial" },
    { name: "román de castro", note: "estudio creativo" },
    { name: "barra de café", note: "conector entre tiempos" },
    { name: "piso ikpali", note: "concept room — objeto", highlight: true },
  ];

  return (
    <SlideShell eyebrow="03 · un vecino más en la reunión">
      <div className="h-full flex flex-col items-center justify-center gap-3 md:gap-5 text-center">
        {items.map((v) => (
          <div key={v.name} className="flex flex-col items-center gap-1.5">
            {v.highlight ? (
              <span
                className="bg-rojo text-blanco font-medium leading-[0.95] inline-block px-6 md:px-8 py-1 md:py-2"
                style={{
                  fontSize: "clamp(28px, 5.5vw, 84px)",
                  letterSpacing: "-0.025em",
                }}
              >
                {v.name}
              </span>
            ) : (
              <span
                className="text-rojo font-medium leading-[0.95]"
                style={{
                  fontSize: "clamp(28px, 5.5vw, 84px)",
                  letterSpacing: "-0.025em",
                }}
              >
                {v.name}
              </span>
            )}
            <span className="text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-rojo/50">
              {v.note}
            </span>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Las marcas — NUEVA lámina, tipografía grande, las 12 marcas (slide rojo).
// ─────────────────────────────────────────────────────────────────────────────

const MARCAS = [
  "Aventurina",
  "Estela Williams",
  "Estebanez Studio",
  "en_ro",
  "Pulpo y chango",
  "Rio Estudio",
  "Burro",
  "kmy",
  "MOT studio",
  "Paralelo Mexicano",
  "Malfarero",
  "La Casa Ocho",
];

function S05Marcas() {
  return (
    <section className="h-full w-full bg-rojo text-blanco flex flex-col">
      <div className="px-6 md:px-16 pt-16 md:pt-20 flex items-baseline justify-between gap-4">
        <Eyebrow light>04 · la selección</Eyebrow>
        <span className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-blanco/60 tabular-nums">
          12 marcas
        </span>
      </div>
      <div className="flex-1 min-h-0 px-6 md:px-16 pb-20 md:pb-24 flex items-center">
        <div className="flex flex-wrap items-baseline gap-x-6 md:gap-x-10 gap-y-1 md:gap-y-2 w-full">
          {MARCAS.map((m, idx) => (
            <span key={m} className="inline-flex items-baseline">
              <span
                className="font-medium leading-[0.92] text-blanco"
                style={{ fontSize: "clamp(30px, 5.4vw, 96px)", letterSpacing: "-0.03em" }}
              >
                {m}
              </span>
              {idx < MARCAS.length - 1 ? (
                <span
                  aria-hidden
                  className="text-blanco/40 font-light px-2 md:px-3"
                  style={{ fontSize: "clamp(24px, 4vw, 72px)" }}
                >
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 06 — Lo que le sumamos a la reunión — versión comunidad, no venta.
//      (Se puede quitar sin romper el flujo.)
// ─────────────────────────────────────────────────────────────────────────────

function S06Suma() {
  const items = [
    {
      t: "público que compra por valor",
      v: "el cliente de piso no llega por descuento; llega porque confía en la selección. público que también camina la casa.",
    },
    {
      t: "contenido que circula",
      v: "cada pieza se fotografía y se documenta. material editorial que suma a la conversación del espacio.",
    },
    {
      t: "un motivo más para volver",
      v: "no es un pop-up ni un evento. es un lugar que se queda — y que da razón de regresar.",
    },
    {
      t: "clientes compartidos",
      v: "el que viene por goya o por el café, se encuentra el objeto. el que viene por el objeto, se queda a la mesa.",
    },
  ];

  return (
    <SlideShell eyebrow="05 · lo que compartimos">
      <div className="h-full flex flex-col justify-center gap-10 md:gap-14 max-w-[1200px] mx-auto">
        <h2
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5.4vw, 84px)", letterSpacing: "-0.025em" }}
        >
          lo que le sumamos a la reunión.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-8 md:gap-y-10">
          {items.map((c) => (
            <div
              key={c.t}
              className="flex flex-col gap-2 md:gap-3 border-t border-rojo/20 pt-4 md:pt-5"
            >
              <span
                className="font-medium leading-tight"
                style={{ fontSize: "clamp(18px, 1.9vw, 28px)", letterSpacing: "-0.014em" }}
              >
                {c.t}
              </span>
              <span
                className="text-rojo/80 font-light"
                style={{ fontSize: "clamp(13px, 1.05vw, 16px)" }}
              >
                {c.v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 07 — Cierre — misma plantilla, reencuadrado a colaboración.
// ─────────────────────────────────────────────────────────────────────────────

function S07Cierre() {
  const STRIP_ICONS = [6, 4, 3, 8, 1, 5, 2];

  return (
    <section className="h-full w-full bg-rojo text-blanco flex flex-col">
      <div className="px-6 md:px-16 pt-16 md:pt-20">
        <Eyebrow light>06 · la siguiente conversación</Eyebrow>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 px-6 md:px-16">
        <div className="flex items-center justify-between gap-4 md:gap-8 w-full max-w-[1280px]">
          {STRIP_ICONS.map((n) => (
            <img
              key={n}
              src={icoNegro(n, 600)}
              alt=""
              aria-hidden
              className="h-16 md:h-24 lg:h-32 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          ))}
        </div>

        <div className="flex items-end justify-between w-full max-w-[1280px] pt-2 md:pt-4">
          <span className="text-[11px] md:text-[13px] tracking-[0.28em] uppercase text-blanco/85">
            colaboremos →
          </span>
          <a
            href="mailto:hola@pisoikpali.com"
            data-no-advance
            onClick={(e) => e.stopPropagation()}
            className="text-blanco font-medium underline-offset-4 hover:underline"
            style={{ fontSize: "clamp(18px, 2vw, 32px)", letterSpacing: "-0.015em" }}
          >
            hola@pisoikpali.com
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide list — index matters for chrome color flip
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES: Array<() => React.JSX.Element> = [
  S01Cover, // 0
  S02Intro, // 1
  S03Equipo, // 2
  S04Vecinos, // 3
  S05Marcas, // 4 ← red
  S06Suma, // 5
  S07Cierre, // 6 ← red
];

const RED_SLIDES = new Set([4, 6]);
