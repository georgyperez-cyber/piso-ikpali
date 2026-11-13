"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./radar.module.css";

type Pieza = {
  c: string;
  h: string;
  ci: string;
  ts: string;
  k: "reel" | "carrusel" | "foto";
  l: number | null;
  cm: number | null;
  p: number | null;
  d: number | null;
  ix: number | null;
  cap: string;
  pa: string;
  pi: string;
  dm: boolean;
  n: string;
  tr: string;
  so: { u: string; sg: number | null }[];
  au: string | null;
  mu: string | null;
  ni: number | null;
  st: boolean;
  hr: number;
  dw: number;
};
type Texto = { t: string; x: string };
type Fila = {
  nombre: string;
  ix: number | null;
  n: number;
  arriba: number;
  ctas: number;
};
type Pregunta = {
  q: string;
  r: string;
  x: string;
  nota: string;
  certeza: "alta" | "media" | "baja";
  graf: string | null;
};
export type Corte = {
  meta: {
    periodo: string;
    piezas: number;
    reels: number;
    carruseles: number;
    fotos: number;
    cuentas: number;
    total: number;
  };
  frase: string;
  palanca: string;
  kpis: { v: string; l: string; s?: string }[];
  posicion: Texto[];
  dejar: Texto[];
  medir: Texto[];
  notas: Record<string, string>;
  jugadas: {
    titulo: string;
    fact: string;
    imp: string;
    porque: string;
    como: string;
    limite: string;
    ej: string[];
  }[];
  estrategia: {
    intro: string;
    preguntas: Pregunta[];
    mezcla: {
      t: string;
      x: string;
      reel: number;
      carrusel: number;
      foto: number;
    };
    semana: { t: string; items: Texto[] };
    nosabe: string[];
  };
  top: string[];
  graf: {
    mezcla: {
      h: string;
      n: string;
      ci: string;
      seg: number;
      total: number;
      reel: number;
      carrusel: number;
      foto: number;
      sem: number;
      comp: number;
    }[];
    mix: Record<string, number>;
    semanas: {
      w: number;
      reel: number;
      carrusel: number;
      foto: number;
      piso: number;
    }[];
    puntos: {
      c: string;
      h: string;
      k: string;
      hr: number;
      dw: number;
      ix: number;
    }[];
    pisoH: { hr: number; dw: number }[];
    alcance: {
      h: string;
      n: string;
      seg: number;
      plays: number;
      reels: number;
    }[];
    colab: {
      c: string;
      h: string;
      k: string;
      tam: number;
      ix: number;
      s: string;
    }[];
    idx: Record<string, Fila[]>;
  };
  cuentas: {
    h: string;
    n: string;
    ci: string;
    city: string;
    seg: number;
    piezas: number;
    sem: number;
    reels: number;
    plays: number | null;
    inter: number | null;
    ocultos: number;
    comp: number;
    dias: number | null;
    desde: string | null;
  }[];
  piezas: Pieza[];
  nombres: Record<string, string>;
  PANT: Record<string, string>;
  PIL: Record<string, string>;
  terminos: { k: string; re: string; x: string }[];
  metodo: string[];
  limites: string[];
};

type Orden = "vistas" | "indice" | "respuesta" | "fecha";
type Filtros = Record<
  "cuenta" | "circulo" | "formato" | "pantalla" | "pilar" | "comp",
  string[]
>;
const SIN_FILTRO: Filtros = {
  cuenta: [],
  circulo: [],
  formato: [],
  pantalla: [],
  pilar: [],
  comp: [],
};
const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const DIAS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const CIRC: Record<string, string> = {
  yo: "CDMX",
  pares: "CDMX · par directo",
  audiencia: "CDMX · audiencia",
};
const TABS = [
  "Panorama",
  "Jugadas",
  "Estrategia",
  "Evidencia",
  "Método",
] as const;
const GRAF: Record<string, [string, string][]> = {
  formato: [["formato", "Likes y comentarios, publicaciones propias"]],
  audio: [["audio", "Reels propios"]],
  dur: [["dur", "Reels propios"]],
  pant: [
    ["pantReel", "Reels propios"],
    ["pantPost", "Fotos y carruseles propios"],
  ],
  pilar: [
    ["pilPost", "Fotos y carruseles propios"],
    ["pilReel", "Reels, propios y compartidos"],
  ],
  socio: [
    ["socioReel", "Reels"],
    ["socioPost", "Fotos y carruseles"],
  ],
  hora: [["hora", "Publicaciones propias, hora de la Ciudad de México"]],
  texto: [["texto", "Publicaciones propias, largo del texto"]],
};
const ROJO = "#ed3424",
  TINTA = ROJO,
  MEDIO = "#f69a92",
  CLARO = "#fbccc8",
  REJILLA = "#fde6e4";
const CONTORNO = { background: "#fff", boxShadow: `inset 0 0 0 1.5px ${ROJO}` };

