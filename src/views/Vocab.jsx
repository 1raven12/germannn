import { useState } from "react";
import { dueWords, answerVocab } from "../engine/srs.js";

export default function Vocab({ state, setState }) {
  const [flipped, setFlipped] = useState(false);
  const faellig = dueWords(state);
  const aktuell = faellig[0] || null;

  function grade(correct) {
    if (!aktuell) return;
    setState((prev) => answerVocab(prev, aktuell.de, correct));
    setFlipped(false);
  }

  const gesamt = state.vokabeln?.length || 0;

  return (
    <div className="vokabeln">
      <h1>Vokabeln</h1>
      <p className="vokabeln-status">
        {gesamt} Wörter gesammelt · {faellig.length} heute fällig
      </p>

      {!aktuell && (
        <p className="vokabeln-leer">Keine Wiederholung fällig. Spiel weiter, um neue Wörter zu sammeln.</p>
      )}

      {aktuell && (
        <div className="karteikarte" onClick={() => setFlipped((f) => !f)}>
          <p className="karteikarte-seite">{flipped ? aktuell.en : aktuell.de}</p>
          {flipped && aktuell.hinweis && <p className="karteikarte-hinweis">{aktuell.hinweis}</p>}
          <p className="karteikarte-tipp">{flipped ? "" : "Tippen zum Umdrehen"}</p>
        </div>
      )}

      {aktuell && flipped && (
        <div className="karteikarte-antworten">
          <button className="btn-oxblood" onClick={() => grade(false)}>
            Falsch
          </button>
          <button className="btn-sage" onClick={() => grade(true)}>
            Richtig
          </button>
        </div>
      )}

      <section className="karte wortliste">
        <h2>Alle Wörter</h2>
        <ul>
          {(state.vokabeln || [])
            .slice()
            .reverse()
            .map((w) => (
              <li key={w.de}>
                <span>{w.de}</span>
                <span className="wortliste-box">Box {w.box}</span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
