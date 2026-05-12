"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Img from "./Img";

const ICONS = [
  "/assets-optimized/hero-icono-1-600.webp",
  "/assets-optimized/hero-icono-2-600.webp",
  "/assets-optimized/hero-icono-3-600.webp",
  "/assets-optimized/hero-icono-4-600.webp",
  "/assets-optimized/hero-icono-5-600.webp",
  "/assets-optimized/hero-icono-6-600.webp",
  "/assets-optimized/hero-icono-7-600.webp",
  "/assets-optimized/hero-icono-8-600.webp",
  "/assets-optimized/hero-icono-foto-1-720.webp",
  "/assets-optimized/hero-icono-foto-3-720.webp",
  "/assets-optimized/hero-icono-foto-5-720.webp",
  "/assets-optimized/hero-icono-foto-7-720.webp",
];

// Sellers, not buyers. Period baked into each so each cycle is a complete sentence.
const WORDS = [
  "pieza.",
  "obra.",
  "mesa.",
  "silla.",
  "jarra.",
  "objeto.",
  "taller.",
  "nombre.",
  "catálogo.",
  "mano.",
];

export default function SectionCierre() {
  const slotRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [iconIdx, setIconIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIconIdx((p) => (p + 1) % ICONS.length);
      setWordIdx((p) => (p + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!slotRef.current) return;
    gsap.fromTo(
      slotRef.current,
      { scale: 0 },
      { scale: 1, duration: 0.28, ease: "back.out(2)" }
    );
  }, [iconIdx]);

  useEffect(() => {
    if (!wordRef.current) return;
    gsap.fromTo(
      wordRef.current,
      { clipPath: "inset(-0.2em 100% -0.2em 0)" },
      { clipPath: "inset(-0.2em 0% -0.2em 0)", duration: 0.32, ease: "steps(3)" }
    );
  }, [wordIdx]);

  return (
    <section className="relative w-full bg-blanco">
      <div className="relative overflow-hidden bg-rojo text-blanco py-40 md:py-56 px-6 md:px-12 select-none">
        <div className="mx-auto max-w-[1400px] relative z-10">
          <p className="text-[11px] tracking-[0.22em] uppercase text-blanco/80 mb-12 md:mb-16">
            contacto · 10
          </p>

          <h2
            className="font-medium leading-[1.05] mb-12 tracking-tight pb-2"
            style={{ fontSize: "clamp(44px, 9.5vw, 156px)", letterSpacing: "-0.025em" }}
          >
            vende
            <span className="inline-flex items-center align-middle mx-3 md:mx-5">
              <span aria-hidden className="opacity-90">(</span>
              <span
                ref={slotRef}
                className="inline-flex items-center justify-center mx-2 md:mx-3"
                style={{
                  width: "0.9em",
                  height: "0.9em",
                  transformOrigin: "center",
                }}
              >
                <Img
                  src={ICONS[iconIdx]}
                  alt=""
                  className="w-full h-full object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </span>
              <span aria-hidden className="opacity-90">)</span>
            </span>
            <br />
            tu{" "}
            <span
              ref={wordRef}
              className="italic font-light inline-block align-baseline"
              style={{ minWidth: "8ch", paddingRight: "0.15em", paddingBottom: "0.12em" }}
            >
              {WORDS[wordIdx]}
            </span>
          </h2>

          <p className="font-light text-[15px] md:text-[18px] leading-relaxed max-w-2xl mb-14 text-blanco/95">
            Junto a este documento llega una selección específica de piezas que nos interesan
            de tu catálogo. No es definitiva: es el punto de partida de una conversación.
            Estamos abiertos a que nos propongas piezas adicionales si consideras que encajan
            con el imaginario del espacio.
          </p>

          <a
            href="mailto:hola@pisoikpali.com?subject=Propuesta%20de%20piezas%20para%20Piso%20ikpali"
            className="inline-flex items-center gap-4 bg-blanco text-rojo px-8 py-5 text-[15px] tracking-tight font-medium hover:bg-blanco/90 transition-colors group"
          >
            proponer piezas
            <span
              aria-hidden
              className="text-[20px] leading-none group-hover:translate-x-1 transition-transform"
            >
              →
            </span>
          </a>
        </div>
      </div>

      <footer className="bg-blanco text-rojo px-6 md:px-12 py-20 md:py-24 border-t border-rojo/20">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">correo</p>
            <a
              href="mailto:hola@pisoikpali.com"
              className="text-rojo font-medium text-[15px] hover:underline"
            >
              hola@pisoikpali.com
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">instagram</p>
            <a
              href="https://instagram.com/pisoikpali"
              target="_blank"
              rel="noreferrer"
              className="text-rojo font-medium text-[15px] hover:underline"
            >
              @pisoikpali
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">ubicación</p>
            <p className="text-rojo font-medium text-[15px]">
              Asamblea
              <br />
              Ciudad de México
            </p>
          </div>
          <div className="flex md:justify-end items-end">
            <Img src="/logo.svg" alt="Piso ikpali" className="h-10 w-auto" />
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] mt-16 pt-8 border-t border-rojo/15 flex flex-col md:flex-row justify-between gap-3 text-[10px] tracking-[0.22em] uppercase text-rojo/50">
          <span>© Piso ikpali · {new Date().getFullYear()}</span>
          <span>una expresión de objeto de ikpali studio</span>
        </div>
      </footer>
    </section>
  );
}
