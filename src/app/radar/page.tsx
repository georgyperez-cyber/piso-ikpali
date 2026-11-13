import type { Metadata } from "next";
import { loadRadar, topPosts } from "@/lib/radar/store";
import { ROSTER } from "@/lib/radar/roster";
import { LECTURA } from "@/lib/radar/lectura";
import RadarView from "./RadarView";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Página abierta, sin contraseña. No está enlazada desde el sitio ni se indexa.
export const metadata: Metadata = {
  title: "Radar · Piso ikpali",
  robots: { index: false, follow: false },
};

export default async function RadarPage() {
  const data = await loadRadar();
  const pendientes = ROSTER.filter((e) => !e.handle).map((e) => e.name);

  return (
    <RadarView
      current={data.current}
      previous={data.previous}
      running={data.running}
      notice={data.notice}
      top={topPosts(data.current)}
      pendientes={pendientes}
      lectura={LECTURA}
    />
  );
}
