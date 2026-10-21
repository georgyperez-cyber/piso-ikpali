import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import Link from "next/link";
import { SITIO } from "@/components/landing/productos";
import { AVISO } from "@/components/landing/aviso";

export const metadata: Metadata = {
  title: "Aviso de privacidad — Piso ikpali",
  description: "Qué datos recibe Piso ikpali a través de su catálogo y para qué los usa.",
};

const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export default function Privacidad() {
  return (
    <main className={`${mono.variable} min-h-screen bg-blanco text-rojo px-6 md:px-12 py-10 md:py-16`}>
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/landing"
          className="font-[family-name:var(--font-mono)] inline-flex items-center gap-2 text-[10px] tracking-[0.06em] uppercase text-rojo/70 hover:text-rojo transition-colors"
        >
          <span aria-hidden>←</span> volver al catálogo
        </Link>

        <h1
          className="mt-16 md:mt-24 font-medium leading-[1.05]"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.02em" }}
        >
          Aviso de privacidad
        </h1>
        <p className="font-[family-name:var(--font-mono)] mt-4 text-[10px] tracking-[0.06em] uppercase text-rojo/70">
          piso ikpali · octubre 2026
        </p>

        <div className="mt-14 md:mt-20 flex flex-col gap-10 md:gap-12 [&_a]:underline [&_a]:underline-offset-4">
          {AVISO.map(([titulo, cuerpo]) => (
            <section key={titulo} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8">
              <h2 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.06em] uppercase text-rojo/70 md:pt-[6px]">{titulo}</h2>
              <p className="text-[15px] leading-relaxed font-light" style={{ textWrap: "pretty" }}>{cuerpo}</p>
            </section>
          ))}
        </div>

        <p className="font-[family-name:var(--font-mono)] mt-20 md:mt-28 text-[10px] tracking-[0.06em] uppercase text-rojo/50">
          {SITIO.direccion} · {SITIO.ciudad}
        </p>
      </div>
    </main>
  );
}
