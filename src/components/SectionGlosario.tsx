"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Img from "./Img";

// Replicates the cactus + red-icons reference: full-width B&W texture,
// horizontal row of red hero icons sitting on a baseline.
const ICONS = [1, 3, 6, 4, 2, 8, 5].map((n) => `/assets-optimized/hero-icono-${n}-600.webp`);

const LABELS = ["disco", "torre", "cesta", "jarra", "lámpara", "tazón", "vela"];

export default function SectionGlosario() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-glos-icon]", sectionRef.current!);
      // Initial state — hidden via clip-path (clean cut, no fade).
      gsap.set(items, { clipPath: "inset(100% 0 0 0)", yPercent: 0 });

      if (reduced) {
        gsap.set(items, { clipPath: "inset(0% 0 0 0)" });
        return;
      }

      // Scrub-driven reveal: icons cut in left-to-right tied to scroll progress.
      gsap.to(items, {
        clipPath: "inset(0% 0 0 0)",
        ease: "steps(1)",
        stagger: { each: 1, from: "start" },
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top 85%",
          end: "center 60%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-blanco overflow-hidden"
    >
      {/* Full-width B&W texture as backdrop */}
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        <Img
          src="/assets-optimized/textura-3-1280.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-blanco/15" aria-hidden />

        <div className="absolute top-6 left-6 md:top-10 md:left-12 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-blanco z-10 mix-blend-difference">
          léxico · 03
        </div>
        <div className="absolute top-6 right-6 md:top-10 md:right-12 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-blanco z-10 mix-blend-difference text-right">
          un vocabulario
          <br />
          de objeto
        </div>

        {/* Icon row baseline */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-7 gap-2 md:gap-6 items-end">
              {ICONS.map((src, i) => (
                <div
                  key={src}
                  className="relative flex flex-col items-center group"
                >
                  <div
                    data-glos-icon
                    className="relative w-full aspect-square flex items-center justify-center"
                  >
                    <Img
                      src={src}
                      alt={LABELS[i]}
                      className="w-[70%] h-[70%] object-contain transition-transform duration-200 group-hover:scale-[1.18]"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Baseline rule */}
            <div className="mt-8 h-px bg-blanco/60 mix-blend-difference" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.22em] uppercase text-blanco mix-blend-difference">
          siete formas, un imaginario
        </div>
      </div>
    </section>
  );
}
