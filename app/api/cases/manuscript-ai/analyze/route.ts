import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { randomUUID } from "crypto";
import mammoth from "mammoth";
import {
  AnalyzeResponseV1,
  AxisKey,
  EvidenceSnippet,
  LanguageStats,
  SpiderAxisScore,
  SpiderMode,
} from "./schema";
import { buildExtractionPrompt, buildScoringPrompt } from "./prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const FALLBACK_MODEL = "gemini-1.5-pro";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const axisMeta: Record<SpiderMode, { key: AxisKey; label: string }[]> = {
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function isModelNotFound(err: unknown) {
  if (!(err instanceof Error)) return false;
  return /404|NOT_FOUND|model(.+)?not(.+)?found/i.test(err.message);
}

function isRateLimit(err: unknown) {
  const status =
    (err as { status?: number })?.status ??
    (err as { cause?: { status?: number } })?.cause?.status;
  if (status === 429) return true;
  if (err instanceof Error && /429|rate limit/i.test(err.message)) return true;
  return false;
}

function getRetryDelayMs(err: unknown) {
  const fromDetails =
    (err as any)?.error?.details ||
    (err as any)?.response?.error?.details ||
    (err as any)?.cause?.error?.details;
  const retryInfo = Array.isArray(fromDetails)
    ? fromDetails.find((d) => typeof d === "object" && d?.["@type"]?.includes("RetryInfo"))
    : undefined;
  const delayStr =
    retryInfo?.retryDelay ||
    retryInfo?.retry_delay ||
    (err as any)?.response?.headers?.get?.("retry-after") ||
    (err as any)?.headers?.get?.("retry-after");
  if (typeof delayStr === "string") {
    const match = delayStr.match(/([\d.]+)\s*s/);
    if (match) {
      const seconds = Number(match[1]);
      if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    }
    const numeric = Number(delayStr);
    if (Number.isFinite(numeric)) return Math.max(0, numeric * 1000);
  }
  return 0;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(err: unknown) {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

async function runWithModelFallback(parts: Part[], generationConfig?: Record<string, unknown>) {
  const modelOrder = Array.from(
    new Set([DEFAULT_MODEL, FALLBACK_MODEL, "gemini-1.0-pro", "gemini-pro"])
  );

  let lastError: unknown = null;
  let lastModel = "";

  for (const modelName of modelOrder) {
    lastModel = modelName;
    let attemptIdx = 0;
    // up to 3 attempts on rate limit for the same model
    while (attemptIdx < 3) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        return await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
        });
      } catch (err) {
        lastError = err;
        if (isModelNotFound(err)) {
          break; // move to next model
        }
        if (isRateLimit(err)) {
          const delays = [2000, 4000, 8000];
          const retryDelay = getRetryDelayMs(err) || delays[attemptIdx] || delays[delays.length - 1];
          attemptIdx += 1;
          if (attemptIdx >= 3) {
            break; // give up on this model after retries
          }
          await sleep(retryDelay);
          continue;
        }
        break; // other errors: try next model
      }
    }
  }

  const status =
    (lastError as { status?: number })?.status ??
    (lastError as { cause?: { status?: number } })?.cause?.status ??
    "unknown";
  throw new Error(
    `All models failed. Last error (status ${status}) on ${lastModel}: ${formatError(lastError)}`
  );
}

function parseJsonFromModel(raw: string) {
  const withoutFences = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const match = withoutFences.match(/\{[\s\S]*\}/);
  const candidate = match ? match[0] : withoutFences;
  return JSON.parse(candidate);
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-zA-Z']+/)
    .filter(Boolean);
}

