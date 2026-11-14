// Catálogo de /landing.
//
// Una entrada por foto final (fotos productos finales/noviembre 13), con el nombre
// de su capa sin la marca. `variantes` son los SKU del inventario de
// pisoikpali.com/admin que muestra esa foto (un anillo en tres tallas es una sola
// foto). Precio y existencias llegan en vivo del admin; RESPALDO es la foto del
// inventario al publicar, por si el admin no responde.
//
// Las fotos se exportan con scripts/fotos-producto/optimizar.py (lee mapa.json,
// foto → id): <id>-800.webp para el tablero y el grid, <id>-1600.webp para la
// pieza abierta. Las jarras de Mot se exportaron con margen (el objeto al 80 %
// del cuadro) porque llenas se veían más grandes que el resto.

export type Variante = { sku: string; talla?: string };

export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  variantes: Variante[];
  // Tamaño relativo dentro del tablero (1 = celda completa). Da ritmo: las
  // piezas chicas (anillos, hebillas) no deben verse del tamaño de una jarra.
  tam: number;
  // Borde inferior del objeto dentro de su foto (0 a 1). Sirve para colgar el
  // nombre justo debajo de la pieza y no debajo del aire transparente.
  fondo?: number;
  src: string;
  srcGrande: string;
};

export type EstadoInv = "disponible" | "bajo" | "agotado";
export type Inventario = Record<string, { precio: number | null; disponible: number; estado: EstadoInv }>;

