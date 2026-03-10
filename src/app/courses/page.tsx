import { auth } from "@/auth.node"
import { redirect } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, CheckCircle2, PlayCircle, BookOpen } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Course {
    id: string;
    moduleNumber: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

export default async function CoursesPage() {
    const session = await auth()
    if (!session?.user) redirect("/signin?callbackUrl=/courses")

    const courses: Course[] = await CourseService.getCoursesWithUserProgress(session.user.id)

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Your Learning Journey</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Master financial literacy step-by-step. Complete each module to unlock the next level of your education.
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-background rounded-xl border border-dashed">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No courses available yet</h2>
                        <p className="text-muted-foreground">Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course: any) => (
                            <Card
                                key={course.id}
                                className={`relative overflow-hidden border-2 transition-all duration-300 ${!course.isUnlocked
                                    ? "opacity-75 grayscale bg-muted/50 border-transparent cursor-not-allowed"
                                    : "hover:shadow-xl hover:border-primary/40 bg-background border-border"
                                    }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="font-semibold uppercase tracking-wider text-[10px]">
                                            Module {course.moduleNumber}
                                        </Badge>
                                        {course.isCompleted && (
                                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Completed
                                            </Badge>
                                        )}
                                        {!course.isUnlocked && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Lock className="h-3 w-3" />
                                                Locked
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl line-clamp-2 min-h-[3.5rem] leading-tight">
                                        {course.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    {!course.isUnlocked && (
                                        <div className="bg-muted/80 p-3 rounded-lg flex items-start gap-3 mt-2 border">
                                            <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <p className="text-xs text-muted-foreground leading-normal">
                                                Complete previous module to unlock this course content.
                                            </p>
                                        </div>
                                    )}
                                    {course.isUnlocked && !course.isCompleted && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Ready to start? Dive into the PDF materials and level up your knowledge.
                                        </p>
                                    )}
                                    {course.isCompleted && (
                                        <p className="text-sm text-emerald-600/80 mt-2 font-medium">
                                            Well done! You've successfully finished this module.
                                        </p>
                                    )}
                                </CardContent>

                                <CardFooter className="pt-2">
                                    <Button
                                        asChild
                                        className="w-full font-bold transition-all"
                                        variant={course.isUnlocked ? "default" : "secondary"}
                                        disabled={!course.isUnlocked}
                                    >
                                        {course.isUnlocked ? (
                                            <Link href={`/courses/${course.id}`} className="flex items-center justify-center gap-2">
                                                <PlayCircle className="h-4 w-4" />
                                                {course.isCompleted ? "Review Course" : "Start Course"}
                                            </Link>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                Locked
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
