"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Img from "./Img";

const ICONOS = [1, 2, 3, 4, 5, 6, 8].map((n) => `/assets-optimized/hero-icono-${n}-600.webp`);

type Crit = { word: string; full: string; in: boolean };
const CRITERIOS: Crit[] = [
  { word: "Coherencia",        full: "Convive con el universo del objeto doméstico.",        in: true  },
  { word: "Tendencia",         full: "Diseño estacional o pensado para gustar a corto plazo.", in: false },
  { word: "Proceso",           full: "Fabricación visible, narrable, con huella humana.",      in: true  },
  { word: "Producción masiva", full: "Cantidad sin criterio editorial detrás.",                in: false },
  { word: "Autoría",           full: "Diseñador o estudio identificable detrás de la pieza.",  in: true  },
  { word: "Anonimato",         full: "Pieza sin historia, sin proceso, sin firma.",            in: false },
  { word: "Materia",           full: "Materialidad con intención: por qué este, no otro.",     in: true  },
  { word: "Decoración",        full: "Lifestyle genérico sin punto de vista.",                 in: false },
  { word: "Función",           full: "Los objetos se usan, no se exhiben.",                    in: true  },
  { word: "Ruido",             full: "Lo que no dialoga con el resto en este momento.",        in: false },
  { word: "Diálogo",           full: "Conversa con las otras piezas del espacio.",             in: true  },
];

export default function SectionCuraduria() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-cur-slide]", stageRef.current!);
      // Stack all slides; only one visible at a time — clean instant crossfade.
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });

      let i = 0;
      const advance = () => {
        const cur = slides[i];
        const next = slides[(i + 1) % slides.length];
        gsap.to(cur, { autoAlpha: 0, duration: 0.22, ease: "power1.out" });
        gsap.to(next, { autoAlpha: 1, duration: 0.22, ease: "power1.out" });
        i = (i + 1) % slides.length;
      };

      const interval = window.setInterval(advance, 1800);
      return () => clearInterval(interval);
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-blanco">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        <div className="bg-rojo text-blanco flex items-center px-6 md:px-16 py-24 md:py-32">
          <div className="max-w-md">
            <p className="text-[11px] tracking-[0.22em] uppercase text-blanco/80 mb-10">
              curaduría · 04
            </p>
            <h2
              className="font-medium leading-[1.05] mb-10"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)", letterSpacing: "-0.015em" }}
            >
              El filtro es el imaginario.
            </h2>
            <p className="font-light text-[15px] md:text-[17px] leading-relaxed mb-8">
              La selección no responde a precios ni a tendencias. El criterio no es el origen de las
              piezas ni su rango: es la coherencia con el imaginario del espacio. Todo lo que está
              en Piso ikpali debe poder convivir dentro del mismo mundo.
            </p>
            <p className="font-light text-[15px] md:text-[17px] leading-relaxed">
              <span className="text-blanco/70">Entra:</span>{" "}
              {CRITERIOS.filter((c) => c.in).map((c, i, arr) => (
                <span key={c.word}>
                  {c.word.toLowerCase()}
                  {i < arr.length - 1 ? ", " : "."}
                </span>
              ))}
              <br />
              <span className="text-blanco/70">No entra:</span>{" "}
              {CRITERIOS.filter((c) => !c.in).map((c, i, arr) => (
                <span key={c.word} className="line-through decoration-blanco/40">
                  {c.word.toLowerCase()}
                  {i < arr.length - 1 ? (
                    <span className="no-underline">, </span>
                  ) : (
                    <span className="no-underline">.</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div
          ref={stageRef}
          className="relative bg-blanco aspect-square md:aspect-auto md:min-h-[80vh] border-t md:border-t-0 md:border-l border-rojo/20 overflow-hidden"
        >
          {ICONOS.map((src) => (
            <Img
              key={src}
              data-cur-slide
              src={src}
              alt=""
              priority
              className="absolute inset-0 w-full h-full object-contain p-[8%]"
            />
          ))}
        </div>
      </div>

    </section>
  );
}
