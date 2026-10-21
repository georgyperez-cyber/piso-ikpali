// Catálogo de /landing.
//
// Por ahora son placeholders: las fotos son las del pitch (hero-icono-foto-N)
// y los nombres, marcas y precios se asignaron a ojo. Cuando llegue la lista
// final con sus fotos, se sustituye este arreglo y nada más.
//
// `precio` en pesos con IVA incluido; null = "precio por confirmar".

export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number | null;
  src: string;
  // Tamaño relativo dentro del tablero (1 = celda completa). Da ritmo: las
  // piezas chicas (anillos, hebillas) no deben verse del tamaño de una jarra.
  tam: number;
  // Borde inferior del objeto dentro de su foto (0 a 1). Sirve para colgar el
  // nombre justo debajo de la pieza y no debajo del aire transparente.
  fondo?: number;
};

const foto = (n: number) => `/assets-optimized/hero-icono-foto-${n}-720.webp`;

export const PRODUCTOS: Producto[] = [
  { id: "p01", nombre: "Clutch classic con piedras", marca: "Aventurina", categoria: "Bolsas", precio: null, src: foto(1), tam: 0.95 },
  { id: "p02", nombre: "Vela Jamaica", marca: "Paralelo Mexicano", categoria: "Velas", precio: null, src: foto(2), tam: 0.85 },
  { id: "p03", nombre: "Bowl sumy verde bosque", marca: "Mot", categoria: "Cerámica", precio: 620, src: foto(3), tam: 1 },
  { id: "p04", nombre: "Dominó de madera", marca: "Paralelo Mexicano", categoria: "Objeto", precio: null, src: foto(4), tam: 1.05 },
  { id: "p05", nombre: "Jarra odesa rojo tomate", marca: "Mot", categoria: "Cerámica", precio: 1600, src: foto(5), tam: 1 },
  { id: "p06", nombre: "Vasija baakel", marca: "Estebanez Studio", categoria: "Objeto", precio: 2165, src: foto(6), tam: 0.95 },
  { id: "p07", nombre: "Botella negra", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(7), tam: 1.1 },
  { id: "p08", nombre: "Diablo mask pendant", marca: "Estella Williams", categoria: "Joyería", precio: 4500, src: foto(8), tam: 0.7 },
  { id: "p09", nombre: "Botella y vaso", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(9), tam: 0.8 },
  { id: "p10", nombre: "Vela en caja", marca: "Paralelo Mexicano", categoria: "Velas", precio: null, src: foto(10), tam: 0.85 },
  { id: "p11", nombre: "Plato moa verde bosque", marca: "Mot", categoria: "Cerámica", precio: 610, src: foto(11), tam: 1.05 },
  { id: "p12", nombre: "Jabonera", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(12), tam: 0.9 },
  { id: "p13", nombre: "Vaso", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(13), tam: 0.85 },
  { id: "p14", nombre: "Hebilla nacarado ámbar", marca: "Kmy", categoria: "Accesorios", precio: null, src: foto(14), tam: 0.75 },
  { id: "p15", nombre: "Vela Ocote", marca: "Paralelo Mexicano", categoria: "Velas", precio: null, src: foto(15), tam: 0.85 },
  { id: "p16", nombre: "Zitlala tiger ring", marca: "Estella Williams", categoria: "Joyería", precio: 3250, src: foto(16), tam: 0.7 },
  { id: "p17", nombre: "Vela Poctapoc", marca: "Estebanez Studio", categoria: "Velas", precio: 2600, src: foto(17), tam: 0.95 },
  { id: "p18", nombre: "Vaso kyoto verde bosque", marca: "Mot", categoria: "Cerámica", precio: 550, src: foto(18), tam: 0.85 },
  { id: "p19", nombre: "Hebilla láser", marca: "Kmy", categoria: "Accesorios", precio: null, src: foto(19), tam: 0.75 },
  { id: "p20", nombre: "Florero toronto", marca: "Mot", categoria: "Cerámica", precio: null, src: foto(20), tam: 0.95 },
  { id: "p21", nombre: "Zitlala tiger ring talla 10", marca: "Estella Williams", categoria: "Joyería", precio: 3250, src: foto(21), tam: 0.7 },
  { id: "p22", nombre: "Jabonera negra", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(22), tam: 0.9 },
  { id: "p23", nombre: "Chilapa tiger ring", marca: "Estella Williams", categoria: "Joyería", precio: 3250, src: foto(23), tam: 0.7 },
  { id: "p24", nombre: "Plato moa rojo tomate", marca: "Mot", categoria: "Cerámica", precio: 610, src: foto(24), tam: 1.05 },
  { id: "p25", nombre: "Zitlala tiger pendant", marca: "Estella Williams", categoria: "Joyería", precio: 3250, src: foto(25), tam: 0.75 },
  { id: "p26", nombre: "Charola con piedra", marca: "Estebanez Studio", categoria: "Objeto", precio: null, src: foto(26), tam: 0.9 },
  { id: "p27", nombre: "Florero verde bosque", marca: "Mot", categoria: "Cerámica", precio: null, src: foto(27), tam: 0.95 },
  { id: "p28", nombre: "Charola moteada", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(28), tam: 0.9 },
  { id: "p29", nombre: "Jarra odesa verde bosque", marca: "Mot", categoria: "Cerámica", precio: 1600, src: foto(29), tam: 1 },
  { id: "p30", nombre: "Vaso kyoto azul nube", marca: "Mot", categoria: "Cerámica", precio: 550, src: foto(30), tam: 0.85 },
  { id: "p31", nombre: "Vela Baakel", marca: "Estebanez Studio", categoria: "Velas", precio: 2000, src: foto(31), tam: 0.95 },
  { id: "p32", nombre: "Hebilla gallo", marca: "Kmy", categoria: "Accesorios", precio: null, src: foto(32), tam: 0.75 },
  { id: "p33", nombre: "Bowl sumy azul nube", marca: "Mot", categoria: "Cerámica", precio: 620, src: foto(33), tam: 1 },
  { id: "p34", nombre: "Vaso kyoto rojo tomate", marca: "Mot", categoria: "Cerámica", precio: 550, src: foto(34), tam: 0.85 },
  { id: "p35", nombre: "Vaso terracota", marca: "Casa 8", categoria: "Cerámica", precio: null, src: foto(35), tam: 0.85 },
  { id: "p36", nombre: "Caja de madera", marca: "Paralelo Mexicano", categoria: "Objeto", precio: null, src: foto(36), tam: 1.05 },
  { id: "p37", nombre: "Bowl sumy rojo tomate", marca: "Mot", categoria: "Cerámica", precio: 620, src: foto(37), tam: 1 },
  { id: "p38", nombre: "Plato moa azul nube", marca: "Mot", categoria: "Cerámica", precio: 610, src: foto(38), tam: 1.05 },
  { id: "p39", nombre: "Vela EEK grande", marca: "Estebanez Studio", categoria: "Velas", precio: 2900, src: foto(39), tam: 1 },
  { id: "p40", nombre: "Rosary necklace", marca: "Estella Williams", categoria: "Joyería", precio: 4500, src: foto(40), tam: 0.9 },
  { id: "p41", nombre: "Florero azul cometa", marca: "Mot", categoria: "Cerámica", precio: null, src: foto(41), tam: 0.95 },
];

