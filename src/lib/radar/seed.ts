// Primera foto del radar, leída a mano de los perfiles públicos el 12 de
// noviembre de 2026 (solo seguidores y total de posts; Instagram redondea los
// seguidores arriba de 10 mil). Sirve de respaldo si Apify no responde. Las
// fotos semanales de Apify viven en su almacén y reemplazan a esta.

import type { AccountSnapshot, Snapshot } from "./metrics";
import { ROSTER } from "./roster";

const LEIDO: Record<string, [followers: number, postsTotal: number]> = {
  "piso.ikpali": [56, 11],
  onoracasa: [52500, 1406],
  utilitariomexicano: [41000, 1912],
  lagolatam: [31100, 2803],
  happeningstore: [64000, 3884],
  "originario.originario": [36800, 229],
  taxonomiamx: [6255, 613],
  seleccionmarsella: [6750, 397],
  escalina_: [4860, 175],
  pisotresg56: [3594, 185],
  bartesanalconceptstore: [863, 335],
  casamandarine: [77000, 105],
  shop__vena: [10100, 410],
  mumedi_oficial: [25000, 505],
  g_mexicana: [11200, 101],
  agoprojects: [50900, 848],
  casacler: [16400, 889],
  "casatho.concepthouse": [47800, 1519],
  marchantastore: [16000, 1376],
  "1050grados": [27600, 787],
  "tonton.textil": [5017, 594],
  doce18concepthouse: [28000, 1574],
};

const accounts: AccountSnapshot[] = ROSTER.filter((e) => e.handle && LEIDO[e.handle]).map((e) => ({
  name: e.name,
  handle: e.handle!,
  city: e.city,
  circle: e.circle,
  ...(e.you ? { you: true } : {}),
  ...(e.nota ? { nota: e.nota } : {}),
  ...(e.fuera ? { fuera: true } : {}),
  followers: LEIDO[e.handle!][0],
  postsTotal: LEIDO[e.handle!][1],
  posts28: null,
  posts28Capped: false,
  eng: null,
  engN: 0,
  hidden: 0,
  medLikes: null,
  mix: null,
  lastPost: null,
  web: null,
  top: null,
  posts: [],
}));

export const SEED: Snapshot[] = [
  {
    weekEnding: "2026-11-12",
    takenAt: "2026-11-12T16:30:00.000Z",
    source: "chrome",
    accounts,
    missing: ROSTER.filter((e) => !e.handle || !LEIDO[e.handle]).map((e) => e.name),
  },
];
