/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**" },
        ],
    },

    // ── Internationalization ────────────────────────────────────
    // Locale-based routing: /en, /de
    // Middleware handles detection + redirect; this enables the built-in
    // Next.js i18n router so Link, useRouter, and useParams are locale-aware.
    // For dynamic locales (like /fr or /es), the middleware redirects to /en
    // if we don't handle them. We want to support ANY 2-letter language code
    // dynamically, so we can't use built-in i18n routing restriction here
    // or we'd get a 404 for /fr.
    // The solution is to remove the i18n block entirely so Next.js doesn't
    // enforce the locale list, and let our middleware and [locale] folder
    // handle it all.
    // Required for Next-Auth v5
    serverExternalPackages: ["@prisma/client"],
    experimental: {
        // any other experimental keys would go here
    },
}

export default nextConfig
