import { auth } from "@/auth.node"
import { redirect } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { CourseList } from "@/components/courses/CourseList"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
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
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-20 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        Your Learning <span className="text-blue-500">Journey</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                        Master financial literacy step-by-step. Our curated curriculum is designed to transform you from a beginner to a market expert.
                    </p>
                </div>

                <CourseList courses={courses} />

                {/* Global Exam Action */}
                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex p-4 bg-blue-600/20 rounded-3xl border border-blue-500/30 mb-2">
                            <GraduationCap className="h-10 w-10 text-blue-400" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                            Final Certification
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Once you have mastered every module in the curriculum, you can attempt the final accreditation exam to earn your official certificate.
                        </p>
                        
                        <div className="pt-4 flex justify-center">
                            {courses.every(c => c.isCompleted) ? (
                                <Link href="/exams">
                                    <Button size="lg" className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-105">
                                        Start Certification Exam
                                    </Button>
                                </Link>
                            ) : (
                                <div className="space-y-4">
                                    <Button disabled size="lg" className="h-16 px-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 font-black text-xl opacity-50 cursor-not-allowed">
                                        Exam Locked
                                    </Button>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        Complete all {courses.length} modules to unlock
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
