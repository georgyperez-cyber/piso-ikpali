import { SITIO } from "./productos";

// El aviso de privacidad, en secciones. Lo usan la tarjeta de la barra y la
// página /landing/privacidad.

export const AVISO: [string, React.ReactNode][] = [
  [
    "Quién",
    <>
      {SITIO.nombre} es un espacio de ikpali studio, con domicilio en {SITIO.direccion}, {SITIO.ciudad}. Es el responsable de los datos que recibe por esta página.
    </>,
  ],
  [
    "Qué datos",
    <>
      Los que escribes en el formulario cuando te interesa una pieza: tu nombre y un correo o número de WhatsApp para contestarte, y el mensaje que quieras dejar. No pedimos nada más.
    </>,
  ],
  [
    "Para qué",
    <>
      Para responderte sobre la pieza que te interesó, confirmarte disponibilidad y precio, y acordar la entrega o la visita a la tienda. Si nos lo pides, también para avisarte de piezas nuevas.
    </>,
  ],
  [
    "Con quién",
    <>
      Con nadie. Cuando una pieza se vende, la marca que la hizo recibe el dato de la venta, no tus datos de contacto. No vendemos ni cedemos información a terceros.
    </>,
  ],
  [
    "Cuánto tiempo",
    <>
      Mientras haya una conversación abierta contigo. Si quieres que borremos tus datos antes, basta con escribirnos.
    </>,
  ],
  [
    "Tus derechos",
    <>
      Puedes pedirnos acceder, corregir, cancelar u oponerte al uso de tus datos (derechos ARCO) escribiendo a{" "}
      <a href={`mailto:${SITIO.email}`}>{SITIO.email}</a>. Te contestamos en un máximo de veinte días hábiles.
    </>,
  ],
  [
    "Cookies",
    <>
      Esta página no usa cookies de rastreo ni publicidad. Guarda un solo dato en tu navegador, y solo durante la visita: que ya pasó la animación de entrada.
    </>,
  ],
];
