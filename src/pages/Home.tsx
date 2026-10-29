import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { entities, entityMap, eras, events, relations, sources } from '../data';
import Art from '../components/Art';
import EntityCard from '../components/EntityCard';
import { IconArrow, IconGraph } from '../components/Icons';
import { useTilt } from '../hooks';
import type { Era } from '../data';
import './home.css';

export const eraCover: Record<string, string> = {
  chaos: 'pangu',
  humanity: 'nvwa',
  sovereigns: 'huangdi',
  shu: 'zongmu',
  heroes: 'yi',
  pantheon: 'yuhuang',
  shanhai: 'jiuweihu',
};

const featured = ['nvwa', 'chiyou', 'shenshu', 'kuafu', 'xiwangmu', 'erlang', 'taotie', 'baisuzhen'];

function Wheel() {
  const R = 210;
  return (
    <div className="wheel">
      <svg viewBox="-260 -260 520 520" className="wheel-svg">
        <defs>
          <radialGradient id="wheel-core" r="0.5">
            <stop offset="0" stopColor="#e8c068" stopOpacity="0.25" />
            <stop offset="1" stopColor="#e8c068" stopOpacity="0" />
          </radialGradient>
          <path id="ring-text" d="M0,-238 a238,238 0 1,1 -0.1,0" />
        </defs>
        <circle r="250" fill="url(#wheel-core)" />
        <g className="spin-slow">
          <circle r="246" className="ring" />
          <text className="ring-text">
            <textPath href="#ring-text">
              天地混沌如鸡子 · 盘古生其中 · 女娲抟黄土作人 · 蚩尤作兵伐黄帝 · 蚕丛及鱼凫开国何茫然 · 羿射十日 · 禹铸九鼎 · 三清四御 · 山海异兽 ·
            </textPath>
          </text>
          {Array.from({ length: 72 }, (_, i) => (
            <line key={i} y1={-226} y2={i % 9 === 0 ? -214 : -220} transform={`rotate(${i * 5})`} className="tick" />
          ))}
        </g>
        <g className="spin-rev">
          <circle r="182" className="ring dashed" />
          {['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'].map((g, i) => (
            <text key={g} className="trigram" transform={`rotate(${i * 45}) translate(0,-160)`}>
              {g}
            </text>
          ))}
        </g>
        <circle r="128" className="ring" />
      </svg>
      {eras.map((era, i) => {
        const a = (i / eras.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <Link
            key={era.id}
            to={`/era/${era.id}`}
            className="wheel-node"
            style={{
              left: `calc(50% + ${Math.cos(a) * R}px * var(--wheel-scale))`,
              top: `calc(50% + ${Math.sin(a) * R}px * var(--wheel-scale))`,
              ['--c' as string]: era.accent,
            }}
            title={era.name}
          >
            <span className="wheel-glyph">{era.glyph}</span>
            <span className="wheel-label">{era.name}</span>
          </Link>
        );
      })}
      <div className="wheel-center">
        <Art entity="hundun" eager />
      </div>
    </div>
  );
}

