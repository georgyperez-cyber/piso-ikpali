"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PASOS = [
  {
    n: "01",
    t: "Conversación inicial",
    d: "Una llamada o visita. Mostramos el espacio, hablamos del momento de la marca y de qué piezas podrían entrar al imaginario.",
    eta: "1 sem",
  },
  {
    n: "02",
    t: "Acuerdo y documentación",
    d: "Carta de consignación corta y transparente. Términos comerciales, periodo, devolución y responsabilidad de inventario.",
    eta: "1 sem",
  },
  {
    n: "03",
    t: "Entrega de piezas",
    d: "Coordinamos la recepción en Asamblea. Inventario fotografiado y registrado al ingresar.",
    eta: "1–2 sem",
  },
  {
    n: "04",
    t: "Producción editorial",
    d: "Sesión fotográfica, ficha curatorial, redacción para canales digitales y materiales para el espacio.",
    eta: "2 sem",
  },
  {
    n: "05",
    t: "Lanzamiento en espacio y canales",
    d: "Las piezas entran al montaje, a Instagram, al sitio y a la agenda de activaciones de Asamblea cuando aplica.",
    eta: "1 día",
  },
  {
    n: "06",
    t: "Revisión a tres meses",
    d: "Lectura conjunta de rotación, comportamiento de la pieza en el espacio y decisiones sobre continuidad o reemplazo.",
    eta: "12 sem",
  },
];

export default function SectionProceso() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const root = ref.current!;
      const progress = root.querySelector<HTMLElement>("[data-progress]")!;
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", root);
      const cards = gsap.utils.toArray<HTMLElement>("[data-pcard]", root);

      // Animated progress line ties to scroll through the section
      gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(progress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.4,
        },
      });

      // Each dot snaps active when its card enters; clean cut, no fade
      cards.forEach((card, i) => {
        gsap.set(cards[i], { clipPath: "inset(0 0 100% 0)" });
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          onEnter: () => {
            gsap.to(card, {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.4,
              ease: "steps(3)",
            });
            gsap.set(dots[i], { backgroundColor: "var(--rojo)", scale: 1.5 });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.3,
              ease: "steps(3)",
            });
            gsap.set(dots[i], { backgroundColor: "transparent", scale: 1 });
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full bg-blanco py-44 md:py-60 px-6 md:px-12 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 items-baseline mb-16 md:mb-24">
          <p className="col-span-6 text-[11px] tracking-[0.22em] uppercase text-rojo/70">
            proceso · 10
          </p>
          <h2
            className="col-span-6 text-rojo font-medium text-right"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            Cómo entrar
          </h2>
        </div>

        <div className="relative grid grid-cols-12 gap-6 md:gap-10">
          {/* Vertical rail */}
          <div className="hidden md:block col-span-1 relative">
            <div className="sticky top-32">
              <div className="relative w-px h-[60vh] bg-rojo/15 mx-auto">
                <div
                  data-progress
                  className="absolute top-0 left-0 w-full bg-rojo origin-top"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>

          <ol className="col-span-12 md:col-span-11 space-y-12 md:space-y-16">
            {PASOS.map((p, i) => (
              <li key={p.n} className="relative grid grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="hidden md:flex col-span-1 items-center justify-center pt-3">
                  <span
                    data-dot
                    className="block w-3 h-3 border border-rojo bg-transparent rounded-full"
                  />
                </div>

                <article
                  data-pcard
                  className="col-span-12 md:col-span-11 border-t border-rojo/30 pt-5 md:grid md:grid-cols-12 md:gap-6 will-change-[clip-path]"
                >
                  <div className="md:col-span-2 flex md:flex-col items-baseline md:items-start gap-3 mb-3 md:mb-0">
                    <span
                      className="text-rojo font-medium leading-none tabular-nums"
                      style={{ fontSize: "clamp(36px, 4.5vw, 64px)", letterSpacing: "-0.03em" }}
                    >
                      {p.n}
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase text-rojo/60">
                      {p.eta}
                    </span>
                  </div>
                  <div className="md:col-span-10">
                    <h3
                      className="text-rojo font-medium tracking-tight leading-tight mb-3"
                      style={{ fontSize: "clamp(22px, 2.6vw, 34px)", letterSpacing: "-0.015em" }}
                    >
                      {p.t}
                    </h3>
                    <p className="text-rojo/85 font-light text-[14px] md:text-[16px] leading-relaxed max-w-prose">
                      {p.d}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
