// Acceso al radar: una sola contraseña (RADAR_PASSWORD). La cookie guarda una
// firma derivada de la contraseña, así que cambiarla cierra todas las sesiones.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const RADAR_COOKIE = "radar_auth";

function signature(): string | null {
  const password = process.env.RADAR_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("piso-ikpali-radar-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function radarConfigured(): boolean {
  return Boolean(process.env.RADAR_PASSWORD);
}

export function passwordMatches(input: string): boolean {
  const password = process.env.RADAR_PASSWORD;
  return Boolean(password) && safeEqual(input, password!);
}

export function sessionCookieValue(): string {
  return signature() || "";
}

export async function isAuthed(): Promise<boolean> {
  const expected = signature();
  if (!expected) return false;
  const value = (await cookies()).get(RADAR_COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, expected);
}
