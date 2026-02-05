// src/context/AppContext.tsx
// Global app-context: auth (anonym), språk & dark mode

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type AppLanguage = "sv" | "en";

interface AppContextValue {
  userId: string | null;
  isAuthReady: boolean;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    const STORAGE_KEY = "vault_user_id";
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    window.localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  });

  const [isAuthReady] = useState<boolean>(() => typeof window !== "undefined");

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window === "undefined") return "sv";
    const storedLang = window.localStorage.getItem("paus_lang");
    return storedLang === "sv" || storedLang === "en" ? storedLang : "sv";
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const storedTheme = window.localStorage.getItem("paus_darkmode");
    if (storedTheme === "0") return false;
    if (storedTheme === "1") return true;
    return true;
  });

  function setLanguage(lang: AppLanguage) {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("paus_lang", lang);
    }
  }

  function toggleDarkMode() {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("paus_darkmode", next ? "1" : "0");
      }
      return next;
    });
  }

  const value: AppContextValue = {
    userId,
    isAuthReady,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}
