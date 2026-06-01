import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "piso ikpali — presentación a marcas",
  description:
    "Pitch comercial para marcas y diseñadores invitados a consignar en Piso ikpali, dentro de Asamblea, Ciudad de México.",
};

export const viewport: Viewport = {
  themeColor: "#ed3424",
  width: "device-width",
  initialScale: 1,
};

export default function PresentacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
