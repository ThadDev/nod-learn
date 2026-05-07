import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { buildLocalizedMetadata } from "@/i18n/server"
import { STATIC_LOCALE_LABELS } from "@/i18n"
import { normalizeLocale } from "@/i18n/detection"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Pre-generate all static locale routes at build time
export function generateStaticParams() {
  return Object.keys(STATIC_LOCALE_LABELS).map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const normalized = normalizeLocale(locale)
  if (normalized !== locale) return {}
  return buildLocalizedMetadata("seo.home.title", "seo.home.description", "/")
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Guard against invalid formats (must be exactly 2 letters)
  const normalized = normalizeLocale(locale)
  if (normalized !== locale || locale.length !== 2) {
    notFound()
  }

  return <>{children}</>
}
