"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import styles from "./radar.module.css";

type Pieza = {
  c: string; h: string; ci: string; ts: string; k: "reel" | "carrusel" | "foto";
  l: number | null; cm: number | null; p: number | null; pps: number | null; d: number | null; ix: number | null;
  cap: string; pa: string; pi: string; dm: boolean; n: string; tr: string; ow: string | null; sg: number | null;
};
type Texto = { t: string; x: string };
type Fila = { k?: string; nombre: string; reels: number; plays: number | null; propios: number; ix: number | null; arriba: number; posts?: number; er?: number | null };
export type Corte = {
  meta: { periodo: string; piezas: number; reels: number; carruseles: number; fotos: number; cuentas: number; total: number };
  frase: string; palanca: string;
  cifras: { v: string; l: string; s?: string }[];
  posicion: Texto[]; dejar: Texto[]; medir: Texto[];
  notas: { pant: string; pil: string; dur: string; colabs: string };
  jugadas: { titulo: string; fact: string; imp: string; porque: string; como: string; limite: string; ej: string[] }[];
  top: string[];
  pant: Fila[]; pil: Fila[]; dur: Fila[];
  colabs: { h: string; n: string; seg: number; socio: string; segSocio: number | null; reels: number; plays: number; propia: number | null; veces: number | null; tam: number | null; top: string }[];
  cuentas: { h: string; n: string; ci: string; city: string; seg: number; piezas: number; p28: number; reels: number; plays: number | null; inter: number | null; ocultos: number; visibles: number; colab: number; dias: number | null; desde: string | null }[];
  piezas: Pieza[];
  nombres: Record<string, string>; PANT: Record<string, string>; PIL: Record<string, string>;
  metodo: string[]; limites: string[]; glosario: { k: string; x: string }[];
};

type Orden = "vistas" | "indice" | "respuesta" | "fecha";
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const CIRC: Record<string, string> = { yo: "CDMX", pares: "CDMX · par directo", audiencia: "CDMX · audiencia" };
const TABS = ["Panorama", "Jugadas", "Evidencia", "Método"] as const;
const SIN_FILTRO = { cuenta: "", circulo: "", formato: "", pantalla: "", pilar: "" };

