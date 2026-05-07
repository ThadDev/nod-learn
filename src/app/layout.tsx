import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { I18nProviderWrapper } from "@/components/providers/I18nProviderWrapper";
import { getServerLocale } from "@/i18n/server";
import { STATIC_LOCALE_LABELS } from "@/i18n";

import Script from "next/script";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "NodLearn | Premium Financial Education",
    template: "%s | NodLearn",
  },
  description:
    "Learn how modern investments work with our free financial education covering stocks, blockchain, and real estate.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://nodlearn.com"),
  alternates: {
    languages: Object.fromEntries(
      Object.keys(STATIC_LOCALE_LABELS).map((l) => [l, `/${l}`])
    ),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  // For static locales use the predefined dir; unknown dynamic locales default to ltr
  const dir = (STATIC_LOCALE_LABELS as Record<string, { dir: string }>)[locale]?.dir ?? "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Google Translate Widget Scripts */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,fr,es,de,pt,ar,zh',
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        {/* Hidden element for Google Translate to mount to if needed */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <NextAuthProvider>
          <I18nProviderWrapper initialLocale={locale}>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </I18nProviderWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
