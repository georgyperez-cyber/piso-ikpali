import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import Landing from "@/components/landing/Landing";

export const metadata: Metadata = {
  title: "Piso ikpali — catálogo",
  description:
    "Objetos de diseño doméstico mexicano, seleccionados por ikpali studio. Lafayette 64, Ciudad de México.",
};

const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export default function LandingPage() {
  return (
    <div className={mono.variable}>
      <Landing />
    </div>
  );
}
