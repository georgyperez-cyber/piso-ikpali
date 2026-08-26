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

// Aviso de recorrido de fecha por la reparación estructural del edificio.
// Va al inicio del pitch de Fayet: quien vuelve al link lo ve primero.
export default function SectionAvisoObra() {
  return (
    <section className="relative w-full bg-blanco pt-28 md:pt-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 md:mb-20">
          <div className="md:col-span-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              aviso · agosto 2026
            </p>
            <h2
              className="text-rojo font-medium leading-[1.0]"
              style={{ fontSize: "clamp(38px, 5.8vw, 86px)", letterSpacing: "-0.02em" }}
            >
              Una pausa antes
              <br />
              de abrir.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-5">
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              En los últimos días se presentó un siniestro estructural en la
              propiedad que requiere atención y pausar las actividades para
              finalizar el local. Esto se interpone con la fecha original estimada
              de apertura al público, de principios a mediados de septiembre.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Esta situación se encuentra fuera de nuestras manos, pero nos
              encontramos haciendo todo lo posible, en conjunto con la
              administración del inmueble, para darle una solución y concluir el
              programa arquitectónico a la brevedad.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Solicitamos su comprensión y paciencia con este retraso. Serán
              notificados cuando hayamos concluido estas actividades.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              La entrega de inventario continuará como fue programada y los
              productos serán almacenados en un espacio de almacén para mantener
              su integridad y seguridad bajo nuestro cuidado.
            </p>
            <p className="text-rojo font-light text-[15px] md:text-[16px] leading-relaxed">
              Agradecemos la confianza. En caso de dudas, estamos a su
              disposición.
            </p>
            <p className="text-rojo font-medium text-[15px] md:text-[16px] leading-relaxed">
              — Nathalia y Georgie
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
