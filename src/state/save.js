const STORAGE_KEY = "nachtschicht:save:v1";
const SAVE_VERSION = 1;
const DEBOUNCE_MS = 150;

export const START = {
  v: SAVE_VERSION,
  profil: { name: "", level: "B1", angelegt: 0 },
  kapitel: 1,
  szene_nr: 0,
  beziehungen: { jonas: 0, leyla: 0, milan: 0, fenna: 0, ada: 0 },
  chronik: [],
  letzteWahl: "",
  vokabeln: [],
  grammatik: {},
  letzteThemen: [],
  frageliste: [],
  aktuelleSzene: null,
  antwortIndex: null,
  antworten: { richtig: 0, falsch: 0 },
};

function migrate(save) {
  if (!save || typeof save !== "object") return { ...START };
  if (save.v === SAVE_VERSION) return save;
  return { ...START, ...save, v: SAVE_VERSION };
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...START, profil: { ...START.profil, angelegt: Date.now() } };
    const parsed = JSON.parse(raw);
    return migrate({ ...START, ...parsed });
  } catch {
    return { ...START, profil: { ...START.profil, angelegt: Date.now() } };
  }
}

let pending = null;
let timer = null;

export function save(state) {
  pending = state;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {
      // storage may be full or unavailable, nothing to recover here
    }
    timer = null;
  }, DEBOUNCE_MS);
}

export function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    if (pending) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      } catch {
        // ignore
      }
    }
  }
}

export function exportSave(state) {
  return JSON.stringify(state, null, 2);
}

export function importSave(text) {
  const parsed = JSON.parse(text);
  return migrate({ ...START, ...parsed });
}

export function wipeSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...START, profil: { ...START.profil, angelegt: Date.now() } };
}
