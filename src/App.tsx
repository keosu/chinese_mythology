import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Background from './components/Background';
import SearchPalette from './components/SearchPalette';
import PwaToast from './components/PwaToast';
import Home from './pages/Home';
import EraPage from './pages/EraPage';
import Atlas from './pages/Atlas';
import EntityPage from './pages/EntityPage';
import TimelinePage from './pages/TimelinePage';
import SourcesPage from './pages/SourcesPage';
import Loading from './components/Loading';

const GraphPage = lazy(() => import('./pages/GraphPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const immersive = location.pathname.startsWith('/graph') || location.pathname.startsWith('/map');

  return (
    <div className="app">
      <Background />
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Suspense fallback={<Loading />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/era/:id" element={<EraPage />} />
                <Route path="/atlas" element={<Atlas />} />
                <Route path="/entity/:id" element={<EntityPage />} />
                <Route path="/graph" element={<GraphPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/sources" element={<SourcesPage />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {!immersive && (
        <footer className="footer">
          <div className="display">华夏神话谱</div>
          <p>
            取材于《山海经》《楚辞》《淮南子》《史记》《华阳国志》《搜神记》等典籍与三星堆、金沙考古。
            <br />
            标注“后世附会”者为明清小说或道教后起之说，非先秦原始神话。
          </p>
        </footer>
      )}
      <SearchPalette />
      <PwaToast />
    </div>
  );
}
