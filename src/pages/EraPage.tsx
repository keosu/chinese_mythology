import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { entitiesOfEra, entityMap, eraMap, eras, events, typeMeta, type EntityType, type EraId } from '../data';
import Art from '../components/Art';
import EntityCard from '../components/EntityCard';
import { IconArrow, IconGraph } from '../components/Icons';
import { useAccent } from '../hooks';
import { eraCover } from './Home';
import './era.css';

const actNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

export default function EraPage() {
  const { id = 'chaos' } = useParams();
  const era = eraMap[id as EraId] ?? eras[0];
  useAccent(era.accent);
  const list = useMemo(() => entitiesOfEra(era.id), [era.id]);
  const acts = useMemo(() => events.filter((e) => e.era === era.id).sort((a, b) => a.order - b.order), [era.id]);
  const types = useMemo(() => [...new Set(list.map((e) => e.type))], [list]);
  const [type, setType] = useState<EntityType | null>(null);
  const shown = type ? list.filter((e) => e.type === type) : list;
  const idx = eras.findIndex((e) => e.id === era.id);
  const prev = eras[idx - 1];
  const next = eras[idx + 1];

  return (
    <div className="era-page" style={{ ['--c' as string]: era.accent }}>
      <section className="era-hero">
        <div className="era-hero-glyph display">{era.glyph}</div>
        <div className="era-hero-text">
          <div className="era-tabs">
            {eras.map((e) => (
              <Link key={e.id} to={`/era/${e.id}`} className={`era-tab ${e.id === era.id ? 'on' : ''}`} style={{ ['--c' as string]: e.accent }}>
                <span className="display">{e.numeral}</span>
                {e.name}
              </Link>
            ))}
          </div>
          <motion.div key={era.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="eyebrow">第{era.numeral}纪</div>
            <h1 className="era-title display">{era.name}</h1>
            <div className="era-sub">「{era.subtitle}」</div>
            {era.intro.map((p, i) => (
              <p key={i} className="era-intro">
                {p}
              </p>
            ))}
            <div className="hero-cta" style={{ marginTop: 26 }}>
              <Link className="btn" to={`/graph?era=${era.id}`}>
                <IconGraph /> 本纪关系图谱
              </Link>
              <a className="btn ghost" href="#acts" onClick={(e) => { e.preventDefault(); document.getElementById('acts')?.scrollIntoView({ behavior: 'smooth' }); }}>
                神话分幕 <IconArrow />
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div
          key={era.id + '-art'}
          className="era-hero-art"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Art entity={eraCover[era.id]} eager />
        </motion.div>
      </section>

      <section className="section themes">
        {era.themes.map((t, i) => (
          <motion.div
            key={t.title}
            className="theme panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="corner tl" />
            <span className="corner br" />
            <div className="theme-i display">{['壹', '贰', '叁'][i]}</div>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="section" id="acts">
        <h2 className="section-title">
          神话分幕 <small>{acts.length} 幕</small>
        </h2>
        <div className="acts">
          {acts.map((ev, i) => {
            const lead = ev.participants.map((p) => entityMap[p]).find((p) => p?.image) ?? entityMap[ev.participants[0]];
            return (
              <motion.article
                key={ev.id}
                className={`act ${i % 2 ? 'right' : 'left'}`}
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <div className="act-node display">{actNum[i]}</div>
                <div className="act-card panel">
                  <div className="act-art">{lead && <Art entity={lead} />}</div>
                  <div className="act-body">
                    <div className="eyebrow" style={{ fontSize: 12 }}>第{actNum[i]}幕</div>
                    <h3>{ev.title}</h3>
                    <p>{ev.summary}</p>
                    {ev.quote && (
                      <blockquote className="quote">
                        {ev.quote.text}
                        <cite>——《{ev.quote.source}》</cite>
                      </blockquote>
                    )}
                    <div className="act-people">
                      {ev.participants.map((p) =>
                        entityMap[p] ? (
                          <Link key={p} to={`/entity/${p}`} className="chip" style={{ ['--chip-color' as string]: typeMeta[entityMap[p].type].color }}>
                            <span className="dot" />
                            {entityMap[p].name}
                          </Link>
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          本纪人物 <small>{list.length} 条目</small>
        </h2>
        <div className="filter-row">
          <button className={`chip ${!type ? 'on' : ''}`} onClick={() => setType(null)}>
            全部
          </button>
          {types.map((t) => (
            <button
              key={t}
              className={`chip ${type === t ? 'on' : ''}`}
              style={{ ['--chip-color' as string]: typeMeta[t].color }}
              onClick={() => setType(type === t ? null : t)}
            >
              <span className="dot" />
              {typeMeta[t].name}
            </button>
          ))}
        </div>
        <div className="grid-cards">
          {shown.map((e) => (
            <EntityCard key={e.id} e={e} />
          ))}
        </div>
      </section>

      <section className="section era-pager">
        {prev ? (
          <Link to={`/era/${prev.id}`} className="pager panel" style={{ ['--c' as string]: prev.accent }}>
            <small>上一纪</small>
            <span className="display">
              {prev.numeral} · {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/era/${next.id}`} className="pager panel next" style={{ ['--c' as string]: next.accent }}>
            <small>下一纪</small>
            <span className="display">
              {next.numeral} · {next.name}
            </span>
          </Link>
        ) : (
          <Link to="/graph" className="pager panel next">
            <small>终章之后</small>
            <span className="display">万神关系图谱</span>
          </Link>
        )}
      </section>
    </div>
  );
}