// Medido sobre las fotos actuales (alpha > 10 %). Se recalcula cuando cambien.
const FONDO: Record<number, number> = {
1: 0.708, 2: 0.793, 3: 0.693, 4: 0.689, 5: 0.768, 6: 0.746, 7: 0.925, 8: 0.769, 9: 0.738, 10: 0.803, 11: 0.669, 12: 0.688, 13: 0.803, 14: 0.707, 15: 0.818, 16: 0.775, 17: 0.706, 18: 0.762, 19: 0.707, 20: 0.817, 21: 0.769, 22: 0.686, 23: 0.735, 24: 0.669, 25: 0.875, 26: 0.708, 27: 0.817, 28: 0.674, 29: 0.769, 30: 0.761, 31: 0.722, 32: 0.708, 33: 0.693, 34: 0.761, 35: 0.794, 36: 0.699, 37: 0.693, 38: 0.669, 39: 0.91, 40: 0.844, 41: 0.81,
};
PRODUCTOS.forEach((p) => {
  const n = Number(p.src.match(/foto-(\d+)-/)?.[1]);
  if (FONDO[n]) p.fondo = FONDO[n];
});

export const formatoPrecio = (precio: number | null) =>
  precio === null
    ? "precio por confirmar"
    : `$${precio.toLocaleString("es-MX")} MXN`;

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