function computeLocalStats(text: string) {
  const charCount = text.length;
  const words = tokenize(text);
  const wordCount = words.length;

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const sentenceLengths = sentences.map((s) => tokenize(s).length);
  const sentenceLengthBuckets = {
    upTo5: sentenceLengths.filter((n) => n <= 5).length,
    sixTo10: sentenceLengths.filter((n) => n > 5 && n <= 10).length,
    elevenTo15: sentenceLengths.filter((n) => n > 10 && n <= 15).length,
    sixteenTo25: sentenceLengths.filter((n) => n > 15 && n <= 25).length,
    over25: sentenceLengths.filter((n) => n > 25).length,
  };

  const pronouns = {
    firstPerson: 0,
    secondPerson: 0,
    thirdPerson: 0,
    plural: 0,
    genderNeutral: 0,
  };
  const pronounSets = {
    firstPerson: new Set(["i", "me", "my", "mine", "we", "us", "our", "ours"]),
    secondPerson: new Set(["you", "your", "yours"]),
    thirdPerson: new Set(["he", "she", "him", "her", "his", "hers", "they", "them", "their", "theirs"]),
    plural: new Set(["we", "us", "our", "ours", "they", "them", "their", "theirs"]),
    genderNeutral: new Set(["they", "them", "their", "theirs"]),
  };
  for (const w of words) {
    (Object.keys(pronounSets) as (keyof typeof pronounSets)[]).forEach((k) => {
      if (pronounSets[k].has(w)) pronouns[k] += 1;
    });
  }

  const nominalizationExamples: string[] = [];
  const passiveExamples: string[] = [];
  let nominalizationCount = 0;
  let passiveCount = 0;

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (/be(en)?\s+[a-z]+ed\b/i.test(trimmed)) {
      passiveCount += 1;
      if (passiveExamples.length < 3) passiveExamples.push(trimmed.slice(0, 140));
    }
    const nomMatches = trimmed.match(/\b\w+(tion|ment|ness|ance|ence|ity)\b/gi);
    if (nomMatches) {
      nominalizationCount += nomMatches.length;
      nomMatches.slice(0, 2).forEach((m) => {
        if (nominalizationExamples.length < 4) nominalizationExamples.push(m);
      });
    }
  }

  const posRatios = {
    nouns: clamp(words.filter((w) => /\b\w+(tion|ment|ness|ity|ance|ence|ship|ism)\b/.test(w)).length / (wordCount || 1), 0, 1),
    verbs: clamp(words.filter((w) => /\b\w+(ing|ed)\b/.test(w)).length / (wordCount || 1), 0, 1),
    adjectives: clamp(words.filter((w) => /\b\w+(ous|ive|ful|less|able|ible|al|ary)\b/.test(w)).length / (wordCount || 1), 0, 1),
    adverbs: clamp(words.filter((w) => w.endsWith("ly")).length / (wordCount || 1), 0, 1),
    dialogue: clamp((text.match(/["“”]/g) || []).length / (sentences.length || 1), 0, 1),
  };

  const languageStats: LanguageStats = {
    posRatios,
    sentenceLengthBuckets,
    pronounProfile: pronouns,
    nominalizationSignals: {
      count: nominalizationCount,
      examples: nominalizationExamples,
    },
    passiveVoiceSignals: {
      count: passiveCount,
      examples: passiveExamples,
    },
  };

  return { charCount, wordCount, languageStats };
}

function fallbackSpider(mode: SpiderMode, baseScore: number): SpiderAxisScore[] {
  return axisMeta[mode].map((axis, idx) => ({
    ...axis,
    score: clamp(baseScore + (idx % 3 === 0 ? 0.3 : -0.2), 0, 5),
    confidence: 0.35,
  }));
}

function pickTitle(text: string, fileName: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return (lines[0] || fileName || "Untitled manuscript").slice(0, 140);
}

async function extractPdfWithGemini(buffer: Buffer) {
  const base64 = buffer.toString("base64");
  const parts: Part[] = [
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64,
      },
    },
    { text: "Extract plain text from this PDF. Return only the text content. No markdown." },
  ];
  const result = await runWithModelFallback(parts, { temperature: 0 });
  return result.response.text() || "";
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdfWithGemini(buffer);
  }

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  return buffer.toString("utf-8");
}

function cleanEvidence(rawEvidence: unknown): EvidenceSnippet[] {
  const asArray = Array.isArray(rawEvidence) ? rawEvidence : [];
  return asArray
    .map((item) => ({
      id: String(item.id || randomUUID()),
      axisKey: item.axisKey as AxisKey,
      startChar: Number(item.startChar || 0),
      endChar: Number(item.endChar || 0),
      text: String(item.text || "").slice(0, 360),
      note: String(item.note || ""),
    }))
    .filter((s) => Boolean(s.text) && Object.values(axisMeta).flat().some((m) => m.key === s.axisKey));
}

function cleanSpider(
  scores: unknown,
  fallbackScore: number
): Record<SpiderMode, SpiderAxisScore[]> {
  const byMode: Partial<Record<SpiderMode, unknown>> | undefined =
    scores && typeof scores === "object"
      ? (scores as Partial<Record<SpiderMode, unknown>>)
      : undefined;

  const ensure = (mode: SpiderMode): SpiderAxisScore[] => {
    const rawForMode = byMode?.[mode];

    const incoming: SpiderAxisScore[] = Array.isArray(rawForMode)
      ? (rawForMode as any[])
          .map((s) => {
            const key = s?.key as AxisKey;
            const metaLabel =
              axisMeta[mode].find((a) => a.key === key)?.label ?? "";
            return {
              key,
              label: String(s?.label ?? metaLabel),
              score: clamp(Number(s?.score), 0, 5),
              confidence: clamp(Number(s?.confidence ?? 0.4), 0, 1),
            } satisfies SpiderAxisScore;
          })
          .filter((s) => axisMeta[mode].some((a) => a.key === s.key))
      : [];

    return incoming.length === axisMeta[mode].length
      ? incoming
      : fallbackSpider(mode, fallbackScore);
  };

  return {
    editorial: ensure("editorial"),
    genreFit: ensure("genreFit"),
    marketNextWeek: ensure("marketNextWeek"),
  };
}

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function fallbackSummary() {
  return {
    synopsis: ["No synopsis available. Provide at least a few paragraphs to enable summarization."],
    comps: ["Add comparable titles to position this manuscript."],
    redFlags: ["Limited evidence; provide more pages for stronger signal."],
    marketPositioning: ["Insufficient data to recommend positioning."],
  };
}

