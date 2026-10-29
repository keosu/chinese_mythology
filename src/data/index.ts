import type { Entity, EntityType, EraId, Region, Relation } from './types';
import { chaos } from './entities/chaos';
import { humanity } from './entities/humanity';
import { sovereigns } from './entities/sovereigns';
import { shu } from './entities/shu';
import { heroes } from './entities/heroes';
import { pantheon } from './entities/pantheon';
import { shanhai } from './entities/shanhai';
import { zhiguai } from './entities/zhiguai';
import { relations } from './relations';
import artManifest from './art-manifest.json';

export * from './types';
export { eras, eraMap } from './eras';
export { events } from './events';
export { sources, sourceMap } from './sources';
export { relations, relationMeta } from './relations';

const art = new Set<string>(artManifest as string[]);

export const entities: Entity[] = [
  ...chaos,
  ...humanity,
  ...sovereigns,
  ...shu,
  ...heroes,
  ...pantheon,
  ...shanhai,
  ...zhiguai,
].map((e) => ({ ...e, image: art.has(e.id) }));

export const entityMap: Record<string, Entity> = Object.fromEntries(entities.map((e) => [e.id, e]));

export const typeMeta: Record<EntityType, { name: string; color: string; glyph: string }> = {
  deity: { name: '神祇', color: '#e8c068', glyph: '神' },
  sovereign: { name: '帝王', color: '#ffb36b', glyph: '帝' },
  hero: { name: '英雄', color: '#ff7a6b', glyph: '雄' },
  beast: { name: '异兽', color: '#7be0a0', glyph: '兽' },
  spirit: { name: '精怪', color: '#c99bff', glyph: '灵' },
  nation: { name: '异国', color: '#8fd3ff', glyph: '国' },
  artifact: { name: '神器', color: '#ffd36b', glyph: '器' },
  place: { name: '圣地', color: '#6be0e0', glyph: '境' },
};

export const regionMeta: Record<Region, { name: string; book: string }> = {
  'shan-south': { name: '南山', book: '南山经' },
  'shan-west': { name: '西山', book: '西山经' },
  'shan-north': { name: '北山', book: '北山经' },
  'shan-east': { name: '东山', book: '东山经' },
  'shan-center': { name: '中山', book: '中山经' },
  hainei: { name: '海内', book: '海内经' },
  'haiwai-south': { name: '海外南', book: '海外南经' },
  'haiwai-west': { name: '海外西', book: '海外西经' },
  'haiwai-north': { name: '海外北', book: '海外北经' },
  'haiwai-east': { name: '海外东', book: '海外东经' },
  'dahuang-east': { name: '大荒东', book: '大荒东经' },
  'dahuang-south': { name: '大荒南', book: '大荒南经' },
  'dahuang-west': { name: '大荒西', book: '大荒西经' },
  'dahuang-north': { name: '大荒北', book: '大荒北经' },
};

export function artUrl(id: string) {
  return `${import.meta.env.BASE_URL}art/${id}.webp`;
}

export function entitiesOfEra(era: EraId) {
  return entities.filter((e) => e.era.includes(era));
}

export function relationsOf(id: string): (Relation & { other: string; outgoing: boolean })[] {
  return relations
    .filter((r) => r.from === id || r.to === id)
    .map((r) => ({ ...r, other: r.from === id ? r.to : r.from, outgoing: r.from === id }));
}

function plain(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

export function searchEntities(q: string, limit = 20) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const scored: [number, Entity][] = [];
  for (const e of entities) {
    let score = 0;
    if (e.name === q) score = 100;
    else if (e.name.includes(q)) score = 60;
    else if (e.alias?.some((a) => a.includes(q))) score = 45;
    else if (plain(e.pinyin).includes(plain(s)) && /[a-z]/.test(s)) score = 40;
    else if (e.title.includes(q) || e.tags?.some((t) => t.includes(q))) score = 25;
    else if (e.summary.includes(q)) score = 10;
    if (score) scored.push([score, e]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, e]) => e);
}