const miles = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
function num(n: number | null): string {
  if (n === null) return "";
  if (n >= 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")} mil`;
  if (n < 10 && !Number.isInteger(n)) return n.toFixed(1);
  return miles(n);
}
function veces(x: number): string {
  if (x >= 10) return miles(x);
  if (x >= 2) return x.toFixed(1);
  return x.toFixed(2);
}
function hora(h: number): string {
  const m = Math.round((h % 1) * 60);
  return `${Math.floor(h)}:${m < 10 ? "0" : ""}${m}`;
}
function fecha(iso: string): string {
  const d = new Date(Date.parse(iso) - 6 * 3600 * 1000);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}
const duracion = (s: number) =>
  s >= 90 ? `${Math.round(s / 60)} min` : `${s} s`;
const respuesta = (p: Pieza) => (p.l ?? 0) + (p.cm ?? 0);
function ultima(dias: number | null, desde: string | null): string {
  if (dias === null) return "";
  if (dias <= 0) return "hoy";
  if (dias > 60 && desde)
    return `${MESES[Number(desde.slice(5)) - 1]} ${desde.slice(0, 4)}`;
  return `hace ${dias} d`;
}
const lg = (v: number, lo: number, hi: number) =>
  (Math.log(Math.min(Math.max(v, lo), hi)) - Math.log(lo)) /
  (Math.log(hi) - Math.log(lo));
const color = (k: string) =>
  k === "reel" ? TINTA : k === "carrusel" ? MEDIO : CLARO;

export default function RadarView({ corte }: { corte: Corte }) {
  const [tab, setTab] = useState(0);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [orden, setOrden] = useState<Orden>("vistas");
  const [f, setF] = useState<Filtros>(SIN_FILTRO);
  const [menu, setMenu] = useState<keyof Filtros | null>(null);
  const [tip, setTip] = useState<{
    x: number;
    y: number;
    arriba: boolean;
    t: string;
  } | null>(null);
  const salto = useRef<string | null>(null);

  const porCodigo = useMemo(
    () => new Map(corte.piezas.map((p) => [p.c, p])),
    [corte],
  );
  const TERMS = useMemo(
    () =>
      corte.terminos.map((t) => ({
        k: t.k,
        x: t.x,
        rx: new RegExp(`(?<![\\wáéíóúñ])(?:${t.re})(?![\\wáéíóúñ])`, "i"),
      })),
    [corte],
  );
  const propias = corte.piezas.filter((p) => p.ci === "yo");
  const nombreDe = (h: string) => corte.nombres[h] || h;

  // Texto con negritas (**así**) y términos del glosario resaltados, con su definición al pasar el cursor.
  const marcar = (
    seg: string,
    usados: Set<string>,
    base: string,
  ): ReactNode[] => {
    const out: ReactNode[] = [];
    let rest = seg;
    let n = 0;
    while (rest) {
      let best: { k: string; x: string; i: number; s: string } | null = null;
      for (const t of TERMS) {
        if (usados.has(t.k)) continue;
        const m = t.rx.exec(rest);
        if (
          m &&
          (!best ||
            m.index < best.i ||
            (m.index === best.i && m[0].length > best.s.length))
        )
          best = { k: t.k, x: t.x, i: m.index, s: m[0] };
      }
      if (!best) {
        out.push(rest);
        break;
      }
      usados.add(best.k);
      out.push(rest.slice(0, best.i));
      out.push(
        <span
          key={`${base}-${n++}`}
          className={styles.term}
          data-def={best.x}
          tabIndex={0}
        >
          {best.s}
        </span>,
      );
      rest = rest.slice(best.i + best.s.length);
    }
    return out;
  };
  // Ligas a publicaciones: [texto](código de Instagram).
  const ligas = (
    seg: string,
    usados: Set<string>,
    base: string,
  ): ReactNode[] => {
    const out: ReactNode[] = [];
    const rx = /\[([^\]]+)\]\(([\w-]{6,})\)/g;
    let last = 0;
    let n = 0;
    let m: RegExpExecArray | null;
    while ((m = rx.exec(seg))) {
      out.push(...marcar(seg.slice(last, m.index), usados, `${base}-${n}`));
      out.push(
        <a
          key={`${base}-l${n}`}
          className={styles.liga}
          href={`https://www.instagram.com/p/${m[2]}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {m[1]}
        </a>,
      );
      n++;
      last = m.index + m[0].length;
    }
    out.push(...marcar(seg.slice(last), usados, `${base}-${n}`));
    return out;
  };
  // Cada término se resalta la primera vez que aparece en un bloque, para no llenar el texto de rojo.
  const rich = (text: string, usados: Set<string> = new Set()): ReactNode => {
    return text
      .split("**")
      .map((seg, i) =>
        i % 2 ? (
          <strong key={i}>{ligas(seg, usados, `b${i}`)}</strong>
        ) : (
          <Fragment key={i}>{ligas(seg, usados, `t${i}`)}</Fragment>
        ),
      );
  };

  const lista = useMemo(() => {
    const out = corte.piezas.filter(
      (p) =>
        (!f.cuenta.length || f.cuenta.includes(p.h)) &&
        (!f.circulo.length || f.circulo.includes(p.ci)) &&
        (!f.formato.length || f.formato.includes(p.k)) &&
        (!f.pantalla.length || f.pantalla.includes(p.pa)) &&
        (!f.pilar.length || f.pilar.includes(p.pi)) &&
        (!f.comp.length || f.comp.includes(p.so.length ? "si" : "no")),
    );
    if (orden === "fecha")
      return out.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    if (orden === "respuesta")
      return out.sort((a, b) => respuesta(b) - respuesta(a));
    if (orden === "indice")
      return out.sort((a, b) => (b.ix ?? -1) - (a.ix ?? -1));
    return out.sort(
      (a, b) => (b.p ?? -1) - (a.p ?? -1) || respuesta(b) - respuesta(a),
    );
  }, [corte, f, orden]);

  const ver = (c: string) => {
    salto.current = c;
    setF(SIN_FILTRO);
    setOrden("vistas");
    setAbierta(c);
    setTab(3);
    setTip(null);
  };
  useEffect(() => {
    if (tab !== 3 || !abierta) return;
    if (salto.current) {
      document
        .getElementById(`pieza-${salto.current}`)
        ?.scrollIntoView({ block: "start" });
      salto.current = null;
    } else {
      document
        .getElementById("pieza-abierta")
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [tab, abierta]);

  // Una sola etiqueta flotante para todo lo que tenga data-def.
  const mostrar = (el: Element | null) => {
    const t = el?.closest<HTMLElement>("[data-def]");
    if (!t) return setTip(null);
    const r = t.getBoundingClientRect();
    const w = Math.min(300, window.innerWidth - 24);
    const arriba = r.bottom + 160 > window.innerHeight;
    setTip({
      x: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)),
      y: arriba ? r.top - 8 : r.bottom + 8,
      arriba,
      t: t.dataset.def || "",
    });
  };

  const principal = (p: Pieza): [string, string] => {
    if (p.p !== null) return [num(p.p), "reproducciones"];
    return p.l === null ? ["ocultos", "likes"] : [miles(p.l), "likes"];
  };
  const pantalla = (p: Pieza) => corte.PANT[p.pa].split(" o ")[0].toLowerCase();

  const mini = (p: Pieza) => (
    <li key={p.c}>
      <button type="button" className={styles.card} onClick={() => ver(p.c)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.cover}
          src={`/radar-media/${p.c}.jpg`}
          alt=""
          loading="lazy"
        />
        <span className={`${styles.name} ${p.ci === "yo" ? styles.rojo : ""}`}>
          {nombreDe(p.h)}
        </span>
        {p.so.length ? (
          <span className={`${styles.meta} ${styles.corta}`}>
            con @{p.so[0].u}
          </span>
        ) : null}
        <span className={`${styles.meta} ${styles.corta}`}>
          {p.k} · {pantalla(p)}
        </span>
        <span className={styles.stats}>
          <strong>{principal(p)[0]}</strong> {principal(p)[1]}
        </span>
      </button>
    </li>
  );

  const enIg = (p: Pieza) => (
    <li key={p.c}>
      <a
        className={styles.card}
        href={`https://www.instagram.com/p/${p.c}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.cover}
          src={`/radar-media/${p.c}.jpg`}
          alt=""
          loading="lazy"
        />
        <span className={`${styles.name} ${p.ci === "yo" ? styles.rojo : ""}`}>
          {nombreDe(p.h)}
        </span>
        {p.so.length ? (
          <span className={`${styles.meta} ${styles.corta}`}>
            con @{p.so[0].u}
          </span>
        ) : null}
        <span className={styles.stats}>
          <strong>{principal(p)[0]}</strong> {principal(p)[1]}
        </span>
        <span className={styles.verIg}>ver en Instagram ↗</span>
      </a>
    </li>
  );

  const tarjeta = (p: Pieza) => {
    const open = abierta === p.c;
    const [cifra, unidad] =
      orden === "indice" && p.ix !== null
        ? [veces(p.ix), "veces lo normal"]
        : principal(p);
    return (
      <Fragment key={p.c}>
        <li id={`pieza-${p.c}`} className={open ? styles.sel : undefined}>
          <button
            type="button"
            className={styles.card}
            aria-expanded={open}
            onClick={() => setAbierta(open ? null : p.c)}
          >
            <span className={styles.cardHead}>
              <span
                className={`${styles.name} ${styles.corta} ${p.ci === "yo" ? styles.rojo : ""}`}
              >
                {nombreDe(p.h)}
              </span>
              <span className={styles.cifra}>{cifra}</span>
            </span>
            <span className={styles.cardHead}>
              <span className={`${styles.meta} ${styles.corta}`}>
                {p.so.length ? `con @${p.so[0].u}` : " "}
              </span>
              <span className={styles.meta}>{unidad}</span>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.cover}
              src={`/radar-media/${p.c}.jpg`}
              alt=""
              loading="lazy"
            />
            <span className={styles.tags}>
              <span className={styles.tag}>{p.k}</span>
              <span className={styles.tag}>{pantalla(p)}</span>
              <span className={styles.tag}>
                {corte.PIL[p.pi].toLowerCase()}
              </span>
              {p.so.length ? (
                <span className={`${styles.tag} ${styles.tagLlena}`}>
                  compartida
                </span>
              ) : null}
            </span>
            <span className={styles.meta}>
              {DIAS[p.dw]} {hora(p.hr)}
              {p.d ? ` · ${duracion(p.d)}` : ""}
              {p.cm !== null ? ` · ${miles(p.cm)} com.` : ""}
            </span>
          </button>
        </li>
        {open ? (
          <li id="pieza-abierta" className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.name}>
                {nombreDe(p.h)}
                {p.so.length ? (
                  <span className={styles.meta}>
                    {" "}
                    con{" "}
                    {p.so
                      .map(
                        (s) =>
                          `@${s.u}${s.sg ? ` (${num(s.sg)} seguidores)` : ""}`,
                      )
                      .join(", ")}
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                className={styles.cerrar}
                onClick={() => setAbierta(null)}
              >
                cerrar
              </button>
            </div>
            <dl className={styles.cajas}>
              {(
                [
                  [p.p !== null ? miles(p.p) : null, "reproducciones"],
                  [p.l === null ? "ocultos" : miles(p.l), "likes"],
                  [p.cm !== null ? miles(p.cm) : null, "comentarios"],
                  [
                    p.ix !== null ? veces(p.ix) : null,
                    "veces lo normal de su cuenta",
                  ],
                  [
                    p.d ? duracion(p.d) : p.ni ? String(p.ni) : null,
                    p.d ? "duración" : "imágenes",
                  ],
                ] as [string | null, string][]
              )
                .filter(([v]) => v !== null)
                .map(([v, l]) => (
                  <div key={l}>
                    <dd>{v}</dd>
                    <dt>{l}</dt>
                  </div>
                ))}
            </dl>
            <div className={styles.panelBody}>
              <div>
                {p.st ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.strip}
                    src={`/radar-media/${p.c}_s.jpg`}
                    alt={
                      p.k === "reel"
                        ? "Cuatro cuadros del reel, del inicio al final"
                        : "Las siguientes imágenes del carrusel"
                    }
                    loading="lazy"
                  />
                ) : null}
                <p>
                  <strong>Lectura. </strong>
                  {rich(p.n)}
                </p>
              </div>
              <div>
                {p.tr ? (
                  <p>
                    <span className={styles.etiqueta}>
                      Lo que dice la voz, transcripción automática
                    </span>
                    “{p.tr}”
                  </p>
                ) : null}
                {p.cap ? (
                  <p className={styles.gris}>
                    <span className={styles.etiqueta}>
                      Texto de la publicación
                    </span>
                    {p.cap}
                  </p>
                ) : null}
                <p className={styles.meta}>
                  {[
                    `${DIAS[p.dw]} ${fecha(p.ts)}, ${hora(p.hr)} h`,
                    p.au === "música"
                      ? `música: ${p.mu}`
                      : p.au === "voz"
                        ? "con voz"
                        : p.au === "original"
                          ? "audio original, sin voz"
                          : "",
                    p.dm ? "Día de Muertos" : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  {" · "}
                  <a
                    href={`https://www.instagram.com/p/${p.c}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ver en Instagram
                  </a>
                </p>
              </div>
            </div>
          </li>
        ) : null}
      </Fragment>
    );
  };

  // Filas de índice: cuánto rinde cada categoría contra lo normal de su cuenta.
  const indice = (clave: string, titulo?: string) => {
    const filas = (corte.graf.idx[clave] || []).filter(
      (r) => r.n > 0 && r.ix !== null,
    );
    if (!filas.length) return null;
    const max = Math.max(...filas.map((r) => r.ix as number));
    const hi = max > 8 ? 32 : max > 4 ? 8 : max > 2 ? 4 : 2;
    const pos = (v: number) => lg(v, 0.5, hi) * 100;
    const uno = pos(1);
    const marcas = [0.5, 1, 2, 4, 8, 32].filter((m) => m <= hi);
    return (
      <div className={styles.indice} key={clave}>
        {titulo ? <p className={styles.indiceTitulo}>{titulo}</p> : null}
        <div className={styles.indiceFila} aria-hidden="true">
          <span />
          <span className={styles.indiceEje}>
            {marcas.map((m) => (
              <span key={m} style={{ left: `${pos(m)}%` }}>
                {m === 1 ? "lo normal" : m === 0.5 ? "½" : `×${m}`}
              </span>
            ))}
          </span>
          <span />
        </div>
        {filas.map((r) => {
          const v = r.ix as number;
          const p = pos(v);
          return (
            <div className={styles.indiceFila} key={r.nombre}>
              <span className={styles.indiceNombre}>{r.nombre}</span>
              <span className={styles.indiceTrack}>
                <span
                  className={styles.indiceUno}
                  style={{ left: `${uno}%` }}
                />
                <span
                  className={`${styles.indiceBar} ${v < 1 ? styles.abajo : ""}`}
                  style={{
                    left: `${Math.min(p, uno)}%`,
                    width: `${Math.max(Math.abs(p - uno), 0.8)}%`,
                  }}
                />
              </span>
              <span className={styles.indiceValor}>
                <strong>{veces(v)}</strong>
                <span className={styles.meta}>
                  {r.arriba} de {r.n} arriba
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const leyenda = (conPiso: boolean, post = false) => (
    <p className={styles.leyenda}>
      <span>
        <i style={{ background: TINTA }} /> reel
      </span>
      {post ? (
        <span>
          <i style={{ background: MEDIO }} /> foto o carrusel
        </span>
      ) : (
        <>
          <span>
            <i style={{ background: MEDIO }} /> carrusel
          </span>
          <span>
            <i style={{ background: CLARO }} /> foto suelta
          </span>
        </>
      )}
      {conPiso ? (
        <span>
          <i style={CONTORNO} /> Piso ikpali
        </span>
      ) : null}
    </p>
  );

  // Puntos: cada cuadro es una pieza; eje vertical en veces lo normal de su cuenta.
  const puntos = (modo: "hora" | "dia") => {
    const W = 1000,
      H = 300,
      L = 78,
      R = 12,
      T = 14,
      B = 34;
    const y = (ix: number) => T + (1 - lg(ix, 0.1, 16)) * (H - T - B);
    const x = (hr: number, dw: number) =>
      modo === "hora"
        ? L + (hr / 24) * (W - L - R)
        : L + ((dw + 0.1 + (hr / 24) * 0.8) / 7) * (W - L - R);
    return (
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={
          modo === "hora"
            ? "Publicaciones por hora del día"
            : "Publicaciones por día de la semana"
        }
      >
        {[0.25, 1, 4].map((v) => (
          <g key={v}>
            <line
              x1={L}
              x2={W - R}
              y1={y(v)}
              y2={y(v)}
              stroke={v === 1 ? ROJO : REJILLA}
              strokeWidth={1}
            />
            <text
              x={L - 8}
              y={y(v) + 4}
              textAnchor="end"
              className={styles.svgTxt}
            >
              {v === 1 ? "lo normal" : v < 1 ? "un cuarto" : "4 veces"}
            </text>
          </g>
        ))}
        {modo === "hora"
          ? [0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
              <text
                key={h}
                x={x(h, 0)}
                y={H - 6}
                textAnchor="middle"
                className={styles.svgTxt}
              >
                {h}:00
              </text>
            ))
          : DIAS.map((d, i) => (
              <text
                key={d}
                x={L + ((i + 0.5) / 7) * (W - L - R)}
                y={H - 6}
                textAnchor="middle"
                className={styles.svgTxt}
              >
                {d}
              </text>
            ))}
        {corte.graf.puntos.map((p) => (
          <rect
            key={p.c}
            x={x(p.hr, p.dw) - 4.5}
            y={y(p.ix) - 4.5}
            width={9}
            height={9}
            fill={color(p.k)}
            className={styles.punto}
            data-def={`${nombreDe(p.h)} · ${p.k} · ${DIAS[p.dw]} ${hora(p.hr)} · ${veces(p.ix)} veces lo normal`}
            onClick={() => ver(p.c)}
          />
        ))}
        {corte.graf.pisoH.map((p, i) => (
          <rect
            key={i}
            x={x(p.hr, p.dw) - 3}
            y={H - B + 3}
            width={6}
            height={10}
            fill="#fff"
            stroke={ROJO}
            strokeWidth={1.5}
            data-def={`Piso ikpali publicó ${DIAS[p.dw]} a las ${hora(p.hr)}`}
          />
        ))}
      </svg>
    );
  };

  const dispersion = () => {
    const W = 1000,
      H = 380,
      L = 78,
      R = 12,
      T = 14,
      B = 40;
    const x = (t: number) => L + lg(t, 0.01, 200) * (W - L - R);
    const y = (ix: number) => T + (1 - lg(ix, 0.1, 1000)) * (H - T - B);
    return (
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Publicaciones compartidas: tamaño del socio contra resultado"
      >
        {[1, 10, 100].map((v) => (
          <g key={v}>
            <line
              x1={L}
              x2={W - R}
              y1={y(v)}
              y2={y(v)}
              stroke={v === 1 ? ROJO : REJILLA}
              strokeWidth={1}
            />
            <text
              x={L - 8}
              y={y(v) + 4}
              textAnchor="end"
              className={styles.svgTxt}
            >
              {v === 1 ? "lo normal" : `${v} veces`}
            </text>
          </g>
        ))}
        {[0.1, 1, 10, 100].map((v) => (
          <g key={v}>
            <line
              x1={x(v)}
              x2={x(v)}
              y1={T}
              y2={H - B}
              stroke={v === 1 ? ROJO : REJILLA}
              strokeWidth={1}
            />
            <text
              x={x(v)}
              y={H - B + 18}
              textAnchor="middle"
              className={styles.svgTxt}
            >
              {v === 1
                ? "socio del mismo tamaño"
                : v < 1
                  ? "10 veces más chico"
                  : `${v} veces más grande`}
            </text>
          </g>
        ))}
        {corte.graf.colab.map((p) => (
          <rect
            key={p.c}
            x={x(p.tam) - 5}
            y={y(p.ix) - 5}
            width={10}
            height={10}
            fill={p.k === "reel" ? TINTA : MEDIO}
            className={styles.punto}
            data-def={`${nombreDe(p.h)} con @${p.s} · ${p.k} · ${veces(p.ix)} veces lo normal`}
            onClick={() => ver(p.c)}
          />
        ))}
      </svg>
    );
  };

  const desplegable = (
    key: keyof Filtros,
    label: string,
    todas: string,
    options: [string, string][],
  ) => {
    const sel = f[key];
    const texto = !sel.length
      ? todas
      : sel.length === 1
        ? options.find(([v]) => v === sel[0])?.[1] || "1"
        : `${sel.length} elegidas`;
    return (
      <div className={styles.filtro}>
        <button
          type="button"
          className={`${styles.filtroBtn} ${sel.length ? styles.filtroOn : ""}`}
          aria-expanded={menu === key}
          onClick={() => setMenu(menu === key ? null : key)}
        >
          {label}: <strong>{texto}</strong> <span aria-hidden="true">↓</span>
        </button>
        {menu === key ? (
          <div className={styles.filtroPanel}>
            {options.map(([v, t]) => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={sel.includes(v)}
                  onChange={() =>
                    setF({
                      ...f,
                      [key]: sel.includes(v)
                        ? sel.filter((s) => s !== v)
                        : [...sel, v],
                    })
                  }
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  const hayFiltro = Object.values(f).some((v) => v.length);
  const bloques = (items: Texto[]) => {
    const u = new Set<string>();
    return (
      <div className={styles.posicion}>
        {items.map((b) => (
          <div key={b.t}>
            <h3 className={styles.sub}>{b.t}</h3>
            <p>{rich(b.x, u)}</p>
          </div>
        ))}
      </div>
    );
  };
  const maxMezcla = Math.max(...corte.graf.mezcla.map((r) => r.total));
  const maxSem = Math.max(
    ...corte.graf.semanas.map((s) => s.reel + s.carrusel + s.foto + s.piso),
  );
  const maxAlc = Math.max(...corte.graf.alcance.map((r) => r.plays));
  const mz = corte.estrategia.mezcla;

  return (
    <main
      className={styles.page}
      onMouseOver={(e) => mostrar(e.target as Element)}
      onMouseLeave={() => setTip(null)}
      onFocus={(e) => mostrar(e.target as Element)}
      onBlur={() => setTip(null)}
    >
      <header className={styles.header}>
        <h1 className={styles.wordmark}>
          piso <span className={styles.paren}>(</span> radar{" "}
          <span className={styles.paren}>)</span> ikpali
        </h1>
        <p className={styles.week}>
          <span>Instagram</span>
          <span>{corte.meta.periodo}</span>
          <span>
            {corte.meta.piezas} piezas · {corte.meta.cuentas} cuentas
          </span>
        </p>
      </header>

      <nav className={styles.tabs} aria-label="Secciones">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={`${styles.tab} ${tab === i ? styles.active : ""}`}
            aria-pressed={tab === i}
            onClick={() => {
              setTab(i);
              setMenu(null);
            }}
          >
            {t}
            {i === 3 ? ` (${corte.meta.piezas})` : ""}
          </button>
        ))}
      </nav>

      {tab === 0 ? (
        <>
          <p className={styles.lead}>{rich(corte.frase)}</p>
          <dl className={styles.figures}>
            {corte.kpis.map((c) => (
              <div key={c.l} className={styles.figure}>
                <dd className={styles.figureValue}>{c.v}</dd>
                <dt className={styles.figureLabel}>{c.l}</dt>
                {c.s ? <dd className={styles.figureSub}>{c.s}</dd> : null}
              </div>
            ))}
          </dl>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo más visto del corte</h2>
            <ul className={`${styles.cards} ${styles.cardsSmall}`}>
              {corte.top.map((c) => mini(porCodigo.get(c) as Pieza))}
            </ul>
            <p className={styles.pie}>
              <button
                type="button"
                className={styles.enlace}
                onClick={() => setTab(3)}
              >
                Ver las {corte.meta.piezas} piezas
              </button>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo que publicó Piso ikpali</h2>
            <ul className={`${styles.cards} ${styles.cardsSmall}`}>
              {propias.map(mini)}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lectura de posición</h2>
            {bloques(corte.posicion)}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Con quién se publica</h2>
            <p className={styles.nota}>{rich(corte.notas.colab)}</p>
            {leyenda(false, true)}
            <div className={styles.svgWrap}>{dispersion()}</div>
            <div className={styles.dos}>
              {indice("socioReel", "Reels, según el tamaño del socio")}
              {indice(
                "socioPost",
                "Fotos y carruseles, según el tamaño del socio",
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Qué hay en pantalla y de qué trata
            </h2>
            <p className={styles.nota}>
              {rich(
                "Cada barra dice cuánto rinde esa categoría contra lo normal de su cuenta; a la derecha, cuántas piezas quedaron arriba. **El objeto solo y los avisos quedan abajo. La gente, el espacio y lo que está pasando, arriba.**",
              )}
            </p>
            <div className={styles.dos}>
              {indice("pantReel", "En pantalla, reels propios")}
              {indice("pantPost", "En pantalla, fotos y carruseles propios")}
              {indice("pilReel", "De qué trata, reels propios y compartidos")}
              {indice("pilPost", "De qué trata, fotos y carruseles propios")}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Qué publica cada tienda</h2>
            <p className={styles.nota}>{rich(corte.notas.mezcla)}</p>
            {leyenda(true)}
            <div className={styles.barras}>
              {corte.graf.mezcla.map((r) => (
                <div
                  key={r.h}
                  className={`${styles.barra} ${r.ci === "yo" ? styles.rojo : ""}`}
                >
                  <span
                    className={styles.barraNombre}
                    tabIndex={0}
                    data-def={`${miles(r.seg)} seguidores · ${r.sem} publicaciones por semana · ${r.comp} compartidas`}
                  >
                    {r.n}
                  </span>
                  <span className={styles.barraTrack}>
                    {(["reel", "carrusel", "foto"] as const).map((k) =>
                      r[k] ? (
                        <span
                          key={k}
                          style={{
                            width: `${(r[k] / maxMezcla) * 100}%`,
                            background: color(k),
                          }}
                          data-def={`${r.n}: ${r[k]} ${k === "reel" ? "reels" : k === "carrusel" ? "carruseles" : "fotos sueltas"}`}
                        />
                      ) : null,
                    )}
                  </span>
                  <span className={styles.barraValor}>
                    <strong>{r.total}</strong>
                    <span className={styles.meta}>{r.sem} por semana</span>
                  </span>
                </div>
              ))}
            </div>
            <h3 className={styles.sub}>Por semana</h3>
            <p className={styles.nota}>{rich(corte.notas.semanas)}</p>
            <div className={styles.columnas}>
              {corte.graf.semanas.map((s) => {
                const total = s.reel + s.carrusel + s.foto + s.piso;
                return (
                  <div key={s.w} className={styles.columna}>
                    <span className={styles.columnaTotal}>{total}</span>
                    <span
                      className={styles.columnaPila}
                      style={{ height: `${(total / maxSem) * 150}px` }}
                    >
                      {s.piso ? (
                        <span
                          style={{ flex: s.piso, ...CONTORNO }}
                          data-def={`${s.piso} de Piso ikpali`}
                        />
                      ) : null}
                      {s.foto ? (
                        <span
                          style={{ flex: s.foto, background: CLARO }}
                          data-def={`${s.foto} fotos sueltas`}
                        />
                      ) : null}
                      {s.carrusel ? (
                        <span
                          style={{ flex: s.carrusel, background: MEDIO }}
                          data-def={`${s.carrusel} carruseles`}
                        />
                      ) : null}
                      {s.reel ? (
                        <span
                          style={{ flex: s.reel, background: TINTA }}
                          data-def={`${s.reel} reels`}
                        />
                      ) : null}
                    </span>
                    <span className={styles.meta}>
                      {s.w === 0 ? "esta" : `−${s.w}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className={styles.meta}>
              Semanas hacia atrás; la última barra es la semana del corte.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>A qué hora y qué día</h2>
            <p className={styles.nota}>{rich(corte.notas.horas)}</p>
            {leyenda(true)}
            <div className={styles.svgWrap}>{puntos("hora")}</div>
            <p className={styles.nota}>{rich(corte.notas.dias)}</p>
            <div className={styles.svgWrap}>{puntos("dia")}</div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Cuántas reproducciones saca cada tienda
            </h2>
            <p className={styles.nota}>{rich(corte.notas.alcance)}</p>
            <div className={styles.barras}>
              {corte.graf.alcance.map((r) => (
                <div key={r.h} className={styles.barra}>
                  <span
                    className={styles.barraNombre}
                    tabIndex={0}
                    data-def={`${miles(r.seg)} seguidores · ${r.reels} reels propios`}
                  >
                    {r.n}
                  </span>
                  <span className={styles.barraTrack}>
                    <span
                      style={{
                        width: `${(r.plays / maxAlc) * 100}%`,
                        background: TINTA,
                      }}
                    />
                  </span>
                  <span className={styles.barraValor}>
                    <strong>{miles(r.plays)}</strong>
                    <span className={styles.meta}>{num(r.seg)} seguidores</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cuentas</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>tienda</th>
                  <th className={styles.num}>seguidores</th>
                  <th className={styles.num}>por semana</th>
                  <th className={`${styles.num} ${styles.wide}`}>reels</th>
                  <th className={`${styles.num} ${styles.wide}`}>
                    compartidas
                  </th>
                  <th className={`${styles.num} ${styles.wide}`}>
                    reproducciones por reel propio
                  </th>
                  <th className={`${styles.num} ${styles.wide}`}>
                    likes y comentarios por publicación
                  </th>
                  <th className={styles.num}>última</th>
                </tr>
              </thead>
              <tbody>
                {corte.cuentas.map((c) => (
                  <tr
                    key={c.h}
                    className={c.ci === "yo" ? styles.rojo : undefined}
                  >
                    <td>
                      <span className={styles.name}>{c.n}</span>
                      <span className={styles.meta}>
                        @{c.h}
                        <span className={styles.sep}> · </span>
                        <span className={styles.linea2}>
                          {CIRC[c.ci] || c.city}
                        </span>
                      </span>
                    </td>
                    <td className={styles.num}>{num(c.seg)}</td>
                    <td className={styles.num}>{c.piezas ? c.sem : ""}</td>
                    <td className={`${styles.num} ${styles.wide}`}>
                      {c.reels || ""}
                    </td>
                    <td className={`${styles.num} ${styles.wide}`}>
                      {c.comp || ""}
                    </td>
                    <td className={`${styles.num} ${styles.wide}`}>
                      {c.plays === null ? "" : miles(c.plays)}
                    </td>
                    <td className={`${styles.num} ${styles.wide}`}>
                      {c.inter === null
                        ? c.ocultos > 2
                          ? "ocultos"
                          : ""
                        : num(c.inter)}
                    </td>
                    <td className={styles.num}>{ultima(c.dias, c.desde)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      {tab === 1 ? (
        <>
          <p className={styles.lead}>{rich(corte.palanca)}</p>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Las {corte.jugadas.length} jugadas, de la que más mueve a la más
              incierta
            </h2>
            <ol className={styles.jugadas}>
              {corte.jugadas.map((j, i) => {
                const u = new Set<string>();
                return (
                  <li key={j.titulo}>
                    <div className={styles.jugadaTexto}>
                      <h3 className={styles.jugadaTitulo}>
                        <span className={styles.rojo}>{i + 1}</span> {j.titulo}
                      </h3>
                      <p className={styles.meta}>
                        Factibilidad: {j.fact.toLowerCase()} · Impacto:{" "}
                        {j.imp.toLowerCase()}
                      </p>
                      <p>
                        <span className={styles.etiqueta}>Por qué</span>
                        {rich(j.porque, u)}
                      </p>
                      <p>
                        <span className={styles.etiqueta}>
                          Cómo se ve en Piso ikpali
                        </span>
                        {rich(j.como, u)}
                      </p>
                      <p className={styles.gris}>
                        <span className={styles.etiqueta}>Límite</span>
                        {rich(j.limite, u)}
                      </p>
                    </div>
                    <ul className={styles.ejemplos}>
                      {j.ej.map((c) => {
                        const p = porCodigo.get(c);
                        return p ? enIg(p) : null;
                      })}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dejar de hacer</h2>
            {bloques(corte.dejar)}
          </section>
        </>
      ) : null}

      {tab === 2 ? (
        <>
          <p className={styles.lead}>{rich(corte.estrategia.intro)}</p>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{mz.t}</h2>
            <div className={styles.mezcla}>
              <div>
                <div className={styles.diez} aria-hidden="true">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        background:
                          i < mz.reel
                            ? TINTA
                            : i < mz.reel + mz.carrusel
                              ? MEDIO
                              : CLARO,
                      }}
                    />
                  ))}
                </div>
                <p className={styles.respuesta}>
                  {mz.reel} reels, {mz.carrusel} carruseles, {mz.foto} foto
                  suelta
                </p>
                <p>{rich(mz.x)}</p>
                <p className={styles.gris}>
                  Hoy las tiendas publican {corte.graf.mix.reel}% reels,{" "}
                  {corte.graf.mix.carrusel}% carruseles y {corte.graf.mix.foto}%
                  fotos sueltas. Piso ikpali: ningún reel, 3 carruseles y 8
                  fotos sueltas.
                </p>
              </div>
              <div>
                <h3 className={styles.sub}>{corte.estrategia.semana.t}</h3>
                <ul className={styles.lista}>
                  {corte.estrategia.semana.items.map((b) => (
                    <li key={b.t}>
                      <strong>{b.t}. </strong>
                      {rich(b.x)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Las preguntas, una por una</h2>
            <ol className={styles.preguntas}>
              {corte.estrategia.preguntas.map((q) => (
                <li key={q.q}>
                  <div>
                    <h3 className={styles.pregunta}>{q.q}</h3>
                    <p className={styles.respuesta}>{q.r}</p>
                    <p>{rich(q.x)}</p>
                    <p className={styles.gris}>
                      <span
                        className={`${styles.certeza} ${styles[q.certeza]}`}
                        tabIndex={0}
                        data-def={
                          q.certeza === "alta"
                            ? "El patrón se repite en varias cuentas y se sostiene quitando la que más pesa."
                            : q.certeza === "media"
                              ? "Apunta en una dirección, con pocas piezas."
                              : "El corte no alcanza. Es un punto de partida para medir con los números propios."
                        }
                      >
                        certeza {q.certeza}
                      </span>{" "}
                      {q.nota}
                    </p>
                  </div>
                  <div>
                    {q.graf
                      ? (GRAF[q.graf] || []).map(([k, t]) => indice(k, t))
                      : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Lo que este corte no puede decir
            </h2>
            <ul className={styles.lista}>
              {corte.estrategia.nosabe.map((m) => (
                <li key={m}>{rich(m)}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cómo saber si funcionó</h2>
            {bloques(corte.medir)}
          </section>
        </>
      ) : null}

      {tab === 3 ? (
        <>
          {menu ? (
            <div className={styles.fondo} onClick={() => setMenu(null)} />
          ) : null}
          <div className={styles.controles}>
            <div className={styles.filtros}>
              {desplegable(
                "cuenta",
                "Tienda",
                "todas",
                corte.graf.mezcla.map((c) => [c.h, c.n] as [string, string]),
              )}
              {desplegable("formato", "Formato", "todos", [
                ["reel", "Reel"],
                ["carrusel", "Carrusel"],
                ["foto", "Foto suelta"],
              ])}
              {desplegable("comp", "Compartida", "todas", [
                ["si", "Compartida con otra cuenta"],
                ["no", "Propia"],
              ])}
              {desplegable(
                "pantalla",
                "En pantalla",
                "todo",
                Object.entries(corte.PANT),
              )}
              {desplegable(
                "pilar",
                "De qué trata",
                "todo",
                Object.entries(corte.PIL),
              )}
              {desplegable("circulo", "Círculo", "todos", [
                ["pares", "Pares directos"],
                ["audiencia", "Audiencia"],
                ["estados", "Otros estados"],
                ["yo", "Piso ikpali"],
              ])}
              {hayFiltro ? (
                <button
                  type="button"
                  className={styles.limpiar}
                  onClick={() => setF(SIN_FILTRO)}
                >
                  limpiar
                </button>
              ) : null}
            </div>
            <div className={styles.orden}>
              <span className={styles.meta}>
                {lista.length} de {corte.meta.piezas} · ordenar por
              </span>
              {(
                [
                  ["vistas", "vistas"],
                  ["indice", "contra su cuenta"],
                  ["respuesta", "likes"],
                  ["fecha", "fecha"],
                ] as const
              ).map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  className={`${styles.tab} ${styles.tabSmall} ${orden === k ? styles.active : ""}`}
                  aria-pressed={orden === k}
                  onClick={() => setOrden(k)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ul className={styles.cards}>{lista.map(tarjeta)}</ul>
        </>
      ) : null}

      {tab === 4 ? (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cómo se arma</h2>
            <ol className={styles.lista}>
              {corte.metodo.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Límites</h2>
            <ul className={styles.lista}>
              {corte.limites.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Glosario</h2>
            <dl className={styles.glosario}>
              {corte.terminos.map((g) => (
                <div key={g.k}>
                  <dt className={styles.sub}>{g.k}</dt>
                  <dd>{g.x}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : null}

      {tip ? (
        <div
          className={`${styles.tip} ${tip.arriba ? styles.tipArriba : ""}`}
          style={{ left: tip.x, top: tip.y }}
          role="tooltip"
        >
          {tip.t}
        </div>
      ) : null}
    </main>
  );
}
