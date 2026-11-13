// Formato de números y fechas del radar. Sin Intl para que servidor y
// navegador pinten exactamente lo mismo.

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DAY_MS = 24 * 60 * 60 * 1000;

function trim(x: number): string {
  return x.toFixed(1).replace(/\.0$/, "");
}

export function miles(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function compact(n: number | null): string {
  if (n === null) return "";
  if (n >= 1_000_000) return `${trim(n / 1_000_000)} M`;
  if (n >= 10_000) return `${trim(n / 1000)} mil`;
  if (n < 10 && !Number.isInteger(n)) return n.toFixed(1);
  return miles(n);
}

export function pct(n: number | null): string {
  if (n === null) return "";
  // En este sector casi todo el ER cae debajo de 1%: ahí hacen falta dos decimales.
  return `${n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2)}%`;
}

export function signed(n: number): string {
  if (n === 0) return "sin cambio";
  return `${n > 0 ? "+" : "−"}${compact(Math.abs(n))}`;
}

export function weekLabel(weekEnding: string): string {
  const end = new Date(`${weekEnding}T12:00:00Z`);
  const start = new Date(end.getTime() - 6 * DAY_MS);
  const year = end.getUTCFullYear();
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const from = sameMonth ? `${start.getUTCDate()}` : `${start.getUTCDate()} de ${MESES[start.getUTCMonth()]}`;
  return `semana del ${from} al ${end.getUTCDate()} de ${MESES[end.getUTCMonth()]} de ${year}`;
}

export function dayLabel(iso: string): string {
  // Hora de CDMX (UTC-6, sin horario de verano desde 2022).
  const d = new Date(Date.parse(iso) - 6 * 60 * 60 * 1000);
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

export function ago(iso: string | null, nowIso: string): string {
  if (!iso) return "";
  const days = Math.floor((Date.parse(nowIso) - Date.parse(iso)) / DAY_MS);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 14) return `hace ${days} días`;
  if (days < 60) return `hace ${Math.floor(days / 7)} semanas`;
  return `hace ${Math.floor(days / 30)} meses`;
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
