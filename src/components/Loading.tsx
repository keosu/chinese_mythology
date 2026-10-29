export default function Loading() {
  return (
    <div style={{ height: 'calc(100vh - var(--header-h))', display: 'grid', placeItems: 'center' }}>
      <div className="display shimmer" style={{ fontSize: 42 }}>
        展卷中……
      </div>
    </div>
  );
}
