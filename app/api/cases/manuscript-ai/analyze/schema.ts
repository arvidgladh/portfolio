export type SpiderMode = "editorial" | "genreFit" | "marketNextWeek";

export type AxisKey =
  | "narrativeMomentum"
  | "characterVoice"
  | "pacingControl"
  | "clarity"
  | "originality"
  | "themeCohesion"
  | "genreTropes"
  | "readerPromise"
  | "voiceMatch"
  | "structureFit"
  | "povConsistency"
  | "ageCategoryFit"
  | "hookStrength"
  | "packagingClarity"
  | "compsFit"
  | "retention"
  | "shareability"
  | "speedToShelf";

export type SpiderAxisScore = {
  key: AxisKey;
  label: string;
  score: number; // 0-5
  confidence: number; // 0-1
};

export type EvidenceSnippet = {
  id: string;
  axisKey: AxisKey;
  startChar: number;
  endChar: number;
  text: string;
  note: string;
};

export type LanguageStats = {
  posRatios: {
    nouns: number;
    verbs: number;
    adjectives: number;
    adverbs: number;
    dialogue: number;
  };
  sentenceLengthBuckets: {
    upTo5: number;
    sixTo10: number;
    elevenTo15: number;
    sixteenTo25: number;
    over25: number;
  };
  pronounProfile: {
    firstPerson: number;
    secondPerson: number;
    thirdPerson: number;
    plural: number;
    genderNeutral: number;
  };
  nominalizationSignals: {
    count: number;
    examples: string[];
  };
  passiveVoiceSignals: {
    count: number;
    examples: string[];
  };
  readingEase?: number;
};

export type AnalyzeResponseV1 = {
  schemaVersion: "1.0";
  fileName: string;
  titleGuess: string;
  detectedGenre: string;
  detectedSubgenre: string;
  subgenreCandidates: string[];
  wordCount: number;
  charCount: number;
  spiderByMode: {
    editorial: SpiderAxisScore[];
    genreFit: SpiderAxisScore[];
    marketNextWeek: SpiderAxisScore[];
  };
  highlights: {
    strengths: string[];
    risks: string[];
  };
  languageStats: LanguageStats;
  evidenceIndex: EvidenceSnippet[];
  llmSummary: {
    synopsis: string[];
    comps: string[];
    redFlags: string[];
    marketPositioning: string[];
  };
};
