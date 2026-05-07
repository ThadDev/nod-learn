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
  
  // Client-side cache for dynamically translated strings: Map<key_with_params, translated_string>
  const [dynamicCache, setDynamicCache] = useState<Record<string, string>>({})

  // Keep refs
  const localeRef = useRef(locale)
  localeRef.current = locale
  const inFlightTranslations = useRef<Set<string>>(new Set())

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

        // Clear dynamic cache when switching locales
        setDynamicCache({})
        inFlightTranslations.current.clear()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
   * If the current locale is dynamic, it returns the English base immediately,
   * but triggers a background API call to translate it, updating the cache when done.
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      if (!translations) return key

      // Get the base English/German string
      const baseString = translate(key, translations, fallback, params)

      // 1. If it's a static locale, just return the base string
      if (isStaticLocale(locale)) {
        return baseString
      }

      // 2. We are in a dynamic locale (e.g. "fr", "it", "zh"). 
      // Use the resolved baseString + target locale as the cache key.
      const cacheKey = `${key}::${JSON.stringify(params || {})}`

      if (dynamicCache[cacheKey]) {
        return dynamicCache[cacheKey]
      }

      // 3. Trigger translation if not already in flight
      if (!inFlightTranslations.current.has(cacheKey) && baseString !== key) {
        inFlightTranslations.current.add(cacheKey)
        
        translateDynamically(baseString, locale).then((translatedText) => {
          setDynamicCache((prev) => ({
            ...prev,
            [cacheKey]: translatedText
          }))
        }).catch((err) => {
          console.error("Dynamic translation failed for", key, err)
          inFlightTranslations.current.delete(cacheKey)
        })
      }

      // 4. Return base string temporarily while loading
      return baseString
    },
    [translations, fallback, locale, dynamicCache]
  )

  const isRTL = isStaticLocale(locale) ? STATIC_LOCALE_LABELS[locale as StaticLocale].dir === "rtl" : false

  const value: I18nContextValue = {
    locale,
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