function EraCard({ era }: { era: Era }) {
  const ref = useTilt<HTMLAnchorElement>(6);
  const count = entities.filter((e) => e.era.includes(era.id)).length;
  return (
    <Link ref={ref} to={`/era/${era.id}`} className="era-card" style={{ ['--c' as string]: era.accent }}>
      <div className="era-card-num display">{era.numeral}</div>
      <div className="era-card-glyph display">{era.glyph}</div>
      <div className="era-card-art">
        <Art entity={entityMap[eraCover[era.id]]} />
      </div>
      <div className="era-card-body">
        <h3 className="display">{era.name}</h3>
        <p>{era.subtitle}</p>
        <span className="era-card-count">{count} 条目</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const stats = [
    { n: entities.length, t: '神祇 · 异兽 · 圣地' },
    { n: relations.length, t: '条关系脉络' },
    { n: events.length, t: '个神话事件' },
    { n: sources.length, t: '部原典与考古' },
  ];
  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <div className="eyebrow">Chinese Mythology · 中国神话体系</div>
          <h1 className="hero-title display shimmer">华夏神话谱</h1>
          <p className="hero-sub">
            自鸿蒙初判、盘古开天，至女娲抟土、炎黄争帝；
            <br />
            自古蜀纵目、大禹治水，至三清四御、山海志怪——
            <br />
            一部可以“看见关系”的中国神话全景。
          </p>
          <div className="hero-cta">
            <Link className="btn" to="/era/chaos">
              开卷 · 混沌创世 <IconArrow />
            </Link>
            <Link className="btn ghost" to="/graph">
              <IconGraph /> 神谱关系图
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-wheel"
          initial={{ opacity: 0, scale: 0.85, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Wheel />
        </motion.div>
        <div className="scroll-hint">
          <span />
          向下展卷
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          七纪 <small>由创世到志怪，神话的七个篇章</small>
        </h2>
        <div className="era-row">
          {eras.map((e) => (
            <EraCard key={e.id} era={e} />
          ))}
        </div>
      </section>

      <section className="section stats">
        {stats.map((s) => (
          <div key={s.t} className="stat">
            <div className="stat-n display gold-text">{s.n}</div>
            <div className="stat-t">{s.t}</div>
          </div>
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">
          神话的层累 <small>同一位神，在不同时代有不同面目</small>
        </h2>
        <div className="layers">
          {[
            {
              k: '先秦',
              t: '原始神话',
              d: '《山海经》《楚辞》《庄子》：神多兽形，豹尾虎齿、人面蛇身，零散而野性。',
              ids: ['xiwangmu', 'zhulong', 'xingtian'],
            },
            {
              k: '秦汉魏晋',
              t: '系统化与历史化',
              d: '《淮南子》《史记》整编五帝谱系与五方五行；徐整补出盘古；志怪记录人间鬼魅。',
              ids: ['pangu', 'huangdi', 'goumang'],
            },
            {
              k: '唐宋明清',
              t: '宗教化与小说化',
              d: '道教三清四御、佛教阎罗地藏，《西游记》《封神演义》让天庭成为一座神界官府。',
              ids: ['yuhuang', 'nezha', 'sunwukong'],
            },
          ].map((l, i) => (
            <motion.div
              key={l.k}
              className="layer panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <span className="corner tl" />
              <span className="corner br" />
              <div className="layer-k display">{l.k}</div>
              <h3>{l.t}</h3>
              <p className="muted">{l.d}</p>
              <div className="layer-arts">
                {l.ids.map((id) => (
                  <Link key={id} to={`/entity/${id}`} title={entityMap[id].name}>
                    <Art entity={id} halo={false} />
                    <span>{entityMap[id].name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          神祇撷英 <small>
            <Link to="/atlas" className="gold-text">
              查看全部图鉴 →
            </Link>
          </small>
        </h2>
        <div className="grid-cards">
          {featured.map((id) => (
            <EntityCard key={id} e={entityMap[id]} />
          ))}
        </div>
      </section>

      <section className="section portals">
        {[
          { to: '/graph', g: '谱', t: '关系图谱', d: '血亲、婚配、敌对、统属、化身……一张网看清诸神关系。' },
          { to: '/map', g: '舆', t: '山海舆图', d: '按五藏山经、海内外经、大荒经铺开的神话地理。' },
          { to: '/timeline', g: '河', t: '时间长河', d: '神话时序与典籍成书年代，看神话如何层累形成。' },
          { to: '/sources', g: '典', t: '典籍书架', d: '从《山海经》到《聊斋志异》，四十部原典一览。' },
        ].map((p) => (
          <Link key={p.to} to={p.to} className="portal panel">
            <span className="portal-g display">{p.g}</span>
            <div>
              <h3>{p.t}</h3>
              <p className="muted">{p.d}</p>
            </div>
            <IconArrow />
          </Link>
        ))}
      </section>
    </>
  );
}
