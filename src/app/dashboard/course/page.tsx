import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, BookOpen, ChevronRight } from "lucide-react"

export default async function CourseDashboard() {
    const session = await auth()
    if (!session?.user) redirect("/api/auth/signin?callbackUrl=/dashboard/course")

    const userId = session.user.id!

    // Get all courses with modules and lessons
    const courses = await CourseService.getFullCourseStructure()

    // Get user progress
    const progress = await CourseService.getUserProgress(userId)
    const completedLessonIds = new Set(progress.filter(p => p.completed).map((p) => p.lessonId))

    if (courses.length === 0) {
        return (
            <div className="py-16 container mx-auto px-4 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Course coming soon</h1>
                <p className="text-muted-foreground">No course content has been added yet. Check back soon!</p>
            </div>
        )
    }

    const course = courses[0]
    const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0)
    const completed = completedLessonIds.size
    const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

    return (
        <div className="py-10 md:py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm mb-2">
                        <span className="text-muted-foreground">{completed}/{totalLessons} lessons completed</span>
                        <span className="font-semibold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-3" />
                </div>

                <div className="space-y-6">
                    {course.modules.map((mod) => {
                        const modCompleted = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length
                        const modPct = mod.lessons.length > 0 ? Math.round((modCompleted / mod.lessons.length) * 100) : 0
                        return (
                            <Card key={mod.id} className="border-0 shadow-md">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b bg-muted/30 flex items-center justify-between">
                                        <div>
                                            <h2 className="font-bold">{mod.title}</h2>
                                            <p className="text-sm text-muted-foreground">{modCompleted}/{mod.lessons.length} completed</p>
                                        </div>
                                        <Badge variant={modPct === 100 ? "success" : "secondary"}>
                                            {modPct === 100 ? "Done" : `${modPct}%`}
                                        </Badge>
                                    </div>
                                    <div className="divide-y">
                                        {mod.lessons.map((lesson) => {
                                            const done = completedLessonIds.has(lesson.id)
                                            return (
                                                <Link key={lesson.id} href={`/dashboard/lesson/${lesson.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors group">
                                                    {done
                                                        ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                                        : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                                                    }
                                                    <span className={`flex-1 text-sm ${done ? "text-muted-foreground line-through" : ""}`}>{lesson.title}</span>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-8 text-center">
                    <Button asChild variant="outline">
                        <Link href="/dashboard">← Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
