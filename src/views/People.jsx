import { CAST } from "../data/cast.js";

export default function People({ state }) {
  return (
    <div className="leute">
      <h1>Leute</h1>
      <ul className="leute-liste">
        {CAST.map((c) => {
          const wert = state.beziehungen?.[c.id] ?? 0;
          return (
            <li key={c.id} className="person">
              <div className="person-kopf">
                <h2>{c.name}</h2>
                <span className="person-alter">{c.alter}</span>
              </div>
              <p className="person-rolle">{c.rolle}</p>
              <p className="person-temperament">{c.temperament}</p>
              <div className="beziehung-balken-hintergrund">
                <div className="beziehung-balken" style={{ width: `${wert * 10}%` }} />
              </div>
              <p className="beziehung-zahl">{wert}/10</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
