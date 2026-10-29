import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  entities,
  entityMap,
  eraMap,
  events,
  regionMeta,
  relationMeta,
  relationsOf,
  sourceMap,
  typeMeta,
  type RelationType,
} from '../data';
import Art from '../components/Art';
import EgoGraph from '../components/EgoGraph';
import EntityCard from '../components/EntityCard';
import { IconGraph } from '../components/Icons';
import { useAccent } from '../hooks';
import './entity.css';

export default function EntityPage() {
  const { id = '' } = useParams();
  const e = entityMap[id];
  const meta = e ? typeMeta[e.type] : undefined;
  useAccent(e ? eraMap[e.era[0]].accent : undefined);

  const grouped = useMemo(() => {
    const g = new Map<RelationType, ReturnType<typeof relationsOf>>();
    for (const r of relationsOf(id)) {
      if (!entityMap[r.other]) continue;
      if (!g.has(r.type)) g.set(r.type, []);
      g.get(r.type)!.push(r);
    }
    return [...g.entries()];
  }, [id]);

  const inEvents = useMemo(() => events.filter((ev) => ev.participants.includes(id)), [id]);

  const similar = useMemo(() => {
    if (!e) return [];
    const linked = new Set(relationsOf(id).map((r) => r.other));
    return entities
      .filter((x) => x.id !== id && !linked.has(x.id))
      .map((x) => ({
        x,
        s: (x.type === e.type ? 2 : 0) + x.era.filter((er) => e.era.includes(er)).length + (x.tags?.filter((t) => e.tags?.includes(t)).length ?? 0) * 1.5,
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((o) => o.x);
  }, [e, id]);

  if (!e || !meta) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <h1 className="display gold-text">此名未载于谱</h1>
        <Link to="/atlas" className="btn">返回图鉴</Link>
      </div>
    );
  }

  return (
    <div className="entity-page" style={{ ['--c' as string]: meta.color }}>
      <section className="entity-hero">
        <motion.div
          key={e.id}
          className="entity-art"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="entity-art-ring" />
          <Art entity={e} eager />
        </motion.div>
        <motion.div key={e.id + 't'} className="entity-head" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="entity-badges">
            <span className="badge" style={{ ['--c' as string]: meta.color }}>
              {meta.name}
            </span>
            {e.era.map((er) => (
              <Link key={er} to={`/era/${er}`} className="badge" style={{ ['--c' as string]: eraMap[er].accent }}>
                {eraMap[er].numeral} · {eraMap[er].name}
              </Link>
            ))}
            {e.region && (
              <Link to={`/map?focus=${e.id}`} className="badge" style={{ ['--c' as string]: '#7be0a0' }}>
                《{regionMeta[e.region].book}》
              </Link>
            )}
            {e.late && <span className="badge late">后世附会</span>}
          </div>
          <h1 className="entity-name display">{e.name}</h1>
          <div className="entity-pinyin">{e.pinyin}</div>
          {e.alias && <div className="entity-alias">又名：{e.alias.join(' · ')}</div>}
          <div className="entity-title">{e.title}</div>
          <p className="entity-summary">{e.summary}</p>
          <div className="hero-cta">
            <Link className="btn" to={`/graph?focus=${e.id}`}>
              <IconGraph /> 在图谱中聚焦
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="section entity-main">
        <div className="entity-story">
          <h2 className="section-title">神话本事</h2>
          {e.story.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              {p}
            </motion.p>
          ))}

          {e.quotes && e.quotes.length > 0 && (
            <>
              <h2 className="section-title" style={{ marginTop: 40 }}>
                原典辑录
              </h2>
              <div className="quotes">
                {e.quotes.map((q, i) => (
                  <figure key={i} className="scroll-quote panel">
                    <span className="corner tl" />
                    <span className="corner br" />
                    <blockquote>{q.text}</blockquote>
                    <figcaption>——《{q.source}》</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}

          {inEvents.length > 0 && (
            <>
              <h2 className="section-title" style={{ marginTop: 40 }}>
                相关事件
              </h2>
              <div className="ev-list">
                {inEvents.map((ev) => (
                  <Link key={ev.id} to={`/era/${ev.era}`} className="ev-item panel" style={{ ['--c' as string]: eraMap[ev.era].accent }}>
                    <span className="badge" style={{ ['--c' as string]: eraMap[ev.era].accent }}>
                      {eraMap[ev.era].name}
                    </span>
                    <b>{ev.title}</b>
                    <span className="muted">{ev.summary}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="entity-side">
          <div className="panel side-box">
            <h3 className="side-title">关系网</h3>
            <EgoGraph id={e.id} />
            <div className="rel-groups">
              {grouped.map(([t, rs]) => (
                <div key={t} className="rel-group">
                  <div className="rel-type" style={{ color: relationMeta[t].color }}>
                    <span className="rel-swatch" style={{ background: relationMeta[t].color }} />
                    {relationMeta[t].name}
                  </div>
                  <div className="rel-items">
                    {rs.map((r, i) => (
                      <Link key={i} to={`/entity/${r.other}`} className="rel-item">
                        <Art entity={r.other} halo={false} />
                        <span>
                          <b>{entityMap[r.other].name}</b>
                          {r.label && <small>{r.label}</small>}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {e.sources && e.sources.length > 0 && (
            <div className="panel side-box">
              <h3 className="side-title">出处典籍</h3>
              <div className="src-list">
                {e.sources.filter((s) => sourceMap[s]).map((s) => (
                  <Link key={s} to={`/sources#${s}`} className="src-item">
                    <b>《{sourceMap[s].title}》</b>
                    <small>
                      {sourceMap[s].dynasty} · {sourceMap[s].author}
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            同类相续 <small>风格或纪元相近的条目</small>
          </h2>
          <div className="grid-cards">
            {similar.map((x) => (
              <EntityCard key={x.id} e={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
