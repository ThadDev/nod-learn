// ============================================================
// i18n/server.ts — Server-side helpers for RSC + metadata
// ============================================================

import { cookies, headers } from "next/headers"
import {
  StaticLocale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  STATIC_LOCALE_LABELS,
} from "./types"
import { isStaticLocale, getLocaleFromAcceptLanguage, normalizeLocale } from "./detection"
import { loadStaticTranslations } from "./loader"
import { translate } from "./utils"
import type { Translations } from "./types"

/**
 * Read the active locale from cookies (set by middleware).
 * Falls back to Accept-Language header, then DEFAULT_LOCALE.
 *
 * Use this in Server Components and generateMetadata() functions.
 */
export async function getServerLocale(): Promise<string> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value

  if (cookieValue) {
    return normalizeLocale(cookieValue)
  }

  // Try the x-nodlearn-locale header injected by middleware
  const headerStore = await headers()
  const headerLocale = headerStore.get("x-nodlearn-locale")
  if (headerLocale) {
    return normalizeLocale(headerLocale)
  }

  // Accept-Language fallback
  const acceptLanguage = headerStore.get("accept-language") ?? ""
  if (acceptLanguage) {
    const detected = getLocaleFromAcceptLanguage(acceptLanguage)
    if (detected) return detected
  }

  return DEFAULT_LOCALE
}

/**
 * Server-side translator — loads translations and returns a `t()` function
 * suitable for use inside Server Components and generateMetadata().
 *
 * Note: For dynamic languages on the server, this currently falls back to English
 * to avoid blocking rendering. Client components will fetch the dynamic translations.
 */
export async function getServerTranslations(localeOverride?: string) {
  const locale = localeOverride ?? (await getServerLocale())
  const staticLocaleToLoad = isStaticLocale(locale) ? (locale as StaticLocale) : DEFAULT_LOCALE

  const [primary, fallback] = await Promise.all([
    loadStaticTranslations(staticLocaleToLoad),
    staticLocaleToLoad !== DEFAULT_LOCALE ? loadStaticTranslations(DEFAULT_LOCALE) : Promise.resolve(null),
  ])

  function t(
    key: string,
    params?: Record<string, string | number>
  ): string {
    return translate(key, primary as unknown as Translations, fallback as unknown as Translations | null, params)
  }

  return { t, locale }
}

/**
 * Build localized metadata for a page.
 * Returns alternates.languages for hreflang SEO tags.
 */
export async function buildLocalizedMetadata(
  titleKey: string,
  descKey: string,
  pathname: string
) {
  const { t, locale } = await getServerTranslations()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://nodlearn.com"

  const alternateLanguages: Record<string, string> = {}
  Object.keys(STATIC_LOCALE_LABELS).forEach((l) => {
    const stripped = pathname.replace(/^\/([a-z]{2})/, "") || "/"
    alternateLanguages[l] = `${origin}/${l}${stripped}`
  })
  
  // Also add the current locale if it's dynamic
  if (!isStaticLocale(locale)) {
      const stripped = pathname.replace(/^\/([a-z]{2})/, "") || "/"
      alternateLanguages[locale] = `${origin}/${locale}${stripped}`
  }

  alternateLanguages["x-default"] = `${origin}/en`

  return {
    title: t(titleKey),
    description: t(descKey),
    alternates: {
      canonical: `${origin}/${locale}${pathname.replace(/^\/([a-z]{2})/, "") || "/"}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: t(titleKey),
      description: t(descKey),
      locale,
    },
  }
}

