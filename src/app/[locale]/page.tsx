"use client"

// ============================================================
// app/[locale]/page.tsx — Multilingual Landing Page
// ============================================================

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen, BarChart3, Bitcoin, Star,
  Users, ChevronRight, ShieldCheck, Globe2,
  TrendingUp, Award,
} from "lucide-react"
import { useTranslation } from "@/i18n"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export default function LocaleHomePage() {
  const { t, locale, baseLocale } = useTranslation()

  const whyCards = [
    { key: "markets", icon: TrendingUp },
    { key: "mistakes", icon: ShieldCheck },
    { key: "skills",  icon: Award },
  ] as const

  const curriculumCourses = [
    { key: "stocks", icon: BarChart3 },
    { key: "scams",  icon: ShieldCheck },
    { key: "crypto", icon: Bitcoin },
    { key: "risk",   icon: TrendingUp },
  ] as const

  return (
    <div className="flex flex-col bg-[#0B0F19] text-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.08),transparent_50%)]" />

        <div className="relative container mx-auto px-6 py-24 max-w-6xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Badge className="border border-white/20 bg-white/5 text-white mb-6 px-4 py-1.5 text-sm">
              <Globe2 size={14} className="mr-2 text-blue-400 inline" />
              {t("landing.hero.badge")}
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight"
          >
            {t("landing.hero.title")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              {t("landing.hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex justify-center gap-4 mt-10 flex-wrap"
          >
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 rounded-full shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
            >
              <a href="https://chat.whatsapp.com/Kovu9i1AyLb4nN8hInik7Y">
                {t("landing.hero.cta")}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              <Link href={`/${baseLocale}/course`}>
                {t("landing.cta.startCourse")} <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 text-sm text-slate-400"
          >
            {[
              { icon: Users, text: t("landing.hero.stats.members") },
              { icon: Star,  text: t("landing.hero.stats.trusted") },
              { icon: BookOpen, text: t("landing.hero.stats.learn") },
            ].map(({ icon: Icon, text }) => (
              <motion.div key={text} variants={fadeUp} className="flex items-center gap-2">
                <Icon size={16} className="text-blue-400" /> {text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────── */}
      <section className="py-28 border-b border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold">
              {t("landing.why.title")}
            </h2>
            <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
              {t("landing.why.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {whyCards.map(({ key, icon: Icon }) => (
              <motion.div key={key} variants={fadeUp}>
                <Card className="bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 hover:border-blue-500/30 transition-all group h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                      <Icon size={22} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {t(`landing.why.cards.${key}.title`)}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {t(`landing.why.cards.${key}.desc`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CURRICULUM ───────────────────────────────────────── */}
      <section className="py-28 border-b border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold">
              {t("landing.curriculum.title")}
            </h2>
            <p className="mt-6 text-slate-400">
              {t("landing.curriculum.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {curriculumCourses.map(({ key, icon: Icon }) => (
              <motion.div key={key} variants={fadeUp}>
                <Card className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group h-full">
                  <CardContent className="p-8">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                      <Icon size={18} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t(`landing.curriculum.courses.${key}.title`)}
                    </h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                      {(t(`landing.curriculum.courses.${key}.items`) as unknown as string[])?.map?.((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">›</span> {item}
                        </li>
                      )) ?? null}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-28 border-b border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-semibold">
              {t("landing.testimonials.title")}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="bg-white/5 border border-white/10 hover:border-white/20 transition-all h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4 text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed italic">
                      &ldquo;{t(`landing.testimonials.reviews.${i}.text`)}&rdquo;
                    </p>
                    <div className="font-semibold text-white">
                      {t(`landing.testimonials.reviews.${i}.name`)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="relative container mx-auto px-6 max-w-3xl text-center">
          <motion.h2
            variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold mb-6"
          >
            {t("landing.cta.title")}
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="text-slate-400 mb-10 text-lg"
          >
            {t("landing.cta.subtitle")}
          </motion.p>
          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div variants={fadeUp}>
              <Button
                asChild size="lg"
                className="bg-blue-600 hover:bg-blue-500 font-bold px-8 rounded-full shadow-xl shadow-blue-600/30 hover:scale-105 transition-all"
              >
                <Link href={`/${baseLocale}/course`}>
                  {t("landing.cta.startCourse")}
                  <ChevronRight className="ml-2" size={18} />
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button
                asChild size="lg" variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full"
              >
                <a href="https://chat.whatsapp.com/Kovu9i1AyLb4nN8hInik7Y">
                  {t("landing.cta.joinWhatsapp")}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
