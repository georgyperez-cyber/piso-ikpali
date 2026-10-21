import type { Metadata } from "next";
import Link from "next/link";
import { SITIO } from "@/components/landing/productos";

export const metadata: Metadata = {
  title: "Aviso de privacidad — Piso ikpali",
  description: "Qué datos recibe Piso ikpali a través de su catálogo y para qué los usa.",
};

const parrafos: [string, React.ReactNode][] = [
  [
    "Quién",
    <>
      {SITIO.nombre} es un espacio de ikpali studio, con domicilio en {SITIO.direccion}, {SITIO.ciudad}. Es el responsable de los datos que recibe por esta página.
    </>,
  ],
  [
    "Qué datos",
    <>
      Los que escribes en el formulario cuando te interesa una pieza: tu nombre y un correo o número de WhatsApp para contestarte, y el mensaje que quieras dejar. No pedimos nada más.
    </>,
  ],
  [
    "Para qué",
    <>
      Para responderte sobre la pieza que te interesó, confirmarte disponibilidad y precio, y acordar la entrega o la visita a la tienda. Si nos lo pides, también para avisarte de piezas nuevas.
    </>,
  ],
  [
    "Con quién",
    <>
      Con nadie. Cuando una pieza se vende, la marca que la hizo recibe el dato de la venta, no tus datos de contacto. No vendemos ni cedemos información a terceros.
    </>,
  ],
  [
    "Cuánto tiempo",
    <>
      Mientras haya una conversación abierta contigo. Si quieres que borremos tus datos antes, basta con escribirnos.
    </>,
  ],
  [
    "Tus derechos",
    <>
      Puedes pedirnos acceder, corregir, cancelar u oponerte al uso de tus datos (derechos ARCO) escribiendo a{" "}
      <a href={`mailto:${SITIO.email}`} className="underline underline-offset-4">
        {SITIO.email}
      </a>
      . Te contestamos en un máximo de veinte días hábiles.
    </>,
  ],
  [
    "Cookies",
    <>
      Esta página no usa cookies de rastreo ni publicidad. Guarda un solo dato en tu navegador, y solo durante la visita: que ya viste la animación de entrada.
    </>,
  ],
];

export default function Privacidad() {
  return (
    <main className="min-h-screen bg-blanco text-rojo px-6 md:px-12 py-10 md:py-16">
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/landing"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-rojo/70 hover:text-rojo transition-colors"
        >
          <span aria-hidden>←</span> volver al catálogo
        </Link>

        <h1
          className="mt-16 md:mt-24 font-medium leading-[1.05]"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.02em" }}
        >
          Aviso de privacidad
        </h1>
        <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-rojo/70">
          piso ikpali · octubre 2026
        </p>

        <div className="mt-14 md:mt-20 flex flex-col gap-10 md:gap-12">
          {parrafos.map(([titulo, cuerpo]) => (
            <section key={titulo} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8">
              <h2 className="text-[11px] tracking-[0.18em] uppercase text-rojo/70 md:pt-[5px]">{titulo}</h2>
              <p className="text-[15px] leading-relaxed font-light" style={{ textWrap: "pretty" }}>{cuerpo}</p>
            </section>
          ))}
        </div>

        <p className="mt-20 md:mt-28 text-[11px] tracking-[0.18em] uppercase text-rojo/50">
          {SITIO.direccion} · {SITIO.ciudad}
        </p>
      </div>
    </main>
  );
}
