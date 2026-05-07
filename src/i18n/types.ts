// ============================================================
// i18n/types.ts — Shared types for the NodLearn i18n system
// ============================================================

import type enTranslations from "../../locales/en.json"

/** Supported static locales (those with local JSON files) */
export type StaticLocale = "en" | "de"

/** The application's default / fallback locale */
export const DEFAULT_LOCALE: StaticLocale = "en"

/** Cookie name used to persist the locale across SSR + client */
export const LOCALE_COOKIE = "nodlearn-locale"

/** localStorage key for client-side persistence */
export const LOCALE_STORAGE_KEY = "nodlearn-locale"

/** Predefined labels for static locales */
export const STATIC_LOCALE_LABELS: Record<StaticLocale, { label: string; nativeLabel: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", nativeLabel: "English", flag: "🇬🇧", dir: "ltr" },
  de: { label: "German",  nativeLabel: "Deutsch", flag: "🇩🇪", dir: "ltr" },
}

/**
 * Deep type for a nested JSON translation object, allowing type-safe key lookup.
 * This is derived from the English source-of-truth file.
 */
export type Translations = typeof enTranslations

/**
 * Produces a union of all dot-notation keys from a nested object type.
 * e.g. DotKeys<{ a: { b: string } }> = "a" | "a.b"
 */
type DotKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
    : `${Prefix}${K}`
}[keyof T & string]

/** Union of every valid dot-notation translation key */
export type TranslationKey = DotKeys<Translations>

/** Context value shape exposed by the i18n provider */
export interface I18nContextValue {
  locale: string
  setLocale: (locale: string, persist?: boolean) => Promise<void>
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
  isLoading: boolean
}
