import { AxisKey, SpiderMode } from "./schema";

type BuildExtractionPromptParams = {
  text: string;
  snippetCount: number;
  axisKeys: AxisKey[];
  sentenceLengthBuckets: Record<string, number>;
  pronounProfile: Record<string, number>;
  posRatios: Record<string, number>;
};

type BuildScoringPromptParams = {
  textSample: string;
  detectedGenre: string;
  detectedSubgenre: string;
  subgenreCandidates: string[];
  languageStatsSummary: Record<string, unknown>;
};

const modeToAxes: Record<SpiderMode, { key: AxisKey; label: string }[]> = {
  editorial: [
    { key: "narrativeMomentum", label: "Narrative momentum" },
    { key: "characterVoice", label: "Character voice consistency" },
    { key: "pacingControl", label: "Pacing control" },
    { key: "clarity", label: "Line-level clarity" },
    { key: "originality", label: "Originality" },
    { key: "themeCohesion", label: "Theme cohesion" },
  ],
  genreFit: [
    { key: "genreTropes", label: "Use of genre tropes" },
    { key: "readerPromise", label: "Reader promise" },
    { key: "voiceMatch", label: "Voice matches genre" },
    { key: "structureFit", label: "Structure fit" },
    { key: "povConsistency", label: "POV consistency" },
    { key: "ageCategoryFit", label: "Age/category fit" },
  ],
  marketNextWeek: [
    { key: "hookStrength", label: "Hook strength" },
    { key: "packagingClarity", label: "Packaging clarity" },
    { key: "compsFit", label: "Comparable titles fit" },
    { key: "retention", label: "Reader retention signals" },
    { key: "shareability", label: "Shareability" },
    { key: "speedToShelf", label: "Speed to shelf" },
  ],
};

export function buildExtractionPrompt(params: BuildExtractionPromptParams): string {
  const { text, snippetCount, axisKeys, sentenceLengthBuckets, pronounProfile, posRatios } = params;

  return `
You are a production-grade text extractor for publishing editors.
Return STRICT JSON only. No prose, no code fences.

TASKS:
1) Provide evidence snippets tied to the provided axis keys. Each snippet should be concrete (max 320 chars) and include a short note on why it matters.
2) Provide a compact languageStats object.

Output JSON shape:
{
  "evidenceIndex": [
    {
      "id": "string",
      "axisKey": "AxisKey from list",
      "startChar": 0,
      "endChar": 0,
      "text": "verbatim snippet",
      "note": "why this snippet matters for that axis"
    }
  ],
  "languageStats": {
    "posRatios": {
      "nouns": 0,
      "verbs": 0,
      "adjectives": 0,
      "adverbs": 0,
      "dialogue": 0
    },
    "sentenceLengthBuckets": {
      "upTo5": 0,
      "sixTo10": 0,
      "elevenTo15": 0,
      "sixteenTo25": 0,
      "over25": 0
    },
    "pronounProfile": {
      "firstPerson": 0,
      "secondPerson": 0,
      "thirdPerson": 0,
      "plural": 0,
      "genderNeutral": 0
    },
    "nominalizationSignals": {
      "count": 0,
      "examples": ["string", "string"]
    },
    "passiveVoiceSignals": {
      "count": 0,
      "examples": ["string"]
    },
    "readingEase": 0
  }
}

Constraints:
- Keep exactly ${snippetCount} snippets total (spread across axes when possible).
- Use axisKey from this list only: ${axisKeys.join(", ")}.
- Do NOT include markdown or extra keys.

Base text (truncate/clean as needed):
${text}

Pre-computed stats (for reference, keep JSON lean):
- sentenceLengthBuckets: ${JSON.stringify(sentenceLengthBuckets)}
- pronounProfile: ${JSON.stringify(pronounProfile)}
- posRatios: ${JSON.stringify(posRatios)}
`;
}

export function buildScoringPrompt(params: BuildScoringPromptParams): string {
  const { textSample, detectedGenre, detectedSubgenre, subgenreCandidates, languageStatsSummary } = params;

  return `
You are an editorial scoring system. Return STRICT JSON only. No prose, no code fences.

Score three radar modes: editorial, genreFit, marketNextWeek. For each axis, produce score 0-5 and confidence 0-1 with the exact labels/keys below. Also provide synopsis, comps, redFlags, and marketPositioning arrays.

Axis definitions:
${JSON.stringify(modeToAxes, null, 2)}

Output JSON shape:
{
  "spiderByMode": {
    "editorial": [{ "key": "narrativeMomentum", "label": "...", "score": 0-5, "confidence": 0-1 }],
    "genreFit": [{ "key": "genreTropes", "label": "...", "score": 0-5, "confidence": 0-1 }],
    "marketNextWeek": [{ "key": "hookStrength", "label": "...", "score": 0-5, "confidence": 0-1 }]
  },
  "detectedGenre": "string",
  "detectedSubgenre": "string",
  "subgenreCandidates": ["string"],
  "highlights": { "strengths": ["string"], "risks": ["string"] },
  "llmSummary": {
    "synopsis": ["string"],
    "comps": ["string"],
    "redFlags": ["string"],
    "marketPositioning": ["string"]
  }
}

Constraints:
- Keep labels in English.
- Scores must be numbers 0-5; confidence 0-1.
- If unsure about subgenre, pick the closest and still populate subgenreCandidates.

Detected genre hint: ${detectedGenre}
Detected subgenre hint: ${detectedSubgenre}
Subgenre options: ${subgenreCandidates.join(", ") || "[]"}
Language stats summary: ${JSON.stringify(languageStatsSummary)}

Text sample (trimmed to ~3k chars):
${textSample}
`;
}
