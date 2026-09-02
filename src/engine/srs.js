export const BOX_INTERVALS = [0, 2, 4, 8, 16, 32];
const MAX_BOX = 5;

export function normalize(word) {
  return word.trim().toLowerCase();
}

export function addVocabFromScene(state, vokabeln, szeneNr) {
  const list = [...(state.vokabeln || [])];
  for (const item of vokabeln || []) {
    if (!item?.de) continue;
    const key = normalize(item.de);
    const existing = list.find((w) => normalize(w.de) === key);
    if (existing) continue;
    list.push({
      de: item.de,
      en: item.en || "",
      hinweis: item.hinweis || "",
      box: 1,
      faellig: szeneNr + BOX_INTERVALS[0],
      richtig: 0,
      falsch: 0,
    });
  }
  return { ...state, vokabeln: list };
}

export function answerVocab(state, de, correct) {
  const key = normalize(de);
  const vokabeln = (state.vokabeln || []).map((w) => {
    if (normalize(w.de) !== key) return w;
    if (correct) {
      const box = Math.min(w.box + 1, MAX_BOX);
      return {
        ...w,
        box,
        faellig: state.szene_nr + BOX_INTERVALS[box],
        richtig: w.richtig + 1,
      };
    }
    return {
      ...w,
      box: 1,
      faellig: state.szene_nr + BOX_INTERVALS[1],
      falsch: w.falsch + 1,
    };
  });
  return { ...state, vokabeln };
}

export function dueWords(state) {
  return (state.vokabeln || []).filter((w) => w.faellig <= state.szene_nr);
}

export function findKnownWord(state, token) {
  const key = normalize(token);
  return (state.vokabeln || []).find((w) => normalize(w.de) === key) || null;
}

export function lastVocabWords(state, count) {
  return (state.vokabeln || []).slice(-count).map((w) => w.de);
}
