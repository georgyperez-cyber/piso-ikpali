import Img from "./Img";

const REFERENTES = [
  {
    nombre: "Tienda de Tetlán",
    nota: "Selección de objeto mexicano contemporáneo, Guadalajara.",
  },
  {
    nombre: "Casa Bosques",
    nota: "Librería + objeto curado en Roma, CDMX. Editorial, no decorativo.",
  },
  {
    nombre: "Gift shops · Jumex · Tamayo · MUAC",
    nota: "Diseño legitimado por una institución cultural detrás.",
  },
];

export default function SectionEspacios() {
  return (
    <section className="relative w-full bg-blanco pt-32 md:pt-44 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-20">
          <div className="md:col-span-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              referentes · 09
            </p>
            <h2
              className="text-rojo font-medium leading-[1.02]"
              style={{ fontSize: "clamp(34px, 5vw, 72px)", letterSpacing: "-0.02em" }}
            >
              Quiénes nos preceden.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex items-end">
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              El mercado de objeto doméstico curado en México ya tiene referentes que
              validan el modelo. Piso ikpali ocupa un espacio propio entre diseño emergente,
              presencia continua, criterio editorial y selección que responde a un imaginario
              específico.
            </p>
          </div>
        </div>

        {/* Planta + elevaciones sketch as visual reference, referentes annotated alongside */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch pb-12 md:pb-16">
          <figure className="md:col-span-8 flex flex-col">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Img
                src="/assets-optimized/plano-1-1600.webp"
                alt="Planta y elevaciones del espacio"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <figcaption className="mt-4 text-[10px] tracking-[0.22em] uppercase text-rojo/55">
              boceto · planta + elevaciones
            </figcaption>
          </figure>

          <ol className="md:col-span-4 flex flex-col self-start gap-6 md:gap-7">
            {REFERENTES.map((r, i) => (
              <li
                key={r.nombre}
                className={`flex flex-col gap-2 ${
                  i > 0 ? "pt-6 md:pt-7 border-t border-rojo/20" : ""
                }`}
              >
                <span className="text-[11px] tracking-[0.22em] uppercase text-rojo/60 tabular-nums">
                  ref · 0{i + 1}
                </span>
                <h3
                  className="text-rojo font-medium tracking-tight leading-[1.1]"
                  style={{ fontSize: "clamp(18px, 1.6vw, 24px)", letterSpacing: "-0.015em" }}
                >
                  {r.nombre}
                </h3>
                <p className="text-rojo/75 font-light text-[13px] md:text-[14px] leading-snug max-w-[32ch]">
                  {r.nota}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
