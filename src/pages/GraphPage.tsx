import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import cytoscape, { type Core, type ElementDefinition } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import {
  artUrl,
  entities,
  entityMap,
  eraMap,
  eras,
  relationMeta,
  relations,
  relationsOf,
  searchEntities,
  typeMeta,
  type EntityType,
  type EraId,
  type RelationType,
} from '../data';
import Art from '../components/Art';
import { IconClose, IconCollapse, IconExpand, IconInstall, IconMinus, IconPlus, IconReset } from '../components/Icons';
import { useFullscreen } from '../hooks';
import './graph.css';

cytoscape.use(fcose);

const allRel = Object.keys(relationMeta) as RelationType[];
const allTypes = Object.keys(typeMeta) as EntityType[];
const directed = new Set<RelationType>(['rule', 'succeed', 'create', 'master', 'avatar']);
type LayoutName = 'fcose' | 'concentric' | 'breadthfirst';

function sealUri(char: string, color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='#120f19'/><circle cx='50' cy='50' r='40' fill='none' stroke='${color}' stroke-opacity='.45' stroke-dasharray='2 3'/><text x='50' y='53' text-anchor='middle' dominant-baseline='middle' font-family='KaiTi,STKaiti,serif' font-size='50' fill='${color}'>${char}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function lineage(root: string, types: RelationType[], max = 5) {
  const seen = new Set([root]);
  let frontier = [root];
  for (let d = 0; d < max && frontier.length; d++) {
    const next: string[] = [];
    for (const id of frontier)
      for (const r of relationsOf(id))
        if (types.includes(r.type) && !seen.has(r.other) && entityMap[r.other]) {
          seen.add(r.other);
          next.push(r.other);
        }
    frontier = next;
  }
  return seen;
}
const hood = (...ids: string[]) => new Set(ids.flatMap((id) => [id, ...relationsOf(id).map((r) => r.other)]));

interface Preset {
  name: string;
  desc: string;
  ids?: () => Set<string>;
  era?: EraId;
  rels?: RelationType[];
  layout?: LayoutName;
}

const presets: Preset[] = [
  { name: '全部神谱', desc: '所有条目与关系' },
  { name: '黄帝谱系', desc: '少典 → 黄帝 → 颛顼、帝喾 → 尧舜禹', ids: () => lineage('huangdi', ['kin', 'spouse', 'succeed'], 4), rels: ['kin', 'spouse', 'succeed'], layout: 'breadthfirst' },
  { name: '炎帝世系', desc: '炎帝 → 祝融 → 共工 → 后土 → 夸父', ids: () => lineage('yandi', ['kin'], 5), rels: ['kin', 'spouse'], layout: 'breadthfirst' },
  { name: '五方五帝', desc: '五帝 · 五佐神 · 四象', ids: () => new Set(['fuxi', 'yandi', 'huangdi', 'shaohao', 'zhuanxu', 'goumang', 'zhurong', 'houtu', 'rushou', 'yuqiang', 'qinglong', 'zhuque', 'baihu', 'xuanwu', 'zhenwu']), rels: ['ally', 'assoc', 'avatar'] },
  { name: '天庭统属', desc: '三清四御与天庭诸部', era: 'pantheon', rels: ['rule', 'ally', 'master', 'kin', 'spouse', 'avatar'], layout: 'fcose' },
  { name: '涿鹿之战', desc: '黄帝、蚩尤与诸神之战', ids: () => hood('chiyou', 'zhuolu'), layout: 'fcose' },
  { name: '古蜀王系', desc: '蚕丛 → 柏灌 → 鱼凫 → 杜宇 → 开明', era: 'shu' },
  { name: '羿与十日', desc: '射日、除害、奔月', ids: () => hood('yi', 'change') },
  { name: '大禹治水', desc: '鲧、禹、启与治水群像', ids: () => hood('yu', 'gun') },
  { name: '封神 · 西游', desc: '明代神魔小说中的天庭', ids: () => hood('jiangziya', 'sunwukong', 'nezha', 'erlang') },
  { name: '山海异兽', desc: '《山海经》与志怪中的异兽精怪', ids: () => new Set(entities.filter((e) => e.type === 'beast' || e.type === 'spirit' || e.type === 'nation').map((e) => e.id)) },
];

const baseStyle: cytoscape.StylesheetJson = [
  {
    selector: 'node',
    style: {
      width: 'mapData(deg, 1, 24, 30, 82)',
      height: 'mapData(deg, 1, 24, 30, 82)',
      'background-color': '#100d17',
      'background-image': 'data(img)',
      'background-fit': 'cover',
      'background-position-y': '16%',
      'background-clip': 'node',
      'border-width': 2,
      'border-color': 'data(color)',
      'border-opacity': 0.9,
      label: 'data(name)',
      color: '#ede5d3',
      'font-family': 'ZCOOL XiaoWei, Noto Serif SC, serif',
      'font-size': 13,
      'text-valign': 'bottom',
      'text-margin-y': 6,
      'text-outline-color': '#07060b',
      'text-outline-width': 3,
      'min-zoomed-font-size': 8,
      'underlay-color': 'data(color)',
      'underlay-opacity': 0,
      'underlay-padding': 7,
      'underlay-shape': 'ellipse',
      'transition-property': 'opacity, border-width, underlay-opacity',
      'transition-duration': 250,
    } as never,
  },
  {
    selector: 'edge',
    style: {
      width: 1.3,
      'line-color': 'data(color)',
      'curve-style': 'bezier',
      opacity: 0.42,
      'arrow-scale': 0.75,
      'target-arrow-color': 'data(color)',
      'transition-property': 'opacity, width',
      'transition-duration': 250,
      'font-family': 'ZCOOL XiaoWei, Noto Serif SC, serif',
      'font-size': 10,
      color: 'data(color)',
      'text-outline-color': '#07060b',
      'text-outline-width': 3,
      'text-rotation': 'autorotate',
    } as never,
  },
  { selector: 'edge[?directed]', style: { 'target-arrow-shape': 'triangle' } },
  { selector: 'edge[?dashed]', style: { 'line-style': 'dashed', 'line-dash-pattern': [5, 4] } as never },
  { selector: '.hidden', style: { display: 'none' } },
  { selector: 'node.faded', style: { opacity: 0.1, 'text-opacity': 0 } },
  { selector: 'edge.faded', style: { opacity: 0.03 } },
  { selector: 'edge.hl, edge.hover', style: { opacity: 0.95, width: 2.4, label: 'data(label)' } },
  { selector: 'node.hl', style: { 'underlay-opacity': 0.16 } as never },
  { selector: 'node.hover', style: { 'underlay-opacity': 0.3, 'border-width': 3 } as never },
  {
    selector: 'node.focus',
    style: { 'border-width': 4, 'underlay-opacity': 0.4, 'font-size': 18, color: '#ffe9b0', 'z-index': 99 } as never,
  },
];

export default function GraphPage() {
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const fs = useFullscreen(wrapRef);

  const initialEra = params.get('era') as EraId | null;
  const [eraSel, setEraSel] = useState<Set<EraId>>(() => new Set(initialEra ? [initialEra] : []));
  const [relSel, setRelSel] = useState<Set<RelationType>>(() => new Set(allRel));
  const [typeSel, setTypeSel] = useState<Set<EntityType>>(() => new Set(allTypes));
  const [late, setLate] = useState(true);
  const [hideIso, setHideIso] = useState(true);
  const [subset, setSubset] = useState<Set<string> | null>(null);
  const [preset, setPreset] = useState('全部神谱');
  const [layout, setLayout] = useState<LayoutName>('fcose');
  const [colorBy, setColorBy] = useState<'type' | 'era'>('type');
  const [selected, setSelected] = useState<string | null>(params.get('focus'));
  const [depth, setDepth] = useState(1);
  const [panel, setPanel] = useState(() => window.innerWidth > 900);
  const [q, setQ] = useState('');
  const [counts, setCounts] = useState({ n: 0, e: 0 });
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const elements = useMemo<ElementDefinition[]>(() => {
    const deg: Record<string, number> = {};
    for (const r of relations) {
      deg[r.from] = (deg[r.from] ?? 0) + 1;
      deg[r.to] = (deg[r.to] ?? 0) + 1;
    }
    const nodes = entities.map((e) => ({
      data: {
        id: e.id,
        name: e.name,
        type: e.type,
        eras: e.era,
        late: !!e.late,
        deg: deg[e.id] ?? 1,
        color: typeMeta[e.type].color,
        eraColor: eraMap[e.era[0]].accent,
        img: e.image ? artUrl(e.id) : sealUri(e.name[0], typeMeta[e.type].color),
      },
    }));
    const edges = relations
      .filter((r) => entityMap[r.from] && entityMap[r.to])
      .map((r, i) => ({
        data: {
          id: `r${i}`,
          source: r.from,
          target: r.to,
          type: r.type,
          label: r.label ?? relationMeta[r.type].name,
          color: relationMeta[r.type].color,
          directed: directed.has(r.type),
          dashed: !!relationMeta[r.type].dashed,
        },
      }));
    return [...nodes, ...edges];
  }, []);

  // init
  useEffect(() => {
    const cy = cytoscape({
      container: boxRef.current,
      elements,
      style: baseStyle,
      minZoom: 0.15,
      maxZoom: 3.5,
      wheelSensitivity: 0.25,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    });
    cyRef.current = cy;
    cy.on('tap', 'node', (e) => setSelected(e.target.id()));
    cy.on('tap', (e) => {
      if (e.target === cy) setSelected(null);
    });
    cy.on('dbltap', 'node', (e) => nav(`/entity/${e.target.id()}`));
    cy.on('mouseover', 'node', (e) => {
      e.target.addClass('hover');
      e.target.connectedEdges().addClass('hover');
      boxRef.current!.style.cursor = 'pointer';
    });
    cy.on('mouseout', 'node', (e) => {
      e.target.removeClass('hover');
      e.target.connectedEdges().removeClass('hover');
      boxRef.current!.style.cursor = '';
    });
    const ro = new ResizeObserver(() => cy.resize());
    ro.observe(boxRef.current!);
    return () => {
      ro.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
  }, [elements, nav]);

  const runLayout = useCallback(
    (name: LayoutName, focus?: string | null) => {
      const cy = cyRef.current;
      if (!cy) return;
      const eles = cy.elements().not('.hidden');
      const common = { animate: true, animationDuration: 700, fit: true, padding: 60 };
      let opts: cytoscape.LayoutOptions;
      if (name === 'concentric') {
        opts = { name, ...common, concentric: (n: cytoscape.NodeSingular) => n.degree(false), levelWidth: () => 3, minNodeSpacing: 18 } as cytoscape.LayoutOptions;
      } else if (name === 'breadthfirst') {
        const visible = eles.nodes();
        const root = focus && cy.$id(focus).nonempty() && !cy.$id(focus).hasClass('hidden')
          ? cy.$id(focus)
          : visible.max((n) => n.degree(false)).ele;
        opts = { name, ...common, directed: false, roots: root, spacingFactor: 1.05, avoidOverlap: true } as cytoscape.LayoutOptions;
      } else {
        opts = {
          name: 'fcose',
          ...common,
          quality: 'default',
          randomize: true,
          nodeRepulsion: 22000,
          idealEdgeLength: 130,
          edgeElasticity: 0.3,
          gravity: 0.18,
          gravityRange: 3.8,
          numIter: 3000,
          nodeSeparation: 130,
          packComponents: true,
        } as cytoscape.LayoutOptions;
      }
      const l = eles.layout(opts);
      l.one('layoutstop', () => {
        const hl = cy.elements('.hl');
        if (selectedRef.current && hl.nonempty()) cy.animate({ fit: { eles: hl, padding: 90 }, duration: 500 });
      });
      l.run();
    },
    [],
  );

  // filters
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.batch(() => {
      cy.nodes().forEach((n) => {
        const d = n.data();
        const ok =
          typeSel.has(d.type) &&
          (eraSel.size === 0 || (d.eras as EraId[]).some((e) => eraSel.has(e))) &&
          (late || !d.late) &&
          (!subset || subset.has(d.id));
        n.toggleClass('hidden', !ok);
      });
      cy.edges().forEach((ed) => {
        const ok = relSel.has(ed.data('type')) && !ed.source().hasClass('hidden') && !ed.target().hasClass('hidden');
        ed.toggleClass('hidden', !ok);
      });
      if (hideIso) {
        cy.nodes().not('.hidden').forEach((n) => {
          if (n.connectedEdges().not('.hidden').empty()) n.addClass('hidden');
        });
      }
    });
    setCounts({ n: cy.nodes().not('.hidden').length, e: cy.edges().not('.hidden').length });
    runLayout(layout, selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraSel, relSel, typeSel, late, subset, hideIso, layout, runLayout]);

  // color mode
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const key = colorBy === 'era' ? 'data(eraColor)' : 'data(color)';
    cy.style().selector('node').style({ 'border-color': key, 'underlay-color': key } as never).update();
  }, [colorBy]);

  // selection
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const p = new URLSearchParams(params);
    if (selected) p.set('focus', selected);
    else p.delete('focus');
    setParams(p, { replace: true });
    cy.batch(() => cy.elements().removeClass('faded hl focus'));
    if (!selected) return;
    const node = cy.$id(selected);
    if (node.empty()) return;
    if (node.hasClass('hidden')) {
      node.removeClass('hidden');
    }
    let nb = node.closedNeighborhood().not('.hidden');
    if (depth > 1) nb = nb.union(nb.nodes().closedNeighborhood().not('.hidden'));
    cy.batch(() => {
      cy.elements().not(nb).addClass('faded');
      nb.addClass('hl');
      node.addClass('focus');
    });
    const t = setTimeout(() => cy.animate({ fit: { eles: nb, padding: 90 }, duration: 600, easing: 'ease-in-out-cubic' }), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, depth]);

  const applyPreset = (p: Preset) => {
    setPreset(p.name);
    setSelected(null);
    setSubset(p.ids ? p.ids() : null);
    setRelSel(new Set(p.rels ?? allRel));
    setEraSel(new Set(p.era ? [p.era] : []));
    setTypeSel(new Set(allTypes));
    setLayout(p.layout ?? 'fcose');
  };

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    setter(n);
  };

  const exportPng = async () => {
    const cy = cyRef.current;
    if (!cy) return;
    const blob = (await cy.png({ output: 'blob-promise', bg: '#07060b', full: true, scale: 2, maxWidth: 6000 })) as Blob;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `华夏神话谱-${preset}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const zoom = (k: number) => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ zoom: { level: cy.zoom() * k, position: { x: cy.width() / 2, y: cy.height() / 2 } as never }, duration: 250 } as never);
  };

  const results = q.trim() ? searchEntities(q, 8) : [];
  const sel = selected ? entityMap[selected] : null;
  const selRels = useMemo(() => (selected ? relationsOf(selected).filter((r) => entityMap[r.other]) : []), [selected]);

  return (
    <div ref={wrapRef} className={`graph-wrap ${fs.active ? 'is-fs' : ''}`}>
      <div ref={boxRef} className="graph-canvas" />

      <div className="graph-topbar">
        <button className="icon-btn" onClick={() => setPanel((p) => !p)}>
          {panel ? '收起筛选' : '筛选 · 预设'}
        </button>
        <div className="graph-search">
          <input value={q} placeholder="寻一位神祇并聚焦……" onChange={(e) => setQ(e.target.value)} />
          {results.length > 0 && (
            <div className="graph-search-list panel">
              {results.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelected(e.id);
                    setQ('');
                  }}
                >
                  <Art entity={e} halo={false} />
                  <b>{e.name}</b>
                  <small>{e.title}</small>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="graph-count muted hide-sm">
          {counts.n} 节点 · {counts.e} 关系
        </div>
        <div className="graph-tools">
          <button className="icon-btn" onClick={() => zoom(1.3)} title="放大">
            <IconPlus />
          </button>
          <button className="icon-btn" onClick={() => zoom(1 / 1.3)} title="缩小">
            <IconMinus />
          </button>
          <button className="icon-btn" onClick={() => runLayout(layout, selected)} title="重新布局">
            <IconReset />
          </button>
          <button className="icon-btn" onClick={exportPng} title="导出图片">
            <IconInstall />
          </button>
          <button className="icon-btn" onClick={fs.toggle} title="图谱全屏">
            {fs.active ? <IconCollapse /> : <IconExpand />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.aside
            className="graph-panel panel"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
          >
            <div className="gp-section">
              <div className="gp-title">预设视图</div>
              <div className="preset-list">
                {presets.map((p) => (
                  <button key={p.name} className={`preset ${preset === p.name ? 'on' : ''}`} onClick={() => applyPreset(p)}>
                    <b>{p.name}</b>
                    <small>{p.desc}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="gp-section">
              <div className="gp-title">布局 · 着色</div>
              <div className="gp-row">
                {([['fcose', '力导'], ['concentric', '同心'], ['breadthfirst', '层级']] as const).map(([k, t]) => (
                  <button key={k} className={`chip ${layout === k ? 'on' : ''}`} onClick={() => setLayout(k)}>
                    {t}
                  </button>
                ))}
                <span style={{ width: 8 }} />
                <button className={`chip ${colorBy === 'type' ? 'on' : ''}`} onClick={() => setColorBy('type')}>
                  按类别
                </button>
                <button className={`chip ${colorBy === 'era' ? 'on' : ''}`} onClick={() => setColorBy('era')}>
                  按纪元
                </button>
              </div>
            </div>
            <div className="gp-section">
              <div className="gp-title">
                关系类型
                <button className="gp-mini" onClick={() => setRelSel(new Set(relSel.size === allRel.length ? [] : allRel))}>
                  {relSel.size === allRel.length ? '全不选' : '全选'}
                </button>
              </div>
              <div className="gp-row">
                {allRel.map((t) => (
                  <button
                    key={t}
                    className={`chip legend ${relSel.has(t) ? 'on' : ''}`}
                    style={{ ['--chip-color' as string]: relationMeta[t].color }}
                    onClick={() => toggle(relSel, t, setRelSel)}
                  >
                    <span className={`line ${relationMeta[t].dashed ? 'dashed' : ''}`} />
                    {relationMeta[t].name}
                  </button>
                ))}
              </div>
            </div>
            <div className="gp-section">
              <div className="gp-title">纪元</div>
              <div className="gp-row">
                {eras.map((e) => (
                  <button
                    key={e.id}
                    className={`chip ${eraSel.has(e.id) ? 'on' : ''}`}
                    style={{ ['--chip-color' as string]: e.accent }}
                    onClick={() => {
                      setSubset(null);
                      setPreset('');
                      toggle(eraSel, e.id, setEraSel);
                    }}
                  >
                    <span className="dot" />
                    {e.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="gp-section">
              <div className="gp-title">类别</div>
              <div className="gp-row">
                {allTypes.map((t) => (
                  <button
                    key={t}
                    className={`chip ${typeSel.has(t) ? 'on' : ''}`}
                    style={{ ['--chip-color' as string]: typeMeta[t].color }}
                    onClick={() => toggle(typeSel, t, setTypeSel)}
                  >
                    <span className="dot" />
                    {typeMeta[t].name}
                  </button>
                ))}
              </div>
            </div>
            <div className="gp-section gp-row">
              <label className="chip toggle">
                <input type="checkbox" checked={late} onChange={(e) => setLate(e.target.checked)} />
                含后世附会
              </label>
              <label className="chip toggle">
                <input type="checkbox" checked={hideIso} onChange={(e) => setHideIso(e.target.checked)} />
                隐藏孤立节点
              </label>
            </div>
            <p className="gp-tip">单击节点聚焦其关系，双击进入详情；滚轮缩放，拖拽平移。</p>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sel && (
          <motion.aside
            key={sel.id}
            className="graph-drawer panel"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            style={{ ['--c' as string]: typeMeta[sel.type].color }}
          >
            <button className="drawer-close icon-btn" onClick={() => setSelected(null)}>
              <IconClose />
            </button>
            <div className="drawer-art">
              <Art entity={sel} eager />
            </div>
            <div className="drawer-head">
              <span className="badge" style={{ ['--c' as string]: typeMeta[sel.type].color }}>
                {typeMeta[sel.type].name}
              </span>
              {sel.late && <span className="badge late">后世附会</span>}
              <h2 className="display">{sel.name}</h2>
              <div className="drawer-title">{sel.title}</div>
              <p className="muted">{sel.summary}</p>
            </div>
            <div className="gp-row" style={{ marginBottom: 12 }}>
              <span className="muted" style={{ fontSize: 13 }}>展开深度</span>
              {[1, 2].map((d) => (
                <button key={d} className={`chip ${depth === d ? 'on' : ''}`} onClick={() => setDepth(d)}>
                  {d} 度
                </button>
              ))}
              <button className="chip" onClick={() => setLayout('breadthfirst')}>
                以此为根
              </button>
            </div>
            <div className="drawer-rels">
              {selRels.map((r, i) => (
                <button key={i} className="drawer-rel" onClick={() => setSelected(r.other)}>
                  <span className="rel-swatch" style={{ background: relationMeta[r.type].color }} />
                  <b>{entityMap[r.other].name}</b>
                  <small>{r.label ?? relationMeta[r.type].name}</small>
                </button>
              ))}
            </div>
            <Link to={`/entity/${sel.id}`} className="btn" style={{ marginTop: 14, justifyContent: 'center' }}>
              查看完整条目
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
