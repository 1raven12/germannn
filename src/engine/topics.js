const LEVEL_RANK = { A2: 0, A1: 0, B1: 1, B2: 2, C1: 2, C2: 2 };

export const TOPICS = [
  { id: "artikel", label: "der/die/das", min: 0 },
  { id: "akkusativ", label: "Akkusativ", min: 0 },
  { id: "dativ", label: "Dativ", min: 0 },
  { id: "praep_akk", label: "Präpositionen mit Akkusativ", min: 0 },
  { id: "praep_dat", label: "Präpositionen mit Dativ", min: 0 },
  { id: "wechsel", label: "Wechselpräpositionen", min: 0 },
  { id: "praesens_reg", label: "Präsens regelmäßig", min: 0 },
  { id: "praesens_irreg", label: "Präsens unregelmäßig", min: 0 },
  { id: "modalverben", label: "Modalverben", min: 0 },
  { id: "trennbar", label: "Trennbare Verben", min: 0 },
  { id: "perfekt", label: "Perfekt", min: 0 },
  { id: "possessiv", label: "Possessivartikel", min: 0 },
  { id: "negation", label: "Kein oder nicht", min: 0 },
  { id: "plural", label: "Pluralformen", min: 0 },
  { id: "reflexiv", label: "Reflexive Verben", min: 1 },
  { id: "adjektivendungen", label: "Adjektivendungen", min: 1 },
  { id: "wortstellung", label: "Wortstellung und Nebensätze", min: 1 },
  { id: "komparativ", label: "Komparativ und Superlativ", min: 1 },
  { id: "praeteritum", label: "Präteritum", min: 1 },
  { id: "genitiv", label: "Genitiv", min: 2 },
  { id: "konjunktiv2", label: "Konjunktiv II", min: 2 },
  { id: "passiv", label: "Passiv", min: 2 },
  { id: "relativsaetze", label: "Relativsätze", min: 2 },
];

const WEAK_SPOTS = new Set(["artikel", "akkusativ", "dativ", "praep_akk", "praep_dat", "wechsel"]);

export function levelRank(level) {
  return LEVEL_RANK[level] ?? 1;
}

export function pickTopic(state) {
  const rank = levelRank(state.profil?.level);
  const pool = TOPICS.filter((t) => t.min <= rank);
  const recent = new Set((state.letzteThemen || []).slice(-5));
  let candidates = pool.filter((t) => !recent.has(t.id));
  if (candidates.length === 0) candidates = pool;

  let best = candidates[0];
  let bestScore = -Infinity;
  for (const topic of candidates) {
    const stats = state.grammatik?.[topic.id];
    const seen = stats?.seen || 0;
    const correct = stats?.correct || 0;
    const accuracy = seen > 0 ? correct / seen : 0;
    let score = (1 - accuracy) * 100;
    if (seen === 0) score += 25;
    if (WEAK_SPOTS.has(topic.id)) score += 30;
    score += Math.random() * 20;
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return best;
}

export function recordTopicUsed(state, topicId) {
  const letzteThemen = [...(state.letzteThemen || []), topicId].slice(-12);
  return { ...state, letzteThemen };
}

export function recordAnswer(state, topicId, correct) {
  const grammatik = { ...(state.grammatik || {}) };
  const prev = grammatik[topicId] || { seen: 0, correct: 0 };
  grammatik[topicId] = {
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
  };
  return { ...state, grammatik };
}

export function findTopic(id) {
  return TOPICS.find((t) => t.id === id) || null;
}
