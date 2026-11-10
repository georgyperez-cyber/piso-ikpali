import Img from "./Img";

// Una muestra de la selección, no el catálogo completo. 40 piezas para que la
// retícula cierre pareja en 4, 5 y 8 columnas.
const TOTAL = 40;
const PIEZAS = Array.from({ length: TOTAL }, (_, i) => i + 1);

export default function SectionProductos() {
  return (
    <section className="relative w-full bg-blanco py-28 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70">
            en piso
          </p>
          <h2
            className="text-rojo font-medium text-balance"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            Algunas piezas de nuestra selección
          </h2>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-px bg-rojo/15">
          {PIEZAS.map((n) => (
            <div
              key={n}
              className="relative aspect-square bg-blanco flex items-center justify-center p-3 md:p-4"
            >
              <Img
                src={`/assets-optimized/hero-icono-foto-${n}-480.webp`}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
