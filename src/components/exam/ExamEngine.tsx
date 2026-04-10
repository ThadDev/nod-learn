"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: string
  question: string
  options: string[]
}

interface Props {
  courseId: string
  attemptId: string
  initialQuestions: Question[]
  duration: number // in minutes
  startedAt: string
}

export default function ExamEngine({ courseId, attemptId, initialQuestions, duration, startedAt }: Props) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)

  // Initialize timer
  useEffect(() => {
    const startTime = new Date(startedAt).getTime()
    const endTime = startTime + duration * 60 * 1000
    
    const updateTimer = () => {
      const now = new Date().getTime()
      const remainingSize = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeLeft(remainingSize)

      if (remainingSize === 0 && !isFinished && !isSubmitting) {
        handleSubmit(true)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [startedAt, duration, isFinished, isSubmitting])

  const handleSubmit = useCallback(async (isAuto = false) => {
    if (isSubmitting || isFinished) return
    
    setIsSubmitting(true)
    if (isAuto) {
      toast.info("Time expired! Automatically submitting your answers.")
    } else {
      toast.loading("Grading your exam...")
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }))

      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers: formattedAnswers }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setIsFinished(true)
        toast.dismiss()
        if (data.passed) {
          toast.success("Congratulations! You passed the exam.")
        } else {
          toast.error("You did not pass the exam. Please try again.")
        }
      } else {
        toast.error(data.error || "Failed to submit exam")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("An error occurred during submission")
    } finally {
      setIsSubmitting(false)
    }
  }, [attemptId, answers, isSubmitting, isFinished])

  const handleSelectOption = (questionId: string, option: string) => {
    if (isFinished) return
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = initialQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / initialQuestions.length) * 100
  const answeredCount = Object.keys(answers).length

  if (isFinished && result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className={`p-6 rounded-3xl mb-8 ${result.passed ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-rose-500/20 border border-rose-500/30'}`}>
           {result.passed ? <CheckCircle2 className="h-16 w-16 text-emerald-400" /> : <ShieldAlert className="h-16 w-16 text-rose-400" />}
        </div>
        <h2 className="text-4xl font-bold mb-4">{result.passed ? 'Exam Passed!' : 'Exam Failed'}</h2>
        <p className="text-slate-400 text-xl mb-8">Your Score: <span className={result.passed ? 'text-emerald-400' : 'text-rose-400'}>{result.score.toFixed(1)}%</span></p>
        
        <div className="flex gap-4">
          <Button onClick={() => router.push('/courses')} variant="outline" className="rounded-full px-8 h-12">
            Back to Curriculum
          </Button>
          {result.passed && (
             <Button onClick={() => router.push('/dashboard')} className="rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-500">
               Go to Dashboard
             </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Timer and Progress */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 -mx-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 300 ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
            <Clock className={`h-4 w-4 ${timeLeft < 300 ? 'animate-pulse' : ''}`} />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
          <div className="hidden md:block text-slate-400 text-sm font-medium">
            Question {currentQuestionIndex + 1} of {initialQuestions.length}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Answered</div>
            <div className="text-sm font-bold">{answeredCount} / {initialQuestions.length}</div>
          </div>
          <Button 
            onClick={() => handleSubmit()} 
            disabled={isSubmitting || answeredCount < initialQuestions.length * 0.5} 
            className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-6"
          >
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
           <Progress value={progress} className="h-1.5 bg-white/5" />
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="p-8 pb-4">
             <CardTitle className="text-2xl font-bold leading-tight">
               {currentQuestion.question}
             </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion.id, option)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                  answers[currentQuestion.id] === option
                    ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${
                  answers[currentQuestion.id] === option ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-8">
           <Button 
             variant="ghost" 
             onClick={() => setCurrentQuestionIndex(i => i - 1)} 
             disabled={currentQuestionIndex === 0}
             className="rounded-full text-slate-400 hover:text-white"
           >
             <ChevronLeft className="mr-2 h-5 w-5" /> Previous
           </Button>
           
           <div className="flex gap-2">
             {currentQuestionIndex < initialQuestions.length - 1 ? (
               <Button 
                 onClick={() => setCurrentQuestionIndex(i => i + 1)} 
                 className="rounded-full bg-white text-slate-950 hover:bg-slate-200 px-8"
               >
                 Next <ChevronRight className="ml-2 h-5 w-5" />
               </Button>
             ) : (
               <Button 
                 onClick={() => handleSubmit()} 
                 disabled={isSubmitting}
                 className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-8"
               >
                 Finish & Submit
               </Button>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
