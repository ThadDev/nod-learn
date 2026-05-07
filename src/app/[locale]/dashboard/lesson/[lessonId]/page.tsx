"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Lesson {
    id: string; title: string; content: string | null; videoUrl: string | null;
    module: { title: string; course: { title: string; id: string } };
}

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [marking, setMarking] = useState(false)

    useEffect(() => {
        fetch(`/api/lessons/${params.lessonId}`)
            .then((r) => r.json())
            .then((data) => { setLesson(data.lesson); setCompleted(data.completed); setLoading(false) })
            .catch(() => setLoading(false))
    }, [params.lessonId])

    const markComplete = async () => {
        setMarking(true)
        await fetch(`/api/lessons/${params.lessonId}/complete`, { method: "POST" })
        setCompleted(true)
        setMarking(false)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    )

    if (!lesson) return (
        <div className="min-h-screen flex items-center justify-center text-center">
            <div>
                <h2 className="text-xl font-bold mb-2">Lesson not found</h2>
                <Button variant="outline" onClick={() => router.push("/dashboard/course")}>Back to Course</Button>
            </div>
        </div>
    )

    return (
        <div className="py-10 md:py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto hover:bg-transparent" onClick={() => router.push("/dashboard/course")}>
                        <ChevronLeft className="h-4 w-4" /> {lesson.module.course.title}
                    </Button>
                    <span>/</span>
                    <span>{lesson.module.title}</span>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold md:text-3xl">{lesson.title}</h1>
                        {completed && <Badge variant="success" className="shrink-0">Completed ✓</Badge>}
                    </div>

                    {/* Video Player */}
                    {lesson.videoUrl && (
                        <div className="mb-8 aspect-video rounded-xl overflow-hidden bg-slate-900 relative">
                            <iframe
                                src={lesson.videoUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {!lesson.videoUrl && (
                        <div className="mb-8 aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <PlayCircle className="h-16 w-16 text-primary/40" />
                        </div>
                    )}

                    {/* Lesson Content */}
                    {lesson.content && (
                        <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                            {lesson.content.split("\n").map((line, i) => {
                                if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace("## ", "")}</h2>
                                if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold mt-5 mb-2">{line.replace("### ", "")}</h3>
                                if (line.startsWith("- ")) return <li key={i} className="mb-1 ml-5 list-disc text-muted-foreground">{line.replace("- ", "")}</li>
                                if (line.trim() === "") return <br key={i} />
                                return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{line}</p>
                            })}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 border-t pt-6">
                        <Button
                            onClick={markComplete}
                            disabled={completed || marking}
                            className="gap-2"
                            size="lg"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            {completed ? "Lesson Completed" : marking ? "Saving..." : "Mark as Complete"}
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => router.push("/dashboard/course")}>
                            Back to Course
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
