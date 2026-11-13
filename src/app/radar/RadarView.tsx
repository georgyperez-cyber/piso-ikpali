"use client";

import { Fragment, useMemo, useState } from "react";
import type { AccountSnapshot, PostKind, PostSummary, Snapshot } from "@/lib/radar/metrics";
import type { Lectura } from "@/lib/radar/lectura";
import { ago, compact, dayLabel, median, miles, pct, signed, weekLabel } from "@/lib/radar/format";
import styles from "./radar.module.css";

type Props = {
  current: Snapshot;
  previous: Snapshot | null;
  running: boolean;
  notice: string | null;
  flash: string | null;
  top: PostSummary[];
  pendientes: string[];
  lectura: Lectura | null;
};

type SortKey = "followers" | "posts" | "eng" | "medLikes" | "lastPost";
type Filter = "todas" | "pares" | "audiencia" | "estados";

const KIND: Record<PostKind, [singular: string, plural: string]> = {
  reel: ["reel", "reels"],
  carrusel: ["carrusel", "carruseles"],
  foto: ["foto", "fotos"],
};

function mixText(mix: Record<PostKind, number>): string {
  return (Object.keys(KIND) as PostKind[])
    .filter((k) => mix[k] > 0)
    .sort((a, b) => mix[b] - mix[a])
    .map((k) => `${mix[k]} ${KIND[k][mix[k] === 1 ? 0 : 1]}`)
    .join(", ");
}

function mainKind(mix: Record<PostKind, number>): string {
  const total = mix.reel + mix.carrusel + mix.foto;
  const best = (Object.keys(KIND) as PostKind[]).sort((a, b) => mix[b] - mix[a])[0];
  return `${KIND[best][1]}, ${Math.round((mix[best] / total) * 100)}%`;
}

function postStats(post: PostSummary): string {
  const parts = [KIND[post.kind][0]];
  if (post.er !== null) parts.push(`${pct(post.er)} de ER`);
  if (post.likes !== null) parts.push(`${miles(post.likes)} likes`);
  if (post.comments !== null) parts.push(`${miles(post.comments)} ${post.comments === 1 ? "comentario" : "comentarios"}`);
  return parts.join(" · ");
}

