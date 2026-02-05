// src/lib/geminiClient.ts
// Fas 3.1–3.3 – Klient för Gemini-analys av Budgetvågen

import { BudgetForecastResult, UserSettings } from "./firestoreSchema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Modellnamn enligt planen
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

export interface GeminiAnalysisRequest {
  forecast: BudgetForecastResult;
  userSettings: UserSettings | null;
  language: "sv" | "en";
}

export interface GeminiAnalysisResult {
  advice: string;
  rawModelResponse?: unknown;
}

function buildSystemInstruction(lang: "sv" | "en"): string {
  if (lang === "sv") {
    return `
Du är en senior finansiell analytiker som arbetar med privatpersoners kassaflöden.
Du analyserar en probabilistisk sexmånadersprognos ("Budgetvågen") med:
- medelvärde per månad,
- ett nedre osäkerhetsband (worst case),
- ett övre osäkerhetsband (best case).

Mål:
- Minska ekonomisk ångest för användaren genom konkreta, små steg.
- Ge handlingskraftiga råd, inte allmänna floskler.
- Fokusera på risk, buffert och timing (vilka månader är känsliga).

Regler:
- MAX ca 170 ord.
- Skriv i DU-form.
- Skriv sammanhängande text med tydliga stycken (använd radbrytningar).
- Var konkret: nämn ungefärliga belopp och månader när det är relevant.
- Undvik att ge investeringsråd (aktier, fonder). Fokusera på kassaflöde, buffert och utgifter.
- Om prognosen ser väldigt stabil ut: fokusera på möjligheter att bygga buffert och sänka stress.
- Om osäkerhetsbandet är brett eller flera månader är tydligt negativa i värsta fall: var tydlig med risk, men lugn i tonen. Föreslå konkreta flyttar (t.ex. "lägg undan X kr i januari" eller "sänk abonnemang med Y kr").

Svar endast på svenska.
`.trim();
  }

  // Engelska versionen
  return `
You are a senior financial analyst specialising in household cash flow.
You analyse a probabilistic six-month forecast ("Budget Wave") with:
- mean value per month,
- a lower uncertainty band (worst case),
- an upper uncertainty band (best case).

Goal:
- Reduce financial anxiety for the user through concrete, small steps.
- Provide actionable advice, not generic platitudes.
- Focus on risk, buffer and timing (which months are vulnerable).

Rules:
- MAX ~170 words.
- Write in the second person ("you").
- Use clear short paragraphs separated by line breaks.
- Be concrete: mention approximate amounts and months when relevant.
- Do NOT give investment advice (no stocks/funds). Focus on cash flow, buffers and spending.
- If the forecast looks very stable: focus on building buffers and lowering stress.
- If the band is wide or several months are clearly negative in the worst case: be explicit about risk, but calm in tone. Propose specific moves (e.g. "set aside X in January" or "reduce subscriptions by Y").

Answer in English only.
`.trim();
}

function buildUserPrompt(req: GeminiAnalysisRequest): string {
  const { forecast, userSettings, language } = req;

  const baseCurrency = userSettings?.baseCurrency ?? "SEK";
  const monthlyIncome = userSettings?.monthlyIncome ?? null;
  const maxSpending = userSettings?.maxMonthlySpending ?? null;

  const metaInfo = {
    baseCurrency,
    monthlyIncome,
    maxMonthlySpending: maxSpending,
  };

  const label =
    language === "sv"
      ? "Analysera följande data för risk och osäkerhet."
      : "Analyse the following data for risk and uncertainty.";

  const focus =
    language === "sv"
      ? "Fokusera särskilt på hur brett osäkerhetsbandet är per månad och vilka månader som är känsligast i worst case. Ge sedan konkreta råd om hur användaren kan jämna ut kurvan kommande sex månader."
      : "Focus in particular on how wide the uncertainty band is for each month and which months are most fragile in the worst case. Then give concrete advice on how the user can smooth the curve over the next six months.";

  return `
${label}

FORECAST_JSON:
${JSON.stringify(forecast, null, 2)}

USER_SETTINGS:
${JSON.stringify(metaInfo, null, 2)}

${focus}
`.trim();
}

// Enkel exponential backoff
async function fetchWithBackoff(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  let attempt = 0;
  let delay = 400; // ms

  while (true) {
    try {
      const res = await fetch(url, options);
      if (!res.ok && attempt < retries) {
        attempt++;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= retries) throw err;
      attempt++;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

export async function callGeminiAnalysis(
  req: GeminiAnalysisRequest
): Promise<GeminiAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY saknas i miljövariablerna.");
  }

  const systemInstruction = buildSystemInstruction(req.language);
  const userPrompt = buildUserPrompt(req);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
  };

  const res = await fetchWithBackoff(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Gemini API error ${res.status}: ${text?.slice(0, 500) || "no body"}`
    );
  }

  const data = (await res.json()) as any;

  const adviceText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.output_text ??
    "";

  if (!adviceText) {
    return {
      advice:
        req.language === "sv"
          ? "AI-modellen kunde inte generera ett råd just nu."
          : "The AI model could not generate advice at this moment.",
      rawModelResponse: data,
    };
  }

  return {
    advice: adviceText.trim(),
    rawModelResponse: data,
  };
}
