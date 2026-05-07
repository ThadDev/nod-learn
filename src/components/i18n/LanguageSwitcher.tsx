"use client"

// ============================================================
// components/i18n/LanguageSwitcher.tsx
// Dropdown language switcher — allows selection of static and
// dynamic languages.
// ============================================================

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Globe, Search } from "lucide-react"
import {
  STATIC_LOCALE_LABELS,
  useTranslation,
  persistLocale,
  isStaticLocale,
  StaticLocale
} from "@/i18n"

interface LanguageSwitcherProps {
  variant?: "dropdown" | "pills" | "floating"
  className?: string
}

// Extended list of common languages for the dropdown
const COMMON_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", isStatic: true },
  { code: "de", name: "Deutsch", flag: "🇩🇪", isStatic: true },
  { code: "fr", name: "Français", flag: "🇫🇷", isStatic: false },
  { code: "es", name: "Español", flag: "🇪🇸", isStatic: false },
  { code: "it", name: "Italiano", flag: "🇮🇹", isStatic: false },
  { code: "pt", name: "Português", flag: "🇵🇹", isStatic: false },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", isStatic: false },
  { code: "ja", name: "日本語", flag: "🇯🇵", isStatic: false },
  { code: "zh", name: "中文", flag: "🇨🇳", isStatic: false },
]

export function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleSelect(next: string) {
    if (next === locale) { setOpen(false); return }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (!isStaticLocale(next)) {
      // Set googtrans cookie for the widget
      const cookieStr = `googtrans=/en/${next}; path=/;`
      document.cookie = isLocalhost ? cookieStr : `${cookieStr} domain=${window.location.hostname}`
      
      if (!isLocalhost) {
        const parts = window.location.hostname.split('.')
        if (parts.length > 2) {
          const domain = parts.slice(-2).join('.')
          document.cookie = `${cookieStr} domain=.${domain}`
        }
      }
      
      // We don't push a new Next.js route, we stay on the current static URL.
      // E.g., if on /en/dashboard, stay there, let the widget translate it.
      persistLocale(next)
      await setLocale(next, true)
      
      window.location.reload()
      return
    } else {
      // Clear the cookie when switching back to a static/supported locale
      const clearCookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = isLocalhost ? clearCookie : `${clearCookie} domain=${window.location.hostname}`
      
      // 1. Persist
      persistLocale(next)

      // 2. Update context
      await setLocale(next, true)

      // 3. Navigate to equivalent path
      const pathParts = pathname.split('/')
      if (pathParts.length > 1 && pathParts[1].length === 2) {
        pathParts.splice(1, 1) // remove existing locale
      }
      const stripped = pathParts.join('/') || '/'
      
      router.push(`/${next}${stripped}`)
      router.refresh()
    }

    setOpen(false)
    setSearchQuery("")
  }

  const currentLangObj = COMMON_LANGUAGES.find(l => l.code === locale)
  const currentLabel = currentLangObj ? currentLangObj.name : locale.toUpperCase()
  const currentFlag = currentLangObj ? currentLangObj.flag : "🌐"

  const filteredLanguages = COMMON_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (variant === "pills") {
    return (
      <div className={`flex items-center gap-1 flex-wrap ${className}`} role="group" aria-label={t("common.selectLanguage")}>
        {COMMON_LANGUAGES.filter(l => l.isStatic || l.code === locale).map((l) => (
          <button
            key={l.code}
            onClick={() => handleSelect(l.code)}
            aria-pressed={l.code === locale}
            className={`
              px-3 py-1 rounded-full text-xs font-semibold transition-all
              ${l.code === locale
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
              }
            `}
          >
            {l.flag} {l.name} {!l.isStatic && " (Auto)"}
          </button>
        ))}
      </div>
    )
  }

  const isFloating = variant === "floating"

  return (
    <div className={`${isFloating ? "fixed bottom-4 left-4 z-[999] md:hidden" : "relative"} ${className}`} ref={ref}>
      <button
        id={isFloating ? "language-switcher-floating-btn" : "language-switcher-btn"}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.selectLanguage")}
        className={isFloating 
          ? `
            flex items-center justify-center w-12 h-12 rounded-full
            bg-slate-900 border border-white/20 shadow-2xl shadow-black/50
            text-white hover:bg-slate-800 transition-all duration-200
          `
          : `
            flex items-center gap-1.5 px-3 py-2 rounded-lg
            text-sm font-medium text-slate-300
            hover:bg-white/10 hover:text-white
            transition-all duration-200
            border border-transparent hover:border-white/10
          `
        }
      >
        {isFloating ? (
          <span className="text-xl">{currentFlag}</span>
        ) : (
          <>
            <Globe size={15} className="text-blue-400 shrink-0" />
            <span className="hidden sm:inline">{currentFlag}</span>
            <span className="hidden sm:inline">{currentLabel} {!currentLangObj?.isStatic && currentLangObj ? "(Auto)" : ""}</span>
            <span className="sm:hidden">{currentFlag}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: isFloating ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isFloating ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute ${isFloating ? "bottom-full mb-3 left-0" : "right-0 top-full mt-2"} z-[200]
              w-56 overflow-hidden flex flex-col
              rounded-xl border border-white/10
              bg-slate-900/95 backdrop-blur-xl
              shadow-2xl shadow-black/40
            `}
          >
            <div className="p-2 border-b border-white/10 relative">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search language..." 
                 className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-blue-500"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 autoFocus
               />
            </div>
            
            <ul role="listbox" className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredLanguages.map((l) => {
                const isActive = l.code === locale
                return (
                  <li key={l.code}>
                    <button
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(l.code)}
                      className={`
                        flex items-center gap-3 w-full px-3 py-2 rounded-lg
                        text-sm font-medium text-left
                        transition-colors duration-150
                        ${isActive
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="flex-1">{l.name}</span>
                      {!l.isStatic && <span className="text-[10px] uppercase text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">Auto</span>}
                      {isActive && <Check size={14} className="text-blue-400 shrink-0" />}
                    </button>
                  </li>
                )
              })}
              {filteredLanguages.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-500 text-center">
                   Language not found
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
