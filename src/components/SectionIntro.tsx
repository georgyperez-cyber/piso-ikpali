// Texto introductorio de Piso ikpali (el mismo del Hero de la home).
// En /fayet va después del boletín y los renders, mientras el aviso esté arriba.
export default function SectionIntro() {
  return (
    <section className="relative w-full bg-blanco pt-24 md:pt-32 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] border-t border-rojo/20 pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70">
            piso ikpali · 00
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6 flex flex-col gap-5">
          <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
            Piso ikpali es la expresión de objeto del universo de{" "}
            <em className="not-italic font-medium">ikpali Studio</em>. Un concept room de diseño
            doméstico mexicano contemporáneo, organizado con criterio curatorial y dispuesto para
            habitarse — no para exhibirse.
          </p>
          <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
            Opera dentro de <em className="not-italic font-medium">Fayet</em>, un hub creativo
            en la Ciudad de México. Cada objeto en el espacio puede comprarse. El cliente no
            necesita investigar ni conocer todas las marcas: la selección es la garantía.
          </p>
          <p className="text-rojo font-light text-[16px] md:text-[19px] leading-relaxed max-w-xl">
            La curaduría no está cerrada ni congelada. La selección crece, se ajusta y evoluciona
            conforme el espacio se habita, las piezas rotan y aparecen nuevas conversaciones entre
            objetos, marcas y visitantes.
          </p>
        </div>
      </div>
    </section>
  );
}
