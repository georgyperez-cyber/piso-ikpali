import Img from "./Img";

type Props = {
  textura: number;
  iconoRojo?: number;
  caption?: string;
  /** "spacer" = short pause between sections, "full" = standalone breath */
  variant?: "spacer" | "full";
};

export default function SectionTextura({
  textura,
  iconoRojo = 4,
  caption,
  variant = "spacer",
}: Props) {
  const bg = `/assets-optimized/textura-${textura}-1280.webp`;
  const icon = `/assets-optimized/hero-icono-${iconoRojo}-600.webp`;
  const height =
    variant === "full" ? "h-[60vh] md:h-[80vh]" : "h-[42vh] md:h-[56vh]";
  return (
    <section className={`relative w-full overflow-hidden bg-blanco ${height}`}>
      <Img
        src={bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Img
          src={icon}
          alt=""
          className="w-[26vw] max-w-[260px] h-auto"
        />
      </div>
      {caption && (
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-blanco text-[10px] md:text-[11px] tracking-[0.22em] uppercase mix-blend-difference">
          {caption}
        </div>
      )}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 text-blanco text-[10px] tracking-[0.22em] uppercase tabular-nums mix-blend-difference">
        textura · {String(textura).padStart(2, "0")}
      </div>
    </section>
  );
}
