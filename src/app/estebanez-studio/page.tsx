import type { Metadata } from "next";
import CartaMarca from "@/components/CartaMarca";

export const metadata: Metadata = {
  title: "piso ikpali — Hola, Estebanez Studio",
  description:
    "Estebanez Studio forma parte de la selección oficial de piso ikpali. Una carta de bienvenida y los siguientes pasos de la colaboración.",
  robots: { index: false, follow: false },
};

export default function EstebanezStudioPage() {
  return <CartaMarca marca="Estebanez Studio" />;
}
