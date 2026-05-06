import Img from "./Img";

const BLOQUES = [
  {
    titulo: "Asamblea como contexto",
    texto:
      "Asamblea reúne moda, joyería, perfumería, arquitectura, gastronomía y diseño bajo un mismo techo. Piso ikpali entra en esa conversación como la voz del objeto doméstico contemporáneo.",
  },
  {
    titulo: "Espacio físico",
    texto:
      "Un piso dedicado dentro de Asamblea, montado como sala doméstica curada. Lo que se ve, se puede comprar. Lo que se compra, se reemplaza por algo nuevo dentro del mismo imaginario.",
  },
  {
    titulo: "Digital",
    texto:
      "Una presencia editorial discreta — Instagram, web y materiales impresos — diseñada para sostener la marca, no para sustituir el espacio. La compra ocurre habitando.",
  },
  {
    titulo: "Activaciones",
    texto:
      "Lanzamientos, conversaciones, cenas, presentaciones de marca. El calendario de Asamblea convoca; Piso ikpali aprovecha esa agenda sin tener que producirla.",
  },
];

export default function SectionAsamblea() {
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
          <div className="md:col-span-7 md:col-start-6 flex items-end">
            <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
              Piso ikpali opera dentro de <em className="not-italic font-medium">Asamblea</em>, un hub creativo en la Ciudad de México encabezado por Goya Taller. El espacio no define la marca, pero la amplifica: una audiencia que ya existe, una agenda que ya pasa, un contexto que ninguna tienda independiente puede fabricar sola.
            </p>
          </div>
        </div>

        {/* Turntable on the left, 4 bloques in a 2×2 grid on the right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <figure className="md:col-span-7 flex flex-col">
            <div className="relative w-full aspect-square">
              <Img
                src="/sketch-turntable.gif"
                alt="Vista isométrica del espacio en rotación"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <figcaption className="mt-4 text-[10px] tracking-[0.22em] uppercase text-rojo/55">
              boceto · vista en rotación
            </figcaption>
          </figure>

          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-12">
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
      </div>
    </section>
  );
}
