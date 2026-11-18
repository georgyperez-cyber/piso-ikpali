// Piezas que aparecen en el sitio (pitch, /fayet, invitaciones, /softopening, decks).
//
// Todas salen de las fotos finales del catálogo de /landing (fotos productos finales,
// noviembre 13): public/productos/<id>-800.webp y -1600.webp, exportadas con
// scripts/fotos-producto/optimizar.py. Los id son los mismos de components/landing/productos.ts.
// Las versiones con trama de líneas (roja y negra) de las ocho piezas ícono salen de esas
// mismas fotos con scripts/fotos-producto/trama.py → public/productos/trama/<color>/<id>-600|400.webp.
//
// Para cambiar una pieza: cambiar su id aquí (y, si es ícono, correr trama.py con el id nuevo).

export const foto = (id: string, tam: 800 | 1600 = 800) => `/productos/${id}-${tam}.webp`;
export const trama = (id: string, color: "rojo" | "negro", tam: 400 | 600 = 600) =>
  `/productos/trama/${color}/${id}-${tam}.webp`;

// Las ocho piezas ícono, una por marca. Los componentes las piden por número (1 a 8),
// como pedían los íconos anteriores; `nombre` es la palabra que acompaña a cada una
// (glosario del pitch).
export const ICONOS = [
  { id: "hebilla-negra-con-dos-aguilas-doradas", nombre: "hebilla" }, // 1 · Kmy
  { id: "vela-jamaica", nombre: "vela" }, // 2 · Río Estudio
  { id: "lampara-pe-roja", nombre: "lámpara" }, // 3 · buRRo
  { id: "portalibros-kuini", nombre: "portalibros" }, // 4 · Paralelo Mexicano
  { id: "jarra-azul-nube", nombre: "jarra" }, // 5 · Mot
  { id: "vasija-baakel-molcajete", nombre: "molcajete" }, // 6 · Estebanez Studio
  { id: "botella-moteada", nombre: "botella" }, // 7 · Casa 8
  { id: "zitlala-tiger-ring", nombre: "anillo" }, // 8 · Estella Williams
] as const;

const icono = (n: number) => ICONOS[(n - 1 + ICONOS.length) % ICONOS.length];
/** Pieza ícono n (1 a 8) con trama roja. */
export const iconoRojo = (n: number, tam: 400 | 600 = 600) => trama(icono(n).id, "rojo", tam);
/** Pieza ícono n (1 a 8) con trama negra. */
export const iconoNegro = (n: number, tam: 400 | 600 = 600) => trama(icono(n).id, "negro", tam);
/** Pieza ícono n (1 a 8) en su foto a color. */
export const iconoFoto = (n: number) => foto(icono(n).id);
export const iconoNombre = (n: number) => icono(n).nombre;

// Las que pasan dentro del paréntesis del hero del pitch y de /fayet. No repiten ninguna
// de la muestra ni de los íconos: en /fayet salen las tres en la misma página.
export const HERO = [
  "jarra-rojo-tomate", "hebilla-piel-de-vibora", "botella-terracota",
  "lampara-pa-azul", "plato-rojo-tomate", "hebilla-morada-con-crochet-blanco",
  "charola-negra", "primer-molar", "vela-poctapoc-chica",
  "chilapa-tiger-pendant", "room-spray-fica-folia", "plato-hondo-azul-nube",
  "hebilla-rosa-rojo-y-dorado", "jabonera-moteada", "plato-hondo-verde-bosque",
  "hebilla-azul-marino-con-pluma", "servilletero-papatzoa-taupe", "lampara-pe-aluminio",
  "taza-toronto-chica-verde-rana", "set-de-bano-negro", "hebilla-carey-oscuro",
  "taza-toronto-grande-azul-cometa", "vaso-negro", "vertebral-chain-eslabon",
  "vela-eek-chica", "zitlala-tiger-pendant-mini", "jabon-cubo-chico",
  "hebilla-vino-con-herraduras", "vaso-azul-nube", "lampara-pa-blanca",
  "vaso-liso-moteado", "hebilla-ambar-con-herraduras", "vaso-verde-bosque",
];

// "Algunas piezas de nuestra selección" (/fayet): 40 para que la retícula cierre en 4, 5 y 8
// columnas, con las diez marcas y sin dos de la misma marca juntas.
export const MUESTRA = [
  "botella-negra", "hebilla-carey-ambar", "jarra-verde-bosque",
  "lampara-pa-roja", "diablo-mask-pendant", "mesa-itztepetl",
  "charola-moteada", "hebilla-naranja-con-gallo-plateado", "plato-azul-nube",
  "vertebral-chain", "room-spray-soliflor", "lampara-de-piso-parakata",
  "lampara-pe-azul-marino", "jabonera-negra", "hebilla-plateada-con-mariposa",
  "plato-hondo-rojo-tomate", "rosary-necklace", "set-de-bano-moteado",
  "vela-eek-grande", "hebilla-azul-morado-iridiscente", "taza-toronto-chica-azul-cometa",
  "vela-ocote", "lampara-changarro-amarilla", "zitlala-tiger-pendant",
  "vaso-terracota", "hebilla-cobre-con-crochet-blanco", "taza-toronto-grande-verde-rana",
  "lampara-pa-aluminio", "tercer-molar", "jabon-cubo-grande",
  "portalibros-yakata", "vaso-liso-negro", "hebilla-verde-oscuro-con-dos-gallos",
  "vaso-rojo-tomate", "vela-baakel-chica", "rosary-bracelet",
  "lampara-pe-blanca", "vaso-moteado", "hebilla-rojiza-con-rifles-y-corneta",
  "plato-verde-bosque",
];

// Las del paréntesis de las invitaciones a marcas (/kmy, /comite…) y de /softopening.
export const PARENTESIS = [
  "jarra-rojo-tomate",
  "lampara-pe-azul-marino",
  "lampara-de-piso-parakata",
  "chilapa-tiger-pendant",
  "taza-toronto-grande-verde-rana",
  "botella-terracota",
  "room-spray-fica-folia",
  "vela-poctapoc-chica",
];
