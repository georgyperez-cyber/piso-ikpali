import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piso ikpali — concept room de diseño doméstico mexicano",
  description:
    "Piso ikpali es la expresión de objeto del universo de ikpali Studio. Un concept room de diseño doméstico mexicano contemporáneo, dentro de Asamblea, Ciudad de México.",
};

export const viewport: Viewport = {
  themeColor: "#ed3424",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-blanco text-rojo">{children}</body>
    </html>
  );
}
