import type { Metadata } from "next";
import CartaMarca from "@/components/CartaMarca";

export const metadata: Metadata = {
  title: "piso ikpali — Hola, La Casa Ocho",
  description:
    "La Casa Ocho forma parte de la selección oficial de piso ikpali. Una carta de bienvenida y los siguientes pasos de la colaboración.",
  robots: { index: false, follow: false },
};

export default function LaCasaOchoPage() {
  return <CartaMarca marca="La Casa Ocho" />;
}
