import type { Metadata } from "next";

import Hero from "@/components/Hero";
import SectionObjeto from "@/components/SectionObjeto";
import SectionAudiencia from "@/components/SectionAudiencia";
import SectionGlosario from "@/components/SectionGlosario";
import SectionCuraduria from "@/components/SectionCuraduria";
import SectionEspacios from "@/components/SectionEspacios";
import SectionMarcas from "@/components/SectionMarcas";
import SectionCierre from "@/components/SectionCierre";
import SectionTextura from "@/components/SectionTextura";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "piso ikpali — para fayet",
  description:
    "Piso ikpali presentado a la comunidad de Fayet: qué es, a quién le habla, cómo cura, y las marcas que trae al espacio.",
  robots: { index: false, follow: false },
};

// Versión del pitch para la gente de Fayet.
// Reutiliza las secciones de la home. Fuera: modelo de negocio, "por qué estar",
// el proceso de consignación, y la explicación a fondo de qué es Fayet.
// Dentro, nuevo: la lámina de marcas.
export default function FayetPage() {
  return (
    <main className="bg-blanco text-rojo">
      <Hero />
      <SectionObjeto />

      <Marquee
        variant="red"
        speed={70}
        items={[
          "concept room",
          "diseño doméstico mexicano",
          "ikpali studio",
          "fayet cdmx",
          "objeto curado",
          "selección como garantía",
        ]}
      />

      <SectionAudiencia />
      <SectionGlosario />
      <SectionCuraduria />

      <SectionTextura textura={5} iconoRojo={7} caption="el filtro" />

      <Marquee
        variant="white"
        speed={55}
        items={[
          "el objeto pasa",
          "el espacio queda",
          "la curaduría se mueve con él",
          "habitarse · no exhibirse",
        ]}
      />

      <SectionEspacios />

      <SectionTextura textura={8} iconoRojo={6} caption="el ritmo" />

      <SectionMarcas />
      <SectionCierre />
    </main>
  );
}
