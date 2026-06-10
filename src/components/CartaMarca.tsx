import HolaMarca from "@/components/HolaMarca";
import SectionTextura from "@/components/SectionTextura";
import Img from "@/components/Img";

const ICON = "inline-block align-[-0.18em] mx-2 md:mx-3 h-[0.85em] w-auto select-none";

const FASE2 = [
  {
    titulo: "Selección de piezas",
    texto:
      "Revisamos juntos la selección específica de piezas que nos interesan de tu catálogo y afinamos cuáles entran al arranque.",
  },
  {
    titulo: "Logística",
    texto:
      "Aterrizamos tiempos de entrega y el registro de inventario de cada pieza que se incorpora al piso.",
  },
  {
    titulo: "Montaje",
    texto:
      "Es el momento de pasar de la idea al montaje: tus piezas, dispuestas dentro del espacio curado.",
  },
];

export default function CartaMarca({ marca }: { marca: string }) {
  return (
    <main className="bg-blanco text-rojo">
      <HolaMarca marca={marca} />

      {/* Manifiesto — la bienvenida formal, con iconos como glifos */}
      <section className="relative w-full bg-blanco py-40 md:py-64 px-6 md:px-12 overflow-hidden">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-12">
            bienvenida · 00
          </p>
          <h2
            className="text-rojo font-medium leading-[1.18] tracking-tight"
            style={{ fontSize: "clamp(32px, 6vw, 80px)", letterSpacing: "-0.01em" }}
          >
            A partir de hoy, {marca} forma
            <Img src="/assets-optimized/hero-icono-negro-4-600.webp" alt="" className={ICON} />
            parte de la selección
            <Img src="/assets-optimized/hero-icono-negro-1-600.webp" alt="" className={ICON} />
            oficial de marcas
            <Img src="/assets-optimized/hero-icono-negro-6-600.webp" alt="" className={ICON} />
            participantes.
          </h2>
        </div>
      </section>

      <SectionTextura textura={2} iconoRojo={3} caption="bienvenida" />

      {/* 01 — la junta */}
      <section className="relative w-full bg-blanco py-32 md:py-48 px-6 md:px-12">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              junta · 01
            </p>
            <h2
              className="text-rojo font-medium leading-[1.05]"
              style={{ fontSize: "clamp(34px, 5vw, 68px)", letterSpacing: "-0.015em" }}
            >
              De dónde
              <br />
              venimos.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 flex items-end">
            <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
              En nuestra primera junta tuvimos el gusto de presentarnos y repasar
              juntos el contenido del <em className="not-italic font-medium">pitch deck</em>,
              además de resolver dudas generales. Escuchamos tus comentarios y tomamos
              en consideración cada una de tus aportaciones.
            </p>
          </div>
        </div>
      </section>

      <SectionTextura textura={4} iconoRojo={6} caption="lo que sigue" />

      {/* 02 — Fase 2 / lo que sigue */}
      <section className="relative w-full bg-blanco py-32 md:py-48 px-6 md:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24">
            <div className="md:col-span-5">
              <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
                fase 2 · 02
              </p>
              <h2
                className="text-rojo font-medium leading-[1.05]"
                style={{ fontSize: "clamp(36px, 5.4vw, 76px)", letterSpacing: "-0.015em" }}
              >
                Lo que
                <br />
                sigue.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
                En el siguiente paso entramos en lo concreto. Es el momento de pasar
                de la idea al montaje — afinamos juntos qué piezas entran al arranque
                y aterrizamos la logística.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-12 border-t border-rojo/15 pt-12 md:pt-16">
            {FASE2.map((b, i) => (
              <article key={b.titulo} className="flex flex-col gap-3">
                <span className="text-[11px] tracking-[0.22em] uppercase text-rojo/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-rojo font-medium text-[19px] md:text-[22px] tracking-tight leading-tight">
                  {b.titulo}
                </h3>
                <p className="text-rojo/80 font-light text-[14px] md:text-[15px] leading-snug">
                  {b.texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionTextura textura={6} iconoRojo={1} caption="el cierre" />

      {/* 03 — cierre (bloque rojo) */}
      <section className="relative w-full bg-blanco">
        <div className="relative overflow-hidden bg-rojo text-blanco py-36 md:py-52 px-6 md:px-12 select-none">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[11px] tracking-[0.22em] uppercase text-blanco/80 mb-12 md:mb-16">
              cierre · 03
            </p>
            <h2
              className="font-medium leading-[1.05] mb-12 tracking-tight"
              style={{ fontSize: "clamp(44px, 9vw, 140px)", letterSpacing: "-0.025em" }}
            >
              Hablamos pronto.
            </h2>
            <p className="font-light text-[15px] md:text-[19px] leading-relaxed max-w-2xl text-blanco/95">
              Los estaremos contactando pronto para coordinar la segunda junta. El
              siguiente paso formal, una vez alineados en piezas y términos, es la{" "}
              <em className="not-italic font-medium">carta de consignación y acuerdo
              legal</em>{" "}— un acuerdo corto y transparente que deja todo por escrito
              antes de la entrega.
            </p>
          </div>
        </div>
      </section>

      {/* Firma + footer */}
      <section className="relative w-full bg-blanco px-6 md:px-12 py-28 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <p
            className="text-rojo font-light leading-[1.25] tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(24px, 3.4vw, 44px)", letterSpacing: "-0.015em" }}
          >
            Gracias de nuevo. Nos da mucho gusto que {marca} sea parte de esta
            conversación.
          </p>
          <p className="mt-10 text-[13px] tracking-[0.22em] uppercase text-rojo/70">
            Nathalia &amp; Georgy — Piso Ikpali
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
    </main>
  );
}
