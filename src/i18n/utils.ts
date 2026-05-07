// ============================================================
// i18n/utils.ts — Core translation resolution utilities
// ============================================================

import { Translations } from "./types"

/**
 * Resolve a dot-notation key against a nested translations object.
 * e.g. get("dashboard.welcome", translations) → "Welcome back, {{name}}"
 *
 * Returns `null` if the key is not found at any depth.
 */
export function resolveKey(
  key: string,
  translations: Translations | Record<string, unknown>
): string | null {
  const parts = key.split(".")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations

  for (const part of parts) {
    if (current == null || typeof current !== "object") return null
    current = current[part]
  }

  return typeof current === "string" ? current : null
}

/**
 * Interpolate `{{param}}` placeholders inside a translation string.
 * e.g. interpolate("Welcome, {{name}}!", { name: "Alice" }) → "Welcome, Alice!"
 */
export function interpolate(
  template: string,
  params: Record<string, string | number> = {}
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in params ? String(params[key]) : `{{${key}}}`
  )
}

/**
 * Full translation resolver:
 * 1. Look up the key in `primary` translations.
 * 2. If missing, look up in `fallback` translations.
 * 3. If still missing, return the raw key (with a dev warning).
 */
export function translate(
  key: string,
  primary: Translations | Record<string, unknown>,
  fallback: Translations | Record<string, unknown> | null,
  params?: Record<string, string | number>
): string {
  const raw =
    resolveKey(key, primary) ??
    (fallback ? resolveKey(key, fallback) : null)

  if (raw === null) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Missing translation key: "${key}"`)
    }
    return key // graceful: show the key itself
  }

  return params ? interpolate(raw, params) : raw
}

/**
 * Build a hreflang meta-tag map for SEO.
 * Returns a record of { locale: absoluteUrl }
 */
export function buildHreflangMap(
  pathname: string,
  locales: string[],
  origin: string
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const locale of locales) {
    // Strip existing locale prefix if present
    const stripped = pathname.replace(/^\/([a-z]{2})/, "") || "/"
    map[locale] = `${origin}/${locale}${stripped}`
  }
  map["x-default"] = `${origin}/en${pathname.replace(/^\/([a-z]{2})/, "") || "/"}`
  return map
}

/**
 * Helper for dynamic multilingual content (Option A pattern).
 * Given a localised field object and a locale, returns the best match.
 *
 * Usage:
 *   getLocalizedField({ en: "Hello", fr: "Bonjour" }, "fr") → "Bonjour"
 */
export function getLocalizedField<T = string>(
  field: Partial<Record<string, T>> | T | null | undefined,
  locale: string,
  fallbackLocale = "en"
): T | string {
  if (!field) return ""
  if (typeof field !== "object" || Array.isArray(field)) return field as T

  const localeField = (field as Partial<Record<string, T>>)[locale]
  if (localeField !== undefined) return localeField

  const fallbackField = (field as Partial<Record<string, T>>)[fallbackLocale]
  if (fallbackField !== undefined) return fallbackField

  // Return the first available value
  const firstValue = Object.values(field as Partial<Record<string, T>>)[0]
  return firstValue ?? ""
}