const LISTA: Omit<Producto, "src" | "srcGrande">[] = [
  { id: "jarra-azul-nube", nombre: "Jarra azul nube", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-012" }], tam: 1.0, fondo: 0.875 },
  { id: "hebilla-piel-de-vibora", nombre: "Hebilla piel de víbora", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-009" }], tam: 0.75, fondo: 0.839 },
  { id: "botella-moteada", nombre: "Botella moteada", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-001" }], tam: 1.05, fondo: 0.99 },
  { id: "lampara-pe-aluminio", nombre: "Lámpara Pe aluminio", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-008" }], tam: 1.0, fondo: 0.95 },
  { id: "chilapa-tiger-pendant", nombre: "Chilapa Tiger Pendant", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-002" }], tam: 0.7, fondo: 0.945 },
  { id: "plato-azul-nube", nombre: "Plato azul nube", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-006" }], tam: 1.0, fondo: 0.713 },
  { id: "hebilla-azul-morado-iridiscente", nombre: "Hebilla azul-morado iridiscente", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-010" }], tam: 0.75, fondo: 0.83 },
  { id: "charola-moteada", nombre: "Charola moteada", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-008" }], tam: 1.0, fondo: 0.995 },
  { id: "lampara-pe-azul-marino", nombre: "Lámpara Pe azul marino", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-004" }], tam: 1.0, fondo: 0.944 },
  { id: "vela-baakel-chica", nombre: "Vela Baakel chica", marca: "Estebanez Studio", categoria: "Velas", variantes: [{ sku: "ES-002" }], tam: 1.05, fondo: 0.771 },
  { id: "taza-toronto-chica-azul-cometa", nombre: "Taza Toronto chica azul cometa", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-013" }], tam: 0.7, fondo: 0.771 },
  { id: "hebilla-negra-con-dos-aguilas-doradas", nombre: "Hebilla negra con dos águilas doradas", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-011" }], tam: 0.75, fondo: 0.832 },
  { id: "jabonera-moteada", nombre: "Jabonera moteada", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-012" }], tam: 0.85, fondo: 0.796 },
  { id: "lampara-pe-blanca", nombre: "Lámpara Pe blanca", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-006" }], tam: 1.0, fondo: 0.945 },
  { id: "diablo-mask-pendant", nombre: "Diablo Mask Pendant", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-004" }], tam: 0.7, fondo: 0.935 },
  { id: "vaso-rojo-tomate", nombre: "Vaso rojo tomate", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-001" }], tam: 0.8, fondo: 0.884 },
  { id: "hebilla-morada-con-crochet-blanco", nombre: "Hebilla morada con crochet blanco", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-012" }], tam: 0.75, fondo: 0.837 },
  { id: "set-de-bano-moteado", nombre: "Set de baño moteado", marca: "Casa 8", categoria: "Cerámica", variantes: [], tam: 1.0, fondo: 0.866 },
  { id: "lampara-pe-roja", nombre: "Lámpara Pe roja", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-005" }], tam: 1.0, fondo: 0.943 },
  { id: "mesa-itztepetl", nombre: "Mesa Itztepetl", marca: "Estebanez Studio", categoria: "Mobiliario", variantes: [{ sku: "ES-006" }], tam: 1.15, fondo: 0.939 },
  { id: "jarra-rojo-tomate", nombre: "Jarra rojo tomate", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-010" }], tam: 1.0, fondo: 0.872 },
  { id: "hebilla-verde-oscuro-con-dos-gallos", nombre: "Hebilla verde oscuro con dos gallos", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-013" }], tam: 0.75, fondo: 0.829 },
  { id: "vaso-moteado", nombre: "Vaso moteado", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-005" }], tam: 0.8, fondo: 0.933 },
  { id: "rosary-bracelet", nombre: "Rosary Bracelet", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-005" }], tam: 0.8, fondo: 0.912 },
  { id: "lampara-pa-aluminio", nombre: "Lámpara Pa aluminio", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-007" }], tam: 1.0, fondo: 0.905 },
  { id: "plato-rojo-tomate", nombre: "Plato rojo tomate", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-005" }], tam: 1.0, fondo: 0.714 },
  { id: "hebilla-carey-ambar", nombre: "Hebilla carey ámbar", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-014" }], tam: 0.75, fondo: 0.844 },
  { id: "botella-negra", nombre: "Botella negra", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-002" }], tam: 1.05, fondo: 0.977 },
  { id: "vasija-baakel-molcajete", nombre: "Vasija Baakel (molcajete)", marca: "Estebanez Studio", categoria: "Objeto", variantes: [{ sku: "ES-005" }], tam: 0.95, fondo: 0.848 },
  { id: "zitlala-tiger-pendant", nombre: "Zitlala Tiger Pendant", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-001" }], tam: 0.7, fondo: 0.93 },
  { id: "taza-toronto-chica-verde-rana", nombre: "Taza Toronto chica verde rana", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-015" }], tam: 0.7, fondo: 0.774 },
  { id: "hebilla-rosa-rojo-y-dorado", nombre: "Hebilla rosa, rojo y dorado", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-015" }], tam: 0.75, fondo: 0.829 },
  { id: "charola-negra", nombre: "Charola negra", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-007" }], tam: 1.0, fondo: 0.997 },
  { id: "vertebral-chain", nombre: "Vertebral chain", marca: "En_ro", categoria: "Joyería", variantes: [{ sku: "EN-001", talla: "13" }, { sku: "EN-002", talla: "11" }], tam: 0.85, fondo: 0.989 },
  { id: "jabon-cubo-chico", nombre: "Jabón cubo chico", marca: "Laguna Cyprien", categoria: "Baño y aroma", variantes: [{ sku: "LC-001" }], tam: 0.55, fondo: 0.765 },
  { id: "vaso-verde-bosque", nombre: "Vaso verde bosque", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-002" }], tam: 0.8, fondo: 0.893 },
  { id: "hebilla-cobre-con-crochet-blanco", nombre: "Hebilla cobre con crochet blanco", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-016" }], tam: 0.75, fondo: 0.827 },
  { id: "jabonera-negra", nombre: "Jabonera negra", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-011" }], tam: 0.85, fondo: 0.768 },
  { id: "lampara-de-piso-parakata", nombre: "Lámpara de piso Parakata", marca: "Paralelo Mexicano", categoria: "Iluminación", variantes: [{ sku: "PM-003" }], tam: 1.15, fondo: 0.983 },
  { id: "lampara-pa-blanca", nombre: "Lámpara Pa blanca", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-001" }], tam: 1.0, fondo: 0.906 },
  { id: "jarra-verde-bosque", nombre: "Jarra verde bosque", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-011" }], tam: 1.0, fondo: 0.875 },
  { id: "hebilla-naranja-con-gallo-plateado", nombre: "Hebilla naranja con gallo plateado", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-017" }], tam: 0.75, fondo: 0.834 },
  { id: "set-de-bano-negro", nombre: "Set de baño negro", marca: "Casa 8", categoria: "Cerámica", variantes: [], tam: 1.0, fondo: 0.854 },
  { id: "vela-eek-chica", nombre: "Vela Eek chica", marca: "Estebanez Studio", categoria: "Velas", variantes: [{ sku: "ES-003" }], tam: 1.05, fondo: 0.771 },
  { id: "rosary-necklace", nombre: "Rosary Necklace", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-006" }], tam: 0.9, fondo: 0.976 },
  { id: "plato-verde-bosque", nombre: "Plato verde bosque", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-004" }], tam: 1.0, fondo: 0.716 },
  { id: "hebilla-azul-marino-con-pluma", nombre: "Hebilla azul marino con pluma", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-018" }], tam: 0.75, fondo: 0.828 },
  { id: "vaso-negro", nombre: "Vaso negro", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-004" }], tam: 0.8, fondo: 0.934 },
  { id: "tercer-molar", nombre: "Tercer molar", marca: "En_ro", categoria: "Joyería", variantes: [{ sku: "EN-003", talla: "L" }, { sku: "EN-004", talla: "S" }], tam: 0.65, fondo: 0.918 },
  { id: "room-spray-soliflor", nombre: "Room spray Soliflor", marca: "Laguna Cyprien", categoria: "Baño y aroma", variantes: [{ sku: "LC-003" }], tam: 0.8, fondo: 0.945 },
  { id: "taza-toronto-grande-azul-cometa", nombre: "Taza Toronto grande azul cometa", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-014" }], tam: 0.8, fondo: 0.769 },
  { id: "hebilla-carey-oscuro", nombre: "Hebilla carey oscuro", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-019" }], tam: 0.75, fondo: 0.835 },
  { id: "botella-terracota", nombre: "Botella terracota", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-003" }], tam: 1.05, fondo: 0.975 },
  { id: "portalibros-kuini", nombre: "Portalibros Kuini", marca: "Paralelo Mexicano", categoria: "Objeto", variantes: [{ sku: "PM-004" }], tam: 0.95, fondo: 0.927 },
  { id: "lampara-pa-roja", nombre: "Lámpara Pa roja", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-003" }], tam: 1.0, fondo: 0.863 },
  { id: "vaso-azul-nube", nombre: "Vaso azul nube", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-003" }], tam: 0.8, fondo: 0.901 },
  { id: "hebilla-vino-con-herraduras", nombre: "Hebilla vino con herraduras", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-020" }], tam: 0.75, fondo: 0.832 },
  { id: "vaso-liso-moteado", nombre: "Vaso liso moteado", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-010" }], tam: 0.8, fondo: 0.932 },
  { id: "vela-eek-grande", nombre: "Vela Eek grande", marca: "Estebanez Studio", categoria: "Velas", variantes: [{ sku: "ES-004" }], tam: 1.15, fondo: 0.878 },
  { id: "zitlala-tiger-pendant-mini", nombre: "Zitlala Tiger Pendant mini", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-003" }], tam: 0.55, fondo: 0.769 },
  { id: "plato-hondo-azul-nube", nombre: "Plato hondo azul nube", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-009" }], tam: 0.9, fondo: 0.735 },
  { id: "hebilla-ambar-con-herraduras", nombre: "Hebilla ámbar con herraduras", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-021" }], tam: 0.75, fondo: 0.832 },
  { id: "vaso-liso-negro", nombre: "Vaso liso negro", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-009" }], tam: 0.8, fondo: 0.931 },
  { id: "primer-molar", nombre: "Primer molar", marca: "En_ro", categoria: "Joyería", variantes: [{ sku: "EN-005" }], tam: 0.6, fondo: 0.912 },
  { id: "jabon-cubo-grande", nombre: "Jabón cubo grande", marca: "Laguna Cyprien", categoria: "Baño y aroma", variantes: [{ sku: "LC-002" }], tam: 0.7, fondo: 0.892 },
  { id: "taza-toronto-grande-verde-rana", nombre: "Taza Toronto grande verde rana", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-016" }], tam: 0.8, fondo: 0.787 },
  { id: "hebilla-rojiza-con-rifles-y-corneta", nombre: "Hebilla rojiza con rifles y corneta", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-022" }], tam: 0.75, fondo: 0.828 },
  { id: "servilletero-papatzoa-taupe", nombre: "Servilletero Papatzoa taupe", marca: "Paralelo Mexicano", categoria: "Objeto", variantes: [{ sku: "PM-001" }], tam: 0.9, fondo: 0.824 },
  { id: "vela-jamaica", nombre: "Vela Jamaica", marca: "Río Estudio", categoria: "Velas", variantes: [{ sku: "RE-001" }], tam: 0.85, fondo: 0.831 },
  { id: "lampara-pa-azul", nombre: "Lámpara Pa azul", marca: "buRRo", categoria: "Iluminación", variantes: [{ sku: "BR-002" }], tam: 1.0, fondo: 0.85 },
  { id: "plato-hondo-rojo-tomate", nombre: "Plato hondo rojo tomate", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-008" }], tam: 0.9, fondo: 0.734 },
  { id: "vaso-terracota", nombre: "Vaso terracota", marca: "Casa 8", categoria: "Cerámica", variantes: [{ sku: "CO-006" }], tam: 0.8, fondo: 0.939 },
  { id: "vela-poctapoc-chica", nombre: "Vela Poctapoc chica", marca: "Estebanez Studio", categoria: "Velas", variantes: [{ sku: "ES-001" }], tam: 1.0, fondo: 0.876 },
  { id: "zitlala-tiger-ring", nombre: "Zitlala Tiger Ring", marca: "Estella Williams", categoria: "Joyería", variantes: [{ sku: "EW-007", talla: "7" }, { sku: "EW-009", talla: "8" }, { sku: "EW-008", talla: "10" }], tam: 0.65, fondo: 0.831 },
  { id: "hebilla-plateada-con-mariposa", nombre: "Hebilla plateada con mariposa", marca: "Kmy", categoria: "Accesorios", variantes: [{ sku: "KM-023" }], tam: 0.75, fondo: 0.831 },
  { id: "plato-hondo-verde-bosque", nombre: "Plato hondo verde bosque", marca: "Mot", categoria: "Cerámica", variantes: [{ sku: "MT-007" }], tam: 0.9, fondo: 0.735 },
  { id: "vertebral-chain-eslabon", nombre: "Vertebral chain, eslabón", marca: "En_ro", categoria: "Joyería", variantes: [{ sku: "EN-001", talla: "13" }, { sku: "EN-002", talla: "11" }], tam: 0.6, fondo: 0.981 },
  { id: "room-spray-fica-folia", nombre: "Room spray Fica folia", marca: "Laguna Cyprien", categoria: "Baño y aroma", variantes: [{ sku: "LC-004" }], tam: 0.8, fondo: 0.967 },
  { id: "portalibros-yakata", nombre: "Portalibros Yakata", marca: "Paralelo Mexicano", categoria: "Objeto", variantes: [{ sku: "PM-002" }], tam: 0.9, fondo: 0.813 },
  { id: "vela-ocote", nombre: "Vela Ocote", marca: "Río Estudio", categoria: "Velas", variantes: [{ sku: "RE-001" }], tam: 0.85, fondo: 0.875 },
];

export const PRODUCTOS: Producto[] = LISTA.map((p) => ({
  ...p,
  src: `/productos/${p.id}-800.webp`,
  srcGrande: `/productos/${p.id}-1600.webp`,
}));

// Inventario al publicar (13 nov 2026). Lo reemplaza lo que responda el admin.
export const RESPALDO: Inventario = {
  "BR-001": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-002": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-003": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-004": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-005": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-006": { precio: 1220, disponible: 3, estado: "disponible" },
  "BR-007": { precio: 2150, disponible: 2, estado: "disponible" },
  "BR-008": { precio: 2150, disponible: 2, estado: "disponible" },
  "CO-001": { precio: null, disponible: 2, estado: "disponible" },
  "CO-002": { precio: null, disponible: 2, estado: "disponible" },
  "CO-003": { precio: null, disponible: 1, estado: "disponible" },
  "CO-004": { precio: null, disponible: 2, estado: "disponible" },
  "CO-005": { precio: null, disponible: 2, estado: "disponible" },
  "CO-006": { precio: null, disponible: 1, estado: "disponible" },
  "CO-007": { precio: null, disponible: 1, estado: "disponible" },
  "CO-008": { precio: null, disponible: 1, estado: "disponible" },
  "CO-009": { precio: null, disponible: 1, estado: "disponible" },
  "CO-010": { precio: null, disponible: 2, estado: "disponible" },
  "CO-011": { precio: null, disponible: 1, estado: "disponible" },
  "CO-012": { precio: null, disponible: 1, estado: "disponible" },
  "EN-001": { precio: 14850, disponible: 1, estado: "disponible" },
  "EN-002": { precio: 13250, disponible: 1, estado: "disponible" },
  "EN-003": { precio: 8050, disponible: 1, estado: "disponible" },
  "EN-004": { precio: 6250, disponible: 1, estado: "disponible" },
  "EN-005": { precio: 4240, disponible: 1, estado: "disponible" },
  "ES-001": { precio: 2600, disponible: 1, estado: "disponible" },
  "ES-002": { precio: 2000, disponible: 1, estado: "disponible" },
  "ES-003": { precio: 2000, disponible: 1, estado: "disponible" },
  "ES-004": { precio: 2900, disponible: 1, estado: "disponible" },
  "ES-005": { precio: 2165, disponible: 1, estado: "disponible" },
  "ES-006": { precio: 13000, disponible: 1, estado: "disponible" },
  "EW-001": { precio: 3250, disponible: 0, estado: "agotado" },
  "EW-002": { precio: 4500, disponible: 1, estado: "disponible" },
  "EW-003": { precio: 2405, disponible: 1, estado: "disponible" },
  "EW-004": { precio: 4500, disponible: 1, estado: "disponible" },
  "EW-005": { precio: 2850, disponible: 1, estado: "disponible" },
  "EW-006": { precio: 4500, disponible: 1, estado: "disponible" },
  "EW-007": { precio: 3250, disponible: 1, estado: "disponible" },
  "EW-008": { precio: 3250, disponible: 1, estado: "disponible" },
  "EW-009": { precio: 3250, disponible: 1, estado: "disponible" },
  "KM-009": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-010": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-011": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-012": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-013": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-014": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-015": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-016": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-017": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-018": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-019": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-020": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-021": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-022": { precio: 2300, disponible: 1, estado: "disponible" },
  "KM-023": { precio: 2300, disponible: 1, estado: "disponible" },
  "LC-001": { precio: 100, disponible: 5, estado: "disponible" },
  "LC-002": { precio: 250, disponible: 5, estado: "disponible" },
  "LC-003": { precio: 260, disponible: 2, estado: "disponible" },
  "LC-004": { precio: 260, disponible: 0, estado: "agotado" },
  "MT-001": { precio: 550, disponible: 2, estado: "disponible" },
  "MT-002": { precio: 550, disponible: 2, estado: "disponible" },
  "MT-003": { precio: 550, disponible: 2, estado: "disponible" },
  "MT-004": { precio: 610, disponible: 2, estado: "disponible" },
  "MT-005": { precio: 610, disponible: 2, estado: "disponible" },
  "MT-006": { precio: 610, disponible: 2, estado: "disponible" },
  "MT-007": { precio: 620, disponible: 2, estado: "disponible" },
  "MT-008": { precio: 620, disponible: 2, estado: "disponible" },
  "MT-009": { precio: 620, disponible: 2, estado: "disponible" },
  "MT-010": { precio: 1600, disponible: 2, estado: "disponible" },
  "MT-011": { precio: 1600, disponible: 2, estado: "disponible" },
  "MT-012": { precio: 1600, disponible: 2, estado: "disponible" },
  "MT-013": { precio: 490, disponible: 1, estado: "disponible" },
  "MT-014": { precio: 560, disponible: 1, estado: "disponible" },
  "MT-015": { precio: 490, disponible: 1, estado: "disponible" },
  "MT-016": { precio: 560, disponible: 1, estado: "disponible" },
  "PM-001": { precio: 3249, disponible: 1, estado: "disponible" },
  "PM-002": { precio: 3049, disponible: 1, estado: "disponible" },
  "PM-003": { precio: 29450, disponible: 1, estado: "disponible" },
  "PM-004": { precio: 5999, disponible: 1, estado: "disponible" },
  "RE-001": { precio: null, disponible: 4, estado: "disponible" },
};

// Precio y existencias de una variante, o de la pieza completa si tiene varias.
export function estadoDe(p: Producto, inv: Inventario, sku?: string) {
  const vs = sku ? p.variantes.filter((v) => v.sku === sku) : p.variantes;
  const filas = vs.map((v) => inv[v.sku]).filter(Boolean);
  if (!filas.length) return { precio: null, disponible: null as number | null, estado: "disponible" as EstadoInv };
  const disponible = filas.reduce((s, f) => s + f.disponible, 0);
  const precios = filas.map((f) => f.precio).filter((x): x is number => x !== null);
  const estado: EstadoInv = disponible <= 0 ? "agotado" : filas.some((f) => f.estado === "bajo") && filas.every((f) => f.estado !== "disponible") ? "bajo" : "disponible";
  return { precio: precios.length ? Math.min(...precios) : null, disponible, estado };
}

export const formatoPrecio = (precio: number | null) =>
  precio === null ? "precio por confirmar" : `$${precio.toLocaleString("es-MX")} MXN`;

// "última pieza", "quedan 2" o "agotado"; nada si hay de sobra.
export const avisoExistencias = (estado: EstadoInv, disponible: number | null) =>
  estado === "agotado" ? "agotado" : estado === "bajo" ? (disponible === 1 ? "última pieza" : `quedan ${disponible}`) : "";

// Datos del sitio. Lo que está entre corchetes falta confirmar.
export const SITIO = {
  nombre: "Piso ikpali",
  direccion: "Lafayette 64, Anzures",
  ciudad: "Ciudad de México",
  dentroDe: "Dentro de Fayet",
  horario: "[horario por confirmar]",
  email: "hola@pisoikpali.com",
  whatsapp: "", // solo dígitos con lada, p. ej. 5215512345678. Vacío = el formulario manda correo.
  instagram: "piso.ikpali",
};
