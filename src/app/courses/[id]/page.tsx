import { auth } from "@/auth.node"
import { redirect, notFound } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle2, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CompletionButton } from "@/components/courses/CompletionButton"

export const dynamic = "force-dynamic"

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const session = await auth()
    if (!session?.user) redirect("/signin?callbackUrl=/courses")

    const courses = await CourseService.getCoursesWithUserProgress(session.user.id)
    const course = courses.find((c) => c.id === id)

    if (!course) return notFound()

    // Security Check: Redirect if course is locked
    if (!course.isUnlocked) {
        redirect("/courses?error=locked")
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header/NavBar Area */}
            <div className="border-b bg-muted/20 backdrop-blur sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm" className="gap-2">
                            <Link href="/courses">
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <div className="hidden md:block h-6 w-[1px] bg-border" />
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">
                                {course.title}
                            </h1>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                                Module {course.moduleNumber}
                            </span>
                        </div>
                    </div>

                    {course.isCompleted ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1.5 px-3 py-1 scale-110">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                        </Badge>
                    ) : (
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Reading PDF
                        </div>
                    )}
                </div>
            </div>

            {/* Main Course Content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid gap-8">
                    {/* PDF Viewer */}
                    <Card className="border shadow-lg bg-background h-[75vh] min-h-[500px] overflow-hidden flex flex-col">
                        <div className="bg-muted/5 p-2 border-b flex items-center justify-between text-xs text-muted-foreground">
                            <span>Interactive PDF Viewer</span>
                            <span className="italic">Pro-Tip: Use full-screen for better focus</span>
                        </div>
                        <div className="flex-1 bg-muted/10 relative">
                            {course.fileUrl ? (
                                <iframe
                                    src={`${course.fileUrl}#toolbar=0`}
                                    className="w-full h-full border-none"
                                    title={course.title}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                                    <p className="text-muted-foreground">No document found for this module.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Completion Action */}
                    <div className="flex flex-col items-center justify-center p-10 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/30">
                        <div className="text-center max-w-md mx-auto space-y-4">
                            <h2 className="text-2xl font-bold">Finished Reading?</h2>
                            <p className="text-muted-foreground">
                                Click the button below to mark this module as completed and unlock the next part of your journey.
                            </p>

                            <CompletionButton
                                courseId={course.id}
                                isCompleted={course.isCompleted}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
            {children}
        </span>
    )
}

function Card({ children, className }: any) {
    return (
        <div className={`rounded-xl bg-card text-card-foreground shadow ${className}`}>
            {children}
        </div>
    )
}
