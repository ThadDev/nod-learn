// ============================================================
// app/api/i18n/set-locale/route.ts
// Persists the user's locale preference in the cookie (SSR sync)
// and, if authenticated, syncs to their DB profile.
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { prisma } from "@/lib/prisma"
import { LOCALE_COOKIE } from "@/i18n"
import { normalizeLocale } from "@/i18n/detection"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { locale } = body as { locale: string }

    const normalized = normalizeLocale(locale)
    if (!locale || normalized !== locale || locale.length !== 2) {
      return NextResponse.json(
        { error: `Unsupported locale format.` },
        { status: 400 }
      )
    }

    const res = NextResponse.json({ ok: true, locale })

    // Always set the cookie regardless of auth state
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      httpOnly: false, // Must be readable by client JS for hydration
    })

    // Sync with DB profile if logged in
    const session = await auth()
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { preferredLocale: locale },
      }).catch((err: unknown) => {
        // Log but don't fail — DB sync is best-effort
        console.warn("[i18n] Could not sync locale to DB:", err)
      })
    }

    return res
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value

  let dbLocale: string | null = null
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferredLocale: true },
    })
    dbLocale = user?.preferredLocale ?? null
  }

  return NextResponse.json({
    cookie: cookieLocale ?? null,
    db: dbLocale,
    resolved: dbLocale ?? cookieLocale ?? null,
  })
}
