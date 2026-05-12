import Img from "./Img";

// Black icons sized to ~0.85 of the cap height, sitting on the baseline
// like a glyph between words. ICON_LG is for icons that need more visual weight.
const ICON =
  "inline-block align-[-0.18em] mx-2 md:mx-3 h-[0.85em] w-auto select-none";
const ICON_LG =
  "inline-block align-[-0.28em] mx-2 md:mx-3 h-[1.1em] w-auto select-none";

export default function SectionObjeto() {
  return (
    <section className="relative w-full bg-blanco py-48 md:py-72 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] tracking-[0.22em] uppercase text-rojo/70 mb-12">
          manifiesto · 01
        </p>

        <h2
          className="text-rojo font-medium leading-[1.18] tracking-tight"
          style={{
            fontSize: "clamp(34px, 6.4vw, 84px)",
            letterSpacing: "-0.01em",
          }}
        >
          Un espacio
          <Img src="/assets-optimized/hero-icono-negro-8-600.webp" alt="" className={ICON} />
          donde los objetos conviven, rotan,
          <Img src="/assets-optimized/hero-icono-negro-4-600.webp" alt="" className={ICON} />
          se venden,
          se
          <Img src="/assets-optimized/hero-icono-negro-3-600.webp" alt="" className={ICON_LG} />
          reponen y construyen
          <Img src="/assets-optimized/hero-icono-negro-6-600.webp" alt="" className={ICON} />
          un imaginario
          <Img src="/assets-optimized/hero-icono-negro-1-600.webp" alt="" className={ICON} />
          doméstico
          <Img src="/assets-optimized/hero-icono-negro-5-600.webp" alt="" className={ICON} />
          vivo.
        </h2>
      </div>
    </section>
  );
}
