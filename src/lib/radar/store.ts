// Estado del radar: qué semanas hay guardadas, si hay una corrida en curso y
// cómo se avanza. Todo vive en un almacén con nombre dentro de la cuenta de
// Apify, así no hay base de datos ni pushes semanales.

import {
  getRun,
  getRunItems,
  hasApify,
  kvGetJson,
  kvPutBinary,
  kvPutJson,
  startProfileRun,
  type IgProfile,
} from "./apify";
import { buildSnapshot, type PostSummary, type Snapshot } from "./metrics";
import sharp from "sharp";
import { ROSTER } from "./roster";
import { SEED } from "./seed";

type Index = {
  weeks: string[];
  pending: { runId: string; startedAt: string } | null;
  lastError: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const TOP_POSTS = 8;

async function readIndex(): Promise<Index> {
  return (await kvGetJson<Index>("index")) ?? { weeks: [], pending: null, lastError: null };
}

// Lo mejor de la competencia: publicaciones propias de los últimos 28 días,
// ordenadas por tasa (no por total, para que no ganen siempre las cuentas grandes).
export function topPosts(snapshot: Snapshot, limit = TOP_POSTS): PostSummary[] {
  const since = Date.parse(snapshot.takenAt) - 28 * DAY_MS;
  return snapshot.accounts
    .filter((a) => !a.you && !a.fuera)
    .flatMap((a) => a.posts || [])
    .filter((p) => p.er !== null && Date.parse(p.ts) >= since)
    .sort((a, b) => (b.er ?? 0) - (a.er ?? 0))
    .slice(0, limit);
}

// Las ligas de imagen de Instagram caducan en horas, así que las miniaturas de
// los posts más fuertes se guardan en el almacén al momento de la corrida.
async function saveThumbs(snapshot: Snapshot, profiles: IgProfile[]): Promise<void> {
  const urls = new Map<string, string>();
  for (const p of profiles) for (const x of p.latestPosts || []) if (x.shortCode && x.displayUrl) urls.set(x.shortCode, x.displayUrl);

  await Promise.all(
    topPosts(snapshot).map(async (post) => {
      const url = urls.get(post.code);
      if (!url) return;
      try {
        const res = await fetch(url, { cache: "no-store" });
        const type = res.headers.get("content-type") || "";
        if (!res.ok || !type.startsWith("image/")) return;
        const original = await res.arrayBuffer();
        if (original.byteLength > 4_000_000) return;
        // Se guarda chica: son miniaturas de 3 columnas, no hace falta el original.
        const small = await sharp(Buffer.from(original)).resize({ width: 720, withoutEnlargement: true }).jpeg({ quality: 74 }).toBuffer();
        const body = small.buffer.slice(small.byteOffset, small.byteOffset + small.byteLength) as ArrayBuffer;
        await kvPutBinary(`thumb-${post.code}`, body, "image/jpeg");
        post.thumb = post.code;
      } catch {
        // Sin miniatura; el post se muestra solo con texto.
      }
    }),
  );
}

export type AdvanceResult = { state: "ingested" | "running" | "started" | "fresh" | "idle" | "failed"; detail?: string };

// Un paso de la rutina semanal. Es seguro llamarlo varias veces: si hay una
// corrida terminada la guarda; si no hay ninguna y ya toca, la inicia.
export async function advance(opts: { start: boolean; force?: boolean }): Promise<AdvanceResult> {
  const index = await readIndex();

  if (index.pending) {
    const run = await getRun(index.pending.runId);
    if (run && (run.status === "READY" || run.status === "RUNNING")) return { state: "running" };

    if (run && run.status === "SUCCEEDED") {
      const profiles = await getRunItems(run.datasetId);
      const snapshot = buildSnapshot(profiles, new Date(run.finishedAt || Date.now()), "apify");
      if (!snapshot.accounts.length) {
        index.pending = null;
        index.lastError = "La corrida terminó sin perfiles.";
        await kvPutJson("index", index);
        return { state: "failed", detail: index.lastError };
      }
      await saveThumbs(snapshot, profiles);
      await kvPutJson(`snap-${snapshot.weekEnding}`, snapshot);
      index.weeks = [...new Set([...index.weeks, snapshot.weekEnding])].sort();
      index.pending = null;
      index.lastError = null;
      await kvPutJson("index", index);
      return { state: "ingested", detail: snapshot.weekEnding };
    }

    index.pending = null;
    index.lastError = `La corrida terminó con estado ${run ? run.status : "desconocido"}.`;
    await kvPutJson("index", index);
    if (!opts.start) return { state: "failed", detail: index.lastError };
  }

  if (!opts.start) return { state: "idle" };

  const latest = index.weeks[index.weeks.length - 1];
  if (!opts.force && latest && Date.now() - Date.parse(`${latest}T12:00:00Z`) < 6 * DAY_MS) return { state: "fresh", detail: latest };

  const handles = ROSTER.filter((e) => e.handle).map((e) => e.handle!);
  const run = await startProfileRun(handles);
  index.pending = { runId: run.id, startedAt: new Date().toISOString() };
  await kvPutJson("index", index);
  return { state: "started" };
}

export type RadarData = {
  current: Snapshot;
  previous: Snapshot | null; // la foto anterior con al menos 5 días de diferencia
  running: boolean;
  notice: string | null;
};

export async function loadRadar(): Promise<RadarData> {
  const byWeek = new Map<string, Snapshot>(SEED.map((s) => [s.weekEnding, s]));
  let running = false;
  let notice: string | null = null;

  if (hasApify()) {
    try {
      const step = await advance({ start: false });
      running = step.state === "running";
      const index = await readIndex();
      if (index.lastError) notice = index.lastError;
      const recent = index.weeks.slice(-4);
      const snaps = await Promise.all(recent.map((w) => kvGetJson<Snapshot>(`snap-${w}`)));
      for (const s of snaps) if (s) byWeek.set(s.weekEnding, s);
    } catch (err) {
      notice = err instanceof Error ? err.message : "No se pudo leer Apify.";
    }
  } else {
    notice = "Corte guardado en el sitio. La actualización de cada lunes se activa al agregar APIFY_TOKEN y CRON_SECRET en Vercel.";
  }

  const weeks = [...byWeek.keys()].sort();
  const current = byWeek.get(weeks[weeks.length - 1])!;
  const previous =
    weeks
      .slice(0, -1)
      .reverse()
      .map((w) => byWeek.get(w)!)
      // La foto leída a mano trae seguidores redondeados: compararla daría cambios falsos.
      .find((s) => s.source === "apify" && Date.parse(current.takenAt) - Date.parse(s.takenAt) >= 5 * DAY_MS) ?? null;

  return { current, previous, running, notice };
}
