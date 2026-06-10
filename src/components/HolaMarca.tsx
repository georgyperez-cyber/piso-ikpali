"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Slide = { src: string; scale: number };

const SEQUENCE: Slide[] = [
  { src: "/assets-optimized/hero-icono-foto-1-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-2-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-3-720.webp", scale: 1.15 },
  { src: "/assets-optimized/hero-icono-foto-4-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-5-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-6-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-7-720.webp", scale: 1.0 },
  { src: "/assets-optimized/hero-icono-foto-8-720.webp", scale: 1.0 },
];

const STAGE = "clamp(80px, 12vw, 180px)";

export default function HolaMarca({ marca }: { marca: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const root = wrapRef.current!;
      const wrapper = root.querySelector<HTMLElement>("[data-wrapper]")!;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
      const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      // Mobile stacks the words vertically and opens upward; desktop opens sideways.
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const measureNatural = () => {
        gsap.set(wrapper, { width: "auto" });
        const w = wrapper.getBoundingClientRect().width;
        gsap.set(wrapper, { width: 0 });
        return w;
      };
      let natural = isMobile ? 0 : measureNatural();

      gsap.set(slides, { autoAlpha: 0 });
      slides.forEach((s, i) => gsap.set(s, { scale: SEQUENCE[i].scale }));
      gsap.set(reveal, { autoAlpha: 0, y: 24 });

      // Closed initial state — width-collapsed (desktop) or clipped from below (mobile).
      if (isMobile) {
        gsap.set(wrapper, { width: "auto", clipPath: "inset(100% 0% 0% 0%)" });
      } else {
        gsap.set(wrapper, { width: 0 });
      }

      if (reduced) {
        if (isMobile) gsap.set(wrapper, { width: "auto", clipPath: "inset(0% 0% 0% 0%)" });
        else gsap.set(wrapper, { width: natural });
        gsap.set(slides[0], { autoAlpha: 1 });
        gsap.set(reveal, { autoAlpha: 1, y: 0 });
        return;
      }

      const OPEN = 0.6;
      const HOLD = 1.5;
      const XF = 0.7;

      // Open once and stay open — no closing cut.
      const intro = gsap.timeline();
      if (isMobile) {
        // Vertical reveal: parens stay spread, wipe in from the bottom upward.
        intro.to(wrapper, { clipPath: "inset(0% 0% 0% 0%)", duration: OPEN + 0.2, ease: "power3.inOut" });
      } else {
        intro.to(wrapper, { width: () => natural, duration: OPEN, ease: "power3.inOut" });
      }
      intro.to(slides[0], { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, "-=0.15");

      // Icons crossfade into one another forever — seamless loop, no hard cuts.
      // A repeat:-1 timeline must run standalone; nesting it inside `intro`
      // clamps the repeat and stops after one pass — so start it once the
      // open finishes instead.
      const cycle = gsap.timeline({ repeat: -1, paused: true });
      for (let i = 0; i < slides.length; i++) {
        const cur = slides[i];
        const nxt = slides[(i + 1) % slides.length];
        cycle
          .to({}, { duration: HOLD })
          .to(cur, { autoAlpha: 0, duration: XF, ease: "power1.inOut" }, ">")
          .to(nxt, { autoAlpha: 1, duration: XF, ease: "power1.inOut" }, "<");
      }
      intro.eventCallback("onComplete", () => cycle.play());

      gsap.to(reveal, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: OPEN + 0.5,
      });

      if (isMobile) return;

      let raf = 0;
      const onResize = () => {
        natural = measureNatural();
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
      <link rel="preload" as="image" href="/assets-optimized/hero-icono-foto-1-720.webp" />

      <div className="absolute top-5 left-5 md:top-8 md:left-10 text-[8px] tracking-[0.1em] md:text-[11px] md:tracking-[0.18em] uppercase text-rojo/80 z-10 whitespace-nowrap">
        piso ikpali · est. 2026 · cdmx
      </div>
      <div className="absolute top-5 right-5 md:top-8 md:right-10 text-[8px] tracking-[0.1em] md:text-[11px] md:tracking-[0.18em] uppercase text-rojo/80 z-10 whitespace-nowrap">
        para {marca}
      </div>

      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24">
        <h1
          aria-label={`Hola, ${marca}`}
          className="relative flex flex-col md:flex-row md:flex-wrap items-center justify-center text-center font-sans font-medium select-none leading-[1.05] will-change-transform"
          style={{ fontSize: "clamp(34px, 8vw, 116px)", letterSpacing: "-0.02em" }}
        >
          <span className="inline-block">Hola</span>

          <span
            data-wrapper
            className="relative inline-flex items-center justify-center overflow-hidden mx-[0.06em] will-change-[width]"
            style={{ width: 0, height: STAGE }}
          >
            <span className="inline-block leading-none px-1 md:px-2">(</span>

            <span
              className="relative inline-flex items-center justify-center"
              style={{ width: STAGE, height: STAGE, flex: "0 0 auto" }}
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
                  style={{ width: STAGE, height: STAGE }}
                />
              ))}
            </span>

            <span className="inline-block leading-none px-1 md:px-2">)</span>
          </span>

          <span className="inline-block">{marca}</span>
        </h1>

        <p
          data-reveal
          className="mt-10 md:mt-14 max-w-[560px] text-center text-[14px] md:text-[16px] leading-relaxed font-light text-rojo/90"
        >
          Gracias por tu interés en participar en{" "}
          <em className="not-italic font-medium">piso ikpali</em>. Estamos muy
          emocionados de esta colaboración.
        </p>

        <p
          data-reveal
          className="mt-7 text-[10px] tracking-[0.3em] uppercase text-rojo/55"
        >
          una carta para {marca}
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-rojo/55">
        scroll ↓
      </div>
    </section>
  );
}
