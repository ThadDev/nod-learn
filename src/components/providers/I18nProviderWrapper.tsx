"use client"

// ============================================================
// components/providers/I18nProviderWrapper.tsx
// Client-side boundary that wraps the app in <I18nProvider>.
// Accepts an initialLocale from the server (via cookie) to
// prevent SSR/client hydration mismatch.
// ============================================================

import { I18nProvider } from "@/i18n"

interface Props {
  children: React.ReactNode
  initialLocale: string
}

export function I18nProviderWrapper({ children, initialLocale }: Props) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
    </I18nProvider>
  )
}
