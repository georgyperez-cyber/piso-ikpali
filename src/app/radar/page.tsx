import type { Metadata } from "next";
import corte from "@/lib/radar/corte-2026-11-13.json";
import RadarView, { type Corte } from "./RadarView";

// Radar de Instagram de Piso ikpali. Página abierta, sin enlazar ni indexar.
// Cada corte se arma en sesión (datos, material visto y lectura) y vive en
// src/lib/radar/corte-AAAA-MM-DD.json, con sus imágenes en public/radar-media.
export const metadata: Metadata = {
  title: "Radar · Piso ikpali",
  robots: { index: false, follow: false },
};

export default function RadarPage() {
  return <RadarView corte={corte as unknown as Corte} />;
}
