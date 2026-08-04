/* eslint-disable @next/next/no-img-element */

export default function PieceImage({
  idx,
  size = 160,
  variant = "color",
  className = "",
}: {
  idx: number;
  size?: number;
  variant?: "color" | "negro";
  className?: string;
}) {
  const safe = Math.max(1, Math.min(8, idx));
  const src =
    variant === "negro"
      ? `/assets-optimized/hero-icono-negro-${safe}-600.webp`
      : `/assets-optimized/hero-icono-foto-${safe}-480.webp`;

  return (
    <div
      className={`relative bg-blanco flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="max-w-[88%] max-h-[88%] object-contain"
        onError={(e) => {
          // fallback to color variant if negro variant missing for this index
          (e.target as HTMLImageElement).src = `/assets-optimized/hero-icono-foto-${safe}-480.webp`;
        }}
      />
    </div>
  );
}
