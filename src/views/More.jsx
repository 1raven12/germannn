import { useRef, useState } from "react";
import { exportSave, importSave, wipeSave } from "../state/save.js";

export default function More({ state, setState }) {
  const fileInput = useRef(null);
  const [wipeSchritt, setWipeSchritt] = useState(false);
  const [meldung, setMeldung] = useState("");

  function onExport() {
    const text = exportSave(state);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nachtschicht-save.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onImportClick() {
    fileInput.current?.click();
  }

  function onImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = importSave(String(reader.result));
        setState(next);
        setMeldung("Speicherstand geladen.");
      } catch {
        setMeldung("Diese Datei konnte nicht gelesen werden.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function onWipe() {
    if (!wipeSchritt) {
      setWipeSchritt(true);
      return;
    }
    const frisch = wipeSave();
    setState(frisch);
    setWipeSchritt(false);
    setMeldung("Speicherstand gelöscht.");
  }

  function onLevel(level) {
    setState((prev) => ({ ...prev, profil: { ...prev.profil, level } }));
  }

  return (
    <div className="mehr">
      <h1>Mehr</h1>

      <section className="karte">
        <h2>Level</h2>
        <div className="level-auswahl">
          {["A2", "B1", "B2"].map((level) => (
            <button
              key={level}
              className={`level-knopf ${state.profil?.level === level ? "aktiv" : ""}`}
              onClick={() => onLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <section className="karte">
        <h2>Statistik</h2>
        <p>Kapitel {state.kapitel} · Szene {state.szene_nr}</p>
        <p>
          {state.antworten?.richtig || 0} richtig · {state.antworten?.falsch || 0} falsch
        </p>
      </section>

      <section className="karte">
        <h2>Speicherstand</h2>
        <div className="mehr-knopfreihe">
          <button className="btn-primary" onClick={onExport}>
            Exportieren
          </button>
          <button className="btn-primary" onClick={onImportClick}>
            Importieren
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            onChange={onImportFile}
            hidden
          />
        </div>
        <button className="btn-oxblood" onClick={onWipe}>
          {wipeSchritt ? "Wirklich alles löschen?" : "Speicherstand löschen"}
        </button>
        {meldung && <p className="mehr-meldung">{meldung}</p>}
      </section>

      <section className="karte">
        <h2>Über</h2>
        <p>NACHTSCHICHT ist ein Deutschlern-Liebesspiel. Jede Szene wird live erzeugt.</p>
      </section>
    </div>
  );
}
