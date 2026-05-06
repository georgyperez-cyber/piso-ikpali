/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  priority?: boolean;
};

// Plain <img> with sensible defaults — assets are pre-optimized at build time.
// Avoids next/image runtime overhead for already-sized webp files.
export default function Img({ priority, loading, decoding, ...rest }: Props) {
  return (
    <img
      {...rest}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
    />
  );
}
