"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BENEFICIOS = [
  {
    n: "01",
    titulo: "Legitimidad editorial",
    texto:
      "Estar en Piso ikpali es entrar a una conversación curada. La marca aparece junto a piezas y diseñadores con criterio claro, no en un catálogo abierto.",
    kpi: "Curaduría",
  },
  {
    n: "02",
    titulo: "Un cliente que compra por valor",
    texto:
      "El visitante de Piso ikpali no negocia el precio: lo entiende. Llega ya predispuesto a invertir en objeto bien hecho.",
    kpi: "Ticket alto",
  },
  {
    n: "03",
    titulo: "Contenido editorial",
    texto:
      "Producimos fotografía y narrativa propias para cada pieza. Las marcas reciben material reusable en sus propios canales.",
    kpi: "Fotografía + texto",
  },
  {
    n: "04",
    titulo: "Visibilidad sin gestión",
    texto:
      "La marca no necesita administrar el espacio, ni atender al público, ni mover inventario. La operación corre por nuestra cuenta.",
    kpi: "Cero overhead",
  },
  {
    n: "05",
    titulo: "Comunidad entre marcas",
    texto:
      "Compartir piso con otros estudios genera referencias cruzadas, colaboraciones y lectura mutua. La selección no compite, conversa.",
    kpi: "Red de pares",
  },
  {
    n: "06",
    titulo: "Continuidad curatorial",
    texto:
      "La curaduría se sostiene en el tiempo y se ajusta. La marca no aparece y desaparece: forma parte de un imaginario que evoluciona.",
    kpi: "Largo plazo",
  },
];

export default function SectionBeneficios() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-bcard]", sectionRef.current!);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // last card stays
        const next = cards[i + 1];
        // As the next card scrolls in, the current card scales down + slides slightly.
        gsap.to(card, {
          scale: 0.94,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-rojo text-blanco py-44 md:py-56 px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 items-baseline mb-20">
          <p className="col-span-6 text-[11px] tracking-[0.22em] uppercase text-blanco/80">
            beneficios · 09
          </p>
          <h2
            className="col-span-6 font-medium text-right"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            Por qué estar en Piso ikpali
          </h2>
        </div>

        <div className="space-y-8 md:space-y-12">
          {BENEFICIOS.map((b) => (
            <article
              key={b.n}
              data-bcard
              className="sticky top-24 md:top-32 grid grid-cols-12 gap-6 bg-rojo border border-blanco/30 p-8 md:p-12 will-change-transform"
              style={{ borderRadius: 0 }}
            >
              <div className="col-span-12 md:col-span-2 flex md:flex-col items-baseline md:items-start justify-between md:justify-start gap-2">
                <span
                  className="font-medium leading-none tabular-nums"
                  style={{ fontSize: "clamp(48px, 7vw, 110px)", letterSpacing: "-0.03em" }}
                >
                  {b.n}
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-blanco/70">
                  {b.kpi}
                </span>
              </div>
              <div className="col-span-12 md:col-span-7">
                <h3
                  className="font-medium leading-tight tracking-tight mb-4"
                  style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.015em" }}
                >
                  {b.titulo}
                </h3>
                <p className="font-light text-[15px] md:text-[17px] leading-relaxed max-w-prose">
                  {b.texto}
                </p>
              </div>
              <div className="col-span-12 md:col-span-3 flex items-end justify-end">
                <span className="text-[10px] tracking-[0.22em] uppercase text-blanco/60">
                  {b.n} / {String(BENEFICIOS.length).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
