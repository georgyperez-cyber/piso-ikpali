// Radar de Instagram de Piso ikpali: cuentas que se siguen cada semana.
// Para agregar o quitar una tienda, edita esta lista y haz push. La siguiente
// corrida (lunes) ya la toma en cuenta. `handle: null` = todavía sin verificar;
// esa cuenta no se consulta hasta que tenga handle.

// Círculos, como en el radar de museos:
// - pares: casa, mobiliario y objeto (lo mismo que vende Piso ikpali). Las medianas de referencia salen de aquí.
// - audiencia: concept stores de moda, regalo o coleccionable que compiten por el mismo público en CDMX.
// - estados: tiendas de diseño mexicano fuera de CDMX.
export type Circle = "pares" | "audiencia" | "estados";

export type RosterEntry = {
  name: string;
  handle: string | null;
  city: string;
  circle: Circle;
  you?: boolean;
  nota?: string; // estado que conviene ver junto al nombre
  fuera?: boolean; // se muestra, pero no entra en las medianas de referencia
};

export const ROSTER: RosterEntry[] = [
  { name: "Piso ikpali", handle: "piso.ikpali", city: "CDMX", circle: "pares", you: true },

  // CDMX
  { name: "Onora", handle: "onoracasa", city: "CDMX", circle: "pares" },
  { name: "Utilitario Mexicano", handle: "utilitariomexicano", city: "CDMX", circle: "pares" },
  { name: "LAGO", handle: "lagolatam", city: "CDMX", circle: "audiencia" },
  { name: "Happening Store", handle: "happeningstore", city: "CDMX", circle: "audiencia" },
  { name: "Originario", handle: "originario.originario", city: "CDMX", circle: "pares" },
  { name: "Taxonomía", handle: "taxonomiamx", city: "CDMX", circle: "pares", nota: "sin publicar desde abril de 2020", fuera: true },
  { name: "Selección Marsella", handle: "seleccionmarsella", city: "CDMX", circle: "pares" },
  { name: "Escalina", handle: "escalina_", city: "CDMX", circle: "pares", nota: "sin publicar desde julio" },
  { name: "PisoTres", handle: "pisotresg56", city: "CDMX", circle: "audiencia" },
  { name: "B Artesanal", handle: "bartesanalconceptstore", city: "CDMX", circle: "audiencia" },
  { name: "Casa Mandarine", handle: "casamandarine", city: "CDMX", circle: "audiencia", nota: "sin publicar desde junio" },
  { name: "Vena", handle: "shop__vena", city: "CDMX", circle: "audiencia" },
  { name: "MUMEDI Shop", handle: "mumedi_oficial", city: "CDMX", circle: "audiencia" },
  { name: "Galería Mexicana de Diseño", handle: "g_mexicana", city: "CDMX", circle: "pares" },
  { name: "AGO Projects", handle: "agoprojects", city: "CDMX", circle: "audiencia" },

  // Otros estados
  { name: "Nimia", handle: null, city: "Guadalajara", circle: "estados" },
  { name: "Casa Cler", handle: "casacler", city: "Monterrey", circle: "estados", nota: "anunció su cierre en abril de 2026", fuera: true },
  { name: "Casa T'HŌ", handle: "casatho.concepthouse", city: "Mérida", circle: "estados" },
  { name: "Marchanta", handle: "marchantastore", city: "Oaxaca", circle: "estados" },
  { name: "Cooperativa 1050°", handle: "1050grados", city: "Oaxaca", circle: "estados" },
  { name: "Ton Ton Textil", handle: "tonton.textil", city: "San Cristóbal de las Casas", circle: "estados" },
  { name: "Dôce 18", handle: "doce18concepthouse", city: "San Miguel de Allende", circle: "estados" },
];
