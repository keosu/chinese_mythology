import { Link } from 'react-router-dom';
import { typeMeta, type Entity } from '../data';
import { useTilt } from '../hooks';
import Art from './Art';

export default function EntityCard({ e }: { e: Entity }) {
  const ref = useTilt<HTMLAnchorElement>(7);
  const meta = typeMeta[e.type];
  return (
    <Link ref={ref} to={`/entity/${e.id}`} className="ecard" style={{ ['--c' as string]: meta.color }}>
      <span className="ecard-type" title={meta.name}>
        {meta.glyph}
      </span>
      <div className="ecard-art">
        <Art entity={e} />
      </div>
      <div className="ecard-body">
        <h3 className="ecard-name">
          {e.name}
          <small>{e.pinyin}</small>
        </h3>
        <div className="ecard-title">
          {e.title}
          {e.late && <span className="badge late" style={{ marginLeft: 8 }}>后世附会</span>}
        </div>
        <p className="ecard-summary">{e.summary}</p>
      </div>
    </Link>
  );
}