function truncateForModel(text: string, limit = 30000) {
  return text.length > limit ? text.slice(0, limit) : text;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing in environment." }, { status: 500 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data with field 'file'." }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file found in 'file' field." }, { status: 400 });
    }

    const rawText = await extractTextFromFile(file);
    const cleanedText = rawText.trim();

    if (!cleanedText || cleanedText.length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough text. Please provide a longer manuscript sample." },
        { status: 400 }
      );
    }

    const truncatedText = truncateForModel(cleanedText);
    const { charCount, wordCount, languageStats } = computeLocalStats(truncatedText);

    const extractionPrompt = buildExtractionPrompt({
      text: truncatedText,
      snippetCount: 6,
      axisKeys: Object.values(axisMeta)
        .flat()
        .map((a) => a.key),
      sentenceLengthBuckets: languageStats.sentenceLengthBuckets,
      pronounProfile: languageStats.pronounProfile,
      posRatios: languageStats.posRatios,
    });

    let evidenceIndex: EvidenceSnippet[] = [];
    let extractedLanguageStats: LanguageStats | undefined;

    try {
      const extractionResult = await runWithModelFallback([{ text: extractionPrompt }], {
        temperature: 0.2,
        maxOutputTokens: 2048,
      });
      const raw = extractionResult.response.text() || "";
      const parsed = parseJsonFromModel(raw);
      evidenceIndex = cleanEvidence(parsed?.evidenceIndex);
      extractedLanguageStats = parsed?.languageStats;
    } catch (err) {
      console.error("extraction prompt parse error", err);
      evidenceIndex = [];
      extractedLanguageStats = undefined;
    }

    const mergedLanguageStats: LanguageStats = {
      ...languageStats,
      ...(extractedLanguageStats || {}),
    };

    const detectedGenre = "General Fiction";
    const detectedSubgenre = "Contemporary";
    const subgenreCandidates = ["Contemporary", "Literary", "Commercial", "Speculative"];

    const scoringPrompt = buildScoringPrompt({
      textSample: truncateForModel(truncatedText, 3000),
      detectedGenre,
      detectedSubgenre,
      subgenreCandidates,
      languageStatsSummary: mergedLanguageStats,
    });

    let spiderByMode = cleanSpider(null, 3.2);
    let llmSummary = fallbackSummary();
    let highlights = { strengths: [] as string[], risks: [] as string[] };
    let scoringDetectedGenre = detectedGenre;
    let scoringDetectedSubgenre = detectedSubgenre;
    let scoringSubgenreCandidates = subgenreCandidates;

    try {
      const scoringResult = await runWithModelFallback([{ text: scoringPrompt }], {
        temperature: 0.3,
        maxOutputTokens: 2048,
      });
      const parsed = parseJsonFromModel(scoringResult.response.text() || "");
      spiderByMode = cleanSpider(parsed?.spiderByMode, 3.2);
      llmSummary = {
        ...fallbackSummary(),
        ...parsed?.llmSummary,
        synopsis: safeArray(parsed?.llmSummary?.synopsis).length
          ? safeArray(parsed?.llmSummary?.synopsis)
          : fallbackSummary().synopsis,
        comps: safeArray(parsed?.llmSummary?.comps).length
          ? safeArray(parsed?.llmSummary?.comps)
          : fallbackSummary().comps,
        redFlags: safeArray(parsed?.llmSummary?.redFlags).length
          ? safeArray(parsed?.llmSummary?.redFlags)
          : fallbackSummary().redFlags,
        marketPositioning: safeArray(parsed?.llmSummary?.marketPositioning).length
          ? safeArray(parsed?.llmSummary?.marketPositioning)
          : fallbackSummary().marketPositioning,
      };
      highlights = {
        strengths: safeArray(parsed?.highlights?.strengths),
        risks: safeArray(parsed?.highlights?.risks),
      };
      scoringDetectedGenre = parsed?.detectedGenre || detectedGenre;
      scoringDetectedSubgenre = parsed?.detectedSubgenre || detectedSubgenre;
      scoringSubgenreCandidates = safeArray(parsed?.subgenreCandidates).length
        ? safeArray(parsed?.subgenreCandidates)
        : subgenreCandidates;
    } catch (err) {
      console.error("scoring prompt parse error", err);
    }

    const response: AnalyzeResponseV1 = {
      schemaVersion: "1.0",
      fileName: file.name,
      titleGuess: pickTitle(cleanedText, file.name),
      detectedGenre: scoringDetectedGenre,
      detectedSubgenre: scoringDetectedSubgenre,
      subgenreCandidates: scoringSubgenreCandidates,
      wordCount,
      charCount,
      spiderByMode,
      highlights,
      languageStats: mergedLanguageStats,
      evidenceIndex,
      llmSummary,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("manuscript-ai analyze error", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong while analyzing the manuscript. Please try again.",
      },
      { status: 500 }
    );
  }
}
