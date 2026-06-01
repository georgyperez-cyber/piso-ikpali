"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TERMINOS = [
  {
    k: "Modelo",
    s: "Consignación",
    v: "Las piezas viven en el espacio sin cambiar de dueño hasta su venta.",
  },
  {
    k: "Liquidación",
    s: "Mensual",
    v: "Reporte y depósito del 65 % el primer lunes hábil de cada mes.",
  },
  {
    k: "Precio de venta",
    s: "Lo fija la marca",
    v: "Sin descuentos al público sin acuerdo previo por escrito.",
  },
  {
    k: "Devolución",
    s: "Sin penalización",
    v: "Sin penalización siempre y cuando se cumpla con el tiempo del acuerdo.",
  },
  {
    k: "Inventario",
    s: "Lo gestionamos nosotros",
    v: "Nos encargamos del inventario de las piezas que tenemos en el espacio.",
  },
  {
    k: "Contenido",
    s: "Producción compartida",
    v: "Fotografía y ficha curatorial reusables por la marca en sus canales.",
  },
];

export default function SectionModelo() {
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const split = splitRef.current!;
      if (reduced) {
        split.style.gridTemplateColumns = "minmax(0,65fr) minmax(0,35fr)";
        return;
      }
      const ratio = { v: 0.5 };
      split.style.gridTemplateColumns = "minmax(0,50fr) minmax(0,50fr)";

      gsap.to(ratio, {
        v: 0.65,
        ease: "none",
        scrollTrigger: {
          trigger: split,
          start: "top 80%",
          end: "center 55%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const r = ratio.v;
          split.style.gridTemplateColumns = `minmax(0,${r * 100}fr) minmax(0,${(1 - r) * 100}fr)`;
        },
      });
    }, splitRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-blanco">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-24 md:pt-32 pb-10 md:pb-14">
        <div className="grid grid-cols-12 items-baseline gap-4">
          <p className="col-span-6 text-[11px] tracking-[0.22em] uppercase text-rojo/70">
            modelo · 07
          </p>
          <h2
            className="col-span-6 text-rojo font-medium text-right"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            Cómo trabajamos juntos
          </h2>
        </div>
      </div>

      {/*
        Single grid where every row has TWO cells (red + white) side-by-side.
        Both cells of a row share the same row height by definition, so
        the hairlines always align — no matter how text wraps.
      */}
      <div
        ref={splitRef}
        className="w-full grid overflow-x-clip"
        style={{ gridTemplateColumns: "minmax(0,65fr) minmax(0,35fr)" }}
      >
        {/* Eyebrow row */}
        <div className="bg-rojo text-blanco px-6 md:px-12 pt-12 md:pt-16 pb-4 md:pb-6">
          <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-blanco/75">
            a la marca
          </span>
        </div>
        <div className="bg-blanco text-rojo px-6 md:px-12 pt-12 md:pt-16 pb-4 md:pb-6 border-l border-rojo">
          <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-rojo/70">
            a piso ikpali
          </span>
        </div>

        {/* Term rows — 6 of them, each row is one red cell + one white cell */}
        {TERMINOS.map((t) => (
          <Fragment key={t.k}>
            <div className="bg-rojo text-blanco px-6 md:px-12 py-4 md:py-5 border-t border-blanco/30 flex flex-col gap-1.5 justify-center">
              <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-blanco/70">
                {t.k}
              </span>
              <span
                className="text-blanco font-medium tracking-tight leading-tight"
                style={{ fontSize: "clamp(15px, 1.5vw, 20px)", letterSpacing: "-0.01em" }}
              >
                {t.s}
              </span>
            </div>
            <div className="bg-blanco text-rojo px-6 md:px-12 py-4 md:py-5 border-t border-rojo/25 border-l border-l-rojo flex items-center">
              <p className="font-light text-[11px] md:text-[12px] leading-snug max-w-[44ch]">
                {t.v}
              </p>
            </div>
          </Fragment>
        ))}

        {/* Numbers row */}
        <div className="bg-rojo text-blanco px-6 md:px-12 pt-10 md:pt-14 pb-12 md:pb-16 border-t border-blanco/30 flex items-end justify-between gap-4">
          <span
            className="font-medium leading-[0.85] tabular-nums"
            style={{ fontSize: "clamp(72px, 18vw, 320px)", letterSpacing: "-0.05em" }}
          >
            65
          </span>
          <span className="text-[11px] md:text-[12px] tracking-[0.18em] uppercase pb-3 md:pb-5 text-blanco/85 max-w-[12ch] text-right">
            de cada venta · siempre
          </span>
        </div>
        <div className="bg-blanco text-rojo px-6 md:px-12 pt-10 md:pt-14 pb-12 md:pb-16 border-t border-rojo/25 border-l border-l-rojo flex items-end justify-between gap-4">
          <span
            className="font-medium leading-[0.85] tabular-nums"
            style={{ fontSize: "clamp(44px, 11vw, 200px)", letterSpacing: "-0.05em" }}
          >
            35
          </span>
          <span className="hidden md:block text-[10px] md:text-[12px] tracking-[0.18em] uppercase pb-2 md:pb-4 text-rojo/70 max-w-[12ch] text-right">
            cubre operación + edición
          </span>
        </div>
      </div>
    </section>
  );
}
