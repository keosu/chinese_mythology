import { NavLink, Link, useLocation } from 'react-router-dom';
import { useFullscreen, useInstallPrompt } from '../hooks';
import { IconCollapse, IconExpand, IconInstall, IconSearch } from './Icons';
import { openSearch } from './SearchPalette';

const links = [
  { to: '/era/chaos', label: '纪元', match: '/era' },
  { to: '/atlas', label: '图鉴' },
  { to: '/graph', label: '图谱' },
  { to: '/map', label: '舆图' },
  { to: '/timeline', label: '长河' },
  { to: '/sources', label: '典籍' },
];

export default function Header() {
  const fs = useFullscreen();
  const { canInstall, install } = useInstallPrompt();
  const { pathname } = useLocation();
  return (
    <header className="header">
      <Link to="/" className="brand" aria-label="华夏神话谱 首页">
        <span className="brand-seal">神</span>
        <span className="brand-name">华夏神话谱</span>
      </Link>
      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              isActive || (l.match && pathname.startsWith(l.match)) ? 'active' : ''
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-tools">
        <button className="icon-btn" onClick={openSearch} title="搜索 (Ctrl+K)">
          <IconSearch />
          <span className="kbd hide-sm">Ctrl K</span>
        </button>
        {canInstall && (
          <button className="icon-btn" onClick={install} title="安装到桌面">
            <IconInstall />
            <span className="hide-sm">安装</span>
          </button>
        )}
        {fs.supported && (
          <button className="icon-btn" onClick={fs.toggle} title={fs.active ? '退出全屏' : '全屏'}>
            {fs.active ? <IconCollapse /> : <IconExpand />}
          </button>
        )}
      </div>
    </header>
  );
}
