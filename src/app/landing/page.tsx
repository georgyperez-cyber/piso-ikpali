import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";

export const metadata: Metadata = {
  title: "Piso ikpali — catálogo",
  description:
    "Objetos de diseño doméstico mexicano, seleccionados por ikpali studio. Lafayette 64, Ciudad de México.",
};

export default function LandingPage() {
  return <Landing />;
}
