import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { entities, sources, typeMeta, type Source } from '../data';
import './sources.css';

const groups: { name: string; test: (s: Source) => boolean }[] = [
  { name: '考古', test: (s) => s.id === 'archaeology' },
  { name: '先秦', test: (s) => s.year < -221 && s.id !== 'archaeology' },
  { name: '秦汉', test: (s) => s.year >= -221 && s.year < 220 },
  { name: '魏晋南北朝', test: (s) => s.year >= 220 && s.year < 589 },
  { name: '隋唐宋', test: (s) => s.year >= 589 && s.year < 1279 },
  { name: '明清', test: (s) => s.year >= 1279 },
];

export default function SourcesPage() {
  const { hash } = useLocation();
  const cited = useMemo(() => {
    const m: Record<string, typeof entities> = {};
    for (const e of entities) for (const s of e.sources ?? []) (m[s] ??= []).push(e);
    return m;
  }, []);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 2000);
      }, 400);
    }
  }, [hash]);

  const sorted = [...sources].sort((a, b) => a.year - b.year);
  const grouped = groups.map((g) => ({
    name: g.name,
    list: sorted.filter(g.test),
  }));

  return (
    <div className="section sources-page">
      <div className="eyebrow">Classics</div>
      <h1 className="display gold-text" style={{ fontSize: 'clamp(48px,6vw,80px)', margin: 0 }}>
        典籍书架
      </h1>
      <p className="muted" style={{ maxWidth: 760 }}>
        中国神话没有一部“神谱”式的经典，而是散落在经、史、子、集与志怪小说之中。以下 {sources.length} 部典籍与考古发现，是本站全部条目的出处。
      </p>

      {grouped.map((g) =>
        g.list.length ? (
          <div key={g.name} className="shelf">
            <h2 className="section-title">{g.name}</h2>
            <div className="shelf-grid">
              {g.list.map((s, i) => (
                <motion.article
                  key={s.id}
                  id={s.id}
                  className="book-card panel"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.06 }}
                >
                  <div className="book-spine">
                    <span className="display">{s.title}</span>
                  </div>
                  <div className="book-body">
                    <div className="book-meta">
                      {s.dynasty} · {s.author}
                    </div>
                    <p>{s.intro}</p>
                    {s.excerpt && <blockquote className="book-excerpt">{s.excerpt}</blockquote>}
                    {cited[s.id] && (
                      <div className="book-cites">
                        {cited[s.id].slice(0, 14).map((e) => (
                          <Link key={e.id} to={`/entity/${e.id}`} className="chip" style={{ ['--chip-color' as string]: typeMeta[e.type].color }}>
                            <span className="dot" />
                            {e.name}
                          </Link>
                        ))}
                        {cited[s.id].length > 14 && <span className="chip">等 {cited[s.id].length} 条</span>}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}
