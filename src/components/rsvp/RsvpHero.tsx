"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./rsvp.css";
import { PARENTESIS, foto } from "@/lib/piezas";

// /softopening · invitación al soft opening (sábado 5 de diciembre de 2026) con su "sí asistiré".
// La respuesta entra al admin (pisoikpali.com/admin → RSVP) por /admin/api/publico/rsvp.
// Un solo gesto de movimiento en toda la página: el paréntesis se abre (como en el hero del sitio)
// y el bloque rojo crece de botón a formulario y de formulario a confirmación. Sin fades: lo que
// cambia adentro aparece en seco mientras el bloque crece.

const NB = " "; // espacio duro: evita palabras cortas o viudas al final de línea

export const EVENTO = {
  clave: "soft-opening-2026",
  fecha: `Sábado 5${NB}de${NB}diciembre`,
  horario: `11:00${NB}a${NB}16:00${NB}h`,
  mapa: "https://www.google.com/maps/search/?api=1&query=Lafayette+64,+Anzures,+Ciudad+de+M%C3%A9xico",
  correo: "hola@pisoikpali.com",
};

const URL_RSVP = "/admin/api/publico/rsvp";
const CLAVE_LOCAL = `ikpali.rsvp.${EVENTO.clave}`;
const ICS = "/softopening.ics";
const GOOGLE =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Soft opening · Piso ikpali") +
  "&dates=20261205T170000Z%2F20261205T220000Z" +
  "&location=" + encodeURIComponent("ffaayyeett, Lafayette 64, Anzures, Ciudad de México") +
  "&details=" + encodeURIComponent("Soft opening de Piso ikpali en ffaayyeett. https://pisoikpali.com/softopening");

// Piezas de la tienda (fotos finales del catálogo, lib/piezas.ts); cambian con corte, sin disolvencia.
const OBJETOS = PARENTESIS.map((id) => foto(id));
// Cada invitado puede venir con una persona (+1)
const ACOMPANANTES: [number, string][] = [[0, "solo yo"], [1, "+1"]];

type Fase = "cerrado" | "form" | "listo";
type Respuesta = { nombre: string; contacto: string; acompanantes: number; instagram: string };
type ErrorForm = { texto: string; correo?: string } | null;

const primerNombre = (n: string) => {
  const p = n.trim().split(/\s+/)[0] || "";
  return p.charAt(0).toUpperCase() + p.slice(1);
};
const leerLocal = (): Respuesta | null => {
  try {
    const s = window.localStorage.getItem(CLAVE_LOCAL);
    return s ? (JSON.parse(s) as Respuesta) : null;
  } catch {
    return null;
  }
};
const guardarLocal = (r: Respuesta) => {
  try {
    window.localStorage.setItem(CLAVE_LOCAL, JSON.stringify(r));
  } catch {
    /* navegador sin almacenamiento: solo no recordará la respuesta */
  }
};
const mailtoRespaldo = (r: Respuesta) =>
  `mailto:${EVENTO.correo}?subject=${encodeURIComponent("Confirmo: soft opening del 5 de diciembre")}&body=${encodeURIComponent(
    `Hola, confirmo que voy al soft opening de Piso ikpali.\n\nNombre: ${r.nombre}\nContacto: ${r.contacto}\n` +
      `${r.acompanantes ? "Voy con mi +1" : "Voy sin acompañante"}` +
      `${r.instagram ? `\nInstagram: ${r.instagram}` : ""}`
  )}`;

function Objetos({ activo }: { activo: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!activo) return;
    const t = setInterval(() => setI((x) => (x + 1) % OBJETOS.length), 1100);
    return () => clearInterval(t);
  }, [activo]);
  return (
    <span className="rv-escenario" aria-hidden>
      {OBJETOS.map((src, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" loading={k < 2 ? "eager" : "lazy"} decoding="async" className={k === i ? "is-on" : ""} />
      ))}
    </span>
  );
}

