// Cliente mínimo de la API de Apify. El token vive solo en la variable de
// entorno APIFY_TOKEN (Vercel y .env.local); nunca en el repo.

const API = "https://api.apify.com/v2";
const STORE_NAME = "piso-ikpali-radar";
const PROFILE_ACTOR = "apify~instagram-profile-scraper";

export function hasApify(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

async function api(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("Falta APIFY_TOKEN");
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (!res.ok && res.status !== 404) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error?.message || "";
    } catch {}
    throw new Error(`Apify respondió ${res.status}. ${detail}`.trim());
  }
  return res;
}

// Perfil tal como lo entrega apify/instagram-profile-scraper.
export type IgPost = {
  type?: string;
  productType?: string;
  shortCode?: string;
  url?: string;
  caption?: string;
  commentsCount?: number;
  likesCount?: number;
  videoViewCount?: number;
  timestamp?: string;
  displayUrl?: string;
  isPinned?: boolean;
  ownerUsername?: string;
};

export type IgProfile = {
  username?: string;
  fullName?: string;
  biography?: string;
  externalUrl?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  verified?: boolean;
  private?: boolean;
  latestPosts?: IgPost[];
};

export type RunInfo = { id: string; status: string; datasetId: string; finishedAt: string | null };

export async function startProfileRun(usernames: string[]): Promise<RunInfo> {
  const res = await api(`/acts/${PROFILE_ACTOR}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames }),
  });
  const { data } = await res.json();
  return { id: data.id, status: data.status, datasetId: data.defaultDatasetId, finishedAt: data.finishedAt || null };
}

export async function getRun(runId: string): Promise<RunInfo | null> {
  const res = await api(`/actor-runs/${runId}`);
  if (res.status === 404) return null;
  const { data } = await res.json();
  return { id: data.id, status: data.status, datasetId: data.defaultDatasetId, finishedAt: data.finishedAt || null };
}

export async function getRunItems(datasetId: string): Promise<IgProfile[]> {
  const res = await api(`/datasets/${datasetId}/items?clean=1`);
  if (res.status === 404) return [];
  const data = await res.json();
  return Array.isArray(data) ? (data as IgProfile[]) : [];
}

// Almacén con nombre: no expira, a diferencia de los datasets de cada corrida.
let storeId: string | null = null;
async function store(): Promise<string> {
  if (storeId) return storeId;
  const res = await api(`/key-value-stores?name=${STORE_NAME}`, { method: "POST" });
  const { data } = await res.json();
  storeId = data.id as string;
  return storeId;
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const res = await api(`/key-value-stores/${await store()}/records/${key}`);
  if (res.status === 404) return null;
  return (await res.json()) as T;
}

export async function kvPutJson(key: string, value: unknown): Promise<void> {
  await api(`/key-value-stores/${await store()}/records/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(value),
  });
}

export async function kvGetBinary(key: string): Promise<{ body: ArrayBuffer; type: string } | null> {
  const res = await api(`/key-value-stores/${await store()}/records/${key}`);
  if (res.status === 404) return null;
  return { body: await res.arrayBuffer(), type: res.headers.get("content-type") || "image/jpeg" };
}

export async function kvPutBinary(key: string, body: ArrayBuffer, type: string): Promise<void> {
  await api(`/key-value-stores/${await store()}/records/${key}`, {
    method: "PUT",
    headers: { "Content-Type": type },
    body,
  });
}
