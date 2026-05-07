"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, PlayCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n"
import { getLocalizedField } from "@/i18n/utils"
import { SAMPLE_COURSES } from "@/lib/i18n-data"

export default function LocaleLessonPage() {
  const { t, locale } = useTranslation()
  const params = useParams()
  const lessonId = params?.id as string ?? ""
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Find lesson across all courses
  let lesson = null
  let courseSlug = ""
  for (const course of SAMPLE_COURSES) {
    for (const mod of course.modules) {
      const found = mod.lessons.find(l => l.id === lessonId)
      if (found) { lesson = found; courseSlug = course.slug; break }
    }
    if (lesson) break
  }

  // Fallback to first lesson for demo
  if (!lesson && SAMPLE_COURSES[0]?.modules[0]?.lessons[0]) {
    lesson = SAMPLE_COURSES[0].modules[0].lessons[0]
    courseSlug = SAMPLE_COURSES[0].slug
  }

  if (!lesson) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
      <div className="text-center">
        <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-400">Lesson not found</p>
        <Link href={`/${locale}/courses`}>
          <Button className="mt-4">{t("lesson.backToCourse")}</Button>
        </Link>
      </div>
    </div>
  )

  const title   = getLocalizedField(lesson.title, locale) as string
  const content = getLocalizedField(lesson.content, locale) as string
  const quiz    = lesson.quiz

  const correctCount = quiz ? quiz.questions.filter(q => {
    const correct = getLocalizedField(q.correctAnswer, locale) as string
    return selectedAnswers[q.id] === correct
  }).length : 0

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">

        {/* Back */}
        <Link href={`/${locale}/course/${courseSlug}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ChevronLeft size={16} /> {t("lesson.backToCourse")}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="border border-white/20 bg-white/5 text-blue-400 mb-4">
            <BookOpen size={12} className="mr-1.5" /> {t("lesson.title")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>

          {/* Video placeholder */}
          {lesson.videoUrl ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-8">
              <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen />
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <div className="text-center text-slate-500">
                <PlayCircle size={48} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t("lesson.videoUnavailable")}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <Card className="bg-white/5 border border-white/10 mb-8">
            <CardContent className="p-8">
              <p className="text-slate-300 leading-relaxed text-lg">{content}</p>
            </CardContent>
          </Card>

          {/* Quiz section */}
          {quiz && !showQuiz && !submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30">
                <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t("quiz.title")}</h3>
                    <p className="text-slate-400">{t("quiz.question", { current: 1, total: quiz.questions.length })}</p>
                  </div>
                  <Button onClick={() => setShowQuiz(true)} className="bg-blue-600 hover:bg-blue-500 rounded-full px-8 shrink-0">
                    {t("lesson.takeQuiz")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quiz questions */}
          <AnimatePresence>
            {showQuiz && !submitted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold mb-6">{t("quiz.title")}</h2>
                <div className="space-y-8">
                  {quiz?.questions.map((q, qi) => {
                    const question = getLocalizedField(q.question, locale) as string
                    const options  = (getLocalizedField(q.options, locale) ?? q.options.en) as string[]
                    return (
                      <Card key={q.id} className="bg-white/5 border border-white/10">
                        <CardContent className="p-6">
                          <p className="font-semibold mb-4 text-lg">
                            <span className="text-blue-400 mr-2">{qi + 1}.</span> {question}
                          </p>
                          <div className="space-y-3">
                            {options.map((opt, oi) => (
                              <button
                                key={oi}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                                  selectedAnswers[q.id] === opt
                                    ? "border-blue-500 bg-blue-600/20 text-white"
                                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Button
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length < (quiz?.questions.length ?? 0)}
                  className="mt-8 bg-blue-600 hover:bg-blue-500 rounded-full px-10"
                >
                  {t("quiz.submit")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quiz results */}
          {submitted && quiz && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className={`border ${correctCount === quiz.questions.length ? "border-emerald-500/40 bg-emerald-600/10" : "border-orange-500/40 bg-orange-600/10"}`}>
                <CardContent className="p-8 text-center">
                  <div className={`text-6xl font-black mb-4 ${correctCount === quiz.questions.length ? "text-emerald-400" : "text-orange-400"}`}>
                    {Math.round((correctCount / quiz.questions.length) * 100)}%
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {correctCount === quiz.questions.length ? t("quiz.passed") : t("quiz.failed")}
                  </h3>
                  <p className="text-slate-400 mb-6">{t("quiz.correctAnswers")}: {correctCount}/{quiz.questions.length}</p>

                  {/* Answer review */}
                  <div className="text-left space-y-4 mb-8">
                    {quiz.questions.map((q) => {
                      const correct = getLocalizedField(q.correctAnswer, locale) as string
                      const explanation = getLocalizedField(q.explanation, locale) as string
                      const isRight = selectedAnswers[q.id] === correct
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border ${isRight ? "border-emerald-500/30 bg-emerald-600/10" : "border-red-500/30 bg-red-600/10"}`}>
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle2 size={16} className={isRight ? "text-emerald-400 mt-0.5 shrink-0" : "text-red-400 mt-0.5 shrink-0"} />
                            <p className="text-sm font-medium">{getLocalizedField(q.question, locale) as string}</p>
                          </div>
                          <p className="text-xs text-slate-400 ml-6">{t("quiz.explanation")}: {explanation}</p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => { setSubmitted(false); setShowQuiz(true); setSelectedAnswers({}) }} variant="outline" className="rounded-full">
                      {t("quiz.tryAgain")}
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500 rounded-full" asChild>
                      <Link href={`/${locale}/courses`}>{t("quiz.nextLesson")} <ChevronRight size={14} className="ml-1" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
