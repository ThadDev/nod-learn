"use client"

// ============================================================
// components/i18n/HreflangTags.tsx
// Injects <link rel="alternate" hreflang="..."> into the <head>
// for SEO. Use in page-level layouts for full coverage.
// ============================================================

import { usePathname } from "next/navigation"
import { STATIC_LOCALE_LABELS, useLocale, isStaticLocale } from "@/i18n"

interface HreflangTagsProps {
  origin?: string
}

export function HreflangTags({
  origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://nodlearn.com",
}: HreflangTagsProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const stripped = pathname.replace(/^\/([a-z]{2})/, "") || "/"

  return (
    <>
      {Object.keys(STATIC_LOCALE_LABELS).map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={`${origin}/${l}${stripped}`}
        />
      ))}
      {!isStaticLocale(locale) && (
         <link
          rel="alternate"
          hrefLang={locale}
          href={`${origin}/${locale}${stripped}`}
        />
      )}
      {/* x-default points to English */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${origin}/en${stripped}`}
      />
    </>
  )
}
