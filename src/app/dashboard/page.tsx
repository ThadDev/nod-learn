import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { CourseService } from "@/services/CourseService"
import { CertificateService } from "@/services/CertificateService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Award, TrendingUp, ChevronRight, Home } from "lucide-react"
import { LogoutButton } from "@/components/layout/LogoutButton"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/api/auth/signin?callbackUrl=/dashboard")

    const user = session.user

    const courseProgress = await CourseService.getUserCourseProgress(user.id!)
    const certificates = await CertificateService.getUserCertificates(user.id!)
    const totalCourses = await CourseService.getCourseCount()

    const completedCourses = courseProgress.filter((p) => p.completed).length

    const progressPct =
        totalCourses > 0
            ? Math.round((completedCourses / totalCourses) * 100)
            : 0

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white py-14 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.03),transparent_50%)] pointer-events-none" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">

                {/* Dashboard Nav */}
                <div className="flex items-center justify-between mb-8 py-3 px-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        <Home className="h-4 w-4 text-blue-400" />
                        <span>Back to Home</span>
                    </Link>
                    <LogoutButton variant="ghost" className="text-slate-400 hover:text-white" />
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-14 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Welcome back, {user.name?.split(" ")[0] ?? "Student"} 👋
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Track your evolution toward financial mastery.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm font-bold uppercase tracking-widest">
                        <TrendingUp className="h-4 w-4" />
                        Active Trader Tier
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    {/* Modules */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-300">
                        <CardContent className="flex items-center gap-5 p-6">
                            <div className="h-14 w-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Modules Completed
                                </p>
                                <p className="text-3xl font-black mt-1">
                                    {completedCourses} / {totalCourses}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-300">
                        <CardContent className="flex items-center gap-5 p-6">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Overall Progress
                                </p>
                                <p className="text-3xl font-black mt-1">
                                    {progressPct}%
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificates */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl group hover:border-yellow-500/30 transition-all duration-300">
                        <CardContent className="flex items-center gap-5 p-6">
                            <div className="h-14 w-14 rounded-2xl bg-yellow-600/20 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Certificates
                                </p>
                                <p className="text-3xl font-black mt-1">
                                    {certificates.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Layout */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Card */}
                        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-sm overflow-hidden rounded-[2rem] hover:border-blue-500/20 transition-all">
                            <div className="bg-gradient-to-br from-blue-600/20 via-transparent to-transparent p-8 border-b border-white/5">
                                <h2 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    Financial Literacy Curriculum
                                </h2>
                                <p className="text-slate-400 mt-2">
                                    Master the professional mechanics of wealth and market dynamics.
                                </p>
                            </div>

                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-3">
                                        <span className="text-slate-500 uppercase tracking-widest">
                                            Curriculum Mastery
                                        </span>
                                        <span className="text-blue-400">
                                            {progressPct}% Complete
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000"
                                            style={{ width: `${progressPct}%` }}
                                        />
                                    </div>
                                </div>

                                <Button asChild size="lg" className="w-full sm:w-auto h-14 rounded-2xl px-8 font-black bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 gap-2">
                                    <Link href="/courses">
                                        {completedCourses === 0 ? "Begin Your Journey" : "Continue Evolution"}
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Modules */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl rounded-[2rem]">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">Recent Milestones</CardTitle>
                            </CardHeader>

                            <CardContent className="p-8 pt-0 space-y-4">
                                {courseProgress.length === 0 ? (
                                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <p className="text-slate-500 italic">No modules completed yet. Start your first lesson!</p>
                                    </div>
                                ) : (
                                    courseProgress.slice(0, 5).map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between border border-white/5 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-3 w-3 rounded-full ${p.completed ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-blue-500 animate-pulse"}`} />
                                                <span className="font-bold text-slate-300 group-hover:text-white transition-colors">
                                                    {p.course.title}
                                                </span>
                                            </div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.completed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                                                {p.completed ? "Completed" : "In Progress"}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>


                    {/* Sidebar */}

                    <div className="space-y-8">


                        {/* Certificate */}

                        <Card className="border border-yellow-200/40 bg-gradient-to-b from-yellow-50/60 to-background dark:from-yellow-900/10">

                            <CardContent className="p-6 text-center space-y-4">

                                <div className="h-14 w-14 mx-auto rounded-xl bg-yellow-500/10 flex items-center justify-center">

                                    <Award className="h-6 w-6 text-yellow-500" />

                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Your Certificate
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Complete the course to unlock it.
                                    </p>

                                </div>

                                {certificates.length > 0 ? (
                                    <Button asChild size="sm" variant="outline">

                                        <Link href={`/certificate/${certificates[0].id}`}>
                                            View Certificate
                                        </Link>

                                    </Button>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        {progressPct}% completed
                                    </div>
                                )}

                            </CardContent>
                        </Card>


                        {/* Quick Links */}

                        <Card className="border border-border/60 bg-background/80 backdrop-blur">

                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick Links
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-1">

                                {[
                                    { href: "/courses", label: "View Course" },
                                    { href: "/blog", label: "Read Blog" },
                                    { href: "/faq", label: "FAQ" },
                                    { href: "/contact", label: "Support" },
                                ].map((l) => (

                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className="flex items-center justify-between p-2 text-sm rounded-md hover:bg-muted transition"
                                    >

                                        {l.label}

                                        <ChevronRight className="h-4 w-4" />

                                    </Link>

                                ))}

                            </CardContent>

                        </Card>

                    </div>

                </div>

            </div>
        </div>
    )
}