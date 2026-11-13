import { hasApify, kvGetBinary } from "@/lib/radar/apify";

// Miniaturas de las publicaciones más fuertes. Las de la rutina semanal viven en
// el almacén de Apify; las del corte guardado en el sitio, en public/radar-thumbs.
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[\w-]{5,40}$/.test(code)) return new Response(null, { status: 404 });

  if (hasApify()) {
    try {
      const record = await kvGetBinary(`thumb-${code}`);
      if (record && record.type.startsWith("image/")) {
        return new Response(record.body, {
          headers: { "Content-Type": record.type, "Cache-Control": "public, max-age=604800" },
        });
      }
    } catch {
      // Sigue al archivo guardado en el sitio.
    }
  }
  return Response.redirect(new URL(`/radar-thumbs/${code}.jpg`, request.url), 302);
}
