import { buildPrompt } from "./prompt.js";
import { pickTopic } from "./topics.js";

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in response.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function validate(scene) {
  if (!scene || typeof scene !== "object") throw new Error("Empty scene.");
  if (!scene.ort || typeof scene.ort !== "string") throw new Error("Missing ort.");
  if (!Array.isArray(scene.beats) || scene.beats.length < 3) {
    throw new Error("Need at least 3 beats.");
  }
  for (const beat of scene.beats) {
    if (!beat.de || !beat.en) throw new Error("Beat missing de/en.");
  }
  if (!Array.isArray(scene.vokabeln) || scene.vokabeln.length === 0) {
    throw new Error("Missing vokabeln.");
  }
  const uebung = scene.uebung;
  if (!uebung || !Array.isArray(uebung.optionen) || uebung.optionen.length !== 4) {
    throw new Error("Exercise needs exactly 4 options.");
  }
  if (!Number.isInteger(uebung.richtig) || uebung.richtig < 0 || uebung.richtig > 3) {
    throw new Error("Exercise richtig must be an integer 0..3.");
  }
  if (!Array.isArray(scene.wahl) || scene.wahl.length < 2) {
    throw new Error("Need at least 2 choices.");
  }
  return scene;
}

async function requestOnce(prompt) {
  const res = await fetch("/api/szene", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  const body = await res.json();
  const scene = extractJson(body.text || "");
  return validate(scene);
}

export async function generateScene(state) {
  const topic = pickTopic(state);
  const prompt = buildPrompt(state, topic);
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const scene = await requestOnce(prompt);
      return { scene, topic };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Could not generate scene.");
}
