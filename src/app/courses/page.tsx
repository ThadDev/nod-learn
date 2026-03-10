import { auth } from "@/auth.node"
import { redirect } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { CourseList } from "@/components/courses/CourseList"

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
            </div>
        </div>
    )
}
