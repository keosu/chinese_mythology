import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { artUrl, entities, entityMap, regionMeta, typeMeta, type Entity, type Region } from '../data';
import Art from '../components/Art';
import { IconClose, IconCollapse, IconExpand, IconMinus, IconPlus, IconReset } from '../components/Icons';
import { useFullscreen } from '../hooks';
import './graph.css';
import './map.css';

const S = 1400;
/** band widths: 大荒 → 海外 → 海内 margin; then the 五藏山 cross */
const B1 = 130;
const B2 = 260;
const IN = 320;
const C0 = 580;
const C1 = S - C0;
type Rect = { x: number; y: number; w: number; h: number; vertical?: boolean };

const rects: Record<Region, Rect> = {
  'dahuang-north': { x: B1, y: 0, w: S - 2 * B1, h: B1 },
  'dahuang-south': { x: B1, y: S - B1, w: S - 2 * B1, h: B1 },
  'dahuang-west': { x: 0, y: B1, w: B1, h: S - 2 * B1, vertical: true },
  'dahuang-east': { x: S - B1, y: B1, w: B1, h: S - 2 * B1, vertical: true },
  'haiwai-north': { x: B2, y: B1, w: S - 2 * B2, h: B2 - B1 },
  'haiwai-south': { x: B2, y: S - B2, w: S - 2 * B2, h: B2 - B1 },
  'haiwai-west': { x: B1, y: B2, w: B2 - B1, h: S - 2 * B2, vertical: true },
  'haiwai-east': { x: S - B2, y: B2, w: B2 - B1, h: S - 2 * B2, vertical: true },
  hainei: { x: IN, y: IN, w: S - 2 * IN, h: S - 2 * IN },
  'shan-north': { x: C0, y: IN, w: C1 - C0, h: C0 - IN },
  'shan-south': { x: C0, y: C1, w: C1 - C0, h: S - IN - C1 },
  'shan-west': { x: IN, y: C0, w: C0 - IN, h: C1 - C0 },
  'shan-east': { x: C1, y: C0, w: S - IN - C1, h: C1 - C0 },
  'shan-center': { x: C0, y: C0, w: C1 - C0, h: C1 - C0 },
};

/** 海内 items sit in the four corners around the 五藏山 cross. */
const corner = C0 - IN;
const haineiSlots: Rect[] = [
  { x: IN, y: IN, w: corner, h: corner },
  { x: C1, y: IN, w: corner, h: corner },
  { x: IN, y: C1, w: corner, h: corner },
  { x: C1, y: C1, w: corner, h: corner },
];

function layoutIn(r: Rect, n: number, top = 44) {
  const inner = { x: r.x + 14, y: r.y + top, w: r.w - 28, h: r.h - top - 14 };
  if (r.vertical) {
    inner.x = r.x + 10;
    inner.w = r.w - 20;
    inner.y = r.y + 110;
    inner.h = r.h - 130;
  }
  const ratio = inner.w / inner.h;
  let cols = Math.max(1, Math.round(Math.sqrt(n * ratio)));
  cols = Math.min(cols, n);
  const rows = Math.ceil(n / cols);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? n - row * cols : cols;
    const col = i % cols;
    pts.push({
      x: inner.x + ((col + 0.5) / inRow) * inner.w,
      y: inner.y + ((row + 0.5) / rows) * inner.h,
    });
  }
  return pts;
}

interface Marker {
  e: Entity;
  x: number;
  y: number;
}

function useMarkers() {
  return useMemo(() => {
    const byRegion = new Map<Region, Entity[]>();
    for (const e of entities) if (e.region) {
      if (!byRegion.has(e.region)) byRegion.set(e.region, []);
      byRegion.get(e.region)!.push(e);
    }
    const out: Marker[] = [];
    for (const [region, list] of byRegion) {
      if (region === 'hainei') {
        list.forEach((e, i) => {
          const slot = haineiSlots[i % 4];
          const group = list.filter((_, j) => j % 4 === i % 4);
          const k = group.indexOf(e);
          const pts = layoutIn(slot, group.length, 30);
          out.push({ e, ...pts[k] });
        });
      } else {
        const pts = layoutIn(rects[region], list.length);
        list.forEach((e, i) => out.push({ e, ...pts[i] }));
      }
    }
    return { markers: out, byRegion };
  }, []);
}

