import type { Metadata } from "next";
import RsvpHero from "@/components/rsvp/RsvpHero";
import BotonConfirmar from "@/components/rsvp/BotonConfirmar";
import ProyectosCasa from "@/components/ProyectosCasa";
import Img from "@/components/Img";

// Invitación al soft opening (friends & family) del sábado 5 de diciembre de 2026, con su RSVP.
// Las confirmaciones caen en el admin: pisoikpali.com/admin → RSVP.
// /soft-opening y /rsvp redirigen aquí (next.config.ts).

const NB = " ";

// Ninguna línea termina en palabra corta (a, de, el, la, y, que…): se amarra a la siguiente con espacio duro.
// Los nombres de dos palabras tampoco se separan.
const CORTAS = /(?<=^|[\s ])(a|al|de|del|el|en|es|la|las|lo|los|y|o|que|con|por|se|un|una|su|tu|mi|ni)\s(?=\S|$)/gi;
const amarrar = (t: string) =>
  t.replace(CORTAS, `$1${NB}`).replace(/Piso ikpali/g, `Piso${NB}ikpali`).replace(/Goya Taller/g, `Goya${NB}Taller`);

export const metadata: Metadata = {
  metadataBase: new URL("https://pisoikpali.com"),
  title: "Soft opening · Piso ikpali",
  description: "Sábado 5 de diciembre, de 11:00 a 16:00 h, en ffaayyeett (Lafayette 64, Anzures). Confirma tu asistencia.",
  openGraph: {
    title: "Soft opening · Piso ikpali",
    description: "Sábado 5 de diciembre, de 11:00 a 16:00 h, en ffaayyeett. Confirma tu asistencia.",
    url: "/softopening",
    siteName: "Piso ikpali",
    locale: "es_MX",
    type: "website",
  },
  robots: { index: false, follow: false },
};

// Un solo párrafo: en bandera en el teléfono (columna angosta) y justificado en escritorio, donde la medida da para eso
const P = "rv-parrafo font-light text-[17px] md:text-[19px] leading-[1.45]";

export default function SoftOpeningPage() {
  return (
    <main className="bg-blanco text-rojo">
      <RsvpHero />

      {/* La invitación */}
      <section className="relative w-full bg-blanco px-6 md:px-12 pt-24 md:pt-40 pb-24 md:pb-36">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-12">
          <div className="md:col-span-5">
            <Img
              src="/assets-optimized/fachada-1200.webp"
              srcSet="/assets-optimized/fachada-720.webp 720w, /assets-optimized/fachada-1200.webp 1200w, /assets-optimized/fachada-1800.webp 1800w"
              sizes="(min-width: 768px) 40vw, 100vw"
              alt="La fachada de Piso ikpali en Lafayette 64"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-end max-w-[580px]">
            <p className={P}>
              {amarrar("Queremos invitarte al soft opening de Piso ikpali, el espacio de diseño doméstico mexicano que armamos dentro de ")}
              <span className="font-medium">ffaayyeett</span>
              {amarrar(". Es la primera vez que lo abrimos a amigos y familia, y nos encantaría que vinieras a conocerlo. Ese mismo día se presenta ")}
              <span className="font-medium">ffaayyeett</span>
              {amarrar(", la casa cultural encabezada por Goya Taller, junto con los proyectos que conviven en ella.")}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] mt-20 md:mt-28">
          <ProyectosCasa />
        </div>
      </section>

      {/* Firma */}
      <section className="relative w-full bg-blanco px-6 md:px-12 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-24 md:pt-32 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div>
            <p
              className="font-light"
              style={{ fontSize: "clamp(34px, 5.2vw, 76px)", lineHeight: 1.0, letterSpacing: "-0.025em" }}
            >
              Te esperamos.
            </p>
            <p className="mt-8 text-[12px] md:text-[13px] tracking-[0.22em] uppercase text-rojo/75">
              Nathalia &amp; Georgy · piso{NB}ikpali
            </p>
          </div>
          <BotonConfirmar />
        </div>
      </section>

      <footer className="bg-blanco text-rojo px-6 md:px-12 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-16 md:pt-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">correo</p>
            <a href="mailto:hola@pisoikpali.com" className="text-rojo font-medium text-[15px] hover:underline">
              hola@pisoikpali.com
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">instagram</p>
            <a
              href="https://instagram.com/piso.ikpali"
              target="_blank"
              rel="noreferrer"
              className="text-rojo font-medium text-[15px] hover:underline"
            >
              @piso.ikpali
            </a>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-[10px] tracking-[0.22em] uppercase text-rojo/60 mb-3">ubicación</p>
            <p className="text-rojo font-medium text-[15px] whitespace-nowrap">ffaayyeett, Lafayette{NB}64, Anzures</p>
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
    </main>
  );
}
