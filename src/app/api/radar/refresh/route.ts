import { advance } from "@/lib/radar/store";

export const maxDuration = 60;

// Rutina semanal del radar. Vercel Cron la llama los lunes (ver vercel.json)
// con el encabezado Authorization: Bearer CRON_SECRET. La primera llamada
// inicia la corrida en Apify; la segunda guarda el resultado.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response(null, { status: 401 });
  }

  try {
    return Response.json(await advance({ start: true }));
  } catch (err) {
    return Response.json({ state: "error", detail: err instanceof Error ? err.message : "error" }, { status: 500 });
  }
}
