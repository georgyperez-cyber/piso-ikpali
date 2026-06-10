import type { Metadata } from "next";
import CartaMarca from "@/components/CartaMarca";

export const metadata: Metadata = {
  title: "piso ikpali — Hola, Estela Williams",
  description:
    "Estela Williams forma parte de la selección oficial de piso ikpali. Una carta de bienvenida y los siguientes pasos de la colaboración.",
  robots: { index: false, follow: false },
};

export default function EstelaWilliamsPage() {
  return <CartaMarca marca="Estela Williams" />;
}
