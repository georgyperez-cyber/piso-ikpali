"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Img from "./Img";

function pickDistinct(count: number, total: number, exclude: number[] = []): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const r = Math.floor(Math.random() * total);
    if (!out.includes(r) && !exclude.includes(r)) out.push(r);
  }
  return out;
}

const PERFILES = [
  {
    n: "01",
    titulo: "El visitante creativo",
    perfil: "25–40 · Diseñador, gestor cultural, habitante curioso.",
    texto:
      "Reconoce el nivel de la selección en cuanto la ve. La compra ocurre en el espacio, no en línea. Paga más cuando entiende quién hizo la pieza y por qué existe.",
  },
  {
    n: "02",
    titulo: "El cliente de mobiliario",
    perfil: "30–50 · Cliente existente de ikpali Studio.",
    texto:
      "Ya tiene la silla. Quiere que el resto de la casa tenga el mismo nivel. Confía en el criterio de ikpali sin más explicación. Suele comprar para regalar.",
  },
  {
    n: "03",
    titulo: "El coleccionista incipiente",
    perfil: "22–35 · Diseño, arte, fotografía, arquitectura.",
    texto:
      "Sensibilidad estética formada. La curaduría le quita la carga de investigar. Cuando compra algo que le encanta, lo comparte. Mayor potencial de prescripción.",
  },
  {
    n: "04",
    titulo: "El habitante con criterio",
    perfil: "Cualquier edad · Sin referencia previa de diseño emergente.",
    texto:
      "No sabe qué es diseño emergente. Pero sabe que ese objeto es diferente. La coherencia del conjunto y la calidad perceptual son los únicos argumentos.",
  },
];

// 10 cells: 9 publico photos + 1 hybrid byn cuadricula tile.
const CELLS = [
  { src: "/assets-optimized/publico-1-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-2-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-3-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-4-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-5-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-6-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/cuadricula-byn-3-1200.webp", kind: "byn" as const },
  { src: "/assets-optimized/publico-7-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-8-720.webp", kind: "foto" as const },
  { src: "/assets-optimized/publico-9-720.webp", kind: "foto" as const },
];

const OVERLAY_ICONS = [
  "/assets-optimized/hero-icono-2-600.webp",
  "/assets-optimized/hero-icono-5-600.webp",
];

export default function SectionAudiencia() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const grid = gridRef.current!;
      const overlays = gsap.utils.toArray<HTMLElement>("[data-overlay]", grid);
      const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", grid);

      const placeOverlay = (overlay: HTMLElement, cellIdx: number) => {
        const cell = cells[cellIdx];
        const cRect = cell.getBoundingClientRect();
        const gRect = grid.getBoundingClientRect();
        gsap.set(overlay, {
          x: cRect.left - gRect.left,
          y: cRect.top - gRect.top,
          width: cRect.width,
          height: cRect.height,
        });
      };

      let positions = [2, 7];
      overlays.forEach((o, i) => placeOverlay(o, positions[i]));

      const shuffle = () => {
        const next = pickDistinct(overlays.length, cells.length, positions);
        overlays.forEach((o, i) => {
          gsap
            .timeline()
            .to(o, { scale: 0, duration: 0.18, ease: "power3.in" })
            .add(() => placeOverlay(o, next[i]))
            .to(o, { scale: 1, duration: 0.22, ease: "back.out(1.6)" });
        });
        positions = next;
      };

      const id = window.setInterval(shuffle, 3000);

      const onResize = () => {
        overlays.forEach((o, i) => placeOverlay(o, positions[i]));
      };
      let raf = 0;
      const debounced = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(onResize);
      };
      window.addEventListener("resize", debounced);

      return () => {
        clearInterval(id);
        window.removeEventListener("resize", debounced);
      };
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-blanco py-40 md:py-56 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70">audiencia · 02</p>
          <h2
            className="text-rojo font-medium"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            A quién le hablamos
          </h2>
        </div>

        {/* 4 perfiles — typography only, no background, no frame */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10 mb-12 md:mb-16 text-rojo">
          {PERFILES.map((p) => (
            <article key={p.n} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] tracking-[0.22em] uppercase opacity-70 tabular-nums">
                  {p.n}
                </span>
                <h3 className="font-medium text-[19px] md:text-[22px] tracking-tight leading-tight">
                  {p.titulo}
                </h3>
              </div>
              <p className="text-[11px] tracking-[0.04em] uppercase opacity-70">
                {p.perfil}
              </p>
              <p className="font-light text-[14px] leading-relaxed">{p.texto}</p>
            </article>
          ))}
        </div>

        {/* Photo grid with hopping overlay icons */}
        <div ref={gridRef} className="relative grid grid-cols-5 gap-2 md:gap-3">
          {CELLS.map((c, i) => (
            <div
              key={i}
              data-cell
              className="relative h-[120px] sm:h-[150px] md:h-[180px] overflow-hidden bg-blanco"
            >
              <Img
                src={c.src}
                alt=""
                className={`w-full h-full object-cover ${c.kind === "foto" ? "grayscale" : ""}`}
              />
            </div>
          ))}

          {OVERLAY_ICONS.map((src, i) => (
            <div
              key={i}
              data-overlay
              className="absolute top-0 left-0 pointer-events-none"
              style={{ transformOrigin: "center" }}
            >
              <Img
                src={src}
                alt=""
                className="w-full h-full object-contain mix-blend-multiply"
                style={{ padding: "8%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
