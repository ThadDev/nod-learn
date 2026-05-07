"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LogoutButton } from "./LogoutButton"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { useTranslation } from "@/i18n"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const loading = status === "loading"
    const { t, locale } = useTranslation()

    const navLinks = [
        { href: `/${locale}/course`, label: t("nav.curriculum") },
        { href: `/${locale}/blog`,   label: t("nav.blog") },
        { href: `/${locale}/about`,  label: t("nav.about") },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between px-6">
                <div className="flex items-center gap-12 md:gap-10">
                    <Link href={`/${locale}`} className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Nodlearn Logo" className="rounded-xl" width={40} height={40} unoptimized />
                        <span className="inline-block font-bold text-l tracking-tighter text-primary">
                            NODLEARN<span className="text-blue-500">.</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors hover:text-blue-500 ${
                                    pathname === link.href ? "text-blue-500" : "text-muted-foreground"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {/* Language Switcher — desktop */}
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {loading ? (
                            <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <Link href={`/${locale}/dashboard`}>
                                    <Button variant="ghost" size="sm" className="font-bold">
                                        {t("nav.dashboard")}
                                    </Button>
                                </Link>
                                <LogoutButton variant="outline" />
                            </div>
                        ) : (
                            <>
                                <Link href={`/${locale}/signin`}>
                                    <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-foreground">
                                        {t("nav.login")}
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/register`}>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 font-bold px-6 rounded-full shadow-lg shadow-blue-600/20">
                                        {t("nav.getStarted")}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        className="md:hidden h-16 w-16 p-0"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-16 w-16" /> : <Menu className="h-16 w-16" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 w-full border-t border-b bg-white dark:bg-slate-950 shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="container px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-lg font-bold transition-colors ${
                                        pathname === link.href ? "text-blue-500" : "text-foreground"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-border" />

                            {/* Language Switcher — mobile pills */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    {t("common.language")}
                                </p>
                                <LanguageSwitcher variant="pills" />
                            </div>
                            <hr className="border-border" />

                            {session ? (
                                <div className="flex flex-col gap-4">
                                    <Link href={`/${locale}/dashboard`} onClick={() => setIsOpen(false)} className="text-lg font-bold">
                                        {t("nav.dashboard")}
                                    </Link>
                                    <LogoutButton fullWidth variant="secondary" className="h-12 text-lg font-bold" />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <Link href={`/${locale}/signin`} onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-2xl">
                                            <LogIn className="mr-2 h-5 w-5" /> {t("nav.login")}
                                        </Button>
                                    </Link>
                                    <Link href={`/${locale}/register`} onClick={() => setIsOpen(false)}>
                                        <Button className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 rounded-2xl">
                                            <UserPlus className="mr-2 h-5 w-5" /> {t("nav.getStarted")}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
