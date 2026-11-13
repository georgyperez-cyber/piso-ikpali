// Corte guardado dentro del sitio. Con esto la página abre aunque no haya
// variables configuradas en Vercel; cuando existe APIFY_TOKEN, las fotos
// semanales del almacén de Apify se suman y reemplazan a las de la misma fecha.

import type { Snapshot } from "./metrics";
import corte20261112 from "./snapshots/2026-11-12.json";

export const SEED: Snapshot[] = [corte20261112 as unknown as Snapshot];
