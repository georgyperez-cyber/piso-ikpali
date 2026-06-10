import type { Metadata } from "next";
import CartaMarca from "@/components/CartaMarca";

export const metadata: Metadata = {
  title: "piso ikpali — Hola, Burro",
  description:
    "Burro forma parte de la selección oficial de piso ikpali. Una carta de bienvenida y los siguientes pasos de la colaboración.",
  robots: { index: false, follow: false },
};

export default function BurroPage() {
  return <CartaMarca marca="Burro" />;
}