function RegionLabel({ region }: { region: Region }) {
  const r = rects[region];
  const name = regionMeta[region].book;
  if (region === 'hainei') {
    return (
      <text x={S / 2} y={(B2 + IN) / 2 + 6} className="region-label hainei">
        海内经
      </text>
    );
  }
  if (r.vertical) {
    return (
      <text className="region-label" x={r.x + r.w / 2} y={r.y + 14}>
        {[...name].map((ch, i) => (
          <tspan key={i} x={r.x + r.w / 2} dy={i === 0 ? 20 : 28}>
            {ch}
          </tspan>
        ))}
      </text>
    );
  }
  return (
    <text x={r.x + r.w / 2} y={r.y + 22} className={`region-label ${region.startsWith('shan') ? 'shan' : ''}`}>
      {name}
    </text>
  );
}

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fs = useFullscreen(wrapRef);
  const { markers, byRegion } = useMarkers();
  const [view, setView] = useState({ x: 0, y: 0, w: S, h: S });
  const [sel, setSel] = useState<string | null>(params.get('focus'));
  const [region, setRegion] = useState<Region | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);

  const zoomTo = (cx: number, cy: number, w: number) => {
    const ww = Math.max(220, Math.min(S * 1.3, w));
    setView({ x: cx - ww / 2, y: cy - ww / 2, w: ww, h: ww });
  };

  useEffect(() => {
    const focus = params.get('focus');
    const m = markers.find((mk) => mk.e.id === focus);
    if (m) zoomTo(m.x, m.y, 520);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (sel) p.set('focus', sel);
    else p.delete('focus');
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  useEffect(() => {
    const svg = svgRef.current!;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = svg.getBoundingClientRect();
      setView((v) => {
        const k = Math.exp(ev.deltaY * 0.0012);
        const nw = Math.max(220, Math.min(S * 1.3, v.w * k));
        const px = (ev.clientX - rect.left) / rect.width;
        const py = (ev.clientY - rect.top) / rect.height;
        const scale = Math.max(v.w / rect.width, v.h / rect.height);
        const offX = (rect.width * scale - v.w) / 2;
        const offY = (rect.height * scale - v.h) / 2;
        const mx = v.x - offX + px * rect.width * scale;
        const my = v.y - offY + py * rect.height * scale;
        return { x: mx - (mx - v.x) * (nw / v.w), y: my - (my - v.y) * (nw / v.h), w: nw, h: nw };
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (ev: React.PointerEvent) => {
    drag.current = { x: ev.clientX, y: ev.clientY, vx: view.x, vy: view.y, moved: false };
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = Math.max(view.w / rect.width, view.h / rect.height);
    const dx = (ev.clientX - d.x) * scale;
    const dy = (ev.clientY - d.y) * scale;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    setView((v) => ({ ...v, x: d.vx - dx, y: d.vy - dy }));
  };
  const onPointerUp = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const clickable = () => !drag.current?.moved;

  const zoom = (k: number) => zoomTo(view.x + view.w / 2, view.y + view.h / 2, view.w * k);
  const selected = sel ? entityMap[sel] : null;
  const regionList = region ? byRegion.get(region) ?? [] : [];

  return (
    <div ref={wrapRef} className={`map-wrap ${fs.active ? 'is-fs' : ''}`}>
      <svg
        ref={svgRef}
        className="map-svg"
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <pattern id="waves" width="60" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 12 q15 -10 30 0 t30 0" fill="none" stroke="#5fb0d0" strokeOpacity="0.16" strokeWidth="1.2" />
            <path d="M-30 24 q15 -10 30 0 t30 0 t30 0" fill="none" stroke="#5fb0d0" strokeOpacity="0.08" strokeWidth="1" />
          </pattern>
          <pattern id="sands" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="8" r="1" fill="#e8c068" fillOpacity="0.14" />
            <circle cx="26" cy="22" r="0.8" fill="#e8c068" fillOpacity="0.12" />
            <circle cx="14" cy="34" r="0.7" fill="#e8c068" fillOpacity="0.1" />
          </pattern>
          <pattern id="peaks" width="50" height="34" patternUnits="userSpaceOnUse">
            <path d="M4 30 l10 -16 l6 8 l6 -12 l12 20" fill="none" stroke="#7be07b" strokeOpacity="0.13" strokeWidth="1.2" />
          </pattern>
          <radialGradient id="map-glow" r="0.6">
            <stop offset="0" stopColor="#e8c068" stopOpacity="0.14" />
            <stop offset="1" stopColor="#e8c068" stopOpacity="0" />
          </radialGradient>
          <clipPath id="mk-clip">
            <circle r="24" />
          </clipPath>
        </defs>

        {/* 大荒 */}
        <rect x="0" y="0" width={S} height={S} fill="#0d0a0c" />
        <rect x="0" y="0" width={S} height={S} fill="url(#sands)" className="frame" />
        {/* 海外 */}
        <rect x={B1} y={B1} width={S - 2 * B1} height={S - 2 * B1} fill="#0a1218" />
        <rect x={B1} y={B1} width={S - 2 * B1} height={S - 2 * B1} fill="url(#waves)" className="frame" />
        {/* 海内 */}
        <rect x={B2} y={B2} width={S - 2 * B2} height={S - 2 * B2} fill="#0d0b12" className="frame" />
        <rect x={B2} y={B2} width={S - 2 * B2} height={S - 2 * B2} fill="url(#waves)" opacity="0.5" />
        <rect x={IN} y={IN} width={S - 2 * IN} height={S - 2 * IN} fill="#100d15" className="frame thin" />
        <circle cx={S / 2} cy={S / 2} r={S * 0.36} fill="url(#map-glow)" />
        {/* compass rose in the corner */}
        <g transform={`translate(${S - B1 / 2},${S - B1 / 2})`} className="rose">
          <circle r="44" />
          <circle r="30" className="dashed" />
          <path d="M0 -40 L6 0 L0 40 L-6 0 Z" />
          <path d="M-40 0 L0 6 L40 0 L0 -6 Z" opacity="0.5" />
          <text y="-52">北</text>
          <text y="58">南</text>
          <text x="-56" y="3">西</text>
          <text x="56" y="3">东</text>
        </g>
        {/* 五藏山 cross */}
        {(['shan-north', 'shan-south', 'shan-west', 'shan-east', 'shan-center'] as Region[]).map((r) => (
          <rect
            key={r}
            x={rects[r].x}
            y={rects[r].y}
            width={rects[r].w}
            height={rects[r].h}
            className={`shan ${region === r ? 'on' : ''}`}
            fill="url(#peaks)"
            onClick={() => clickable() && setRegion(region === r ? null : r)}
          />
        ))}
        {/* region hit areas for bands */}
        {(Object.keys(rects) as Region[])
          .filter((r) => !r.startsWith('shan') && r !== 'hainei')
          .map((r) => (
            <rect
              key={r}
              x={rects[r].x}
              y={rects[r].y}
              width={rects[r].w}
              height={rects[r].h}
              className={`band-hit ${region === r ? 'on' : ''}`}
              onClick={() => clickable() && setRegion(region === r ? null : r)}
            />
          ))}

        {(Object.keys(rects) as Region[]).map((r) => (
          <RegionLabel key={r} region={r} />
        ))}
        <text x={S / 2} y={S / 2 + 6} className="map-center-glyph">山</text>

        {markers.map(({ e, x, y }) => {
          const c = typeMeta[e.type].color;
          const on = sel === e.id;
          const dim = region && e.region !== region;
          return (
            <g
              key={e.id}
              transform={`translate(${x},${y})`}
              className={`mk ${on ? 'on' : ''} ${hover === e.id ? 'hover' : ''}`}
              opacity={dim ? 0.25 : 1}
              onMouseEnter={() => setHover(e.id)}
              onMouseLeave={() => setHover(null)}
              onClick={(ev) => {
                ev.stopPropagation();
                if (clickable()) setSel(e.id);
              }}
            >
              <circle r="30" className="mk-glow" fill={c} />
              <circle r="26" fill="#0c0a12" stroke={c} strokeWidth={on ? 3 : 1.6} />
              {e.image ? (
                <image href={artUrl(e.id)} x="-24" y="-24" width="48" height="48" clipPath="url(#mk-clip)" preserveAspectRatio="xMidYMin slice" />
              ) : (
                <text className="mk-glyph" fill={c}>
                  {e.name[0]}
                </text>
              )}
              <text y="44" className="mk-label">
                {e.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="map-topbar">
        <div className="map-heading">
          <span className="display gold-text">山海舆图</span>
          <small className="muted hide-sm">天圆地方 · 五藏山经居中 · 海内海外环之 · 大荒在外</small>
        </div>
        <div className="graph-tools">
          <button className="icon-btn" onClick={() => zoom(0.75)} title="放大">
            <IconPlus />
          </button>
          <button className="icon-btn" onClick={() => zoom(1.33)} title="缩小">
            <IconMinus />
          </button>
          <button className="icon-btn" onClick={() => { setView({ x: 0, y: 0, w: S, h: S }); setRegion(null); }} title="复位">
            <IconReset />
          </button>
          <button className="icon-btn" onClick={fs.toggle} title="舆图全屏">
            {fs.active ? <IconCollapse /> : <IconExpand />}
          </button>
        </div>
      </div>

      <div className="map-regions panel hide-sm">
        {(Object.keys(regionMeta) as Region[]).map((r) => (
          <button
            key={r}
            className={`map-region-btn ${region === r ? 'on' : ''}`}
            onClick={() => {
              setRegion(region === r ? null : r);
              const rr = rects[r];
              zoomTo(rr.x + rr.w / 2, rr.y + rr.h / 2, Math.max(rr.w, rr.h) * 1.6);
            }}
          >
            {regionMeta[r].book}
            <small>{byRegion.get(r)?.length ?? 0}</small>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {(selected || region) && (
          <motion.aside
            key={selected?.id ?? region}
            className="graph-drawer panel"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <button className="drawer-close icon-btn" onClick={() => { setSel(null); setRegion(null); }}>
              <IconClose />
            </button>
            {selected ? (
              <>
                <div className="drawer-art">
                  <Art entity={selected} eager />
                </div>
                <div className="drawer-head" style={{ ['--c' as string]: typeMeta[selected.type].color }}>
                  <span className="badge" style={{ ['--c' as string]: typeMeta[selected.type].color }}>
                    {typeMeta[selected.type].name}
                  </span>
                  {selected.region && <span className="badge">《{regionMeta[selected.region].book}》</span>}
                  <h2 className="display">{selected.name}</h2>
                  <div className="drawer-title">{selected.title}</div>
                  <p className="muted">{selected.summary}</p>
                </div>
                {selected.quotes?.[0] && (
                  <blockquote className="quote" style={{ ['--c' as string]: typeMeta[selected.type].color }}>
                    {selected.quotes[0].text}
                    <cite>——《{selected.quotes[0].source}》</cite>
                  </blockquote>
                )}
                <div style={{ flex: 1 }} />
                <Link to={`/entity/${selected.id}`} className="btn" style={{ justifyContent: 'center' }}>
                  查看完整条目
                </Link>
              </>
            ) : (
              region && (
                <>
                  <div className="drawer-head">
                    <div className="eyebrow">《山海经》</div>
                    <h2 className="display">{regionMeta[region].book}</h2>
                    <p className="muted">此卷所载 {regionList.length} 条</p>
                  </div>
                  <div className="drawer-rels">
                    {regionList.map((e) => (
                      <button key={e.id} className="drawer-rel map-li" onClick={() => setSel(e.id)}>
                        <Art entity={e} halo={false} />
                        <b>{e.name}</b>
                        <small>{e.title}</small>
                      </button>
                    ))}
                  </div>
                </>
              )
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