export default function RsvpHero() {
  const parRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const altoAntes = useRef<number | null>(null);
  const [ciclo, setCiclo] = useState(false);
  const [fase, setFase] = useState<Fase>("cerrado");
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [acomp, setAcomp] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<ErrorForm>(null);

  const reducido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // El paréntesis se abre y empiezan a pasar los objetos
  useEffect(() => {
    const el = parRef.current;
    if (!el) return;
    if (reducido()) {
      gsap.set(el, { width: "auto" });
      return;
    }
    gsap.set(el, { width: "auto" });
    const natural = el.getBoundingClientRect().width;
    const tl = gsap.timeline({ delay: 0.35 });
    tl.fromTo(el, { width: 0 }, { width: natural, duration: 0.6, ease: "power3.inOut" })
      .set(el, { width: "auto" })
      .call(() => setCiclo(true));
    return () => {
      tl.kill();
    };
  }, []);

  // Si ya había confirmado desde este navegador, se le muestra su confirmación
  useEffect(() => {
    const r = leerLocal();
    if (r) {
      setRespuesta(r);
      setAcomp(Math.min(1, r.acompanantes));
      setFase("listo");
    }
  }, []);

  // El bloque rojo crece (o se encoge) a su nueva altura; el contenido nuevo ya está adentro
  const cambiar = useCallback((f: Fase) => {
    altoAntes.current = panelRef.current?.offsetHeight ?? null;
    setError(null);
    setFase(f);
  }, []);

  useLayoutEffect(() => {
    const el = panelRef.current;
    const desde = altoAntes.current;
    if (!el || desde == null) return;
    altoAntes.current = null;
    const alFinal = () => {
      if (fase === "form") nombreRef.current?.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: reducido() ? "auto" : "smooth", block: "nearest" });
    };
    if (reducido()) return alFinal();
    const hasta = el.offsetHeight;
    gsap.fromTo(el, { height: desde }, { height: hasta, duration: 0.55, ease: "power3.inOut", clearProps: "height", onComplete: alFinal });
  }, [fase]);

  // "confirmar asistencia" desde el final de la página
  useEffect(() => {
    const abrir = () => {
      panelRef.current?.scrollIntoView({ behavior: reducido() ? "auto" : "smooth", block: "center" });
      setFase((f) => {
        if (f !== "cerrado") return f;
        altoAntes.current = panelRef.current?.offsetHeight ?? null;
        return "form";
      });
    };
    window.addEventListener("rsvp:abrir", abrir);
    return () => window.removeEventListener("rsvp:abrir", abrir);
  }, []);

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;
    const fd = new FormData(e.currentTarget);
    const r: Respuesta = {
      nombre: String(fd.get("nombre") || "").trim(),
      contacto: String(fd.get("contacto") || "").trim(),
      instagram: String(fd.get("instagram") || "").trim(),
      acompanantes: acomp,
    };
    if (!r.nombre) return setError({ texto: "Escribe tu nombre." });
    if (!r.contacto) return setError({ texto: "Déjanos tu WhatsApp o tu correo." });
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch(URL_RSVP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r, evento: EVENTO.clave, sitio: String(fd.get("sitio") || "") }),
      });
      if (res.ok) {
        guardarLocal(r);
        setRespuesta(r);
        cambiar("listo");
        return;
      }
      if ([400, 403, 429].includes(res.status)) {
        const d = await res.json().catch(() => ({}));
        setError({ texto: d.error ? `${d.error}.` : "Revisa tus datos." });
        return;
      }
    } catch {
      /* sin conexión con el admin: abajo se ofrece mandarlo por correo */
    } finally {
      setEnviando(false);
    }
    setError({ texto: "No pudimos guardar tu respuesta.", correo: mailtoRespaldo(r) });
  };

  return (
    <section className="relative w-full min-h-[100svh] bg-blanco text-rojo px-6 md:px-12 pt-6 md:pt-8 pb-10 md:pb-12 flex flex-col">
      <link rel="preload" as="image" href={OBJETOS[0]} />

      <div className="mx-auto w-full max-w-[1400px] flex items-start justify-between gap-6">
        <a href="/" aria-label="Piso ikpali" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Piso ikpali" className="h-10 md:h-12 w-auto" />
        </a>
        <p className="pt-1 text-[10px] tracking-[0.22em] uppercase text-rojo/75 text-right whitespace-nowrap">
          amigos y{NB}familia
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1400px] flex-1 flex items-center py-9 md:py-14">
        <h1 aria-label="Soft opening" className="rv-titulo flex flex-wrap items-baseline">
          <span className="inline-flex items-baseline">
            <span>
              Sof<span className="rv-t">t</span>
            </span>
            <span ref={parRef} className="rv-parentesis" style={{ width: 0 }}>
              <span className="rv-p">(</span>
              <Objetos activo={ciclo} />
              <span className="rv-p">)</span>
            </span>
          </span>
          <span className="basis-full md:basis-auto">opening</span>
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-8 border-t border-rojo/25 pt-7 md:pt-9">
        <div className="md:col-span-7">
          <p
            className="font-medium"
            style={{ fontSize: "clamp(34px, 5.2vw, 76px)", lineHeight: 1.0, letterSpacing: "-0.025em" }}
          >
            Sábado 5
            <br />
            de{NB}diciembre
          </p>
          <p
            className="mt-3 md:mt-4 font-light tabular-nums"
            style={{ fontSize: "clamp(22px, 2.4vw, 34px)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
          >
            {EVENTO.horario}
          </p>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
          <div className="text-[17px] md:text-[19px] leading-snug whitespace-nowrap">
            <p className="font-medium">ffaayyeett</p>
            <p className="font-light">Lafayette 64, Anzures</p>
            <p className="font-light">Ciudad de{NB}México</p>
            <a
              href={EVENTO.mapa}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[13px] font-light underline underline-offset-4 decoration-rojo/40 hover:decoration-rojo"
            >
              cómo llegar ↗
            </a>
          </div>

          <div ref={panelRef} className="rv-panel" id="confirmar">
            {fase === "cerrado" && (
              <button type="button" className="rv-boton" onClick={() => cambiar("form")}>
                sí asistiré <span className="rv-flecha" aria-hidden>→</span>
              </button>
            )}

            {fase === "form" && (
              <form className="rv-form" onSubmit={enviar} noValidate>
                <div className="rv-cabeza">
                  <span>sí asistiré</span>
                  {!respuesta && (
                    <button type="button" className="rv-cerrar" onClick={() => cambiar("cerrado")}>
                      cerrar
                    </button>
                  )}
                </div>
                <label className="rv-campo">
                  <span className="rv-etiqueta">Tu nombre</span>
                  <input ref={nombreRef} name="nombre" autoComplete="name" required maxLength={120} defaultValue={respuesta?.nombre} />
                </label>
                <label className="rv-campo">
                  <span className="rv-etiqueta">WhatsApp o correo</span>
                  <input
                    name="contacto"
                    autoComplete="email"
                    required
                    maxLength={160}
                    defaultValue={respuesta?.contacto}
                  />
                  <span className="rv-nota">Para avisarte si cambia algo.</span>
                </label>
                <div className="rv-campo" role="group" aria-labelledby="rv-acomp">
                  <span className="rv-etiqueta" id="rv-acomp">¿Vienes con alguien?</span>
                  <div className="rv-opciones">
                    {ACOMPANANTES.map(([n, txt]) => (
                      <button
                        key={n}
                        type="button"
                        className={`rv-opcion${acomp === n ? " is-on" : ""}`}
                        aria-pressed={acomp === n}
                        onClick={() => setAcomp(n)}
                      >
                        {txt}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="rv-campo">
                  <span className="rv-etiqueta">Instagram (opcional)</span>
                  <input name="instagram" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={60} placeholder="@" defaultValue={respuesta?.instagram} />
                </label>
                <input name="sitio" className="rv-trampa" tabIndex={-1} autoComplete="off" aria-hidden />

                {error && (
                  <p className="rv-error" role="alert">
                    {error.texto}
                    {error.correo && (
                      <>
                        {" "}
                        <a href={error.correo}>Mándanoslo por{NB}correo</a> y te{NB}anotamos.
                      </>
                    )}
                  </p>
                )}

                <button type="submit" className="rv-enviar" disabled={enviando}>
                  {enviando ? "enviando" : "confirmar"} <span className="rv-flecha" aria-hidden>→</span>
                </button>
                <p className="rv-legal">
                  Solo usamos tus datos para este evento.{" "}
                  <a href="/landing/privacidad">Aviso{NB}de{NB}privacidad</a>
                </p>
              </form>
            )}

            {fase === "listo" && respuesta && (
              <div className="rv-listo grid gap-5" role="status">
                <h3>Listo, {primerNombre(respuesta.nombre)}.</h3>
                <p>
                  Te esperamos el sábado{NB}5 de{NB}diciembre, de{NB}{EVENTO.horario}.
                  {respuesta.acompanantes > 0 && <> Contamos contigo y{NB}con tu{NB}+1.</>}
                </p>
                <div>
                  <span className="rv-etiqueta">Agrégalo a tu calendario</span>
                  <div className="rv-chicos">
                    <a className="rv-chico" href={ICS} download="soft-opening-piso-ikpali.ics">
                      Apple <span aria-hidden>↓</span>
                    </a>
                    <a className="rv-chico" href={GOOGLE} target="_blank" rel="noreferrer">
                      Google <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
                <p className="rv-legal">
                  ¿Cambio de{NB}planes?{" "}
                  <button type="button" className="rv-cerrar" style={{ fontSize: "inherit" }} onClick={() => cambiar("form")}>
                    Cambia tu respuesta
                  </button>{" "}
                  o{NB}escríbenos a{NB}<a href={`mailto:${EVENTO.correo}`}>{EVENTO.correo}</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
