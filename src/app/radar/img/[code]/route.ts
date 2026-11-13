import { isAuthed } from "@/lib/radar/auth";
import { kvGetBinary } from "@/lib/radar/apify";

// Miniaturas de los posts más fuertes, guardadas en la corrida semanal.
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!(await isAuthed())) return new Response(null, { status: 404 });
  const { code } = await params;
  if (!/^[\w-]{5,40}$/.test(code)) return new Response(null, { status: 404 });

  try {
    const record = await kvGetBinary(`thumb-${code}`);
    if (!record || !record.type.startsWith("image/")) return new Response(null, { status: 404 });
    return new Response(record.body, {
      headers: { "Content-Type": record.type, "Cache-Control": "private, max-age=604800" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
