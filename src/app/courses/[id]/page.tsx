import { auth } from "@/auth.node"
import { redirect, notFound } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle2, FileText, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { CompletionButton } from "@/components/courses/CompletionButton"

export const dynamic = "force-dynamic"

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const session = await auth()
    if (!session?.user) redirect("/signin?callbackUrl=/courses")

    const courses = await CourseService.getCoursesWithUserProgress(session.user.id)
    const course = courses.find((c: any) => c.id === id)

    if (!course) return notFound()

    if (!course.isUnlocked) {
        redirect("/courses?error=locked")
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_50%)] pointer-events-none" />

            {/* Header/NavBar Area */}
            <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-white/5">
                            <Link href="/courses">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back to Curriculum</span>
                            </Link>
                        </Button>
                        <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold truncate max-w-[180px] md:max-w-md bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-blue-400" />
                                <span className="text-[10px] text-blue-400 uppercase font-black tracking-[0.2em]">
                                    Module {course.moduleNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {course.isCompleted ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="hidden xs:inline">Completed</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <span className="hidden xs:inline">Studying Material</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Course Content */}
            <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl relative z-10">
                <div className="grid gap-10">
                    {/* PDF Viewer */}
                    <Card className="group relative border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-sm h-[80vh] min-h-[600px] overflow-hidden flex flex-col rounded-3xl transition-all hover:border-blue-500/30">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Study Hub</span>
                            </div>
                            <span className="text-[10px] text-slate-500 italic hidden sm:block">Recommended: Professional Focus Mode</span>
                        </div>
                        <div className="flex-1 bg-slate-950/30 relative">
                            {course.fileUrl ? (
                                <iframe
                                    src={`${course.fileUrl}#toolbar=0`}
                                    className="w-full h-full border-none invert-[0.05] grayscale-[0.1]"
                                    title={course.title}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-6">
                                        <AlertCircle className="h-12 w-12 text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Resource Unavailable</h3>
                                    <p className="text-slate-500 max-w-sm">
                                        The study material for this module is currently being updated. Please check back shortly.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Completion Action */}
                    <div className="relative group overflow-hidden p-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[2.5rem] transition-all hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.2)]">
                        <div className="flex flex-col items-center justify-center p-12 bg-[#0B0F19] rounded-[2.3rem] border border-white/10">
                            <div className="text-center max-w-lg mx-auto space-y-6">
                                <div className="inline-flex p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 mb-2">
                                    <CheckCircle2 className="h-8 w-8 text-blue-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                                    Module Mastery
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Have you absorbed the core concepts of this lesson?
                                    Register your progress to unlock the next Tier of your education.
                                </p>

                                <div className="pt-4 flex justify-center">
                                    <CompletionButton
                                        courseId={course.id}
                                        isCompleted={course.isCompleted}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Card({ children, className }: any) {
    return (
        <div className={`rounded-xl overflow-hidden ${className}`}>
            {children}
        </div>
    )
}
