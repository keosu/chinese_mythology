import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { entities, searchEntities, typeMeta } from '../data';
import Art from './Art';

const EVT = 'open-search';
export const openSearch = () => window.dispatchEvent(new Event(EVT));

const featured = ['pangu', 'nvwa', 'huangdi', 'cancong', 'yu', 'xiwangmu', 'jiuweihu', 'sunwukong'];

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener(EVT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(EVT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(
    () => (q.trim() ? searchEntities(q, 30) : featured.map((id) => entities.find((e) => e.id === id)!)),
    [q],
  );

  const go = (id: string) => {
    setOpen(false);
    nav(`/entity/${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="panel palette"
            initial={{ y: -20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={q}
              placeholder="搜索神祇、异兽、典故……（支持拼音）"
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSel((s) => Math.min(s + 1, results.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSel((s) => Math.max(s - 1, 0));
                } else if (e.key === 'Enter' && results[sel]) go(results[sel].id);
              }}
            />
            <div className="palette-list">
              {!q.trim() && <div className="eyebrow" style={{ padding: '6px 12px', fontSize: 12 }}>推荐</div>}
              {results.length === 0 && <div className="palette-empty">未寻得此名，或可换个称谓</div>}
              {results.map((e, i) => (
                <div
                  key={e.id}
                  className={`palette-item ${i === sel ? 'sel' : ''}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(e.id)}
                >
                  <Art entity={e} className="thumb" halo={false} />
                  <div style={{ minWidth: 0 }}>
                    <b>{e.name}</b>{' '}
                    <span className="badge" style={{ ['--c' as string]: typeMeta[e.type].color }}>
                      {typeMeta[e.type].name}
                    </span>
                    <div className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.title} · {e.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
