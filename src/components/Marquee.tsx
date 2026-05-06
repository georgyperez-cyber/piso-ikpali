"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  items: string[];
  speed?: number; // pixels per second
  variant?: "white" | "red";
};

export default function Marquee({ items, speed = 60, variant = "white" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const track = ref.current!.querySelector<HTMLElement>("[data-track]")!;
      const half = track.scrollWidth / 2;
      const duration = half / speed;
      gsap.set(track, { x: 0 });
      gsap.to(track, {
        x: -half,
        duration,
        ease: "none",
        repeat: -1,
      });
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  const bg = variant === "red" ? "bg-rojo text-blanco" : "bg-blanco text-rojo";
  const rule = variant === "red" ? "border-blanco/30" : "border-rojo/30";

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${bg} border-y ${rule} py-5 md:py-7 select-none`}
    >
      <div data-track className="flex whitespace-nowrap will-change-transform">
        {[...items, ...items].map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-8 text-[18px] md:text-[26px] font-medium tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            {s}
            <span className="mx-8 inline-block h-2 w-2 rounded-full bg-current opacity-60" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
