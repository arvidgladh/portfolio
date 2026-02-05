// src/i18n/useI18n.ts
// Hook som hämtar aktuell language från AppContext

"use client";

import { useAppContext } from "../context/AppContext";
import { T, TranslationKey } from "./translations";

export function useI18n() {
  const { language } = useAppContext();

  function t(key: TranslationKey): string {
    return T(language, key);
  }

  return { t, language };
}
