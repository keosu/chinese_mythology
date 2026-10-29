import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;
  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };
  return (
    <div className="panel toast" role="status">
      <span>{needRefresh ? '神谱已有新版本' : '已缓存，可离线翻阅'}</span>
      {needRefresh && (
        <button className="btn" style={{ padding: '4px 14px', fontSize: 14 }} onClick={() => updateServiceWorker(true)}>
          更新
        </button>
      )}
      <button className="chip" onClick={close}>
        知道了
      </button>
    </div>
  );
}
