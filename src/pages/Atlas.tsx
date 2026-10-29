import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { entities, eras, searchEntities, typeMeta, type EntityType, type EraId } from '../data';
import EntityCard from '../components/EntityCard';
import './atlas.css';

const typeOrder = Object.keys(typeMeta) as EntityType[];

export default function Atlas() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const type = params.get('type') as EntityType | null;
  const era = params.get('era') as EraId | null;
  const early = params.get('early') === '1';

  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p, { replace: true });
  };

  const list = useMemo(() => {
    let l = q.trim() ? searchEntities(q, 999) : entities;
    if (type) l = l.filter((e) => e.type === type);
    if (era) l = l.filter((e) => e.era.includes(era));
    if (early) l = l.filter((e) => !e.late);
    return l;
  }, [q, type, era, early]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of entities) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, []);

  return (
    <div className="section atlas">
      <div className="atlas-head">
        <div>
          <div className="eyebrow">Bestiary & Pantheon</div>
          <h1 className="display gold-text atlas-title">神祇图鉴</h1>
          <p className="muted">
            共收 {entities.length} 条：神祇、帝王、英雄、异兽、精怪、异国、神器、圣地。点击任一卡片查看出处与关系。
          </p>
        </div>
        <input className="atlas-search" value={q} placeholder="检索名号、别称、拼音……" onChange={(e) => set('q', e.target.value)} />
      </div>

      <div className="atlas-filters panel">
        <div className="filter-group">
          <span className="filter-label">类别</span>
          <button className={`chip ${!type ? 'on' : ''}`} onClick={() => set('type', null)}>
            全部
          </button>
          {typeOrder.map((t) => (
            <button
              key={t}
              className={`chip ${type === t ? 'on' : ''}`}
              style={{ ['--chip-color' as string]: typeMeta[t].color }}
              onClick={() => set('type', type === t ? null : t)}
            >
              <span className="dot" />
              {typeMeta[t].name}
              <small style={{ opacity: 0.6 }}>{counts[t] ?? 0}</small>
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">纪元</span>
          <button className={`chip ${!era ? 'on' : ''}`} onClick={() => set('era', null)}>
            全部
          </button>
          {eras.map((e) => (
            <button
              key={e.id}
              className={`chip ${era === e.id ? 'on' : ''}`}
              style={{ ['--chip-color' as string]: e.accent }}
              onClick={() => set('era', era === e.id ? null : e.id)}
            >
              <span className="dot" />
              {e.name}
            </button>
          ))}
          <label className="chip toggle" style={{ marginLeft: 'auto' }}>
            <input type="checkbox" checked={early} onChange={(e) => set('early', e.target.checked ? '1' : null)} />
            仅看古神话（隐藏后世附会）
          </label>
        </div>
      </div>

      <div className="atlas-count muted">检得 {list.length} 条</div>
      <div className="grid-cards">
        {list.map((e) => (
          <EntityCard key={e.id} e={e} />
        ))}
      </div>
      {list.length === 0 && <div className="palette-empty">此间无所载，请换个条件</div>}
    </div>
  );
}
