// ============================================================
// middleware.ts — Next.js Edge Middleware for i18n routing
// Handles: locale detection → redirect → cookie persistence
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
} from "./src/i18n/types"
import {
  normalizeLocale,
  getLocaleFromAcceptLanguage,
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
  return (normalized === segment && segment.length === 2) ? segment : null
}

/** Strip locale prefix from pathname */
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
  const savedLocale: string | null =
    normalizedCookie === cookieLocale && cookieLocale?.length === 2 ? cookieLocale : null

  // ── 2. Browser Accept-Language header ───────────────────────
  const acceptHeader = req.headers.get("accept-language") ?? ""
  const browserLocale = acceptHeader
    ? getLocaleFromAcceptLanguage(acceptHeader)
    : null

  // ── 3. Resolve final locale (priority chain) ─────────────────
  const resolvedLocale: string =
    savedLocale ??
    browserLocale ??
    DEFAULT_LOCALE

  // ── 4. Redirect if no locale prefix in URL ───────────────────
  if (!pathLocale) {
    const url = req.nextUrl.clone()
    url.pathname = `/${resolvedLocale}${pathname === "/" ? "" : pathname}`

    const res = NextResponse.redirect(url)

    // Persist resolved locale in cookie (1 year)
    res.cookies.set(LOCALE_COOKIE, resolvedLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    })

    return res
  }

  // ── 5. Locale prefix exists — validate and persist ───────────
  const locale = normalizeLocale(pathLocale)

  // If the prefix is invalid, redirect to resolved locale
  if (locale !== pathLocale || pathLocale.length !== 2) {
    const url = req.nextUrl.clone()
    const stripped = stripLocale(pathname)
    url.pathname = `/${resolvedLocale}${stripped}`
    return NextResponse.redirect(url)
  }

  // All good — add locale header for server components to read
  const res = NextResponse.next()
  res.headers.set("x-nodlearn-locale", locale)

  // Keep cookie in sync if it differs
  if (savedLocale !== locale) {
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
