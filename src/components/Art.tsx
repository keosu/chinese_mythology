import { useState } from 'react';
import { artUrl, entityMap, typeMeta, type Entity } from '../data';

interface Props {
  entity: Entity | string;
  className?: string;
  halo?: boolean;
  eager?: boolean;
}

export function Seal({ char, color }: { char: string; color: string }) {
  return (
    <svg className="seal-fallback" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={`sg-${char}`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#sg-${char})`} stroke={color} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 3" />
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d="M50 6 l3 5 h-6 z"
          fill={color}
          fillOpacity="0.7"
          transform={`rotate(${a + 45} 50 50)`}
        />
      ))}
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Ma Shan Zheng, KaiTi, serif"
        fontSize="46"
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      >
        {char}
      </text>
    </svg>
  );
}

export default function Art({ entity, className = '', halo = true, eager }: Props) {
  const e = typeof entity === 'string' ? entityMap[entity] : entity;
  const [failed, setFailed] = useState(false);
  if (!e) return null;
  const color = typeMeta[e.type].color;
  return (
    <div className={`art ${className}`} style={{ ['--c' as string]: color }}>
      {halo && <span className="halo" />}
      {e.image && !failed ? (
        <img
          src={artUrl(e.id)}
          alt={e.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <Seal char={e.name[0]} color={color} />
      )}
    </div>
  );
}
