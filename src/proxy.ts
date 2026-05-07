// ============================================================
// proxy.ts — Next.js Edge Proxy for i18n routing + Auth
// Handles: locale detection → redirect → auth check → persistence
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  STATIC_LOCALE_LABELS
} from "@/i18n/types"
import {
  normalizeLocale,
  getLocaleFromAcceptLanguage,
  isStaticLocale
} from "@/i18n/detection"

// ── Paths that should be excluded from ALL logic (assets/api) ──
const ASSET_PATHS = [
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

// ── Publicly accessible pages (should be checked AFTER i18n prefix) ──
const PUBLIC_PAGES = [
  "/",
  "/landing",
  "/about",
  "/faq",
  "/contact",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/signin",
  "/verify-email",
  "/register",
  "/admin/signin"
]

function isAssetPath(pathname: string): boolean {
  return ASSET_PATHS.some((p) => pathname.startsWith(p))
}

/** Extract locale prefix from pathname, e.g. "/fr/dashboard" → "fr" */
function getLocaleFromPathname(pathname: string): string | null {
  const segment = pathname.split("/")[1]
  const normalized = normalizeLocale(segment)
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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Skip assets and API routes
  if (isAssetPath(pathname)) return NextResponse.next()

  const pathLocale = getLocaleFromPathname(pathname)
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value
  const normalizedCookie = cookieLocale ? normalizeLocale(cookieLocale) : null

  // 2. Resolve base locale for redirection
  const acceptHeader = req.headers.get("accept-language") ?? ""
  const browserLocaleRaw = acceptHeader ? getLocaleFromAcceptLanguage(acceptHeader) : null
  
  const resolvedBaseLocale =
    (normalizedCookie && isStaticLocale(normalizedCookie) ? normalizedCookie : null) ??
    (browserLocaleRaw && isStaticLocale(browserLocaleRaw) ? browserLocaleRaw : null) ??
    DEFAULT_LOCALE

  // 3. I18n Redirect: If no valid static locale prefix in URL, add it
  if (!pathLocale || !isStaticLocale(pathLocale)) {
    const url = req.nextUrl.clone()
    const stripped = stripLocale(pathname)
    url.pathname = `/${resolvedBaseLocale}${stripped === "/" ? "" : stripped}`
    return NextResponse.redirect(url)
  }

  // 4. Auth Check: Logic from former proxy.ts
  const sessionToken = req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value
  
  const strippedPath = stripLocale(pathname)
  const isPublicPage = PUBLIC_PAGES.includes(strippedPath) || strippedPath.startsWith("/blog")

  if (!isPublicPage && !sessionToken) {
    const url = req.nextUrl.clone()
    // Redirect to localized signin
    const loginPath = strippedPath.startsWith("/admin") ? "/admin/signin" : "/signin"
    url.pathname = `/${pathLocale}${loginPath}`
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // 5. Finalize: Set headers and cookies
  const res = NextResponse.next()
  res.headers.set("x-nodlearn-locale", pathLocale)

  if (!normalizedCookie) {
    res.cookies.set(LOCALE_COOKIE, pathLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    })
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
