import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/radar/auth";
import { advance } from "@/lib/radar/store";

export const maxDuration = 60;

// Botón "actualizar ahora" del radar. Cada corrida cuesta centavos en Apify.
export async function POST(request: Request) {
  if (!(await isAuthed())) return NextResponse.redirect(new URL("/radar", request.url), 303);

  let estado: string;
  try {
    estado = (await advance({ start: true, force: true })).state;
  } catch {
    estado = "error";
  }
  return NextResponse.redirect(new URL(`/radar?estado=${estado}`, request.url), 303);
}
