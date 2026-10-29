import { entities, entityMap, events, relations, sourceMap } from '../src/data/index';

let bad = 0;
const ids = new Set<string>();
for (const e of entities) {
  if (ids.has(e.id)) { console.log('dup id', e.id); bad++; }
  ids.add(e.id);
  for (const s of e.sources ?? []) if (!sourceMap[s]) { console.log('missing source', s, 'in', e.id); bad++; }
}
for (const r of relations) {
  for (const id of [r.from, r.to]) if (!entityMap[id]) { console.log('relation missing', id, r); bad++; }
}
for (const ev of events) for (const p of ev.participants) if (!entityMap[p]) { console.log('event missing', p, ev.id); bad++; }
const deg: Record<string, number> = {};
for (const r of relations) { deg[r.from] = (deg[r.from] ?? 0) + 1; deg[r.to] = (deg[r.to] ?? 0) + 1; }
const iso = entities.filter((e) => !deg[e.id]).map((e) => e.id);
const noImg = entities.filter((e) => !e.image).map((e) => e.id);
console.log(`entities ${entities.length}, relations ${relations.length}, events ${events.length}`);
console.log('isolated:', iso.join(', ') || 'none');
console.log(`without art (${noImg.length}):`, noImg.join(' '));
process.exit(bad ? 1 : 0);
