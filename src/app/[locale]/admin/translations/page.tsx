"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Save, RefreshCw, Download, Upload, Search, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/i18n"
import enTranslations from "../../../../../locales/en.json"
import deTranslations from "../../../../../locales/de.json"

// Flatten nested JSON to dot-notation entries
function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  return Object.keys(obj).reduce<Record<string, string>>((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val as Record<string, unknown>, fullKey))
    } else if (typeof val === "string") {
      acc[fullKey] = val
    }
    return acc
  }, {})
}

const EN_FLAT = flattenObject(enTranslations as unknown as Record<string, unknown>)
const DE_FLAT = flattenObject(deTranslations as unknown as Record<string, unknown>)

const LANGS = [
  { code: "en", label: "English 🇬🇧", flat: EN_FLAT },
  { code: "de", label: "Deutsch 🇩🇪", flat: DE_FLAT },
]

export default function AdminTranslationsPage() {
  const { t } = useTranslation()
  const [search, setSearch]       = useState("")
  const [activeLang, setActiveLang] = useState("de")
  const [edits, setEdits]         = useState<Record<string, string>>({})
  const [saved, setSaved]         = useState(false)
  const [showMissing, setShowMissing] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const allKeys = Object.keys(EN_FLAT)
  const targetFlat = LANGS.find(l => l.code === activeLang)?.flat ?? {}

  const missingKeys = allKeys.filter(k => !targetFlat[k])

  const displayKeys = allKeys.filter(k => {
    const matchSearch = !search || k.toLowerCase().includes(search.toLowerCase()) ||
      (EN_FLAT[k] ?? "").toLowerCase().includes(search.toLowerCase())
    const matchMissing = !showMissing || missingKeys.includes(k)
    return matchSearch && matchMissing
  })

  // Group by top-level section
  const grouped: Record<string, string[]> = {}
  for (const key of displayKeys) {
    const section = key.split(".")[0]
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(key)
  }

  function toggleSection(s: string) {
    setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }))
  }

  function handleEdit(key: string, val: string) {
    setEdits(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  function handleSave() {
    // In production: POST edits to /api/admin/translations to write back to JSON
    console.log("[Admin] Saving translations:", edits)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function exportJSON() {
    const merged = { ...targetFlat, ...edits }
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${activeLang}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Globe size={24} className="text-blue-400" />
              <h1 className="text-3xl font-bold">{t("admin.translationManager.title")}</h1>
            </div>
            <p className="text-slate-400">{t("admin.translationManager.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportJSON} variant="outline" size="sm" className="border-white/20 text-slate-300">
              <Download size={14} className="mr-2" /> {t("admin.translationManager.exportAll")}
            </Button>
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-500">
              {saved ? <CheckCircle2 size={14} className="mr-2 text-emerald-400" /> : <Save size={14} className="mr-2" />}
              {saved ? "Saved!" : t("common.save")}
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total keys",    value: allKeys.length,     color: "text-white"        },
            { label: "Translated",    value: allKeys.length - missingKeys.length, color: "text-emerald-400" },
            { label: "Missing",       value: missingKeys.length, color: "text-orange-400"   },
            { label: "Coverage",      value: `${Math.round(((allKeys.length - missingKeys.length) / allKeys.length) * 100)}%`, color: "text-blue-400" },
          ].map(s => (
            <Card key={s.label} className="bg-white/5 border border-white/10">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Language tabs */}
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setActiveLang(l.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeLang === l.code
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search keys or values..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-9 text-sm"
            />
          </div>

          <button
            onClick={() => setShowMissing(!showMissing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              showMissing
                ? "border-orange-500/40 bg-orange-600/10 text-orange-400"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <AlertCircle size={14} />
            {t("admin.translationManager.missingTranslations")} ({missingKeys.length})
          </button>
        </div>

        {/* Translation table by section */}
        <div className="space-y-4">
          {Object.keys(grouped).sort().map(section => {
            const keys = grouped[section]
            const isOpen = expandedSections[section] !== false // default open
            const sectionMissing = keys.filter(k => missingKeys.includes(k)).length

            return (
              <Card key={section} className="bg-white/5 border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                    <span className="font-semibold capitalize">{section}</span>
                    <Badge className="bg-white/10 text-slate-400 border-0 text-xs">{keys.length} keys</Badge>
                    {sectionMissing > 0 && (
                      <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs">
                        {sectionMissing} missing
                      </Badge>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10">
                        {/* Column headers */}
                        <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span>Key</span>
                          <span>English (source)</span>
                          <span>
                            {LANGS.find(l => l.code === activeLang)?.label ?? activeLang}
                            {activeLang === "en" && " (read-only)"}
                          </span>
                        </div>

                        <div className="divide-y divide-white/5">
                          {keys.map(key => {
                            const enVal     = EN_FLAT[key] ?? ""
                            const targetVal = edits[key] ?? targetFlat[key] ?? ""
                            const isMissing = !targetFlat[key] && !edits[key]

                            return (
                              <div key={key} className={`grid grid-cols-3 gap-4 px-6 py-3 items-start ${isMissing ? "bg-orange-600/5" : ""}`}>
                                <div className="font-mono text-xs text-slate-500 pt-2 break-all">{key}</div>
                                <div className="text-sm text-slate-300 pt-2">{enVal}</div>
                                <div>
                                  {activeLang === "en" ? (
                                    <span className="text-sm text-slate-400">{enVal}</span>
                                  ) : (
                                    <textarea
                                      rows={1}
                                      value={targetVal}
                                      onChange={e => handleEdit(key, e.target.value)}
                                      placeholder={isMissing ? "⚠ Missing — add translation" : ""}
                                      className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-orange-400/60 focus:outline-none focus:border-blue-500 resize-none transition-colors ${
                                        isMissing ? "border-orange-500/40" : "border-white/10"
                                      }`}
                                      onInput={e => {
                                        const el = e.currentTarget
                                        el.style.height = "auto"
                                        el.style.height = `${el.scrollHeight}px`
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>

        {/* Bottom save bar */}
        {Object.keys(edits).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-slate-900 border border-white/20 shadow-2xl shadow-black/50">
              <CardContent className="p-4 flex items-center gap-4">
                <span className="text-sm text-slate-300">
                  {Object.keys(edits).length} unsaved change{Object.keys(edits).length > 1 ? "s" : ""}
                </span>
                <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-500">
                  <Save size={14} className="mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
