// ============================================================
// i18n/loader.ts — Hybrid translation loader
// Handles static JSON for en/de, and triggers dynamic translation
// for other languages via API.
// ============================================================

import { StaticLocale, Translations, DEFAULT_LOCALE } from "./types"

/** In-memory cache for full JSON structures */
const staticCache = new Map<StaticLocale, Translations>()

/**
 * Dynamically import the translation file for a static locale.
 * Results are cached so the JSON is only fetched once per session.
 */
export async function loadStaticTranslations(locale: StaticLocale): Promise<Translations> {
  if (staticCache.has(locale)) return staticCache.get(locale)!

  try {
    let translations: Translations

    // Next.js needs static string imports for bundle splitting to work.
    switch (locale) {
      case "de":
        translations = (await import("../../locales/de.json")).default as unknown as Translations
        break
      default:
        translations = (await import("../../locales/en.json")).default as unknown as Translations
    }

    staticCache.set(locale, translations)
    return translations
  } catch (err) {
    console.warn(`[i18n] Failed to load static locale "${locale}", falling back to "${DEFAULT_LOCALE}"`, err)

    if (locale !== DEFAULT_LOCALE) {
      return loadStaticTranslations(DEFAULT_LOCALE)
    }

    return {} as Translations
  }
}

/**
 * Client-side dynamic translation fetcher.
 * Translates a single text string to the target language via API.
 */
export async function translateDynamically(text: string, targetLang: string): Promise<string> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    })

    if (!res.ok) throw new Error("Translation API failed")
    
    const data = await res.json()
    return data.translatedText || text
  } catch (err) {
    console.error("[i18n] Dynamic translation failed:", err)
    return text // Fallback to original text on error
  }
}

