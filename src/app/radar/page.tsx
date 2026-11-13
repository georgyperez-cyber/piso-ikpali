import type { Metadata } from "next";
import { isAuthed, radarConfigured } from "@/lib/radar/auth";
import { loadRadar, topPosts } from "@/lib/radar/store";
import { ROSTER } from "@/lib/radar/roster";
import { LECTURA } from "@/lib/radar/lectura";
import RadarView from "./RadarView";
import styles from "./radar.module.css";

export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Radar · Piso ikpali",
  robots: { index: false, follow: false },
};

function Wordmark() {
  return (
    <h1 className={styles.wordmark}>
      piso <span className={styles.paren}>(</span> radar <span className={styles.paren}>)</span> ikpali
    </h1>
  );
}

const FLASH: Record<string, string> = {
  started: "Corrida iniciada. Tarda uno o dos minutos: recarga la página para ver los datos nuevos.",
  running: "Ya hay una corrida en curso. Recarga la página en un par de minutos.",
  ingested: "Datos actualizados.",
  failed: "La corrida anterior falló. Vuelve a intentar.",
  error: "No se pudo iniciar la corrida. Revisa el crédito disponible en Apify.",
};

export default async function RadarPage({ searchParams }: { searchParams: Promise<{ error?: string; estado?: string }> }) {
  const query = await searchParams;

  if (!radarConfigured()) {
    return (
      <main className={styles.page}>
        <Wordmark />
        <p className={styles.gateNote}>Falta configurar la variable RADAR_PASSWORD para abrir el radar.</p>
      </main>
    );
  }

  if (!(await isAuthed())) {
    return (
      <main className={styles.page}>
        <Wordmark />
        <form className={styles.gate} method="post" action="/radar/entrar">
          <label className={styles.gateLabel} htmlFor="password">
            contraseña
          </label>
          <input className={styles.gateInput} id="password" name="password" type="password" autoComplete="current-password" autoFocus required />
          <button className={styles.textButton} type="submit">
            entrar
          </button>
          {query.error ? <p className={styles.gateError}>Contraseña incorrecta.</p> : null}
        </form>
      </main>
    );
  }

  const data = await loadRadar();
  const pendientes = ROSTER.filter((e) => !e.handle).map((e) => e.name);

  return (
    <RadarView
      current={data.current}
      previous={data.previous}
      running={data.running}
      notice={data.notice}
      flash={query.estado ? FLASH[query.estado] || null : null}
      top={topPosts(data.current)}
      pendientes={pendientes}
      lectura={LECTURA}
    />
  );
}
