"use client"

// ============================================================
// i18n/context.tsx — React context + provider for i18n state
// ============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react"
import {
  StaticLocale,
  Translations,
  I18nContextValue,
  DEFAULT_LOCALE,
  STATIC_LOCALE_LABELS,
} from "./types"
import { detectLocale, persistLocale, isStaticLocale } from "./detection"
import { loadStaticTranslations, translateDynamically } from "./loader"
import { translate } from "./utils"

// ── Context ──────────────────────────────────────────────────

const I18nContext = createContext<I18nContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────

interface I18nProviderProps {
  children: React.ReactNode
  /** Server-detected locale (from cookie / middleware) */
  initialLocale?: string
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<string>(initialLocale ?? DEFAULT_LOCALE)
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [fallback, setFallback] = useState<Translations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Keep refs
  const localeRef = useRef(locale)
  localeRef.current = locale

  // Load translations whenever locale changes
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    async function load() {
      // If static, load the specific JSON. If dynamic, load English as the base structure.
      const staticLocaleToLoad = isStaticLocale(locale) ? (locale as StaticLocale) : DEFAULT_LOCALE

      const [primary, fb] = await Promise.all([
        loadStaticTranslations(staticLocaleToLoad),
        staticLocaleToLoad !== DEFAULT_LOCALE ? loadStaticTranslations(DEFAULT_LOCALE) : Promise.resolve(null),
      ])

      if (!cancelled) {
        setTranslations(primary)
        setFallback(fb)
        setIsLoading(false)

        // Sync <html lang="...">
        document.documentElement.lang = locale
        // If we have a predefined dir, use it, otherwise default to ltr
        document.documentElement.dir = isStaticLocale(locale) 
          ? STATIC_LOCALE_LABELS[locale as StaticLocale].dir 
          : "ltr"
      }
    }

    load()
    return () => { cancelled = true }
  }, [locale])

  // On first mount, resolve locale from client-side detection if needed
  useEffect(() => {
    if (!initialLocale) {
      const detected = detectLocale()
      if (detected !== localeRef.current) {
        setLocaleState(detected)
      }
    }
  }, [])

  /**
   * Change locale, persist it, and optionally sync with backend.
   */
  const setLocale = useCallback(async (next: string, persist = true) => {
    setLocaleState(next)
    if (persist) {
      persistLocale(next)

      fetch("/api/i18n/set-locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      }).catch(() => { /* silently ignore */ })
    }
  }, [])

  /**
   * Translate a dot-notation key.
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      if (!translations) return key
      return translate(key, translations, fallback, params)
    },
    [translations, fallback]
  )

  const isRTL = isStaticLocale(locale) ? STATIC_LOCALE_LABELS[locale as StaticLocale].dir === "rtl" : false

  // Determine the URL base locale (must be a static locale). 
  // If the active locale is dynamic (e.g., 'fr'), the URL stays on 'en'.
  const baseLocale = isStaticLocale(locale) ? locale : "en"

  const value: I18nContextValue = {
    locale,
    baseLocale, // We need to add this to the type
    setLocale,
    t,
    isRTL,
    isLoading,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error(
      "[useTranslation] Must be used inside <I18nProvider>. " +
      "Make sure you have wrapped your app in the provider."
    )
  }
  return ctx
}

export function useT() {
  return useTranslation().t
}

export function useLocale(): string {
  return useTranslation().locale
}
