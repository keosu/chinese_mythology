export type EraId =
  | 'chaos'
  | 'humanity'
  | 'sovereigns'
  | 'shu'
  | 'heroes'
  | 'pantheon'
  | 'shanhai';

export type EntityType =
  | 'deity'
  | 'sovereign'
  | 'hero'
  | 'beast'
  | 'spirit'
  | 'nation'
  | 'artifact'
  | 'place';

export type RelationType =
  | 'kin'
  | 'spouse'
  | 'master'
  | 'enemy'
  | 'ally'
  | 'rule'
  | 'succeed'
  | 'create'
  | 'avatar'
  | 'assoc';

/** 《山海经》 sections used by the map. */
export type Region =
  | 'shan-south'
  | 'shan-west'
  | 'shan-north'
  | 'shan-east'
  | 'shan-center'
  | 'hainei'
  | 'haiwai-south'
  | 'haiwai-west'
  | 'haiwai-north'
  | 'haiwai-east'
  | 'dahuang-east'
  | 'dahuang-south'
  | 'dahuang-west'
  | 'dahuang-north';

export interface Quote {
  text: string;
  source: string;
}

export interface Entity {
  id: string;
  name: string;
  alias?: string[];
  pinyin: string;
  type: EntityType;
  era: EraId[];
  title: string;
  summary: string;
  story: string[];
  quotes?: Quote[];
  sources?: string[];
  tags?: string[];
  region?: Region;
  /** later literary invention rather than early myth */
  late?: boolean;
  image?: boolean;
}

export interface Relation {
  from: string;
  to: string;
  type: RelationType;
  label?: string;
}

export interface MythEvent {
  id: string;
  era: EraId;
  order: number;
  title: string;
  summary: string;
  participants: string[];
  quote?: Quote;
}

export interface Source {
  id: string;
  title: string;
  dynasty: string;
  year: number;
  author: string;
  intro: string;
  excerpt?: string;
}

export interface Era {
  id: EraId;
  index: number;
  numeral: string;
  name: string;
  subtitle: string;
  accent: string;
  glyph: string;
  intro: string[];
  themes: { title: string; text: string }[];
}
