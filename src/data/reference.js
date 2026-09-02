export const REFERENCE = [
  {
    id: "artikelendungen",
    titel: "Artikelendungen nach Endung",
    absatz: [
      "Substantive auf -e sind fast immer feminin: die Lampe, die Straße, die Liebe.",
      "Substantive auf -ung, -heit, -keit, -schaft, -tion sind feminin: die Zeitung, die Freiheit, die Möglichkeit, die Freundschaft, die Nation.",
      "Substantive auf -chen und -lein sind immer neutral, egal was sie bedeuten: das Mädchen, das Fräulein.",
      "Substantive auf -er für Personen und Geräte sind meist maskulin: der Lehrer, der Computer, der Fahrer.",
      "Substantive auf -ismus, -ling, -or sind maskulin: der Kapitalismus, der Frühling, der Motor.",
      "Infinitive als Substantiv sind immer neutral: das Essen, das Leben, das Rauchen.",
    ],
  },
  {
    id: "vier_faelle",
    titel: "Die vier Fälle",
    absatz: [
      "Nominativ fragt wer oder was. Es ist der Fall des Subjekts: Der Mann trinkt Bier.",
      "Akkusativ fragt wen oder was. Es ist meistens das direkte Objekt: Ich sehe den Mann.",
      "Dativ fragt wem. Es ist meistens das indirekte Objekt: Ich gebe dem Mann das Bier.",
      "Genitiv fragt wessen. Er zeigt Besitz: Das Bier des Mannes ist leer.",
    ],
    tabellen: [
      {
        caption: "Bestimmter Artikel",
        headers: ["Fall", "maskulin", "feminin", "neutral", "Plural"],
        rows: [
          ["Nominativ", "der", "die", "das", "die"],
          ["Akkusativ", "den", "die", "das", "die"],
          ["Dativ", "dem", "der", "dem", "den"],
          ["Genitiv", "des", "der", "des", "der"],
        ],
      },
      {
        caption: "Unbestimmter Artikel",
        headers: ["Fall", "maskulin", "feminin", "neutral"],
        rows: [
          ["Nominativ", "ein", "eine", "ein"],
          ["Akkusativ", "einen", "eine", "ein"],
          ["Dativ", "einem", "einer", "einem"],
          ["Genitiv", "eines", "einer", "eines"],
        ],
      },
    ],
  },
  {
    id: "praepositionen",
    titel: "Drei Gruppen von Präpositionen",
    absatz: [
      "Gruppe eins steht immer mit Akkusativ: durch, für, gegen, ohne, um. Beispiel: Ich gehe durch den Park.",
      "Gruppe zwei steht immer mit Dativ: aus, bei, mit, nach, seit, von, zu. Beispiel: Ich komme aus der Stadt.",
      "Gruppe drei sind die Wechselpräpositionen: an, auf, hinter, in, neben, über, unter, vor, zwischen. Sie stehen mit Akkusativ bei Bewegung mit Ziel (Wohin?) und mit Dativ bei Ort ohne Bewegung (Wo?).",
      "Wohin-Beispiel, Akkusativ: Ich stelle das Glas auf den Tisch.",
      "Wo-Beispiel, Dativ: Das Glas steht auf dem Tisch.",
    ],
  },
  {
    id: "praesens",
    titel: "Präsens: regelmäßig und unregelmäßig",
    absatz: [
      "Regelmäßige Verben ändern nur die Endung: ich wohne, du wohnst, er/sie/es wohnt, wir wohnen, ihr wohnt, sie wohnen.",
      "Stammvokal-Verben ändern den Vokal in der du- und er/sie/es-Form: fahren wird du fährst, er fährt. Sehen wird du siehst, er sieht.",
    ],
    tabellen: [
      {
        caption: "fahren (a → ä)",
        headers: ["Person", "Form"],
        rows: [
          ["ich", "fahre"],
          ["du", "fährst"],
          ["er/sie/es", "fährt"],
          ["wir", "fahren"],
          ["ihr", "fahrt"],
          ["sie/Sie", "fahren"],
        ],
      },
    ],
  },
  {
    id: "modal_trennbar",
    titel: "Modalverben und trennbare Verben: Wortstellung",
    absatz: [
      "Beim Modalverb steht das konjugierte Modalverb auf Position zwei, der Infinitiv geht ans Satzende: Ich kann heute nicht kommen.",
      "Bei trennbaren Verben steht das Präfix ebenfalls am Satzende: Ich rufe dich morgen an. Im Nebensatz bleibt das Verb ganz zusammen: ..., weil ich dich morgen anrufe.",
    ],
  },
  {
    id: "perfekt",
    titel: "Perfekt: haben oder sein",
    absatz: [
      "Die meisten Verben bilden das Perfekt mit haben: Ich habe gegessen. Ich habe gearbeitet.",
      "Verben der Bewegung von A nach B und Zustandsänderung bilden das Perfekt mit sein: Ich bin gefahren. Ich bin aufgewacht. Ich bin geblieben (Ausnahme ohne Bewegung, aber mit sein).",
      "Das Partizip II steht am Satzende: Ich habe die ganze Nacht gearbeitet.",
    ],
  },
  {
    id: "wortstellung_negation",
    titel: "Wortstellung und Negation",
    absatz: [
      "Im Hauptsatz steht das konjugierte Verb auf Position zwei, unabhängig davon was auf Position eins steht: Heute arbeite ich. Ich arbeite heute.",
      "Im Nebensatz steht das konjugierte Verb am Ende: ..., weil ich heute arbeite.",
      "Nicht verneint einen ganzen Satz oder ein Verb und steht meist am Ende oder vor dem Element, das verneint wird: Ich komme nicht. Ich komme nicht heute, sondern morgen.",
      "Kein verneint ein Substantiv mit unbestimmtem Artikel oder ohne Artikel: Ich habe kein Geld. Ich habe keine Zeit.",
    ],
  },
  {
    id: "adjektivendungen",
    titel: "Adjektivendungen",
    absatz: [
      "Nach dem bestimmten Artikel sind die Endungen schwach: -e im Nominativ Singular, sonst meist -en.",
      "Nach dem unbestimmten Artikel sind die Endungen stark im Nominativ und tragen die Fallendung, die der Artikel nicht zeigt.",
    ],
    tabellen: [
      {
        caption: "Nach bestimmtem Artikel (schwach)",
        headers: ["Fall", "maskulin", "feminin", "neutral", "Plural"],
        rows: [
          ["Nominativ", "der neue Mann", "die neue Frau", "das neue Kind", "die neuen Leute"],
          ["Akkusativ", "den neuen Mann", "die neue Frau", "das neue Kind", "die neuen Leute"],
          ["Dativ", "dem neuen Mann", "der neuen Frau", "dem neuen Kind", "den neuen Leuten"],
        ],
      },
      {
        caption: "Nach unbestimmtem Artikel (stark im Nominativ)",
        headers: ["Fall", "maskulin", "feminin", "neutral"],
        rows: [
          ["Nominativ", "ein neuer Mann", "eine neue Frau", "ein neues Kind"],
          ["Akkusativ", "einen neuen Mann", "eine neue Frau", "ein neues Kind"],
          ["Dativ", "einem neuen Mann", "einer neuen Frau", "einem neuen Kind"],
        ],
      },
    ],
  },
];
