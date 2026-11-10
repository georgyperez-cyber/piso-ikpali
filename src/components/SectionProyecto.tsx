import Img from "./Img";

// /fayet · el proyecto. Texto de presentación de Piso ikpali, cierre con el
// agradecimiento y, abajo, la fachada con los dos renders del local.
// Las tres imágenes van en el mismo formato (cuadrado): la fachada grande a la
// izquierda y los renders apilados a la derecha. El ancho de la columna derecha
// se calcula para que la fachada y el segundo render terminen a la misma altura:
// (100% - 48px de columna - 48px de fila - 28px de pie de foto en desktop) / 3.

type Foto = { src: string; srcSet: string; alt: string; caption: string; pos: string };

const FACHADA: Foto = {
  src: "/assets-optimized/foto-tienda-1-1086.webp",
  srcSet:
    "/assets-optimized/foto-tienda-1-720.webp 720w, /assets-optimized/foto-tienda-1-1086.webp 1086w",
  alt: "Fachada de Piso ikpali: ventana con el nombre y el interior iluminado",
  caption: "foto · la fachada",
  pos: "center 75%",
};

const RENDERS: Foto[] = [
  {
    src: "/assets-optimized/render-tienda-1-1400.webp",
    srcSet:
      "/assets-optimized/render-tienda-1-800.webp 800w, /assets-optimized/render-tienda-1-1400.webp 1400w",
    alt: "Render del local: exhibición con vista a la calle",
    caption: "render · vista a la calle",
    pos: "45% center",
  },
  {
    src: "/assets-optimized/render-tienda-2-1400.webp",
    srcSet:
      "/assets-optimized/render-tienda-2-800.webp 800w, /assets-optimized/render-tienda-2-1400.webp 1400w",
    alt: "Render del local: muro de madera, mesa y obra colgada",
    caption: "render · muro de madera",
    pos: "55% center",
  },
];

function Figura({ f, sizes, className = "" }: { f: Foto; sizes: string; className?: string }) {
  return (
    <figure className={`flex flex-col ${className}`}>
      <div className="relative w-full aspect-square overflow-hidden">
        <Img
          src={f.src}
          srcSet={f.srcSet}
          sizes={sizes}
          alt={f.alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: f.pos }}
        />
      </div>
      <figcaption className="mt-3 leading-4 text-balance md:h-4 text-[10px] tracking-[0.22em] uppercase text-rojo/55">
        {f.caption}
      </figcaption>
    </figure>
  );
}

const P = "text-rojo font-light text-[16px] md:text-[19px] leading-relaxed text-pretty";

export default function SectionProyecto() {
  return (
    <section className="relative w-full bg-blanco pt-28 md:pt-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24">
          <div className="md:col-span-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-4">
              el proyecto
            </p>
            <h2
              className="text-rojo font-medium leading-[1.0]"
              style={{ fontSize: "clamp(38px, 5.8vw, 86px)", letterSpacing: "-0.02em" }}
            >
              Un piso dentro
              <br />
              de la casa.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-5">
            <p className={P}>
              Piso ikpali es la expresión de objeto del universo de{" "}
              <em className="not-italic font-medium">ikpali Studio</em>. Un concept room de diseño
              doméstico mexicano contemporáneo, organizado con criterio curatorial y dispuesto para
              habitarse, no&nbsp;para exhibirse.
            </p>
            <p className={P}>
              Opera dentro de <em className="not-italic font-medium">Fayet</em>, un hub creativo en
              la Ciudad de México. Cada objeto en el espacio puede comprarse. El cliente no necesita
              investigar ni conocer todas las marcas: la selección es la garantía.
            </p>
            <p className={P}>
              La curaduría no está cerrada ni congelada. La selección crece, se ajusta y evoluciona
              conforme el espacio se habita, las piezas rotan y aparecen nuevas conversaciones entre
              objetos, marcas y visitantes.
            </p>
            <p className={P}>Gracias por acompañarnos en este proyecto.</p>
            <p className={P}>Con cariño,</p>
            <p className="text-rojo font-medium text-[16px] md:text-[19px] leading-relaxed">
              Nathalia y Georgy
              <br />
              Piso ikpali
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-12 md:grid-cols-[minmax(0,1fr)_calc((100%_-_124px)/3)] pb-4">
          <Figura
            f={FACHADA}
            sizes="(min-width: 768px) 62vw, 100vw"
            className="col-span-2 md:col-span-1 md:row-span-2"
          />
          {RENDERS.map((r) => (
            <Figura key={r.src} f={r} sizes="(min-width: 768px) 30vw, 50vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
