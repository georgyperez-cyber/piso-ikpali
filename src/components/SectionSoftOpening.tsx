import Img from "./Img";

// /fayet · soft opening (friends & family) del 5 de diciembre de 2026, antes del
// manifiesto. Abajo, los proyectos que conviven en ffaayyeett.
//
// Logos: SVG en el rojo de Piso ikpali (#ed3424) dentro de public/fayet-logos/.
// `alto` es la altura del logo en desktop; se ajusta a ojo para que pesen igual.
// Sin logo, se muestra el nombre en tipografía.

type Proyecto = { nombre: string; nota: string; logo?: string; alto?: number };

const PROYECTOS: Proyecto[] = [
  { nombre: "Goya Taller", nota: "cocina · panadería · comedor", logo: "/fayet-logos/goya-taller.svg", alto: 76 },
  { nombre: "Com Com Com", nota: "sound bar", logo: "/fayet-logos/com-com-com.svg", alto: 32 },
  { nombre: "Galería Ajena", nota: "galería de diseño", logo: "/fayet-logos/galeria-ajena.svg", alto: 54 },
  { nombre: "Punto Ácido", nota: "showroom editorial", logo: "/fayet-logos/punto-acido.svg", alto: 28 },
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
              El sábado 5 de diciembre de 2026, de 11:00 a 16:00&nbsp;h, Piso ikpali abre sus
              puertas con un soft opening para amigos y familia. Es nuestra presentación al
              público como el punto comercial de{" "}
              <em className="not-italic font-medium">ffaayyeett</em>, la casa cultural encabezada
              por Goya Taller.
            </p>
            <p className={P}>
              Esa misma tarde se presenta ffaayyeett como proyecto, junto a las propuestas que
              conviven en la casa: Goya Taller, Com Com Com, Galería Ajena, Punto Ácido, Román de
              Castro y&nbsp;más.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-5 md:gap-x-8 border-t border-rojo/20">
          {PROYECTOS.map((p) => (
            <li
              key={p.nombre}
              className="flex items-center justify-between gap-4 py-5 border-b border-rojo/15 md:flex-col md:items-start md:justify-start md:gap-4 md:pt-8 md:pb-0 md:border-b-0"
            >
              <div className="flex items-center md:items-end md:h-[76px]">
                {p.logo ? (
                  <Img
                    src={p.logo}
                    alt={p.nombre}
                    className="w-auto max-w-[60vw] md:max-w-full"
                    style={{ height: `clamp(${Math.round((p.alto ?? 40) * 0.72)}px, ${((p.alto ?? 40) / 14.4).toFixed(2)}vw, ${p.alto}px)` }}
                  />
                ) : (
                  <span
                    className="text-rojo font-medium leading-none tracking-tight"
                    style={{ fontSize: "clamp(20px, 1.9vw, 27px)", letterSpacing: "-0.015em" }}
                  >
                    {p.nombre}
                  </span>
                )}
              </div>
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
