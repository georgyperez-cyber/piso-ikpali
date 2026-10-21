"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SITIO } from "./productos";

// Barra de cristal al pie. Tres nombres: ubicación, contacto, privacidad.
// Ubicación y contacto expanden la misma barra (morph) y muestran un texto
// corto; privacidad lleva a su página.

type Panel = "ubicacion" | "contacto" | null;

export default function GlassBar({ visible = true }: { visible?: boolean }) {
  const [abierto, setAbierto] = useState<Panel>(null);
  const [medida, setMedida] = useState(0);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const size = useRef<{ w: number; h: number } | null>(null);

  // Mide el tamaño natural del contenido y lleva la barra ahí con un morph.
  useLayoutEffect(() => {
    const o = outer.current!;
    const inn = inner.current!;
    const vw = window.innerWidth;
    const navW = nav.current!.scrollWidth;
    const targetW = abierto ? Math.min(560, vw - 32) : navW;
    inn.style.setProperty("--bar-w", `${targetW}px`);
    const targetH = inn.offsetHeight;

    if (!size.current) {
      gsap.set(o, { width: targetW, height: targetH });
      size.current = { w: targetW, h: targetH };
      return;
    }
    const from = size.current;
    size.current = { w: targetW, h: targetH };
    gsap.fromTo(
      o,
      { width: from.w, height: from.h },
      { width: targetW, height: targetH, duration: 0.65, ease: "expo.inOut", overwrite: true }
    );
    if (panel.current) {
      gsap.fromTo(
        panel.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.25, overwrite: true }
      );
    }
  }, [abierto, medida]);

  useLayoutEffect(() => {
    const onResize = () => {
      size.current = null;
      setMedida((m) => m + 1); // fuerza re-medición
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    gsap.to(outer.current, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : 16,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [visible]);

  const toggle = (p: Exclude<Panel, null>) => setAbierto((a) => (a === p ? null : p));

  return (
    <div ref={outer} className="ld-glass ld-bar" role="navigation" aria-label="Información">
      <div ref={inner} className="ld-bar__inner">
        {abierto && (
          <div ref={panel} className="ld-bar__panel" key={abierto}>
            {abierto === "ubicacion" ? (
              <p>
                <em>{SITIO.direccion}</em>, {SITIO.ciudad}. {SITIO.dentroDe}.
                <br />
                {SITIO.horario}
              </p>
            ) : (
              <p>
                <a href={`mailto:${SITIO.email}`}>{SITIO.email}</a>
                <br />
                <a href={`https://instagram.com/${SITIO.instagram}`} target="_blank" rel="noreferrer">
                  @{SITIO.instagram}
                </a>
                {SITIO.whatsapp && (
                  <>
                    <br />
                    <a href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        )}
        <div ref={nav} className="ld-bar__nav">
          <button
            type="button"
            className={`ld-bar__btn${abierto === "ubicacion" ? " is-on" : ""}`}
            onClick={() => toggle("ubicacion")}
            aria-expanded={abierto === "ubicacion"}
          >
            ubicación
          </button>
          <span className="ld-bar__dot" aria-hidden />
          <button
            type="button"
            className={`ld-bar__btn${abierto === "contacto" ? " is-on" : ""}`}
            onClick={() => toggle("contacto")}
            aria-expanded={abierto === "contacto"}
          >
            contacto
          </button>
          <span className="ld-bar__dot" aria-hidden />
          <Link href="/landing/privacidad" className="ld-bar__btn">
            privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}
