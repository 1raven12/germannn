import { useEffect, useRef, useState } from "react";
import { generateScene } from "../engine/client.js";
import { addVocabFromScene, answerVocab, findKnownWord, normalize } from "../engine/srs.js";
import { recordTopicUsed, recordAnswer, findTopic } from "../engine/topics.js";

function tokenize(text) {
  const parts = text.split(/([A-Za-zÀ-ÖØ-öø-ÿß]+)/);
  return parts.map((part, i) => ({ text: part, isWord: i % 2 === 1 }));
}

function applyChoice(prev, wahl) {
  const beziehungen = { ...prev.beziehungen };
  const ziel = wahl.ziel;
  if (ziel && ziel in beziehungen) {
    beziehungen[ziel] = Math.max(0, Math.min(10, (beziehungen[ziel] ?? 0) + (wahl.wert ?? 0)));
  }
  for (const id of Object.keys(beziehungen)) {
    if (id === ziel) continue;
    if ((prev.beziehungen[id] ?? 0) >= 7) {
      beziehungen[id] = Math.max(0, beziehungen[id] - 1);
    }
  }
  return beziehungen;
}

export default function Story({ state, setState }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aufgedeckt, setAufgedeckt] = useState(() => new Set());
  const [gloss, setGloss] = useState(null);
  const [confirm, setConfirm] = useState("");
  const inFlight = useRef(false);

  useEffect(() => {
    if (state.aktuelleSzene || loading || inFlight.current || error) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    generateScene(state)
      .then(({ scene, topic }) => {
        setState((prev) => {
          let next = addVocabFromScene(prev, scene.vokabeln, prev.szene_nr);
          next = recordTopicUsed(next, topic.id);
          return {
            ...next,
            aktuelleSzene: { ...scene, topicId: topic.id },
            antwortIndex: null,
            frageliste: [],
          };
        });
        setAufgedeckt(new Set());
      })
      .catch((err) => setError(err.message || "Etwas ist schiefgelaufen."))
      .finally(() => {
        setLoading(false);
        inFlight.current = false;
      });
  }, [state.aktuelleSzene, loading, error, state, setState]);

  useEffect(() => {
    if (!confirm) return;
    const t = setTimeout(() => setConfirm(""), 2500);
    return () => clearTimeout(t);
  }, [confirm]);

  function onWordTap(word) {
    const known = findKnownWord(state, word);
    if (known) {
      setGloss((prev) => (prev && normalize(prev.de) === normalize(word) ? null : known));
      return;
    }
    setGloss(null);
    setState((prev) => {
      const key = normalize(word);
      if ((prev.frageliste || []).some((w) => normalize(w) === key)) return prev;
      return { ...prev, frageliste: [...(prev.frageliste || []), word] };
    });
    setConfirm(`„${word}“ gemerkt — wird in der nächsten Szene erklärt.`);
  }

  function onAntwort(idx) {
    if (state.antwortIndex !== null) return;
    setState((prev) => {
      const richtig = idx === prev.aktuelleSzene.uebung.richtig;
      let next = recordAnswer(prev, prev.aktuelleSzene.topicId, richtig);
      return {
        ...next,
        antwortIndex: idx,
        antworten: {
          richtig: next.antworten.richtig + (richtig ? 1 : 0),
          falsch: next.antworten.falsch + (richtig ? 0 : 1),
        },
      };
    });
  }

  function onWahl(wahl) {
    setState((prev) => {
      const beziehungen = applyChoice(prev, wahl);
      const chronik = [...prev.chronik, prev.aktuelleSzene.chronik].slice(-40);
      const szene_nr = prev.szene_nr + 1;
      const kapitel = Math.floor(szene_nr / 6) + 1;
      return {
        ...prev,
        beziehungen,
        chronik,
        letzteWahl: wahl.folge || wahl.en || wahl.de,
        szene_nr,
        kapitel,
        aktuelleSzene: null,
        antwortIndex: null,
      };
    });
  }

  function retry() {
    setError(null);
  }

  if (loading || (!state.aktuelleSzene && !error)) {
    return (
      <div className="szene-lade">
        <div className="lade-spinner" aria-hidden="true" />
        <p>Die Nacht beginnt …</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="szene-fehler">
        <p>{error}</p>
        <button className="btn-primary" onClick={retry}>
          Noch einmal versuchen
        </button>
      </div>
    );
  }

  const szene = state.aktuelleSzene;
  const topic = findTopic(szene.topicId);
  const beantwortet = state.antwortIndex !== null;

  return (
    <div className="szene">
      <p className="szene-ort">{szene.ort}</p>

      <div className="beats">
        {szene.beats.map((beat, i) => (
          <div key={i} className="beat">
            {beat.wer && beat.wer !== "Erzähler" && <span className="beat-sprecher">{beat.wer}</span>}
            <span className="beat-text">
              {tokenize(beat.de).map((part, j) =>
                part.isWord ? (
                  <span
                    key={j}
                    role="button"
                    tabIndex={0}
                    className={`wort ${findKnownWord(state, part.text) ? "wort-bekannt" : ""}`}
                    onClick={() => onWordTap(part.text)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onWordTap(part.text);
                      }
                    }}
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={j}>{part.text}</span>
                )
              )}
              <button
                type="button"
                className="beat-umschalten"
                aria-label="Übersetzung anzeigen"
                onClick={() =>
                  setAufgedeckt((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
              >
                EN
              </button>
            </span>
            {aufgedeckt.has(i) && <span className="beat-uebersetzung">{beat.en}</span>}
          </div>
        ))}
      </div>

      {gloss && (
        <p className="wort-gloss">
          <strong>{gloss.de}</strong> — {gloss.en} {gloss.hinweis && <span>({gloss.hinweis})</span>}
        </p>
      )}
      {confirm && <p className="bestaetigung">{confirm}</p>}

      {topic && <p className="hinweiszeile">Grammatik-Fokus: {topic.label}</p>}

      <section className="karte vokabelkarte">
        <h2>Neue Wörter</h2>
        <ul>
          {szene.vokabeln.map((v, i) => (
            <li key={i}>
              <strong>{v.de}</strong> — {v.en}
              {v.hinweis && <span className="vokabel-hinweis"> ({v.hinweis})</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="karte uebungskarte">
        <h2>Übung</h2>
        <p className="uebung-satz">{szene.uebung.satz}</p>
        <div className="optionen">
          {szene.uebung.optionen.map((opt, i) => {
            let klasse = "option";
            if (beantwortet) {
              if (i === szene.uebung.richtig) klasse += " richtig";
              else if (i === state.antwortIndex) klasse += " falsch";
            }
            return (
              <button
                key={i}
                type="button"
                className={klasse}
                disabled={beantwortet}
                onClick={() => onAntwort(i)}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {beantwortet && <p className="erklaerung">{szene.uebung.erklaerung}</p>}
      </section>

      {beantwortet && (
        <section className="wahlen">
          {szene.wahl.map((w, i) => (
            <button key={i} type="button" className="wahl-knopf" onClick={() => onWahl(w)}>
              <span className="wahl-de">{w.de}</span>
              <span className="wahl-en">{w.en}</span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
