import { auth } from "@/auth.node"
import { redirect } from "next/navigation"
import { ExamService } from "@/lib/exam/examService"
import ExamEngine from "@/components/exam/ExamEngine"
import { ShieldCheck } from "lucide-react"

export default async function ExamPage() {
  const session = await auth()
  if (!session?.user) redirect(`/signin?callbackUrl=/exams`)

  // Get the global certification exam
  const exam = await ExamService.getGlobalExam()
  if (!exam) {
    // If it doesn't exist, try to create it (inline seed)
    await ExamService.getOrCreateExam("global-certification")
    redirect("/exams") // Refresh to load the newly created exam
  }
  const courseId = "global"

  // Use a simple fetch to the internal start API to create an attempt
  // or use the service directly. Better to use service for SSR.
  let attemptId: string
  try {
    const attempt = await ExamService.startAttempt(session.user.id, exam.id)
    attemptId = attempt.id
  } catch (error: any) {
    // If max attempts reached, we should show existing attempts or an error
    // For now, let's look for the last unfinished attempt or redirect
    const existingAttempts = await ExamService.getUserAttempts(session.user.id, exam.id)
    const activeAttempt = existingAttempts.find(a => !a.submittedAt)

    if (activeAttempt) {
      attemptId = activeAttempt.id
    } else {
      // All 3 attempts used?
      redirect(`/courses?error=max_attempts`)
    }
  }

  // 3. Get questions (shuffled, no correct answers)
  const questions = await ExamService.getQuestionsForExam(exam.id)

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-20 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Official Accreditation Exam</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              {exam.title}
            </h1>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Pass Requirement</div>
            <div className="text-2xl font-black text-white">{exam.passScore}%</div>
          </div>
        </div>

        <ExamEngine
          courseId={courseId}
          attemptId={attemptId}
          initialQuestions={questions}
          duration={exam.duration}
          startedAt={new Date().toISOString()} // Approximate for client initialization, server-side startedAt is used for strict enforcement
        />
      </div>
    </div>
  )
}
