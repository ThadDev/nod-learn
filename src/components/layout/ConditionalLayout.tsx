"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { Preloader } from "./Preloader"

const NO_LAYOUT_PATHS = ["/signin", "/register", "/verify-email", "/forgot-password"]

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isNoLayoutPage =
        NO_LAYOUT_PATHS.includes(pathname) ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/courses")

    if (isNoLayoutPage) {
        return <>{children}</>
    }

    return (
        <>
            <Preloader />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    )
}
