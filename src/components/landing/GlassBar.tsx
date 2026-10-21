"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SITIO } from "./productos";
import { AVISO } from "./aviso";
import { Adapt } from "./contraste";

// Barra de cristal al pie. Tres nombres: ubicación, contacto, privacidad.
// Los tres expanden la misma barra (morph) y muestran su texto.

type Panel = "ubicacion" | "contacto" | "privacidad" | null;

export default function GlassBar({ visible = true }: { visible?: boolean }) {
  const [abierto, setAbierto] = useState<Panel>(null);
  const [medida, setMedida] = useState(0);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const size = useRef<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const o = outer.current!;
    const inn = inner.current!;
    const vw = window.innerWidth;
    // ancho natural de la fila de nombres (sin que la ensanche el panel)
    inn.style.setProperty("--bar-w", "max-content");
    const navW = Math.ceil(nav.current!.getBoundingClientRect().width);
    const targetW = abierto ? Math.min(abierto === "privacidad" ? 600 : 560, vw - 32) : navW;
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
      setMedida((m) => m + 1);
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
          <div
            ref={panel}
            className={`ld-bar__panel${abierto === "privacidad" ? " ld-bar__panel--aviso" : ""}`}
            key={abierto}
            data-lenis-prevent
          >
            {abierto === "ubicacion" && (
              <p>
                <em>{SITIO.direccion}</em>, {SITIO.ciudad}. {SITIO.dentroDe}.
                <br />
                {SITIO.horario}
              </p>
            )}
            {abierto === "contacto" && (
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
            {abierto === "privacidad" && (
              <div className="ld-bar__aviso">
                {AVISO.map(([titulo, cuerpo]) => (
                  <div key={titulo}>
                    <h3>{titulo}</h3>
                    <p>{cuerpo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div ref={nav} className="ld-bar__nav">
          {(
            [
              ["ubicacion", "ubicación"],
              ["contacto", "contacto"],
              ["privacidad", "privacidad"],
            ] as [Exclude<Panel, null>, string][]
          ).map(([k, label], idx) => (
            <span key={k} style={{ display: "contents" }}>
              {idx > 0 && <span className="ld-bar__dot" aria-hidden />}
              <button
                type="button"
                className={`ld-bar__btn${abierto === k ? " is-on" : ""}`}
                onClick={() => toggle(k)}
                aria-expanded={abierto === k}
              >
                <span className="ld-btn-tx"><Adapt>{label}</Adapt></span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
