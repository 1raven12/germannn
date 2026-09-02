import { TOPICS } from "../engine/topics.js";
import { REFERENCE } from "../data/reference.js";

export default function Grammar({ state }) {
  return (
    <div className="grammatik">
      <h1>Grammatik</h1>

      <ul className="themen-liste">
        {TOPICS.map((topic) => {
          const stats = state.grammatik?.[topic.id];
          const seen = stats?.seen || 0;
          const correct = stats?.correct || 0;
          const pct = seen > 0 ? Math.round((correct / seen) * 100) : 0;
          const gut = seen > 0 && pct >= 70;
          return (
            <li key={topic.id} className="thema">
              <div className="thema-kopf">
                <span>{topic.label}</span>
                <span className="thema-zahl">
                  {correct}/{seen}
                </span>
              </div>
              <div className="thema-balken-hintergrund">
                <div
                  className={`thema-balken ${seen === 0 ? "leer" : gut ? "gut" : "schlecht"}`}
                  style={{ width: seen > 0 ? `${pct}%` : "100%" }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <details className="referenz">
        <summary>Grammatik-Nachschlagewerk (offline)</summary>
        {REFERENCE.map((abschnitt) => (
          <article key={abschnitt.id} className="referenz-abschnitt">
            <h2>{abschnitt.titel}</h2>
            {abschnitt.absatz.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {abschnitt.tabellen?.map((tab, i) => (
              <div key={i} className="referenz-tabelle-wrapper">
                {tab.caption && <p className="referenz-tabelle-titel">{tab.caption}</p>}
                <table className="referenz-tabelle">
                  <thead>
                    <tr>
                      {tab.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tab.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </article>
        ))}
      </details>
    </div>
  );
}
