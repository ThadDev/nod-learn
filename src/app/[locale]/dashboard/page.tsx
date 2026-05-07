"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Award, CheckCircle2, TrendingUp, ChevronRight, Clock, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n"

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export default function LocaleDashboardPage() {
  const { data: session, status } = useSession()
  const { t, locale } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/signin`)
  }, [status, router, locale])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!session) return null
  const firstName = session.user?.name?.split(" ")[0] ?? "there"

  const statCards = [
    { key: "coursesEnrolled",    value: 3,  icon: BookOpen,     color: "blue"    },
    { key: "lessonsCompleted",   value: 14, icon: CheckCircle2, color: "emerald" },
    { key: "certificatesEarned", value: 1,  icon: Award,        color: "yellow"  },
    { key: "streakDays",         value: 7,  icon: Flame,        color: "orange"  },
  ] as const

  const colorMap = {
    blue:    "bg-blue-600/20 text-blue-400 border-blue-600/20",
    emerald: "bg-emerald-600/20 text-emerald-400 border-emerald-600/20",
    yellow:  "bg-yellow-600/20 text-yellow-400 border-yellow-600/20",
    orange:  "bg-orange-600/20 text-orange-400 border-orange-600/20",
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-12">
          <Badge className="border border-white/20 bg-white/5 text-blue-400 mb-4">{t("dashboard.overview")}</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold mb-3">{t("dashboard.welcome", { name: firstName })}</h1>
          <p className="text-slate-400 text-lg">{t("dashboard.progress")}</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map(({ key, value, icon: Icon, color }) => {
            const [bg, text, border] = colorMap[color].split(" ")
            return (
              <motion.div key={key} variants={fadeUp}>
                <Card className={`bg-white/5 border ${border} hover:bg-white/10 transition-all`}>
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon size={20} className={text} />
                    </div>
                    <div className="text-3xl font-bold mb-1">{value}</div>
                    <div className="text-sm text-slate-400">{t(`dashboard.stats.${key}`)}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid lg:grid-cols-3 gap-8">
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card className="bg-white/5 border border-white/10 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">{t("dashboard.continueLearning")}</CardTitle>
                <Link href={`/${locale}/courses`}>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    {t("dashboard.viewAll")} <ChevronRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Stock Market 101",      progress: 65, lessons: 8, total: 12 },
                  { title: "Crypto & Blockchain",   progress: 30, lessons: 3, total: 10 },
                  { title: "Risk Management Basics", progress: 10, lessons: 1, total: 8  },
                ].map((course, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{t("courses.progress", { percent: course.progress })}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{course.lessons}/{course.total} {t("courses.lessons")}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="bg-white/5 border border-white/10 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">{t("dashboard.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: CheckCircle2, color: "text-emerald-400", label: 'Completed "What is a Stock?"', time: "2h ago" },
                  { icon: TrendingUp,   color: "text-blue-400",    label: "Quiz passed — 90%",           time: "1d ago" },
                  { icon: Award,        color: "text-yellow-400",  label: "Certificate earned",           time: "3d ago" },
                  { icon: Clock,        color: "text-slate-400",   label: 'Started "Crypto Basics"',      time: "5d ago" },
                ].map(({ icon: Icon, color, label, time }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-snug">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-8">
          <Card className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("dashboard.certificates")}</h3>
                <p className="text-slate-400">Complete a course and earn your NodLearn certificate.</p>
              </div>
              <Link href={`/${locale}/exams`}>
                <Button className="bg-blue-600 hover:bg-blue-500 rounded-full px-6 shrink-0">
                  {t("exam.startExam")} <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
