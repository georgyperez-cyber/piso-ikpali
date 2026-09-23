import Img from "./Img";

const RENDERS = [
  {
    src: "/assets-optimized/render-tienda-1-1400.webp",
    srcSet:
      "/assets-optimized/render-tienda-1-800.webp 800w, /assets-optimized/render-tienda-1-1400.webp 1400w",
    alt: "Render del local: exhibición con vista a la calle",
    caption: "render 01 · el local",
  },
  {
    src: "/assets-optimized/render-tienda-2-1400.webp",
    srcSet:
      "/assets-optimized/render-tienda-2-800.webp 800w, /assets-optimized/render-tienda-2-1400.webp 1400w",
    alt: "Render del local: muro de madera, mesa y obra colgada",
    caption: "render 02 · el local",
  },
];

// Boletín informativo para las marcas: actualización sobre la apertura.
// Va al inicio del pitch de Fayet: quien vuelve al link lo ve primero.
// Orden: boletín, renders, y después el texto introductorio (SectionIntro).
export default function SectionAvisoObra() {
  return (
    <section className="relative w-full bg-blanco pt-28 md:pt-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 md:mb-20">
          <div className="md:col-span-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              boletín · septiembre 2026
            </p>
            <h2
              className="text-rojo font-medium leading-[1.0]"
              style={{ fontSize: "clamp(38px, 5.8vw, 86px)", letterSpacing: "-0.02em" }}
            >
              Boletín informativo
              <br />
              importante
            </h2>
            <p className="mt-6 text-rojo/80 font-light text-[15px] md:text-[17px] leading-snug max-w-md">
              Actualización sobre la apertura del Concept Store
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-5">
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Queridas marcas:
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Antes que nada, gracias por su paciencia durante estas semanas.
              Nos da gusto compartirles que la problemática estructural que
              estábamos atendiendo en el espacio ya fue solucionada, y las
              actividades programadas de la obra se han reanudado. Con esto,
              estimamos comenzar actividades en tienda en aproximadamente dos
              semanas a partir de hoy.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              La fecha del opening oficial al público, al que por supuesto estarán
              invitadas, sigue por definir, pero nuestro objetivo es arrancar la
              actividad en Piso Ikpali en ese plazo. Les recordamos que sus piezas
              se encuentran resguardadas en almacén hasta que el espacio esté listo
              para su instalación. Una vez más, gracias por su confianza; les
              mantendremos al tanto de cualquier novedad.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Con cariño,
            </p>
            <p className="text-rojo font-medium text-[15px] md:text-[16px] leading-relaxed">
              Nathalia y Georgie
              <br />
              Piso Ikpali
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-4">
          {RENDERS.map((r) => (
            <figure key={r.src} className="flex flex-col">
              <div className="relative w-full aspect-[5/4] overflow-hidden">
                <Img
                  src={r.src}
                  srcSet={r.srcSet}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={r.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-[10px] tracking-[0.22em] uppercase text-rojo/55">
                {r.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