function miles(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function num(n: number | null): string {
  if (n === null) return "";
  if (n >= 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")} mil`;
  if (n < 10 && !Number.isInteger(n)) return n.toFixed(1);
  return miles(n);
}
function veces(x: number): string {
  if (x < 0.01) return "menos de 0.01";
  if (x >= 10) return miles(x);
  if (x >= 2) return x.toFixed(1);
  return x.toFixed(2);
}
function fecha(iso: string): string {
  const d = new Date(Date.parse(iso) - 6 * 3600 * 1000);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}
function duracion(s: number): string {
  return s >= 90 ? `${Math.round(s / 60)} min` : `${s} s`;
}
function ultima(dias: number | null, desde: string | null): string {
  if (dias === null) return "";
  if (dias === 0) return "hoy";
  if (dias > 60 && desde) return `${MESES[Number(desde.slice(5)) - 1]} ${desde.slice(0, 4)}`;
  return `hace ${dias} d`;
}
function respuesta(p: Pieza): number {
  return (p.l ?? 0) + (p.cm ?? 0);
}
function principal(p: Pieza): string {
  if (p.p !== null) return `${num(p.p)} reproducciones`;
  return p.l === null ? "likes ocultos" : `${miles(p.l)} likes`;
}
function secundarias(p: Pieza): string[] {
  const out: string[] = [];
  if (p.p !== null) out.push(p.l === null ? "likes ocultos" : `${miles(p.l)} likes`);
  if (p.cm !== null) out.push(`${miles(p.cm)} ${p.cm === 1 ? "comentario" : "comentarios"}`);
  return out;
}

export default function RadarView({ corte }: { corte: Corte }) {
  const [tab, setTab] = useState(0);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [orden, setOrden] = useState<Orden>("vistas");
  const [f, setF] = useState(SIN_FILTRO);
  const salto = useRef<string | null>(null);

  const porCodigo = useMemo(() => new Map(corte.piezas.map((p) => [p.c, p])), [corte]);
  const propias = corte.piezas.filter((p) => p.ci === "yo");
  const cuentasConPiezas = corte.cuentas.filter((c) => c.piezas > 0 && c.ci !== "yo");

  const lista = useMemo(() => {
    const out = corte.piezas.filter(
      (p) =>
        (!f.cuenta || p.h === f.cuenta) &&
        (!f.circulo || p.ci === f.circulo) &&
        (!f.formato || p.k === f.formato) &&
        (!f.pantalla || p.pa === f.pantalla) &&
        (!f.pilar || p.pi === f.pilar),
    );
    if (orden === "fecha") return out.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    if (orden === "respuesta") return out.sort((a, b) => respuesta(b) - respuesta(a));
    if (orden === "indice") return out.sort((a, b) => (b.ix ?? -1) - (a.ix ?? -1));
    return out.sort((a, b) => (b.p ?? -1) - (a.p ?? -1) || respuesta(b) - respuesta(a));
  }, [corte, f, orden]);

  // Abrir una pieza desde Panorama o Jugadas: va a Evidencia y la deja a la vista.
  const ver = (c: string) => {
    salto.current = c;
    setF(SIN_FILTRO);
    setOrden("vistas");
    setAbierta(c);
    setTab(2);
  };
  useEffect(() => {
    if (tab !== 2 || !abierta) return;
    if (salto.current) {
      document.getElementById(`pieza-${salto.current}`)?.scrollIntoView({ block: "start" });
      salto.current = null;
    } else {
      document.getElementById("pieza-abierta")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [tab, abierta]);

  const nombre = (p: Pieza) => (
    <>
      <span className={`${styles.name} ${p.ci === "yo" ? styles.rojo : ""}`}>{corte.nombres[p.h] || p.h}</span>
      {p.ow ? <span className={`${styles.meta} ${styles.corta}`}>con @{p.ow}</span> : null}
    </>
  );

  const mini = (p: Pieza) => (
    <li key={p.c}>
      <button type="button" className={styles.card} onClick={() => ver(p.c)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.cover} src={`/radar-media/${p.c}.jpg`} alt="" loading="lazy" />
        {nombre(p)}
        <span className={styles.meta}>
          {p.k} · {corte.PANT[p.pa]}
        </span>
        <span className={styles.stats}>{principal(p)}</span>
      </button>
    </li>
  );

  const tarjeta = (p: Pieza) => {
    const open = abierta === p.c;
    return (
      <Fragment key={p.c}>
        <li id={`pieza-${p.c}`} className={open ? styles.sel : undefined}>
          <button type="button" className={styles.card} aria-expanded={open} onClick={() => setAbierta(open ? null : p.c)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cover} src={`/radar-media/${p.c}.jpg`} alt="" loading="lazy" />
            {nombre(p)}
            <span className={styles.meta}>
              {p.k} · {corte.PANT[p.pa]} · {corte.PIL[p.pi]}
            </span>
            <span className={styles.stats}>{principal(p)}</span>
            <span className={`${styles.meta} ${styles.sec}`}>
              {orden === "indice" && p.ix !== null ? (
                <span>{veces(p.ix)} veces la mediana de su cuenta</span>
              ) : (
                secundarias(p).map((s) => <span key={s}>{s}</span>)
              )}
            </span>
          </button>
        </li>
        {open ? (
          <li id="pieza-abierta" className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.name}>
                {corte.nombres[p.h] || p.h}
                {p.ow ? (
                  <span className={styles.meta}>
                    {" "}
                    con @{p.ow}
                    {p.sg ? `, de ${miles(p.sg)} seguidores` : ""}
                  </span>
                ) : null}
              </span>
              <button type="button" className={styles.cerrar} onClick={() => setAbierta(null)}>
                cerrar
              </button>
            </div>
            <div className={styles.panelBody}>
              <div>
                {p.k === "reel" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.strip} src={`/radar-media/${p.c}_s.jpg`} alt="Cuatro cuadros del reel, del inicio al final" loading="lazy" />
                ) : null}
                <p>
                  <span className={styles.etiqueta}>Lectura</span>
                  {p.n}
                </p>
                <p className={styles.meta}>
                  {[
                    fecha(p.ts),
                    p.d ? duracion(p.d) : "",
                    principal(p),
                    ...secundarias(p),
                    p.pps !== null ? `${p.pps >= 1 ? p.pps.toFixed(1) : p.pps.toFixed(2)} reproducciones por seguidor` : "",
                    p.ix !== null ? `${veces(p.ix)} veces la mediana de su cuenta` : "",
                    p.dm ? "Día de Muertos" : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className={styles.meta}>
                  <a href={`https://www.instagram.com/p/${p.c}/`} target="_blank" rel="noopener noreferrer">
                    ver en Instagram
                  </a>
                </p>
              </div>
              <div>
                {p.tr ? (
                  <p>
                    <span className={styles.etiqueta}>Voz, transcripción automática</span>“{p.tr}”
                  </p>
                ) : null}
                {p.cap ? (
                  <p className={styles.meta}>
                    <span className={styles.etiqueta}>Texto de la publicación</span>
                    {p.cap}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ) : null}
      </Fragment>
    );
  };

  const select = (key: keyof typeof f, label: string, options: [string, string][]) => (
    <label className={styles.filtro}>
      <span className={styles.meta}>{label}</span>
      <select value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
        <option value="">todo</option>
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );

  // Tabla de categorías: mediana cruda y contra la propia cuenta.
  const tabla = (primera: string, filas: Fila[], conER: boolean, soloPropios = false) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{primera}</th>
          <th className={styles.num}>{soloPropios ? "reels propios" : "reels"}</th>
          <th className={styles.num}>reproducciones, mediana</th>
          <th className={styles.num}>contra su cuenta</th>
          <th className={`${styles.num} ${styles.wide}`}>arriba de su mediana</th>
          {conER ? <th className={`${styles.num} ${styles.wide}`}>fotos y carruseles</th> : null}
          {conER ? <th className={styles.num}>ER, mediana</th> : null}
        </tr>
      </thead>
      <tbody>
        {filas.map((r) => (
          <tr key={r.nombre}>
            <td className={styles.cat}>
              <span className={styles.name}>{r.nombre}</span>
            </td>
            <td className={styles.num}>{r.reels || ""}</td>
            <td className={styles.num}>{r.plays === null ? "" : miles(r.plays)}</td>
            <td className={styles.num}>{r.ix === null ? "" : r.ix.toFixed(2)}</td>
            <td className={`${styles.num} ${styles.wide}`}>{r.propios ? `${r.arriba} de ${r.propios}` : ""}</td>
            {conER ? <td className={`${styles.num} ${styles.wide}`}>{r.posts || ""}</td> : null}
            {conER ? <td className={styles.num}>{r.er === null || r.er === undefined ? "" : `${r.er.toFixed(2)}%`}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.wordmark}>
          piso <span className={styles.paren}>(</span> radar <span className={styles.paren}>)</span> ikpali
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
          <button key={t} type="button" className={`${styles.tab} ${tab === i ? styles.active : ""}`} aria-pressed={tab === i} onClick={() => setTab(i)}>
            {t}
            {i === 2 ? ` (${corte.meta.piezas})` : ""}
          </button>
        ))}
      </nav>

      {tab === 0 ? (
        <>
          <p className={styles.lead}>{corte.frase}</p>
          <dl className={styles.figures}>
            {corte.cifras.map((c) => (
              <div key={c.l} className={styles.figure}>
                <dd className={styles.figureValue}>{c.v}</dd>
                <dt className={styles.figureLabel}>{c.l}</dt>
                {c.s ? <dd className={styles.figureSub}>{c.s}</dd> : null}
              </div>
            ))}
          </dl>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo más visto del corte</h2>
            <ul className={`${styles.cards} ${styles.cardsSmall}`}>{corte.top.map((c) => mini(porCodigo.get(c) as Pieza))}</ul>
            <p className={styles.pie}>
              <button type="button" className={styles.enlace} onClick={() => setTab(2)}>
                Ver las {corte.meta.piezas} piezas
              </button>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo que publicó Piso ikpali</h2>
            <ul className={`${styles.cards} ${styles.cardsSmall}`}>{propias.map(mini)}</ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lectura de posición</h2>
            <div className={styles.posicion}>
              {corte.posicion.map((b) => (
                <div key={b.t}>
                  <h3 className={styles.name}>{b.t}</h3>
                  <p>{b.x}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Qué hay en pantalla</h2>
            <p className={styles.nota}>{corte.notas.pant}</p>
            {tabla("en pantalla", corte.pant, true)}
          </section>

          <div className={styles.dos}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>De qué trata</h2>
              <p className={styles.nota}>{corte.notas.pil}</p>
              {tabla("pilar", corte.pil, false)}
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cuánto dura</h2>
              <p className={styles.nota}>{corte.notas.dur}</p>
              {tabla("duración", corte.dur, false, true)}
            </section>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Con quién se publica</h2>
            <p className={styles.nota}>{corte.notas.colabs}</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>cuenta y socio</th>
                  <th className={`${styles.num} ${styles.wide}`}>seguidores de la cuenta</th>
                  <th className={`${styles.num} ${styles.wide}`}>seguidores del socio</th>
                  <th className={styles.num}>tamaño del socio, veces la cuenta</th>
                  <th className={`${styles.num} ${styles.wide}`}>reels</th>
                  <th className={styles.num}>reproducciones</th>
                  <th className={`${styles.num} ${styles.wide}`}>mediana propia</th>
                  <th className={styles.num}>contra su cuenta</th>
                </tr>
              </thead>
              <tbody>
                {corte.colabs.map((c) => (
                  <tr key={c.h + c.socio}>
                    <td>
                      <button type="button" className={`${styles.name} ${styles.enlace}`} onClick={() => ver(c.top)}>
                        {c.n}
                      </button>
                      <span className={styles.meta}>
                        <span className={styles.con}>con </span>@{c.socio}
                      </span>
                    </td>
                    <td className={`${styles.num} ${styles.wide}`}>{miles(c.seg)}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{c.segSocio === null ? "" : miles(c.segSocio)}</td>
                    <td className={styles.num}>{c.tam === null ? "" : c.tam < 0.01 ? "menos de 0.01" : c.tam >= 10 ? Math.round(c.tam) : c.tam.toFixed(2)}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{c.reels}</td>
                    <td className={styles.num}>{miles(c.plays)}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{c.propia === null ? "sin reels propios" : miles(c.propia)}</td>
                    <td className={styles.num}>{c.veces === null ? "" : c.veces.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cuentas</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>tienda</th>
                  <th className={styles.num}>seguidores</th>
                  <th className={styles.num}>en 28 días</th>
                  <th className={`${styles.num} ${styles.wide}`}>reels</th>
                  <th className={`${styles.num} ${styles.wide}`}>reproducciones por reel</th>
                  <th className={`${styles.num} ${styles.wide}`}>interacciones por publicación</th>
                  <th className={styles.num}>última</th>
                </tr>
              </thead>
              <tbody>
                {corte.cuentas.map((c) => (
                  <tr key={c.h} className={c.ci === "yo" ? styles.rojo : undefined}>
                    <td>
                      <span className={styles.name}>{c.n}</span>
                      <span className={styles.meta}>
                        @{c.h}
                        <span className={styles.sep}> · </span>
                        <span className={styles.linea2}>{CIRC[c.ci] || c.city}</span>
                      </span>
                    </td>
                    <td className={styles.num}>{num(c.seg)}</td>
                    <td className={styles.num}>{c.p28}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{c.reels || ""}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{num(c.plays)}</td>
                    <td className={`${styles.num} ${styles.wide}`}>{c.inter === null || c.visibles < 3 ? (c.ocultos ? "ocultos" : "") : num(c.inter)}</td>
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
          <p className={styles.lead}>{corte.palanca}</p>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Las {corte.jugadas.length} jugadas, de la que más mueve a la más incierta</h2>
            <ol className={styles.jugadas}>
              {corte.jugadas.map((j, i) => (
                <li key={j.titulo}>
                  <div className={styles.jugadaTexto}>
                    <h3 className={styles.jugadaTitulo}>
                      <span className={styles.rojo}>{i + 1}</span> {j.titulo}
                    </h3>
                    <p className={styles.meta}>
                      Factibilidad: {j.fact.toLowerCase()} · Impacto: {j.imp.toLowerCase()}
                    </p>
                    <p>
                      <span className={styles.etiqueta}>Por qué</span>
                      {j.porque}
                    </p>
                    <p>
                      <span className={styles.etiqueta}>Cómo se ve en Piso ikpali</span>
                      {j.como}
                    </p>
                    <p className={styles.meta}>
                      <span className={styles.etiqueta}>Límite</span>
                      {j.limite}
                    </p>
                  </div>
                  <ul className={styles.ejemplos}>
                    {j.ej.map((c) => {
                      const p = porCodigo.get(c);
                      if (!p) return null;
                      return (
                        <li key={c}>
                          <button type="button" className={styles.card} onClick={() => ver(p.c)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className={styles.cover} src={`/radar-media/${p.c}.jpg`} alt="" loading="lazy" />
                            {nombre(p)}
                            <span className={styles.meta}>{principal(p)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dejar de hacer</h2>
            <div className={styles.posicion}>
              {corte.dejar.map((b) => (
                <div key={b.t}>
                  <h3 className={styles.name}>{b.t}</h3>
                  <p>{b.x}</p>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cómo saber si funcionó</h2>
            <div className={styles.posicion}>
              {corte.medir.map((b) => (
                <div key={b.t}>
                  <h3 className={styles.name}>{b.t}</h3>
                  <p>{b.x}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {tab === 2 ? (
        <>
          <div className={styles.controles}>
            <div className={styles.orden}>
              <span className={styles.meta}>ordenar por</span>
              {(
                [
                  ["vistas", "vistas"],
                  ["indice", "contra su cuenta"],
                  ["respuesta", "respuesta"],
                  ["fecha", "fecha"],
                ] as const
              ).map(([k, t]) => (
                <button key={k} type="button" className={`${styles.tab} ${styles.tabSmall} ${orden === k ? styles.active : ""}`} aria-pressed={orden === k} onClick={() => setOrden(k)}>
                  {t}
                </button>
              ))}
            </div>
            <div className={styles.filtros}>
              {select("cuenta", "cuenta", [["piso.ikpali", "Piso ikpali"], ...cuentasConPiezas.map((c) => [c.h, c.n] as [string, string])])}
              {select("circulo", "círculo", [["pares", "pares directos"], ["audiencia", "competencia de audiencia"], ["estados", "otros estados"], ["yo", "Piso ikpali"]])}
              {select("formato", "formato", [["reel", "reel"], ["carrusel", "carrusel"], ["foto", "foto"]])}
              {select("pantalla", "en pantalla", Object.entries(corte.PANT))}
              {select("pilar", "pilar", Object.entries(corte.PIL))}
              <span className={`${styles.meta} ${styles.cuenta}`}>
                {lista.length} de {corte.meta.piezas}
              </span>
            </div>
          </div>
          <ul className={styles.cards}>{lista.map(tarjeta)}</ul>
        </>
      ) : null}

      {tab === 3 ? (
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
              {corte.glosario.map((g) => (
                <div key={g.k}>
                  <dt className={styles.name}>{g.k}</dt>
                  <dd>{g.x}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : null}
    </main>
  );
}
