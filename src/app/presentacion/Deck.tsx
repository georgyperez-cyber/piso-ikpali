"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Deck shell — keyboard + click navigation
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
      aria-label="piso ikpali presentación"
    >
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 pt-5 md:pt-7 pointer-events-none">
        <span
          className={`text-[9px] md:text-[11px] tracking-[0.22em] uppercase ${
            chromeIsLight ? "text-blanco/85" : "text-rojo/70"
          }`}
        >
          piso ikpali · presentación · 2026
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
// 01 — Cover: icon grid full-bleed with "piso" / "ikpali" gaps + random flip
// ─────────────────────────────────────────────────────────────────────────────

function S01Cover() {
  const COLS = 8;
  const ROWS = 5;
  const total = COLS * ROWS;

  // Wait until after mount to randomize, so SSR HTML matches first client render
  const [icons, setIcons] = useState<number[] | null>(null);

  useEffect(() => {
    const arr: number[] = [];
    for (let i = 0; i < total; i++) {
      arr.push(ICONS_BOTH[Math.floor(Math.random() * ICONS_BOTH.length)]);
    }
    setIcons(arr);
  }, [total]);

  // Where the word "piso" sits in the grid (row index, col index, span)
  const PISO = { row: 1, col: 1, colSpan: 2 };
  // Where "ikpali" sits — different row, on the right side
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

  // Cells available to flip
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
// 02 — Intro: pure typography. Small logo in the middle, text around it.
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
          segunda expresión de ikpali studio · asamblea cdmx · 2026
        </span>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Nuestro equipo — B&W team photo, big title
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
// 04 — Asamblea + Visión, split layout
// ─────────────────────────────────────────────────────────────────────────────

function S04Asamblea() {
  return (
    <section className="h-full w-full bg-blanco text-rojo flex flex-col">
      <div className="px-6 md:px-12 pt-16 md:pt-20">
        <Eyebrow>03 · el contexto</Eyebrow>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-0">
        {/* LEFT half — asamblea info + visión */}
        <div className="col-span-12 md:col-span-6 px-6 md:px-12 pb-20 md:pb-24 flex flex-col justify-center gap-6 md:gap-8">
          <h2
            className="font-medium leading-[0.9]"
            style={{ fontSize: "clamp(44px, 7vw, 120px)", letterSpacing: "-0.028em" }}
          >
            asamblea,
            <br />
            cdmx.
          </h2>

          <p
            className="font-light max-w-[52ch]"
            style={{ fontSize: "clamp(13px, 1.1vw, 17px)" }}
          >
            Un espacio multidisciplinario en la Ciudad de México. Gastronomía, diseño, música y
            arte conviven bajo un mismo techo — un organismo vivo, no un programa cerrado.
          </p>

          <p
            className="font-medium text-rojo"
            style={{ fontSize: "clamp(16px, 1.7vw, 26px)", letterSpacing: "-0.012em" }}
          >
            asamblea funciona como reunión.
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-5 pt-2 max-w-[640px]">
            {[
              { k: "liderazgo", v: "goya taller" },
              { k: "curaduría", v: "filo art services" },
              { k: "asesoría", v: "ikpali studio" },
            ].map((r) => (
              <div key={r.k} className="flex flex-col gap-1.5 border-l border-rojo/30 pl-3">
                <span className="text-[10px] tracking-[0.24em] uppercase text-rojo/55">
                  {r.k}
                </span>
                <span
                  className="font-medium leading-tight"
                  style={{ fontSize: "clamp(12px, 0.95vw, 15px)" }}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-5 pt-4 border-t border-rojo/20 max-w-[640px]">
            {[
              { k: "gastronomía", v: "la mesa como reunión" },
              { k: "cultura", v: "exhibiciones e intervenciones" },
              { k: "entretenimiento", v: "música y vida nocturna" },
            ].map((r) => (
              <div key={r.k} className="flex flex-col gap-1 pt-3">
                <span className="text-[10px] tracking-[0.24em] uppercase text-rojo/55">
                  {r.k}
                </span>
                <span
                  className="font-light text-rojo/85 leading-snug"
                  style={{ fontSize: "clamp(11px, 0.9vw, 13px)" }}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT half — gif clean on white */}
        <div className="hidden md:flex col-span-6 items-center justify-center">
          <img
            src="/sketch-turntable.gif"
            alt="boceto del espacio en rotación"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Los vecinos — centered list, big
// ─────────────────────────────────────────────────────────────────────────────

function S05Vecinos() {
  const items = [
    { name: "goya taller", note: "cocina · panadería · comedor" },
    { name: "com com com", note: "sound bar" },
    { name: "punto ácido", note: "showroom editorial" },
    { name: "román de castro", note: "estudio creativo" },
    { name: "barra de café", note: "conector entre tiempos" },
    { name: "piso ikpali", note: "concept room — objeto", highlight: true },
  ];

  return (
    <SlideShell eyebrow="04 · los vecinos">
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
// 06 — Por qué piso ikpali — RED slide
// ─────────────────────────────────────────────────────────────────────────────

function S06PorQue() {
  const items = [
    {
      n: "01",
      t: "legitimidad editorial",
      v: "el espacio carga peso curatorial — las marcas que entran heredan ese contexto.",
    },
    {
      n: "02",
      t: "cliente que compra por valor",
      v: "no llega por descuento; llega porque confía en la selección.",
    },
    {
      n: "03",
      t: "contenido editorial",
      v: "fotografía y ficha curatorial reutilizables por la marca.",
    },
    {
      n: "04",
      t: "visibilidad sin gestión",
      v: "asamblea trae la audiencia. la marca aparece en la agenda cultural.",
    },
    {
      n: "05",
      t: "comunidad entre marcas",
      v: "diálogo con los vecinos curados. clientes compartidos.",
    },
    {
      n: "06",
      t: "continuidad curatorial",
      v: "no es un evento ni una feria. es un lugar al que se vuelve.",
    },
  ];

  return (
    <SlideShell eyebrow="05 · por qué" bg="rojo">
      <div className="h-full flex flex-col justify-center gap-10 md:gap-14 max-w-[1200px] mx-auto">
        <h2
          className="font-medium leading-[0.92] text-blanco text-center"
          style={{ fontSize: "clamp(36px, 6vw, 92px)", letterSpacing: "-0.025em" }}
        >
          por qué estar en piso ikpali.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-8 md:gap-y-10">
          {items.map((c) => (
            <div key={c.n} className="flex flex-col gap-2 md:gap-3">
              <span
                className="text-blanco font-medium leading-tight"
                style={{ fontSize: "clamp(18px, 1.8vw, 26px)", letterSpacing: "-0.014em" }}
              >
                {c.t}
              </span>
              <span
                className="text-blanco/85 font-light"
                style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
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
// 07 — Modelo (pie chart 65/35)
// ─────────────────────────────────────────────────────────────────────────────

function S07Modelo() {
  const r = 40;
  const C = 2 * Math.PI * r;
  const filled = C * 0.65;

  const terms = [
    { k: "modelo", v: "consignación" },
    { k: "liquidación", v: "mensual" },
    { k: "precio", v: "lo fija la marca" },
    { k: "devolución", v: "sin penalización siempre y cuando se cumpla con el tiempo del acuerdo" },
    { k: "inventario", v: "asegurado" },
    { k: "contenido", v: "compartido" },
  ];

  return (
    <SlideShell eyebrow="06 · cómo trabajamos juntos">
      <div className="h-full grid grid-cols-12 gap-8 md:gap-14 items-center">
        <div className="col-span-12 md:col-span-6 flex items-center justify-center">
          <div className="relative w-full max-w-[460px] aspect-square">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="var(--rojo)"
                strokeOpacity="0.14"
                strokeWidth="11"
              />
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="var(--rojo)"
                strokeWidth="11"
                strokeDasharray={`${filled} ${C}`}
                strokeLinecap="butt"
              />
            </svg>
            {/* Center: 65 big, "marca" eyebrow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-rojo/60 mb-1">
                marca
              </span>
              <span
                className="font-medium leading-none text-rojo tabular-nums"
                style={{ fontSize: "clamp(96px, 13vw, 200px)", letterSpacing: "-0.04em" }}
              >
                65
              </span>
              <span className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-rojo/60 mt-2">
                % de cada venta
              </span>
            </div>
            {/* 35% label outside, top-right where the 35 arc sits */}
            <div className="absolute -top-2 right-0 text-right">
              <span className="text-[9px] md:text-[10px] tracking-[0.26em] uppercase text-rojo/55 block">
                piso ikpali
              </span>
              <span
                className="font-medium text-rojo tabular-nums leading-none"
                style={{ fontSize: "clamp(28px, 3vw, 48px)", letterSpacing: "-0.02em" }}
              >
                35
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 flex flex-col gap-6 md:gap-7">
          <h2
            className="font-medium leading-[0.95]"
            style={{ fontSize: "clamp(26px, 4vw, 56px)", letterSpacing: "-0.02em" }}
          >
            La marca conserva la propiedad. piso ikpali sostiene la operación.
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
            {terms.map((t) => (
              <div
                key={t.k}
                className="flex flex-col gap-1 border-t border-rojo/25 pt-3"
              >
                <span className="text-[10px] tracking-[0.26em] uppercase text-rojo/55">
                  {t.k}
                </span>
                <span
                  className="font-medium"
                  style={{ fontSize: "clamp(13px, 1.05vw, 16px)", letterSpacing: "-0.005em" }}
                >
                  {t.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 08 — Seis pasos (timeline, no diamonds)
// ─────────────────────────────────────────────────────────────────────────────

function S08Pasos() {
  const steps = [
    { n: "01", t: "conversación", sub: "primera reunión", dur: "60 min", ic: 1 },
    { n: "02", t: "acuerdo", sub: "términos por escrito", dur: "1 semana", ic: 8 },
    { n: "03", t: "entrega", sub: "recibimos las piezas", dur: "1 día", ic: 4 },
    { n: "04", t: "editorial", sub: "fotografía + ficha", dur: "2 semanas", ic: 3 },
    { n: "05", t: "lanzamiento", sub: "al piso", dur: "1 día", ic: 6 },
    { n: "06", t: "revisión", sub: "ajuste curatorial", dur: "a 3 meses", ic: 5 },
  ];

  return (
    <SlideShell eyebrow="07 · cómo entrar">
      <div className="h-full grid grid-rows-[auto_1fr_auto] gap-8 md:gap-10">
        <h2
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(36px, 5.6vw, 88px)", letterSpacing: "-0.025em" }}
        >
          seis pasos.
        </h2>

        <div className="relative flex items-center">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-rojo/30" />

          <div className="relative grid grid-cols-6 gap-2 w-full">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-start">
                <div className="flex flex-col gap-2 pb-8 md:pb-10">
                  <img
                    src={icoNegro(s.ic, 400)}
                    alt=""
                    aria-hidden
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                  <span className="text-[10px] tracking-[0.26em] uppercase text-rojo/55">
                    {s.n}
                  </span>
                  <span
                    className="font-medium leading-tight"
                    style={{ fontSize: "clamp(14px, 1.4vw, 22px)", letterSpacing: "-0.012em" }}
                  >
                    {s.t}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-8 md:pt-10">
                  <span
                    className="font-light text-rojo/80 leading-snug"
                    style={{ fontSize: "clamp(11px, 0.9vw, 13px)" }}
                  >
                    {s.sub}
                  </span>
                  <span className="text-[10px] tracking-[0.22em] uppercase text-rojo/55">
                    {s.dur}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="font-light text-rojo/75 max-w-[60ch]"
          style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
        >
          La revisión a 3 meses no es un cierre — es la primera oportunidad de ajustar la selección,
          rotar piezas o expandir el alcance. La curaduría se mueve con el espacio.
        </p>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 09 — Cierre — horizontal strip of white icons, captions below
// ─────────────────────────────────────────────────────────────────────────────

function S09Cierre() {
  const STRIP_ICONS = [6, 4, 3, 8, 1, 5, 2];

  return (
    <section className="h-full w-full bg-rojo text-blanco flex flex-col">
      <div className="px-6 md:px-16 pt-16 md:pt-20">
        <Eyebrow light>08 · la siguiente conversación</Eyebrow>
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
            proponer piezas →
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
  S01Cover,     // 0
  S02Intro,     // 1
  S03Equipo,    // 2 — nuestro equipo (b&w team photo)
  S04Asamblea,  // 3
  S05Vecinos,   // 4
  S06PorQue,    // 5 ← red
  S07Modelo,    // 6
  S08Pasos,     // 7
  S09Cierre,    // 8 ← red
];

const RED_SLIDES = new Set([5, 8]);
