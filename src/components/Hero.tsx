"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Slide = { src: string; isLogo?: boolean; activeScale: number };

const SEQUENCE: Slide[] = [
  { src: "/logo.svg", isLogo: true, activeScale: 0.55 }, // smaller logo
  { src: "/assets-optimized/hero-icono-foto-1-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-2-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-3-720.webp", activeScale: 1.15 },
  { src: "/assets-optimized/hero-icono-foto-4-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-5-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-6-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-7-720.webp", activeScale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-8-720.webp", activeScale: 1.0 },
];

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const root = wrapRef.current!;
      const wrapper = root.querySelector<HTMLElement>("[data-wrapper]")!;
      const stage = root.querySelector<HTMLElement>("[data-stage]")!;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
      const title = root.querySelector<HTMLElement>("[data-title]")!;
      const paragraphs = gsap.utils.toArray<HTMLElement>("[data-paragraph]", root);
      const hint = root.querySelector<HTMLElement>("[data-hint]")!;

      // Measure the natural width of the (stage) wrapper while open.
      const measureNatural = () => {
        gsap.set(wrapper, { width: "auto" });
        const w = wrapper.getBoundingClientRect().width;
        gsap.set(wrapper, { width: 0 });
        return w;
      };
      let natural = measureNatural();

      // Closed initial state.
      gsap.set(wrapper, { width: 0 });
      gsap.set(slides, { autoAlpha: 0, scale: 0.9 });
      gsap.set(paragraphs, { autoAlpha: 0, y: 80 });
      gsap.set(hint, { autoAlpha: 0 });

      if (reduced) {
        gsap.set(wrapper, { width: natural });
        gsap.set([...paragraphs, hint], { autoAlpha: 1, y: 0 });
        gsap.set(slides[0], { autoAlpha: 1, scale: SEQUENCE[0].activeScale });
        return;
      }

      const HOLD = 0.85;
      const FADE = 0.4;
      const OPEN = 0.6;
      const CLOSED_BEAT = 0.5;

      // ───────── Master loop: open → cycle → close → hold → repeat ─────────
      const loop = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

      // Open: wrapper width 0 → natural; first slide fades in
      loop
        .to(wrapper, { width: () => natural, duration: OPEN, ease: "power3.inOut" }, "open")
        .to(
          slides[0],
          { autoAlpha: 1, scale: SEQUENCE[0].activeScale, duration: 0.4, ease: "power2.out" },
          "open+=0.25"
        )
        .to({}, { duration: HOLD });

      // Cycle through remaining slides — HARD CUT, no fade.
      for (let i = 1; i < slides.length; i++) {
        const prev = slides[i - 1];
        const cur = slides[i];
        loop
          .set(prev, { autoAlpha: 0, scale: 0.9 }, ">")
          .set(cur, { autoAlpha: 1, scale: SEQUENCE[i].activeScale }, "<")
          .to({}, { duration: HOLD });
      }

      // Close: fade last slide, collapse the entire wrapper to 0 (parens go too)
      const last = slides[slides.length - 1];
      loop
        .to(last, { autoAlpha: 0, scale: 0.9, duration: FADE, ease: "power2.in" }, "close")
        .to(
          wrapper,
          { width: 0, duration: OPEN, ease: "power3.inOut" },
          "close+=0.05"
        )
        .to({}, { duration: CLOSED_BEAT });

      gsap.to(hint, { autoAlpha: 1, duration: 0.4, delay: OPEN + 0.7 });

      // ───────── Scroll-controlled reveal (independent) ─────────
      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=85%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        })
        .to(title, { y: () => -Math.min(140, window.innerHeight * 0.14) }, 0)
        .to(hint, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(paragraphs, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6 }, 0.05);

      // Resize: re-measure natural width
      let raf = 0;
      const onResize = () => {
        natural = measureNatural();
        // If currently open, snap to new natural width
        const cur = wrapper.getBoundingClientRect().width;
        if (cur > 1) gsap.set(wrapper, { width: natural });
      };
      const debounced = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(onResize);
      };
      window.addEventListener("resize", debounced);
      return () => window.removeEventListener("resize", debounced);
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full bg-blanco text-rojo overflow-hidden"
    >
      <link rel="preload" as="image" href="/logo.svg" />
      <link rel="preload" as="image" href="/assets-optimized/hero-icono-foto-1-720.webp" />

      <div className="absolute top-5 left-5 md:top-8 md:left-10 text-[8px] tracking-[0.1em] md:text-[11px] md:tracking-[0.18em] uppercase text-rojo/80 z-10 whitespace-nowrap">
        piso ikpali · est. 2026 · cdmx
      </div>
      <div className="absolute top-5 right-5 md:top-8 md:right-10 text-[8px] tracking-[0.1em] md:text-[11px] md:tracking-[0.18em] uppercase text-rojo/80 z-10 whitespace-nowrap">
        dentro de asamblea
      </div>

      <div className="relative h-screen w-full flex flex-col items-center justify-center px-4">
        <h1
          data-title
          aria-label="Piso ikpali"
          className="relative flex items-center justify-center font-sans font-medium select-none whitespace-nowrap leading-none will-change-transform"
          style={{
            fontSize: "clamp(40px, 9vw, 120px)",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="inline-block">piso</span>

          {/* Wrapper collapses ALL of "( stage )" to zero width when closed */}
          <span
            data-wrapper
            className="relative inline-flex items-center justify-center overflow-hidden mx-[0.1em] will-change-[width]"
            style={{ width: 0, height: "clamp(100px, 14vw, 210px)" }}
          >
            <span className="inline-block leading-none px-1 md:px-2">(</span>

            <span
              data-stage
              className="relative inline-flex items-center justify-center"
              style={{
                width: "clamp(100px, 14vw, 210px)",
                height: "clamp(100px, 14vw, 210px)",
                flex: "0 0 auto",
              }}
            >
              {SEQUENCE.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.src}
                  data-slide
                  src={item.src}
                  alt=""
                  aria-hidden
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 m-auto object-contain will-change-[opacity,transform]"
                  style={{
                    width: "clamp(100px, 14vw, 210px)",
                    height: "clamp(100px, 14vw, 210px)",
                  }}
                />
              ))}
            </span>

            <span className="inline-block leading-none px-1 md:px-2">)</span>
          </span>

          <span className="inline-block">ikpali</span>
        </h1>

        <div className="absolute left-1/2 -translate-x-1/2 max-w-[640px] w-full px-6 text-rojo" style={{ bottom: "12vh" }}>
          <p data-paragraph className="text-[13px] md:text-[14px] leading-relaxed mb-4 font-light will-change-transform">
            Piso ikpali es la expresión de objeto del universo de{" "}
            <em className="not-italic font-medium">ikpali Studio</em>. Un concept room de diseño
            doméstico mexicano contemporáneo, organizado con criterio curatorial y dispuesto para
            habitarse — no para exhibirse.
          </p>
          <p data-paragraph className="text-[13px] md:text-[14px] leading-relaxed mb-4 font-light will-change-transform">
            Opera dentro de <em className="not-italic font-medium">Asamblea</em>, un hub creativo
            en la Ciudad de México. Cada objeto en el espacio puede comprarse. El cliente no
            necesita investigar ni conocer todas las marcas: la selección es la garantía.
          </p>
          <p data-paragraph className="text-[13px] md:text-[14px] leading-relaxed font-light will-change-transform">
            La curaduría no está cerrada ni congelada. La selección crece, se ajusta y evoluciona
            conforme el espacio se habita, las piezas rotan y aparecen nuevas conversaciones entre
            objetos, marcas y visitantes.
          </p>
        </div>

        <div data-hint className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-rojo/60">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