export default function RadarView({ current, previous, running, notice, flash, top, pendientes, lectura }: Props) {
  const [filter, setFilter] = useState<Filter>("todas");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "followers", dir: -1 });
  const [open, setOpen] = useState<string | null>(null);

  const accounts = current.accounts;
  const has = (pick: (a: AccountSnapshot) => unknown) => accounts.some((a) => pick(a) !== null);
  const show28 = has((a) => a.posts28);
  const showEng = has((a) => a.eng);
  const showLikes = has((a) => a.medLikes);
  const showMix = has((a) => a.mix);
  const showLast = has((a) => a.lastPost);

  const before = useMemo(() => new Map((previous?.accounts || []).map((a) => [a.handle, a])), [previous]);
  const delta = (a: AccountSnapshot): number | null => {
    const prev = before.get(a.handle);
    return prev && prev.followers !== null && a.followers !== null ? a.followers - prev.followers : null;
  };

  const value = (a: AccountSnapshot, key: SortKey): number | null => {
    if (key === "followers") return a.followers;
    if (key === "posts") return show28 ? a.posts28 : a.postsTotal;
    if (key === "eng") return a.eng;
    if (key === "medLikes") return a.medLikes;
    return a.lastPost ? Date.parse(a.lastPost) : null;
  };

  const rows = useMemo(() => {
    const list = accounts.filter((a) => filter === "todas" || a.circle === filter);
    return [...list].sort((a, b) => {
      const x = value(a, sort.key);
      const y = value(b, sort.key);
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      return (x - y) * sort.dir;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, filter, sort, show28]);

  const us = accounts.find((a) => a.you) || null;
  // Las medianas de referencia salen solo de los pares directos.
  const others = accounts.filter((a) => !a.you && !a.fuera && a.circle === "pares");
  const med = (pick: (a: AccountSnapshot) => number | null) =>
    median(others.map(pick).filter((v): v is number => v !== null));

  const usDelta = us ? delta(us) : null;
  const figures: { value: string; label: string; sub?: string }[] = [];
  if (us) {
    figures.push({
      value: compact(us.followers),
      label: "seguidores de Piso ikpali",
      sub: usDelta !== null ? `${signed(usDelta)} contra la semana anterior` : undefined,
    });
  }
  figures.push({ value: compact(med((a) => a.followers)), label: `seguidores, mediana de los ${others.length} pares con cuenta vigente` });
  if (us && show28) {
    figures.push({
      value: us.posts28 === null ? "0" : `${us.posts28}`,
      label: "publicaciones de Piso ikpali en 28 días",
      sub: `mediana de pares: ${compact(med((a) => a.posts28))}`,
    });
  } else if (us) {
    figures.push({ value: compact(us.postsTotal), label: "posts publicados por Piso ikpali" });
  }
  if (us && showEng) {
    figures.push({
      value: pct(med((a) => a.eng)),
      label: "ER por seguidor, mediana de pares",
      sub: us.eng === null ? "Piso ikpali tiene los likes ocultos" : `Piso ikpali: ${pct(us.eng)}`,
    });
  } else {
    figures.push({ value: compact(med((a) => a.postsTotal)), label: "posts publicados, mediana de pares" });
  }

  const header = (key: SortKey, label: string, extra = "") => {
    const active = sort.key === key;
    return (
      <th className={`${styles.num} ${extra}`} aria-sort={active ? (sort.dir === -1 ? "descending" : "ascending") : "none"}>
        <button
          type="button"
          data-key={key}
          className={`${styles.sortButton} ${active ? styles.active : ""}`}
          onClick={() => setSort((s) => (s.key === key ? { key, dir: s.dir === -1 ? 1 : -1 } : { key, dir: -1 }))}
        >
          {label}
          <span className={styles.arrow} aria-hidden="true">
            {active ? (sort.dir === -1 ? "↓" : "↑") : ""}
          </span>
        </button>
      </th>
    );
  };

  const columns = 3 + 1 + (showEng ? 1 : 0) + (showLikes ? 1 : 0) + (showMix ? 1 : 0) + (showLast ? 1 : 0) + 1;
  const filters: [Filter, string][] = [
    ["todas", "todas"],
    ["pares", "pares directos"],
    ["audiencia", "competencia de audiencia"],
    ["estados", "otros estados"],
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.wordmark}>
          piso <span className={styles.paren}>(</span> radar <span className={styles.paren}>)</span> ikpali
        </h1>
        <p className={styles.week}>
          <span className={styles.weekPart}>Instagram</span>
          <span className={styles.dot}>{" · "}</span>
          <span className={styles.weekPart}>{weekLabel(current.weekEnding)}</span>
        </p>
      </header>

      {flash || running ? (
        <p className={styles.notice}>{flash || "Hay una corrida en curso. Recarga la página en un par de minutos."}</p>
      ) : null}

      <dl className={styles.figures}>
        {figures.map((f) => (
          <div key={f.label} className={styles.figure}>
            <dd className={styles.figureValue}>{f.value}</dd>
            <dt className={styles.figureLabel}>{f.label}</dt>
            {f.sub ? <dd className={styles.figureSub}>{f.sub}</dd> : null}
          </div>
        ))}
      </dl>

      <nav className={styles.filters} aria-label="Filtrar por círculo">
        {filters.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`${styles.textButton} ${filter === key ? styles.active : ""}`}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rank} aria-label="Lugar" />
            <th className={styles.nameHead}>tienda</th>
            {header("followers", "seguidores")}
            {header("posts", show28 ? "posts, 28 días" : "posts", showEng ? styles.mid : "")}
            {showEng ? header("eng", "ER por seguidor") : null}
            {showLikes ? header("medLikes", "interacciones por post", styles.wide) : null}
            {showMix ? <th className={`${styles.textCol} ${styles.wide}`}>formato</th> : null}
            {showLast ? header("lastPost", "último post", styles.wide) : null}
            <th className={styles.toggleCol} aria-label="Detalle" />
          </tr>
        </thead>
        <tbody>
          {rows.map((a, i) => {
            const d = delta(a);
            const detail = Boolean(a.top || a.mix || a.web);
            const isOpen = open === a.handle;
            return (
              <Fragment key={a.handle}>
                <tr
                  data-c={a.circle}
                  data-v={JSON.stringify({
                    followers: a.followers,
                    posts: value(a, "posts"),
                    eng: a.eng,
                    medLikes: a.medLikes,
                    lastPost: value(a, "lastPost"),
                  })}
                  className={`${styles.row} ${a.you ? styles.you : ""} ${detail ? styles.clickable : ""}`}
                  onClick={detail ? () => setOpen(isOpen ? null : a.handle) : undefined}
                >
                  <td className={styles.rank}>{i + 1}</td>
                  <td className={styles.nameCell}>
                    <span className={styles.name}>{a.name}</span>
                    <span className={styles.meta}>
                      <a
                        className={styles.handle}
                        href={`https://www.instagram.com/${a.handle}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        @{a.handle}
                      </a>
                      <span className={styles.dot}>{" · "}</span>
                      {a.city}
                      {a.nota ? `, ${a.nota}` : ""}
                    </span>
                  </td>
                  <td className={styles.num}>
                    {compact(a.followers)}
                    {d !== null ? <span className={styles.delta}>{signed(d)}</span> : null}
                  </td>
                  <td className={`${styles.num} ${showEng ? styles.mid : ""}`}>
                    {compact(show28 ? a.posts28 : a.postsTotal)}
                    {show28 && a.posts28Capped ? "+" : ""}
                  </td>
                  {showEng ? (
                    <td className={styles.num}>
                      {a.eng === null && a.hidden > 0 ? <span className={styles.meta}>ocultos</span> : pct(a.eng)}
                      {a.eng !== null && a.engN <= 4 ? <span className={styles.delta}>con {a.engN} {a.engN === 1 ? "post" : "posts"}</span> : null}
                    </td>
                  ) : null}
                  {showLikes ? <td className={`${styles.num} ${styles.wide}`}>{compact(a.medLikes)}</td> : null}
                  {showMix ? <td className={`${styles.textCol} ${styles.wide}`}>{a.mix ? mainKind(a.mix) : ""}</td> : null}
                  {showLast ? <td className={`${styles.num} ${styles.wide}`}>{ago(a.lastPost, current.takenAt)}</td> : null}
                  <td className={styles.toggleCol}>
                    {detail ? (
                      <button type="button" className={styles.toggle} aria-expanded={isOpen} aria-label={`Detalle de ${a.name}`}>
                        {isOpen ? "−" : "+"}
                      </button>
                    ) : null}
                  </td>
                </tr>
                {detail && isOpen ? (
                  <tr className={styles.detailRow}>
                    <td />
                    <td colSpan={columns - 1} className={styles.detail}>
                      {a.top ? (
                        <p>
                          <span className={styles.detailLabel}>Publicación propia más fuerte en 28 días</span>
                          {a.top.caption ? `${a.top.caption} ` : ""}
                          <span className={styles.meta}>
                            {postStats(a.top)}
                            {" · "}
                            <a href={a.top.url} target="_blank" rel="noopener noreferrer">
                              ver en Instagram
                            </a>
                          </span>
                        </p>
                      ) : null}
                      {a.mix ? (
                        <p>
                          <span className={styles.detailLabel}>Formatos recientes</span>
                          {mixText(a.mix)}
                        </p>
                      ) : null}
                      {a.medLikes !== null || a.lastPost ? (
                        <p className={styles.narrowOnly}>
                          <span className={styles.detailLabel}>Ritmo</span>
                          {[
                            a.posts28 !== null ? `${a.posts28} ${a.posts28 === 1 ? "post" : "posts"} en 28 días` : "",
                            a.medLikes !== null ? `${compact(a.medLikes)} interacciones por post` : "",
                            a.lastPost ? `último post ${ago(a.lastPost, current.takenAt)}` : "",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      ) : null}
                      {a.web ? (
                        <p>
                          <span className={styles.detailLabel}>Sitio</span>
                          <a href={a.web} target="_blank" rel="noopener noreferrer">
                            {a.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                          </a>
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {top.length ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lo mejor de la competencia en 28 días</h2>
          <ul className={styles.posts}>
            {top.map((post) => {
              const owner = accounts.find((a) => a.handle === post.handle);
              return (
                <li key={post.code}>
                  <a className={styles.post} href={post.url} target="_blank" rel="noopener noreferrer">
                    {post.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className={styles.thumb} src={`/radar/img/${post.thumb}`} alt="" loading="lazy" />
                    ) : null}
                    <span className={styles.name}>{owner ? owner.name : `@${post.handle}`}</span>
                    <span className={styles.meta}>{postStats(post)}</span>
                    {post.caption ? <span className={styles.caption}>{post.caption}</span> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {us && us.posts.length ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lo que publicó Piso ikpali</h2>
          <table className={`${styles.table} ${styles.activity}`}>
            <thead>
              <tr>
                <th>fecha</th>
                <th>formato</th>
                <th className={styles.num}>likes</th>
                <th className={styles.num}>comentarios</th>
                <th className={styles.seeHead}>publicación</th>
              </tr>
            </thead>
            <tbody>
              {us.posts.map((post) => (
                <tr key={post.code}>
                  <td className={styles.when}>{dayLabel(post.ts)}</td>
                  <td>{post.collab ? `${KIND[post.kind][0]}, con @${post.collab}` : KIND[post.kind][0]}</td>
                  <td className={styles.num} data-label="likes">
                    {post.likes === null ? <span className={styles.meta}>ocultos</span> : miles(post.likes)}
                  </td>
                  <td className={styles.num} data-label="comentarios">
                    {post.comments === null ? "" : miles(post.comments)}
                  </td>
                  <td className={styles.see}>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      {post.caption || "sin texto"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {lectura ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{lectura.titulo}</h2>
          <p className={styles.lead}>{lectura.metodo}</p>

          <table className={`${styles.table} ${styles.activity}`}>
            <thead>
              <tr>
                <th className={styles.nameHead}>tienda</th>
                <th>última publicación</th>
                <th className={styles.num}>en 28 días</th>
                <th className={styles.seeHead}>qué se ve</th>
              </tr>
            </thead>
            <tbody>
              {lectura.actividad.map((row) => {
                const owner = accounts.find((a) => a.handle === row.handle);
                return (
                  <tr key={row.handle} className={owner?.you ? styles.you : ""}>
                    <td className={styles.who}>{owner ? owner.name : `@${row.handle}`}</td>
                    <td className={styles.when}>{row.ultimo}</td>
                    <td className={styles.num} data-label="en 28 días">
                      {row.en28}
                    </td>
                    <td className={styles.see}>{row.seVe}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.reading}>
            <div>
              <h3 className={styles.readingTitle}>Descubrimientos</h3>
              <ol className={styles.items}>
                {lectura.descubrimientos.map((d) => (
                  <li key={d.titulo}>
                    <span className={styles.name}>{d.titulo}</span>
                    <p>{d.texto}</p>
                    <p className={styles.meta}>Límite: {d.limite}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className={styles.readingTitle}>Jugadas</h3>
              <ol className={styles.items}>
                {lectura.jugadas.map((j) => (
                  <li key={j.titulo}>
                    <span className={styles.name}>{j.titulo}</span>
                    <p>{j.texto}</p>
                    <p className={styles.meta}>Sustento: {j.sustento}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      <footer className={styles.footer}>
        <div className={styles.notes}>
          {current.source === "chrome" ? (
            <p>
              Esta primera foto se leyó directo de los perfiles el {dayLabel(current.takenAt)}: trae seguidores (redondeados arriba de 10 mil) y total
              de posts. ER, posts de la semana y formatos entran con la primera corrida de Apify.
            </p>
          ) : (
            <p>
              Datos de los perfiles públicos de Instagram, capturados el {dayLabel(current.takenAt)}: las 12 publicaciones más recientes de cada
              cuenta. ER por seguidor es la mediana de likes más comentarios entre seguidores, solo en publicaciones propias con likes visibles; las
              colaboraciones y los likes ocultos quedan fuera. Lo mejor de la competencia se ordena por esa tasa, no por total. Instagram no publica
              alcance, guardados ni vistas. Se actualiza solo cada lunes.
            </p>
          )}
          {current.missing.length || pendientes.length ? (
            <p>Sin datos esta semana: {[...new Set([...pendientes, ...current.missing])].join(", ")}.</p>
          ) : null}
          {notice ? <p>{notice}</p> : null}
        </div>
        <form method="post" action="/radar/actualizar">
          <button type="submit" className={styles.textButton}>
            actualizar ahora
          </button>
        </form>
      </footer>
    </main>
  );
}
