// src/i18n/translations.ts
// Nycklar + text på svenska/engelska

import type { AppLanguage } from "../context/AppContext";

const sv = {
  // Generellt
  "loading.data": "Hämtar din data...",
  "error.generic": "Något gick fel",

  // Dashboard
  "dashboard.title": "Paus Budgetvåg",
  "dashboard.subtitle":
    "Se sex månader framåt, med osäkerhet och risk inräknad. Mindre ångest, mer kontroll.",
  "dashboard.header.settingsTitle": "Dina budgetmål",
  "dashboard.header.incomeLabel": "Månadsinkomst",
  "dashboard.header.maxSpendingLabel": "Max utgifter",

  // Budgetvågen
  "budgetWave.title": "Din budgetvåg kommande 6 månader",
  "budgetWave.subtitle":
    "Medelvärde (linje) och worst/best case (skuggat band) baserat på din historik.",
  "budgetWave.legend.mean": "Medelprognos",
  "budgetWave.legend.lower": "Worst case",
  "budgetWave.legend.upper": "Best case",
  "budgetWave.axis.label": "Netto per månad",
  "budgetWave.empty.noHistory":
    "Lägg till några transaktioner först så kan vi börja bygga din våg.",

  // AI-insikt
  "insight.title": "AI-insikt på din våg",
  "insight.subtitle":
    "Analys av risk, känsliga månader och konkreta åtgärder de kommande sex månaderna.",
  "insight.loading": "Analyserar din prognos...",
  "insight.empty.needHistory":
    "När du har lite historik kan vi visa AI-genererade råd här.",
  "insight.empty.noAdvice":
    "Det finns ingen analys att visa just nu.",
  "insight.error.prefix":
    "Kunde inte hämta AI-råd just nu",

  // Onboarding
  "onboarding.step1.title": "Välkommen till Paus Budgetvåg",
  "onboarding.step1.body":
    "Målet är enkelt: mindre ekonomisk ångest. Vi visar en sexmånadersvåg över ditt kassaflöde, så du ser riskerna innan de hinner bli problem.",

  "onboarding.step2.title": "Så funkar Budgetvågen",
  "onboarding.step2.body":
    "Linjen visar ditt förväntade netto per månad. Det skuggade bandet visar worst/best case. Ju bredare band, desto högre osäkerhet.",
  "onboarding.step2.caption":
    "Vi använder din historik och abonnemang för att göra en lätt probabilistisk prognos – inget avancerat, bara tillräckligt bra för att lugna hjärnan.",

  "onboarding.step3.title": "Sätt din grundbudget",
  "onboarding.step3.incomeLabel": "Din typiska månadsinkomst",
  "onboarding.step3.maxSpendingLabel": "Max du vill lägga på utgifter",
  "onboarding.step3.cta": "Spara och starta Budgetvågen",
  "onboarding.error.income": "Ange en rimlig månadsinkomst över 0.",
  "onboarding.error.maxSpending":
    "Ange en rimlig maxgräns för utgifter över 0.",

  // Settings
  "settings.title": "Inställningar",
  "settings.subtitle":
    "Finjustera språk, tema och budgetmål. Påverkar hur prognosen tolkas.",
  "settings.section.app": "Appinställningar",
  "settings.section.budget": "Budgetmål",
  "settings.languageLabel": "Språk",
  "settings.darkModeLabel": "Mörkt läge",
  "settings.incomeLabel": "Månadsinkomst",
  "settings.maxSpendingLabel": "Max utgifter per månad",
  "settings.currencyLabel": "Basvaluta",
  "settings.saving": "Sparar...",
  "settings.saveButton": "Spara inställningar",
  "settings.saved": "Inställningarna har sparats.",
  "settings.errorPrefix": "Kunde inte spara inställningarna",
} as const;

const en = {
  // Generic
  "loading.data": "Loading your data...",
  "error.generic": "Something went wrong",

  // Dashboard
  "dashboard.title": "Paus Budget Wave",
  "dashboard.subtitle":
    "See six months ahead with risk and uncertainty included. Less anxiety, more control.",
  "dashboard.header.settingsTitle": "Your budget goals",
  "dashboard.header.incomeLabel": "Monthly income",
  "dashboard.header.maxSpendingLabel": "Max spending",

  // Budget wave
  "budgetWave.title": "Your budget wave for the next 6 months",
  "budgetWave.subtitle":
    "Mean forecast (line) and worst/best case (shaded band) based on your history.",
  "budgetWave.legend.mean": "Mean forecast",
  "budgetWave.legend.lower": "Worst case",
  "budgetWave.legend.upper": "Best case",
  "budgetWave.axis.label": "Net per month",
  "budgetWave.empty.noHistory":
    "Add a few transactions first so we can start building your wave.",

  // AI insight
  "insight.title": "AI insight on your wave",
  "insight.subtitle":
    "Analysis of risk, fragile months and concrete actions over the next six months.",
  "insight.loading": "Analysing your forecast...",
  "insight.empty.needHistory":
    "Once you have some history we’ll show AI-generated advice here.",
  "insight.empty.noAdvice": "There is no analysis to show right now.",
  "insight.error.prefix":
    "Could not fetch AI advice right now",

  // Onboarding
  "onboarding.step1.title": "Welcome to Paus Budget Wave",
  "onboarding.step1.body":
    "The goal is simple: less financial anxiety. We show you a six-month wave of your cash flow so you see risks before they become problems.",

  "onboarding.step2.title": "How the Budget Wave works",
  "onboarding.step2.body":
    "The line shows your expected net per month. The shaded band shows worst/best case. The wider the band, the higher the uncertainty.",
  "onboarding.step2.caption":
    "We use your history and subscriptions to build a light probabilistic forecast – nothing heavy, just good enough to calm the brain.",

  "onboarding.step3.title": "Set your base budget",
  "onboarding.step3.incomeLabel": "Your typical monthly income",
  "onboarding.step3.maxSpendingLabel": "Max you want to spend",
  "onboarding.step3.cta": "Save and start the Budget Wave",
  "onboarding.error.income": "Enter a reasonable monthly income above 0.",
  "onboarding.error.maxSpending":
    "Enter a reasonable max spending limit above 0.",

  // Settings
  "settings.title": "Settings",
  "settings.subtitle":
    "Fine-tune language, theme and budget goals. This affects how the forecast is interpreted.",
  "settings.section.app": "App settings",
  "settings.section.budget": "Budget goals",
  "settings.languageLabel": "Language",
  "settings.darkModeLabel": "Dark mode",
  "settings.incomeLabel": "Monthly income",
  "settings.maxSpendingLabel": "Max spending per month",
  "settings.currencyLabel": "Base currency",
  "settings.saving": "Saving...",
  "settings.saveButton": "Save settings",
  "settings.saved": "Settings have been saved.",
  "settings.errorPrefix": "Could not save settings",
} as const;

export type TranslationKey = keyof typeof sv;

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  sv,
  en,
};

export function T(lang: AppLanguage, key: TranslationKey): string {
  const table = translations[lang] ?? translations.sv;
  return table[key] ?? translations.sv[key] ?? key;
}
