import Img from "./Img";

const BLOQUES = [
  {
    titulo: "Fayet como contexto",
    texto:
      "Fayet reúne moda, joyería, perfumería, arquitectura, gastronomía y diseño bajo un mismo techo. Piso ikpali entra en esa conversación como la voz del objeto doméstico contemporáneo.",
  },
  {
    titulo: "Espacio físico",
    texto:
      "Un piso dedicado dentro de Fayet, montado como sala doméstica curada. Lo que se ve, se puede comprar. Lo que se compra, se reemplaza por algo nuevo dentro del mismo imaginario.",
  },
  {
    titulo: "Digital",
    texto:
      "Una presencia editorial discreta — Instagram, web y materiales impresos — diseñada para sostener la marca, no para sustituir el espacio. La compra ocurre habitando.",
  },
  {
    titulo: "Activaciones",
    texto:
      "Lanzamientos, conversaciones, cenas, presentaciones de marca. El calendario de Fayet convoca; Piso ikpali aprovecha esa agenda sin tener que producirla.",
  },
];

const FOTOS = [
  {
    src: "/assets-optimized/fachada-1200.webp",
    srcSet:
      "/assets-optimized/fachada-720.webp 720w, /assets-optimized/fachada-1200.webp 1200w, /assets-optimized/fachada-1800.webp 1800w",
    alt: "Fachada de Piso ikpali: ventana con el nombre y el interior iluminado",
    caption: "foto · la fachada",
  },
  {
    src: "/assets-optimized/foto-tienda-2-1086.webp",
    srcSet:
      "/assets-optimized/foto-tienda-2-720.webp 720w, /assets-optimized/foto-tienda-2-1086.webp 1086w",
    alt: "Interior de Piso ikpali: repisas con piezas, mesa verde y silla de madera",
    caption: "foto · el interior",
  },
];

// Nota de M de Milenio sobre la casa (10 nov 2026).
const NOTA_MILENIO =
  "https://mrevistademilenio.com/ffaayyeett-espacio-cultural-anzures-cdmx/";

export default function SectionFayet() {
  return (
    <section className="relative w-full bg-blanco py-44 md:py-60 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24">
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">contexto · 05</p>
            <h2
              className="text-rojo font-medium leading-[1.05]"
              style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "-0.015em" }}
            >
              Dónde vive
              <br />
              Piso ikpali.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 flex flex-col justify-end items-start gap-6">
            <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
              Piso ikpali opera dentro de <em className="not-italic font-medium">Fayet</em>, un hub creativo en la Ciudad de México encabezado por Goya Taller. El espacio no define la marca, pero la amplifica: una audiencia que ya existe, una agenda que ya pasa, un contexto que ninguna tienda independiente puede fabricar sola.
            </p>
            <a
              href={NOTA_MILENIO}
              target="_blank"
              rel="noreferrer"
              className="self-start inline-flex items-center gap-2 text-rojo font-medium text-[14px] md:text-[15px] underline underline-offset-4 decoration-rojo/40 hover:decoration-rojo transition-colors"
            >
              ffaayyeett en M de Milenio
              <span aria-hidden className="inline-block">↗</span>
            </a>
          </div>
        </div>

        {/* Fotos del espacio (fachada e interior) y abajo los 4 bloques en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
          {FOTOS.map((f) => (
            <figure key={f.src} className="flex flex-col">
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Img
                  src={f.src}
                  srcSet={f.srcSet}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={f.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-[10px] tracking-[0.22em] uppercase text-rojo/55">
                {f.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
          {BLOQUES.map((b, i) => (
            <article key={b.titulo} className="flex flex-col gap-2">
              <span className="text-[11px] tracking-[0.22em] uppercase text-rojo/60 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-rojo font-medium text-[17px] md:text-[19px] tracking-tight leading-tight">
                {b.titulo}
              </h3>
              <p className="text-rojo/80 font-light text-[13px] md:text-[14px] leading-snug">
                {b.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
