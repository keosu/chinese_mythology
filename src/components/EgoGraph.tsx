import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artUrl, entityMap, relationMeta, relationsOf, typeMeta } from '../data';

/** Radial one-hop relation diagram centered on an entity. */
export default function EgoGraph({ id }: { id: string }) {
  const nav = useNavigate();
  const [hover, setHover] = useState<string | null>(null);
  const rels = useMemo(() => relationsOf(id).filter((r) => entityMap[r.other]), [id]);
  const nodes = useMemo(() => {
    const seen = new Map<string, typeof rels>();
    for (const r of rels) {
      if (!seen.has(r.other)) seen.set(r.other, []);
      seen.get(r.other)!.push(r);
    }
    const order = ['kin', 'spouse', 'succeed', 'master', 'rule', 'ally', 'create', 'avatar', 'enemy', 'assoc'];
    return [...seen.entries()].sort(
      (a, b) => order.indexOf(a[1][0].type) - order.indexOf(b[1][0].type),
    );
  }, [rels]);

  const size = 560;
  const c = size / 2;
  const n = nodes.length;
  const R = n > 16 ? 230 : n > 9 ? 210 : 180;
  const nodeR = n > 18 ? 22 : 27;
  const center = entityMap[id];
  if (!n) return <div className="muted">此条目暂无记载的关系。</div>;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="ego-graph">
      <defs>
        <clipPath id="ego-clip-c">
          <circle cx={c} cy={c} r={52} />
        </clipPath>
        {nodes.map(([oid], i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <clipPath key={oid} id={`ego-clip-${oid}`}>
              <circle cx={c + Math.cos(a) * R} cy={c + Math.sin(a) * R} r={nodeR} />
            </clipPath>
          );
        })}
      </defs>
      <circle cx={c} cy={c} r={R} fill="none" stroke="rgba(232,192,104,0.12)" strokeDasharray="3 6" />
      {nodes.map(([oid, rs], i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = c + Math.cos(a) * R;
        const y = c + Math.sin(a) * R;
        const m = relationMeta[rs[0].type];
        const dim = hover && hover !== oid;
        const mx = c + Math.cos(a) * R * 0.55;
        const my = c + Math.sin(a) * R * 0.55;
        return (
          <g key={oid} opacity={dim ? 0.25 : 1} style={{ transition: 'opacity .25s' }}>
            <line x1={c} y1={c} x2={x} y2={y} stroke={m.color} strokeWidth={hover === oid ? 2.4 : 1.3} strokeOpacity={0.8} strokeDasharray={m.dashed ? '4 4' : undefined} />
            {hover === oid && (
              <text x={mx} y={my} className="ego-edge-label" fill={m.color}>
                {rs.map((r) => r.label ?? relationMeta[r.type].name).join(' / ')}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={c} cy={c} r={58} fill="#0c0a12" stroke="var(--gold)" strokeWidth={1.5} />
      {center.image ? (
        <image href={artUrl(id)} x={c - 52} y={c - 52} width={104} height={104} clipPath="url(#ego-clip-c)" preserveAspectRatio="xMidYMin slice" />
      ) : (
        <text x={c} y={c + 2} className="ego-glyph" fontSize={46} fill="var(--gold)">
          {center.name[0]}
        </text>
      )}
      {nodes.map(([oid, rs], i) => {
        const e = entityMap[oid];
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = c + Math.cos(a) * R;
        const y = c + Math.sin(a) * R;
        const col = typeMeta[e.type].color;
        const dim = hover && hover !== oid;
        const below = Math.sin(a) > -0.2;
        return (
          <g
            key={oid}
            className="ego-node"
            opacity={dim ? 0.35 : 1}
            onMouseEnter={() => setHover(oid)}
            onMouseLeave={() => setHover(null)}
            onClick={() => nav(`/entity/${oid}`)}
          >
            <circle cx={x} cy={y} r={nodeR + 3} fill="#0c0a12" stroke={relationMeta[rs[0].type].color} strokeWidth={hover === oid ? 2.5 : 1.4} />
            {e.image ? (
              <image href={artUrl(oid)} x={x - nodeR} y={y - nodeR} width={nodeR * 2} height={nodeR * 2} clipPath={`url(#ego-clip-${oid})`} preserveAspectRatio="xMidYMin slice" />
            ) : (
              <text x={x} y={y + 1} className="ego-glyph" fontSize={nodeR} fill={col}>
                {e.name[0]}
              </text>
            )}
            <text x={x} y={below ? y + nodeR + 18 : y - nodeR - 9} className="ego-label">
              {e.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
