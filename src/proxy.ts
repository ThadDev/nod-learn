import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Check for session cookie (both local and secure production variants)
    const sessionToken = req.cookies.get("authjs.session-token")?.value ||
        req.cookies.get("__Secure-authjs.session-token")?.value

    const isApiAuthRoute = pathname.startsWith("/api/auth")
    const publicPaths = ["/", "/landing", "/about", "/faq", "/contact", "/terms", "/privacy", "/disclaimer", "/signin", "/verify-email", "/register", "/admin/signin"]
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/blog")

    if (isApiAuthRoute || isPublicPath) {
        return NextResponse.next()
    }

    if (!sessionToken) {
        // Redirect admin paths to admin login, others to regular signin
        const loginPath = pathname.startsWith("/admin") ? "/admin/signin" : "/signin"
        return NextResponse.redirect(new URL(loginPath, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
