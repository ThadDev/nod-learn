// ============================================================
// i18n/detection.ts — Language detection utility
// Browser + IP + Cookie priority chain (client-safe)
// ============================================================

import {
  StaticLocale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  STATIC_LOCALE_LABELS,
} from "./types"

/**
 * Checks whether a string is a supported static locale (has JSON file).
 */
export function isStaticLocale(value: string): value is StaticLocale {
  return value in STATIC_LOCALE_LABELS
}

/**
 * Normalize a raw BCP-47 tag (e.g. "fr-FR") to our supported Locale ("fr").
 * With dynamic translations, we accept any 2-letter language code.
 */
export function normalizeLocale(raw: string): string {
  if (!raw) return DEFAULT_LOCALE
  const prefix = raw.split("-")[0].toLowerCase()
  return prefix.length === 2 ? prefix : DEFAULT_LOCALE
}

// ──────────────────────────────────────────────
// Client-side detection helpers
// ──────────────────────────────────────────────

/** Read locale from document.cookie */
export function getLocaleFromCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
  if (!match) return null
  const value = match.split("=")[1]
  return normalizeLocale(value)
}

/** Read locale from localStorage */
export function getLocaleFromStorage(): string | null {
  if (typeof localStorage === "undefined") return null
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (!value) return null
    return normalizeLocale(value)
  } catch {
    return null
  }
}

/** Detect locale from navigator.language / navigator.languages */
export function getLocaleFromBrowser(): string | null {
  if (typeof navigator === "undefined") return null
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const lang of langs) {
    const resolved = normalizeLocale(lang)
    if (resolved) {
      return resolved
    }
  }
  return null
}

/**
 * Persist the locale to both cookie and localStorage.
 * Cookie max-age: 1 year (365 days).
 */
export function persistLocale(locale: string): void {
  // localStorage
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // silently ignore quota errors
  }

  // Cookie (accessible to middleware / SSR)
  if (typeof document !== "undefined") {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  }
}

/**
 * Full client-side resolution chain:
 * 1. Saved preference (localStorage)
 * 2. Saved preference (cookie)
 * 3. Browser language
 * 4. DEFAULT_LOCALE
 */
export function detectLocale(): string {
  return (
    getLocaleFromStorage() ??
    getLocaleFromCookie() ??
    getLocaleFromBrowser() ??
    DEFAULT_LOCALE
  )
}

// ──────────────────────────────────────────────
// Server-side helpers (edge / Node runtime)
// ──────────────────────────────────────────────

/**
 * Extract locale from an Accept-Language header string.
 * e.g. "fr-CH, fr;q=0.9, en;q=0.8" → "fr"
 */
export function getLocaleFromAcceptLanguage(header: string): string | null {
  const parts = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { tag: tag.trim(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of parts) {
    const resolved = normalizeLocale(tag)
    if (resolved) return resolved
  }
  return null
}

/**
 * Extract locale from a cookies object (e.g. NextRequest.cookies).
 */
export function getLocaleFromCookies(
  cookies: { get: (name: string) => { value: string } | undefined } | Map<string, string>
): string | null {
  const value =
    cookies instanceof Map
      ? cookies.get(LOCALE_COOKIE)
      : cookies.get(LOCALE_COOKIE)?.value

  if (!value) return null
  return normalizeLocale(value)
}
