"use client"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Search, ChevronRight, Clock, Star, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/i18n"
import { SAMPLE_COURSES } from "@/lib/i18n-data"
import { getLocalizedField } from "@/i18n/utils"

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function LocaleCoursesPage() {
  const { t, locale } = useTranslation()
  const [search, setSearch] = useState("")

  const filtered = SAMPLE_COURSES.filter(c => {
    const title = getLocalizedField(c.title, locale) as string
    return title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="container mx-auto px-6 py-16 max-w-6xl">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-12">
          <Badge className="border border-white/20 bg-white/5 text-blue-400 mb-4">
            {t("common.free")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{t("courses.title")}</h1>
          <p className="text-slate-400 text-lg mb-8">{t("courses.subtitle")}</p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("courses.searchPlaceholder")}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Course Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">{t("courses.noCoursesFound")}</div>
        ) : (
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="grid md:grid-cols-2 gap-8"
          >
            {filtered.map((course) => {
              const title       = getLocalizedField(course.title, locale) as string
              const description = getLocalizedField(course.description, locale) as string
              const tagline     = getLocalizedField(course.tagline, locale) as string
              const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

              return (
                <motion.div key={course.id} variants={fadeUp}>
                  <Card className="bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all group overflow-hidden h-full">
                    {/* Course image */}
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-0">
                        {t(`courses.${course.level}`)}
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-emerald-600/90 text-white border-0">
                        {t("courses.free")}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">{tagline}</p>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{title}</h2>
                      <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">{description}</p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={13} /> {lessonCount} {t("courses.lessons")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} /> {course.modules.length} {t("courses.modules")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star size={13} className="text-yellow-400 fill-yellow-400" /> 4.9
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={13} /> 1.2k
                        </span>
                      </div>

                      <Link
                        href={`/${locale}/course/${course.slug}`}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {t("courses.viewCourse")} <ChevronRight size={14} />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
