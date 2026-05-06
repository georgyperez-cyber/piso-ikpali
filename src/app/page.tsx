import Hero from "@/components/Hero";
import SectionObjeto from "@/components/SectionObjeto";
import SectionAudiencia from "@/components/SectionAudiencia";
import SectionGlosario from "@/components/SectionGlosario";
import SectionCuraduria from "@/components/SectionCuraduria";
import SectionAsamblea from "@/components/SectionAsamblea";
import SectionModelo from "@/components/SectionModelo";
import SectionBeneficios from "@/components/SectionBeneficios";
import SectionProceso from "@/components/SectionProceso";
import SectionEspacios from "@/components/SectionEspacios";
import SectionCierre from "@/components/SectionCierre";
import SectionTextura from "@/components/SectionTextura";
import Marquee from "@/components/Marquee";

export default function Home() {
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
          "asamblea cdmx",
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

      <SectionAsamblea />

      <SectionTextura textura={7} iconoRojo={2} caption="el contexto" />

      <SectionModelo />
      <SectionBeneficios />
      <SectionProceso />

      <SectionTextura textura={8} iconoRojo={6} caption="el ritmo" />

      <SectionEspacios />
      <SectionCierre />
    </main>
  );
}
