/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**" },
        ],
    },
    // Required for Next-Auth v5
    serverExternalPackages: ["@prisma/client"],
    experimental: {
        // any other experimental keys would go here
    },
}

export default nextConfig
