import { useEffect, useState, useCallback } from "react";
import { load, save, flush } from "./state/save.js";
import Story from "./views/Story.jsx";
import Vocab from "./views/Vocab.jsx";
import Grammar from "./views/Grammar.jsx";
import People from "./views/People.jsx";
import More from "./views/More.jsx";

const TABS = [
  { id: "geschichte", label: "Geschichte" },
  { id: "vokabeln", label: "Vokabeln" },
  { id: "grammatik", label: "Grammatik" },
  { id: "leute", label: "Leute" },
  { id: "mehr", label: "Mehr" },
];

export default function App() {
  const [state, setStateRaw] = useState(() => load());
  const [tab, setTab] = useState("geschichte");
  const [name, setName] = useState("");

  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onUnload = () => flush();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  if (!state.profil?.name) {
    return (
      <div className="namensschirm">
        <div className="namensschirm-karte">
          <h1>NACHTSCHICHT</h1>
          <p>Wie heißt du?</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = name.trim();
              if (!trimmed) return;
              setState((prev) => ({
                ...prev,
                profil: { ...prev.profil, name: trimmed, angelegt: Date.now() },
              }));
            }}
          >
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              maxLength={30}
            />
            <button type="submit" className="btn-primary">
              Schicht beginnen
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-inhalt">
        {tab === "geschichte" && <Story state={state} setState={setState} />}
        {tab === "vokabeln" && <Vocab state={state} setState={setState} />}
        {tab === "grammatik" && <Grammar state={state} />}
        {tab === "leute" && <People state={state} />}
        {tab === "mehr" && <More state={state} setState={setState} />}
      </main>
      <nav className="tab-leiste" aria-label="Hauptnavigation">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-knopf ${tab === t.id ? "aktiv" : ""}`}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
