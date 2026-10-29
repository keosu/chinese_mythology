import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { entityMap, eras, events, sources } from '../data';
import Art from '../components/Art';
import './timeline.css';

const segs: [number, number, number][] = [
  [-1300, -800, 260],
  [-800, -200, 760],
  [-200, 500, 940],
  [500, 1300, 420],
  [1300, 1800, 420],
];
const AXIS_W = segs.reduce((s, x) => s + x[2], 0);
function yearX(y: number) {
  let x = 0;
  for (const [a, b, w] of segs) {
    if (y <= b) return x + ((Math.max(y, a) - a) / (b - a)) * w;
    x += w;
  }
  return x;
}
const dynasties: [string, number, number][] = [
  ['商', -1300, -1046],
  ['西周', -1046, -771],
  ['春秋', -770, -476],
  ['战国', -475, -221],
  ['秦汉', -221, 220],
  ['魏晋南北朝', 220, 589],
  ['隋唐五代', 589, 960],
  ['宋', 960, 1279],
  ['元明', 1279, 1644],
  ['清', 1644, 1800],
];
const fmt = (y: number) => (y < 0 ? `前 ${-y}` : `${y}`);

function useHorizontalWheel(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((e.deltaY > 0 && el.scrollLeft >= max - 1) || (e.deltaY < 0 && el.scrollLeft <= 0)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [ref]);
}

export default function TimelinePage() {
  const riverRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  useHorizontalWheel(riverRef);
  useHorizontalWheel(bookRef);

  const placed = useMemo(() => {
    const sorted = [...sources].sort((a, b) => a.year - b.year);
    const rows: number[] = [];
    return sorted.map((s) => {
      const x = yearX(s.year);
      let row = rows.findIndex((last) => x - last > 120);
      if (row === -1) {
        row = rows.length;
        rows.push(x);
      } else rows[row] = x;
      return { s, x, row };
    });
  }, []);
  const rowCount = Math.max(...placed.map((p) => p.row)) + 1;

  return (
    <div className="timeline-page">
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="eyebrow">River of Time</div>
        <h1 className="display gold-text" style={{ fontSize: 'clamp(48px,6vw,80px)', margin: 0 }}>
          时间长河
        </h1>
        <p className="muted" style={{ maxWidth: 760 }}>
          上卷依神话自身的时序，从混沌到志怪顺流而下；下卷依典籍成书的年代排列。两相对照便能看出：
          越早的神祇往往越晚被写成完整的故事——这正是顾颉刚所说的“层累地造成的中国古史”。
        </p>
      </section>

      <h2 className="section-title tl-h">
        上卷 · 神话时序 <small>横向滚动</small>
      </h2>
      <div ref={riverRef} className="river-scroll">
        <div className="river">
          <div className="river-line" />
          {eras.map((era) => {
            const evs = events.filter((e) => e.era === era.id).sort((a, b) => a.order - b.order);
            return (
              <div key={era.id} className="river-era" style={{ ['--c' as string]: era.accent }}>
                <Link to={`/era/${era.id}`} className="river-era-head">
                  <span className="display river-num">{era.numeral}</span>
                  <span className="display river-name">{era.name}</span>
                  <small>{era.subtitle}</small>
                </Link>
                <div className="river-events">
                  {evs.map((ev, i) => {
                    const lead = ev.participants.map((p) => entityMap[p]).find((p) => p?.image);
                    return (
                      <div key={ev.id} className={`river-ev ${i % 2 ? 'down' : 'up'}`}>
                        <div className="river-dot" />
                        <div className="river-card panel">
                          {lead && (
                            <div className="river-art">
                              <Art entity={lead} halo={false} />
                            </div>
                          )}
                          <b>{ev.title}</b>
                          <p>{ev.summary}</p>
                          <div className="river-people">
                            {ev.participants.slice(0, 5).map((p) =>
                              entityMap[p] ? (
                                <Link key={p} to={`/entity/${p}`}>
                                  {entityMap[p].name}
                                </Link>
                              ) : null,
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="section-title tl-h" style={{ marginTop: 40 }}>
        下卷 · 典籍成书 <small>公元前 1300 年 — 公元 1800 年（分段比例）</small>
      </h2>
      <div ref={bookRef} className="river-scroll">
        <div className="books" style={{ width: AXIS_W + 120, height: 120 + rowCount * 74 }}>
          {dynasties.map(([n, a, b], i) => (
            <div key={n} className={`dyn ${i % 2 ? 'alt' : ''}`} style={{ left: 60 + yearX(a), width: yearX(b) - yearX(a) }}>
              <span>{n}</span>
            </div>
          ))}
          <div className="books-axis" style={{ left: 60, width: AXIS_W }} />
          {[-1200, -1000, -800, -600, -400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800].map((y) => (
            <div key={y} className="tick" style={{ left: 60 + yearX(y) }}>
              {fmt(y)}
            </div>
          ))}
          {placed.map(({ s, x, row }) => (
            <Link key={s.id} to={`/sources#${s.id}`} className="book" style={{ left: 60 + x, top: 96 + row * 74 }}>
              <span className="book-pin" />
              <b>《{s.title}》</b>
              <small>
                {s.dynasty} · {s.author}
              </small>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}
