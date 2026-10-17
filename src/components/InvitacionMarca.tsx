import type { Metadata } from "next";
import HolaMarca from "@/components/HolaMarca";
import SectionTextura from "@/components/SectionTextura";
import Img from "@/components/Img";

// Invitación al Comité ikpali (sábado 24 de octubre): el arranque comercial de
// piso ikpali, abierto a las marcas para que vean el montaje y opinen.
// Con `marca`: la versión para cada marca participante (rutas /burro, /kmy...).
// Sin `marca`: la versión general, para todas las marcas (/soft-opening).
// Sustituye a CartaMarca (la carta de bienvenida de la fase 2) en las rutas
// por marca. CartaMarca se queda en el repo por si se necesita de nuevo.

const NB = " "; // espacio duro: evita palabras cortas o viudas al final de línea

const FECHA = `Sábado 24 de${NB}octubre`;
const HORARIO = "14:00 a 16:00 h";
const MAPA =
  "https://www.google.com/maps/search/?api=1&query=Lafayette+64,+Anzures,+Ciudad+de+M%C3%A9xico";

export function metadataInvitacion(marca: string): Metadata {
  return {
    title: `Hola, ${marca} · Comité ikpali`,
    description:
      "Una invitación al Comité ikpali. Sábado 24 de octubre, de 14:00 a 16:00 h.",
    robots: { index: false, follow: false },
  };
}

export const metadataGeneral: Metadata = {
  title: "Comité ikpali · piso ikpali",
  description:
    "Una invitación al Comité ikpali. Sábado 24 de octubre, de 14:00 a 16:00 h, en Fayet.",
};

const GRACIAS = (
  <>
    Gracias por su{NB}paciencia. Han sido meses de{NB}mucho trabajo de{NB}nuestra
    parte y{NB}agradecemos que{NB}hayan estado a{NB}nuestro lado en este{NB}camino.
  </>
);

export default function InvitacionMarca({ marca }: { marca?: string }) {
  return (
    <main className="bg-blanco text-rojo">
      {marca ? (
        <HolaMarca
          marca={marca}
          etiqueta={`una invitación para ${marca}`}
          mensaje={GRACIAS}
        />
      ) : (
        <HolaMarca
          saludo="Comité"
          marca="ikpali"
          arriba={`sábado 24 de${NB}octubre`}
          etiqueta=""
          mensaje={GRACIAS}
        />
      )}

      <SectionTextura textura={2} iconoRojo={3} />

      {/* La invitación */}
      <section className="relative w-full bg-rojo text-blanco px-6 md:px-12 py-32 md:py-48">
        <div className="mx-auto max-w-[1400px]">
          <p
            className="font-light text-pretty max-w-3xl"
            style={{ fontSize: "clamp(22px, 2.6vw, 36px)", lineHeight: 1.25, letterSpacing: "-0.01em" }}
          >
            Es un placer invitarlos al{" "}
            <em className="not-italic font-medium">Comité{NB}ikpali</em>.
          </p>

          <h2
            className="mt-12 md:mt-16 font-medium text-balance"
            style={{ fontSize: "clamp(52px, 10vw, 156px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
          >
            {FECHA}
          </h2>
          <p
            className="mt-5 md:mt-8 font-medium tabular-nums"
            style={{ fontSize: "clamp(28px, 4.2vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            {HORARIO}
          </p>

          <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
            <div className="md:col-span-6 flex flex-col gap-5 font-light text-[16px] md:text-[19px] leading-relaxed text-pretty max-w-xl">
              <p>
                Con el Comité arranca la actividad comercial de{NB}piso{NB}ikpali: a{NB}partir
                de{NB}ese sábado sus piezas ya están a{NB}la{NB}venta.
              </p>
              <p>
                Pero lo que más nos importa es que{NB}vengan, vean cómo{NB}quedó montado
                el espacio y{NB}nos digan qué{NB}opinan. Desde{NB}el{NB}principio hablamos de
                hacer esto juntos, y{NB}esta es nuestra manera de{NB}escucharlos.
              </p>
            </div>
            <a
              href={MAPA}
              target="_blank"
              rel="noreferrer"
              className="md:col-span-4 md:col-start-9 text-[16px] md:text-[19px] leading-relaxed hover:underline"
            >
              <span className="font-medium">Fayet, Lafayette 64</span>
              <br />
              <span className="font-light">Anzures, Ciudad de México</span>
            </a>
          </div>
        </div>
      </section>

      {/* Firma */}
      <section className="relative w-full bg-blanco px-6 md:px-12 py-28 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <p
            className="text-rojo font-light tracking-tight"
            style={{ fontSize: "clamp(24px, 3.4vw, 44px)", lineHeight: 1.25, letterSpacing: "-0.015em" }}
          >
            Los esperamos.
          </p>
          <p className="mt-10 text-[13px] tracking-[0.22em] uppercase text-rojo/70">
            Nathalia &amp; Georgy · piso ikpali
          </p>
        </div>
      </section>

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
              Fayet
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
    </main>
  );
}
