const MARCAS = [
  "Aventurina",
  "Estela Williams",
  "Estebanez Studio",
  "en_ro",
  "Pulpo y chango",
  "Rio Estudio",
  "Burro",
  "kmy",
  "MOT studio",
  "Paralelo Mexicano",
  "Malfarero",
  "La Casa Ocho",
];

// Lámina de marcas — tipografía grande, roster completo de la selección.
// Reusa el lenguaje del pitch: rojo pleno, Helixa medium, tracking cerrado.
export default function SectionMarcas() {
  return (
    <section className="relative w-full bg-rojo text-blanco py-40 md:py-56 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between mb-14 md:mb-20">
          <p className="text-[11px] tracking-[0.22em] uppercase text-blanco/80">
            la selección · 06
          </p>
          <h2
            className="font-medium"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.015em" }}
          >
            Las marcas
          </h2>
        </div>

        {/* Roster — nombres grandes, en flujo, separados por punto */}
        <div className="flex flex-wrap items-baseline gap-x-6 md:gap-x-10 gap-y-2 md:gap-y-3">
          {MARCAS.map((m, i) => (
            <span key={m} className="inline-flex items-baseline">
              <span
                className="font-medium leading-[0.95]"
                style={{ fontSize: "clamp(30px, 6vw, 104px)", letterSpacing: "-0.03em" }}
              >
                {m}
              </span>
              {i < MARCAS.length - 1 ? (
                <span
                  aria-hidden
                  className="text-blanco/40 font-light px-2 md:px-4"
                  style={{ fontSize: "clamp(24px, 4vw, 76px)" }}
                >
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <p className="mt-16 md:mt-24 font-light text-[15px] md:text-[18px] leading-relaxed max-w-2xl text-blanco/90">
          Doce estudios y autores que hoy conviven dentro del imaginario de Piso ikpali —
          la selección con la que llegamos a la casa.
        </p>
      </div>
    </section>
  );
}
