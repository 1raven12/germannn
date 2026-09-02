import { CAST } from "../data/cast.js";
import { lastVocabWords } from "./srs.js";

const WORLD = `Kolibri, a small bar in the Belgisches Viertel in Cologne. A back room for concerts, a kitchen upstairs, a courtyard with one broken bench, a Späti on the corner, rain most nights. The player works shifts here and lives upstairs with Ada.`;

function castLines(beziehungen) {
  return CAST.map(
    (c) =>
      `${c.id} | ${c.name}, ${c.alter}, ${c.rolle}. ${c.temperament} Affection: ${
        beziehungen[c.id] ?? 0
      }/10.`
  ).join("\n");
}

function chronikLines(chronik) {
  const recent = (chronik || []).slice(-14);
  if (recent.length === 0) return "(none yet, this is the first scene)";
  return recent.map((line, i) => `${i + 1}. ${line}`).join("\n");
}

function tensionLine(beziehungen, kapitel, szeneNr) {
  const high = CAST.filter((c) => (beziehungen[c.id] ?? 0) >= 6);
  if (high.length >= 2) {
    return `TENSION: ${high[0].name} and ${high[1].name} are both close to the player. Put them in the same room and let it get uncomfortable.`;
  }
  if (szeneNr >= 4) {
    const low = CAST.filter((c) => (beziehungen[c.id] ?? 0) <= 1);
    if (low.length >= 2) {
      return `Give ${low[0].name} a reason to be in this scene. They have been off-page too long.`;
    }
  }
  return "";
}

export function buildPrompt(state, topic) {
  const name = state.profil?.name || "Spieler";
  const level = state.profil?.level || "B1";
  const kapitel = state.kapitel || 1;
  const szeneNr = state.szene_nr || 0;
  const letzteWahl =
    state.letzteWahl || "(first shift, Ada is late, the bar is already filling up)";
  const bekannteWoerter = lastVocabWords(state, 70).join(", ") || "(none yet)";
  const frageliste = (state.frageliste || []).join(", ") || "(none)";
  const tension = tensionLine(state.beziehungen || {}, kapitel, szeneNr);

  return `You are the story engine for a German-learning romance game called NACHTSCHICHT. Return ONE JSON object and nothing else. No markdown, no fences, no commentary.

WORLD
${WORLD}

PLAYER
Name: ${name}. German level: ${level}. Known weaknesses: articles, cases, prepositions.

CAST (everyone is bisexual and available)
${castLines(state.beziehungen || {})}

STORY SO FAR (never reuse these setups, locations or beats)
${chronikLines(state.chronik)}

LAST CHOICE THE PLAYER MADE
${letzteWahl}

CHAPTER ${kapitel}, SCENE ${szeneNr + 1}
${tension}

REQUIRED GRAMMAR FOCUS for the exercise: ${topic.label}

ALREADY TAUGHT, do not teach again: ${bekannteWoerter}
WORDS THE PLAYER TAPPED BECAUSE THEY DID NOT KNOW THEM, gloss them if they fit: ${frageliste}

WRITING RULES
- German narration is first person, present tense, close to the body. Heart, stomach, jaw, hands, throat, heat on the neck. Never explain a feeling from the outside. Jealousy shows in the body before anyone admits it.
- Short sentences. Fragments where they land. Pull back at the peak instead of spelling it out.
- Charged and adult, but not explicit.
- Exactly 5 beats, mixing narration and dialogue, each with a natural English translation, not word for word.
- Every scene needs a new hour, a new room or a new problem. Push the plot: someone lies, someone leaves, a band cancels, an ex walks in, the till is short.
- Exactly 4 vocabulary items that really appear in the beats. Nouns get article and plural in hinweis, verbs get their key forms.
- The exercise must test ${topic.label}, use a sentence from this scene, and have exactly one correct option among four. Explanation in English, max 18 words, a concrete rule.
- Exactly 3 choices in German, each aimed at a different character where possible, each changing what happens next.

JSON SCHEMA
{"ort":"German, e.g. Hinterzimmer, 23:40","beats":[{"wer":"Erzähler or a character first name","de":"German","en":"English"}],"vokabeln":[{"de":"word","en":"meaning","hinweis":"article and plural, or verb forms"}],"uebung":{"satz":"German sentence with ___ for the gap","optionen":["a","b","c","d"],"richtig":0,"erklaerung":"English, max 18 words"},"wahl":[{"de":"German","en":"English","ziel":"character id","wert":2,"folge":"one line English, what this sets in motion"}],"chronik":"one English sentence, max 15 words"}`;
}
