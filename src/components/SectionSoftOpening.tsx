import ProyectosCasa from "./ProyectosCasa";

// /fayet · soft opening (friends & family) del 5 de diciembre de 2026, antes del
// manifiesto. Abajo, los proyectos que conviven en ffaayyeett (ProyectosCasa).

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

        <ProyectosCasa />
      </div>
    </section>
  );
}
