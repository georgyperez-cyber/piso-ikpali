import Img from "./Img";

// /fayet · soft opening (friends & family) del 5 de diciembre de 2026, antes del
// manifiesto. Abajo, los proyectos que conviven en Fayet.
//
// Logos: guarda cada SVG en public/fayet-logos/ y pon la ruta en `logo`
// (p. ej. "/fayet-logos/goya-taller.svg"). Mientras no haya logo, se muestra el
// nombre en tipografía.

type Proyecto = { nombre: string; nota: string; logo?: string };

const PROYECTOS: Proyecto[] = [
  { nombre: "Goya Taller", nota: "cocina · panadería · comedor" },
  { nombre: "Com Com Com", nota: "sound bar" },
  { nombre: "Galería Ajena", nota: "galería de diseño" },
  { nombre: "Punto Ácido", nota: "showroom editorial" },
  { nombre: "Román de Castro", nota: "estudio creativo" },
];

const P = "text-rojo font-light text-[16px] md:text-[19px] leading-relaxed text-pretty";

export default function SectionSoftOpening() {
  return (
    <section className="relative w-full bg-blanco pt-28 md:pt-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 md:mb-20">
          <div className="md:col-span-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              soft opening · friends &amp; family
            </p>
            <h2
              className="text-rojo font-medium leading-[1.0]"
              style={{ fontSize: "clamp(38px, 5.8vw, 86px)", letterSpacing: "-0.02em" }}
            >
              Sábado 5
              <br />
              de diciembre.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-5">
            <p className={P}>
              El sábado 5 de diciembre de 2026, de 13:00 a 17:00&nbsp;h (horario por confirmar),
              Piso ikpali abre sus puertas con un soft opening para amigos y familia. Es nuestra
              presentación al público como el punto comercial de{" "}
              <em className="not-italic font-medium">Fayet</em>, la casa cultural encabezada por
              Goya Taller.
            </p>
            <p className={P}>
              Esa misma tarde se presenta Fayet como proyecto, junto a las propuestas que conviven
              en la casa: Goya Taller, Com Com Com, Galería Ajena, Punto Ácido, Román de Castro
              y&nbsp;más.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-5 md:gap-x-8 border-t border-rojo/20">
          {PROYECTOS.map((p) => (
            <li
              key={p.nombre}
              className="flex items-baseline justify-between gap-4 py-5 border-b border-rojo/15 md:flex-col md:items-start md:justify-start md:gap-3 md:pt-7 md:pb-0 md:border-b-0"
            >
              {p.logo ? (
                <Img src={p.logo} alt={p.nombre} className="h-7 md:h-9 w-auto" />
              ) : (
                <span
                  className="text-rojo font-medium leading-none tracking-tight"
                  style={{ fontSize: "clamp(20px, 1.9vw, 27px)", letterSpacing: "-0.015em" }}
                >
                  {p.nombre}
                </span>
              )}
              <span className="text-[10px] tracking-[0.22em] uppercase text-rojo/55 text-right md:text-left">
                {p.nota}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
