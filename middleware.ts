// ============================================================
// middleware.ts — Next.js Edge Middleware for i18n routing
// Handles: locale detection → redirect → cookie persistence
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  STATIC_LOCALE_LABELS
} from "./src/i18n/types"
import {
  normalizeLocale,
  getLocaleFromAcceptLanguage,
  isStaticLocale
} from "./src/i18n/detection"

// ── Paths that should be excluded from locale logic ──────────
const PUBLIC_PATHS = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/logo.png",
  "/robots.txt",
  "/sitemap.xml",
  "/fonts",
  "/images",
  "/icons",
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

/** Extract locale prefix from pathname, e.g. "/fr/dashboard" → "fr" */
function getLocaleFromPathname(pathname: string): string | null {
  const segment = pathname.split("/")[1]
  const normalized = normalizeLocale(segment)
  // Check if it's a valid 2-letter code to prevent stripping things like /api
  return (normalized === segment && segment.length === 2) ? segment : null
}

/** Strip any 2-letter locale prefix from pathname */
function stripLocale(pathname: string): string {
  const segment = pathname.split("/")[1]
  const normalized = normalizeLocale(segment)
  if (normalized === segment && segment.length === 2) {
    return pathname.slice(segment.length + 1) || "/"
  }
  return pathname
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static assets and API routes
  if (isPublicPath(pathname)) return NextResponse.next()

  const pathLocale = getLocaleFromPathname(pathname)

  // ── 1. Priority: Cookie preference ──────────────────────────
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value
  const normalizedCookie = cookieLocale ? normalizeLocale(cookieLocale) : null
  
  // For the URL prefix, we only care about static locales. If the user chose "fr", 
  // the path should be "/en" since the Google Widget handles the "fr" part over the "en" base.
  const baseLocaleFromCookie = normalizedCookie && isStaticLocale(normalizedCookie) 
    ? normalizedCookie 
    : (normalizedCookie ? "en" : null)

  // ── 2. Browser Accept-Language header ───────────────────────
  const acceptHeader = req.headers.get("accept-language") ?? ""
  const browserLocaleRaw = acceptHeader ? getLocaleFromAcceptLanguage(acceptHeader) : null
  const baseLocaleFromBrowser = browserLocaleRaw && isStaticLocale(browserLocaleRaw)
    ? browserLocaleRaw
    : (browserLocaleRaw ? "en" : null)

  // ── 3. Resolve final base locale for URL (must be static) ────
  const resolvedBaseLocale =
    baseLocaleFromCookie ??
    baseLocaleFromBrowser ??
    DEFAULT_LOCALE

  // ── 4. Redirect if no valid static locale prefix in URL ──────
  if (!pathLocale) {
    const url = req.nextUrl.clone()
    url.pathname = `/${resolvedBaseLocale}${pathname === "/" ? "" : pathname}`

    const res = NextResponse.redirect(url)

    // We don't overwrite the nodlearn-locale if it's a dynamic language,
    // we only set it if it doesn't exist
    if (!normalizedCookie) {
      res.cookies.set(LOCALE_COOKIE, resolvedBaseLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      })
    }

    return res
  }

  // ── 5. Static Locale prefix exists — validate ────────────────
  const locale = normalizeLocale(pathLocale)

  if (!isStaticLocale(locale)) {
    const url = req.nextUrl.clone()
    const stripped = stripLocale(pathname)
    url.pathname = `/${resolvedBaseLocale}${stripped}`
    return NextResponse.redirect(url)
  }

  // All good — add locale header for server components to read
  const res = NextResponse.next()
  res.headers.set("x-nodlearn-locale", locale)

  // We DO NOT update the cookie to match the path if the cookie is a dynamic language.
  // E.g., if cookie is 'fr' and path is 'en', that's correct.
  if (!normalizedCookie) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    })
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - robots.txt / sitemap.xml
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
