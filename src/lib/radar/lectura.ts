// Lectura del radar: lo que se concluye al ver el material, corte por corte.
// La escribe Claude en sesión (no la rutina automática) y se sube con un push.
// Regla del radar de museos: cada descubrimiento lleva su cifra y su límite;
// cada jugada dice en qué se sostiene. Nada sale solo de captions.

export type Lectura = {
  fecha: string; // YYYY-MM-DD
  titulo: string;
  metodo: string;
  actividad: { handle: string; ultimo: string; en28: string; seVe: string }[];
  descubrimientos: { titulo: string; texto: string; limite: string }[];
  jugadas: { titulo: string; texto: string; sustento: string }[];
};

export const LECTURA: Lectura = {
  fecha: "2026-11-12",
  titulo: "Lectura del corte del 12 de noviembre",
  metodo:
    "Hecha con las 12 publicaciones más recientes de cada cuenta (263 en total) y viendo el material de los pares: sus grids completos y, cuadro por cuadro, el reel más fuerte. La respuesta se mide en likes más comentarios; Instagram no publica alcance, guardados ni vistas.",
  actividad: [
    {
      handle: "originario.originario",
      ultimo: "10 de noviembre",
      en28: "8",
      seVe: "Instalaciones y sets de color saturado, objeto en vitrina. 266 interacciones por publicación propia. 5 de 12 son colaboraciones.",
    },
    {
      handle: "onoracasa",
      ultimo: "12 de noviembre",
      en28: "9",
      seVe: "Bodegones de producto en luz baja, altar de Día de Muertos y placas con tipografía. 5 reels de 12. Oculta los likes en 8 de 12; en las 4 visibles, 137 por publicación.",
    },
    {
      handle: "utilitariomexicano",
      ultimo: "12 de noviembre",
      en28: "6",
      seVe: "Un objeto por publicación sobre fondo gris claro, sin personas ni texto. 8.5 interacciones por publicación.",
    },
    {
      handle: "piso.ikpali",
      ultimo: "5 de noviembre",
      en28: "8",
      seVe: "Serie de adelanto: acercamientos a materiales y piezas, tres imágenes de obra y una colaboración con MOT. Likes ocultos; de 0 a 3 comentarios.",
    },
    {
      handle: "g_mexicana",
      ultimo: "28 de octubre",
      en28: "1",
      seVe: "Producto en interiores montados, dos retratos de diseñadores y un flyer. 19 interacciones por publicación.",
    },
    {
      handle: "seleccionmarsella",
      ultimo: "17 de octubre",
      en28: "1",
      seVe: "Objeto en primer plano con luz baja, manos en dos. 17 interacciones por publicación.",
    },
    {
      handle: "escalina_",
      ultimo: "fines de julio",
      en28: "0",
      seVe: "Series por color, mobiliario y vidrio. 20 interacciones por publicación. La más fuerte de las 12 es la única con una persona.",
    },
    {
      handle: "taxonomiamx",
      ultimo: "1 de abril de 2020",
      en28: "0",
      seVe: "Cuenta detenida. Su última publicación es el aviso de cierre temporal por la pandemia.",
    },
  ],
  descubrimientos: [
    {
      titulo: "Piso ikpali tiene los likes ocultos",
      texto:
        "Sus 10 publicaciones propias. Desde fuera solo se ven los comentarios, de 0 a 3 por publicación, así que el radar no puede comparar su respuesta con la de nadie.",
      limite: "ustedes sí la ven en Insights. Con 56 seguidores, además, un porcentaje no dice nada: un like es 1.8%.",
    },
    {
      titulo: "La respuesta no sigue al tamaño",
      texto:
        "Utilitario Mexicano, con 41 mil seguidores, recibe 8.5 interacciones por publicación. Originario, con 36.8 mil, recibe 266. Casi el mismo tamaño y 30 veces la respuesta: uno publica catálogo sobre fondo gris y el otro sets e instalaciones.",
      limite: "son dos cuentas, 12 y 6 publicaciones. El catálogo puede vender sin generar likes; ventas y guardados no se ven.",
    },
    {
      titulo: "La pieza más fuerte de los pares es un montaje con gente",
      texto:
        "El reel donde Originario arma su ofrenda con @andresg_estudio: 6,525 likes y 91 comentarios, 25 veces su mediana. Visto cuadro por cuadro: personas cortando papel, alguien en una escalera, dos colgando una pieza. En Escalina, la más fuerte de las 12 también es la única con una persona.",
      limite:
        "el reel junta tres cosas a la vez: colaboración con la cuenta del fundador, evento de Open House CDMX y proceso con gente. No se puede atribuir a una sola.",
    },
    {
      titulo: "Las colaboraciones traen respuesta prestada",
      texto:
        "En 8 de las 9 cuentas donde se puede medir, la mediana de las colaboraciones supera a la de las propias: 1,965 contra 266 en Originario, 1,169 contra 31 en Ton Ton Textil. En Piso ikpali, la publicación con MOT tiene 256 likes y 20 comentarios.",
      limite:
        "esas interacciones vienen sobre todo de la audiencia de la otra cuenta. Y no toda colaboración sube: las dos de Originario por su colección GOTEO quedaron en 189 y 238, como una propia.",
    },
    {
      titulo: "El evento por sí solo no sube la respuesta",
      texto:
        "Las publicaciones propias de Originario sobre la ofrenda, la de horarios (126) y la de último día (261), quedaron en su mediana o abajo. Lo que subió fue la pieza de montaje compartida.",
      limite: "son dos publicaciones.",
    },
    {
      titulo: "El formato no explica la respuesta",
      texto:
        "Entre los pares, los reels tienen el doble de ER que carruseles y fotos (0.49% contra 0.21% y 0.20%). Pero dentro de una misma cuenta el reel gana en 4, pierde en 4 y empata en 1.",
      limite: "pocos reels por cuenta, de 2 a 7.",
    },
    {
      titulo: "De los 7 pares directos, 3 publican con regularidad",
      texto:
        "Originario, Onora y Utilitario Mexicano. Galería Mexicana de Diseño y Selección Marsella publicaron una vez en 28 días, Escalina no publica desde julio y Taxonomía desde 2020. Fuera de los pares, Casa Cler cerró y Casa Mandarine no publica desde junio.",
      limite: "solo se ve el grid, no las historias.",
    },
  ],
  jugadas: [
    {
      titulo: "Colaboraciones con las marcas en consigna",
      texto:
        "Cada marca trae su propia audiencia y Piso ikpali tiene 56 seguidores. Una publicación compartida aparece también en el grid de la marca.",
      sustento:
        "8 de 9 cuentas, y la de MOT es lo más visto de Piso ikpali. Falta saber cuántos seguidores deja cada una: eso solo se ve comparando seguidores antes y después.",
    },
    {
      titulo: "Grabar el montaje del 5 de diciembre con gente",
      texto:
        "Marcas llegando, piezas acomodándose, la tienda armándose. Compartido con @ffaayyeett y con las marcas que salgan. En la serie de adelanto ya hay tres imágenes de obra.",
      sustento:
        "el reel de Originario y la publicación de Escalina. Son dos casos y el primero mezcla colaboración y evento. En el radar de museos la persona en escena fue la presencia de mayor alcance, pero es otro sector.",
    },
    {
      titulo: "Dejar los avisos para historias",
      texto: "Horarios, recordatorios y último día fueron lo más bajo del mes de Originario.",
      sustento: "débil: dos publicaciones de una cuenta. Es barato de probar.",
    },
    {
      titulo: "Mostrar los likes o pasar los números de Insights",
      texto:
        "Mientras estén ocultos, el radar ve a los demás pero no a Piso ikpali. Las dos opciones sirven: mostrarlos, o pasar cada lunes alcance e interacciones desde Insights.",
      sustento: "Onora, LAGO, Vena y MUMEDI también ocultan la mayoría. Es decisión de marca, no de método.",
    },
  ],
};
