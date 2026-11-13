// Convierte los perfiles crudos en la foto semanal que pinta el dashboard.
// Reglas (del radar de museos): nunca inventar, lo que no viene queda en null;
// medianas en vez de promedios; y el ER por seguidor solo cuenta publicaciones
// propias con likes visibles (una colaboración trae la audiencia de la otra cuenta).

import type { IgPost, IgProfile } from "./apify";
import { ROSTER, type Circle } from "./roster";

export type PostKind = "reel" | "carrusel" | "foto";

export type PostSummary = {
  handle: string;
  code: string;
  url: string;
  ts: string;
  kind: PostKind;
  likes: number | null; // null cuando la cuenta oculta los likes
  comments: number | null;
  er: number | null; // % de (likes + comentarios) entre seguidores; null en colaboraciones y likes ocultos
  collab: string | null; // cuenta dueña de la publicación cuando es compartida
  caption: string;
  thumb?: string; // llave de la miniatura guardada, si se pudo bajar
};

export type AccountSnapshot = {
  name: string;
  handle: string;
  city: string;
  circle: Circle;
  you?: boolean;
  nota?: string;
  fuera?: boolean;
  followers: number | null;
  postsTotal: number | null;
  posts28: number | null; // publicadas en los 28 días previos a la captura
  posts28Capped: boolean; // true si las 12 leídas caen todas dentro de esos 28 días
  eng: number | null; // ER por seguidor, mediana de las propias con likes visibles
  engN: number; // cuántas publicaciones sostienen ese ER
  hidden: number; // propias con likes ocultos
  medLikes: number | null; // interacciones por publicación propia, mediana
  mix: Record<PostKind, number> | null;
  lastPost: string | null;
  web: string | null;
  top: PostSummary | null; // la propia con más interacciones de los últimos 28 días
  posts: PostSummary[]; // las publicaciones recientes leídas (hasta 12)
};

export type Snapshot = {
  weekEnding: string; // YYYY-MM-DD, fecha de captura en hora de CDMX
  takenAt: string;
  source: "apify" | "chrome";
  accounts: AccountSnapshot[];
  missing: string[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function cdmxDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(d);
}

function kindOf(p: IgPost): PostKind {
  if (p.type === "Video") return "reel";
  if (p.type === "Sidecar") return "carrusel";
  return "foto";
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function round2(n: number | null): number | null {
  return n === null ? null : Math.round(n * 100) / 100;
}

function oneLine(text: string | undefined, max = 150): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 30)).replace(/[\s,.;:]+$/, "") + "…";
}

export function interactions(p: PostSummary): number {
  return (p.likes ?? 0) + (p.comments ?? 0);
}

export function buildSnapshot(profiles: IgProfile[], takenAt: Date, source: Snapshot["source"]): Snapshot {
  const byHandle = new Map<string, IgProfile>();
  for (const p of profiles) if (p.username) byHandle.set(p.username.toLowerCase(), p);

  const accounts: AccountSnapshot[] = [];
  const missing: string[] = [];

  for (const entry of ROSTER) {
    if (!entry.handle) continue;
    const handle = entry.handle;
    const p = byHandle.get(handle.toLowerCase());
    if (!p) {
      missing.push(entry.name);
      continue;
    }

    const followers = num(p.followersCount);
    const all = (p.latestPosts || []).filter((x) => x.timestamp && x.shortCode);
    // Los fijados suelen ser viejos y de los mejores: solo cuentan si caen dentro
    // del rango de fechas de las publicaciones recientes.
    const regular = all.filter((x) => !x.isPinned);
    const oldest = regular.length ? Math.min(...regular.map((x) => Date.parse(x.timestamp!))) : Infinity;
    const recent = all
      .filter((x) => !x.isPinned || Date.parse(x.timestamp!) >= oldest)
      .sort((a, b) => Date.parse(b.timestamp!) - Date.parse(a.timestamp!));

    const posts: PostSummary[] = recent.map((x) => {
      const likes = num(x.likesCount);
      const comments = num(x.commentsCount);
      const owner = x.ownerUsername && x.ownerUsername.toLowerCase() !== handle.toLowerCase() ? x.ownerUsername : null;
      return {
        handle,
        code: x.shortCode!,
        url: x.url || `https://www.instagram.com/p/${x.shortCode}/`,
        ts: x.timestamp!,
        kind: kindOf(x),
        likes,
        comments,
        er: !owner && followers && likes !== null ? round2(((likes + (comments ?? 0)) / followers) * 100) : null,
        collab: owner,
        caption: oneLine(x.caption),
      };
    });

    const age = (x: PostSummary) => takenAt.getTime() - Date.parse(x.ts);
    const in28 = posts.filter((x) => age(x) <= 28 * DAY_MS);
    const own = posts.filter((x) => !x.collab);
    const measurable = own.filter((x) => x.likes !== null);
    const best = in28.filter((x) => !x.collab && x.likes !== null).sort((a, b) => interactions(b) - interactions(a))[0];

    accounts.push({
      name: entry.name,
      handle,
      city: entry.city,
      circle: entry.circle,
      ...(entry.you ? { you: true } : {}),
      ...(entry.nota ? { nota: entry.nota } : {}),
      ...(entry.fuera ? { fuera: true } : {}),
      followers,
      postsTotal: num(p.postsCount),
      posts28: all.length ? in28.length : null,
      posts28Capped: posts.length >= 12 && in28.length === posts.length,
      eng: round2(median(measurable.filter((x) => x.er !== null).map((x) => x.er!))),
      engN: measurable.length,
      hidden: own.length - measurable.length,
      medLikes: median(measurable.map(interactions)),
      mix: posts.length
        ? posts.reduce<Record<PostKind, number>>((m, x) => ({ ...m, [x.kind]: m[x.kind] + 1 }), { reel: 0, carrusel: 0, foto: 0 })
        : null,
      lastPost: posts[0]?.ts ?? null,
      web: p.externalUrl || null,
      top: best ?? null,
      posts,
    });
  }

  return { weekEnding: cdmxDate(takenAt), takenAt: takenAt.toISOString(), source, accounts, missing };
}
