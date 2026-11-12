import Img from "./Img";

// Proyectos que conviven en ffaayyeett. Lo usan SectionSoftOpening (/fayet) y
// SectionFayet (home).
// Logos: SVG en el rojo de Piso ikpali (#ed3424) dentro de public/fayet-logos/.
// `alto` es la altura del logo en desktop; se ajusta a ojo para que pesen igual.
// Sin logo, se muestra el nombre en tipografía.

type Proyecto = { nombre: string; nota: string; logo?: string; alto?: number };

export const PROYECTOS: Proyecto[] = [
  { nombre: "Goya Taller", nota: "cocina · panadería · comedor", logo: "/fayet-logos/goya-taller.svg", alto: 76 },
  { nombre: "Com Com Com", nota: "sound bar", logo: "/fayet-logos/com-com-com.svg", alto: 32 },
  { nombre: "Galería Ajena", nota: "galería", logo: "/fayet-logos/galeria-ajena.svg", alto: 54 },
  { nombre: "Punto Ácido", nota: "showroom editorial", logo: "/fayet-logos/punto-acido.svg", alto: 28 },
  { nombre: "Román de Castro", nota: "estudio creativo" },
];

export default function ProyectosCasa() {
  return (
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
  );
}
