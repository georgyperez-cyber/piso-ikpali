import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "piso ikpali — presentación a fayet",
  description:
    "Presentación de Piso ikpali para la comunidad de Fayet: qué es, quién lo hace, las marcas que trae al espacio y cómo suma a la reunión.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ed3424",
  width: "device-width",
  initialScale: 1,
};

export default function PresentacionFayetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
