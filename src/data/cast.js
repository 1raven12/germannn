export const CAST = [
  {
    id: "jonas",
    name: "Jonas Reiter",
    alter: 27,
    rolle: "Barkeeper, Schlagzeuger in einer Band, die niemand mag",
    temperament: "Trocken, langsam beim Auftauen, sagt drei Worte, wo andere dreißig brauchen.",
  },
  {
    id: "leyla",
    name: "Leyla Demir",
    alter: 29,
    rolle: "Restauratorin im Museum, kommt nach der Arbeit vorbei",
    temperament: "Direkt, ungeduldig, korrigiert dein Deutsch und meint es gut.",
  },
  {
    id: "milan",
    name: "Milan Kowalski",
    alter: 24,
    rolle: "Medizinstudent, macht die Tür",
    temperament: "Weich, überkorrekt, errötet leicht, lernt Karteikarten auf der Stufe.",
  },
  {
    id: "fenna",
    name: "Fenna de Vries",
    alter: 31,
    rolle: "Niederländerin, macht den Sound im Hinterzimmer",
    temperament: "Anziehend, flirtet mit allen, meint es fast immer ernst.",
  },
  {
    id: "ada",
    name: "Ada Nowak",
    alter: 26,
    rolle: "Deine Mitbewohnerin, bucht die Bands",
    temperament: "Kennt dich zu gut, wartet zu lange, spricht nie zuerst.",
  },
];

export function findCharacter(id) {
  return CAST.find((c) => c.id === id) || null;
}
