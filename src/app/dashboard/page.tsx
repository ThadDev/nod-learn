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
import { BookOpen, Award, TrendingUp, ChevronRight } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/api/auth/signin?callbackUrl=/dashboard")

    const user = session.user

    const progress = await CourseService.getUserProgress(user.id!)
    const certificates = await CertificateService.getUserCertificates(user.id!)

    const completedLessons = progress.filter((p) => p.completed).length
    const totalLessons = await CourseService.getTotalLessonCount()

    const progressPct =
        totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-background to-blue-50 dark:from-indigo-950/30 dark:via-background dark:to-background py-14">
            <div className="container max-w-7xl mx-auto px-6">

                {/* Header */}

                <div className="flex items-center justify-between mb-14">

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Welcome back, {user.name?.split(" ")[0] ?? "Student"} 👋
                        </h1>

                        <p className="text-muted-foreground mt-1">
                            Continue building your financial intelligence.
                        </p>
                    </div>

                    <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 px-3 py-1">
                        Lifelong Learning
                    </Badge>

                </div>


                {/* Stats */}

                <div className="grid gap-6 md:grid-cols-3 mb-12">


                    {/* Lessons */}

                    <Card className="border border-blue-200/40 bg-gradient-to-b from-blue-50/70 to-white dark:from-blue-900/10 backdrop-blur">

                        <CardContent className="flex items-center gap-5 p-6">

                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lessons Completed
                                </p>

                                <p className="text-2xl font-semibold">
                                    {completedLessons} / {totalLessons}
                                </p>
                            </div>

                        </CardContent>
                    </Card>


                    {/* Progress */}

                    <Card className="border border-emerald-200/40 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-900/10 backdrop-blur">

                        <CardContent className="flex items-center gap-5 p-6">

                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Course Progress
                                </p>

                                <p className="text-2xl font-semibold">
                                    {progressPct}%
                                </p>
                            </div>

                        </CardContent>
                    </Card>


                    {/* Certificates */}

                    <Card className="border border-yellow-200/40 bg-gradient-to-b from-yellow-50/70 to-white dark:from-yellow-900/10 backdrop-blur">

                        <CardContent className="flex items-center gap-5 p-6">

                            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                                <Award className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Certificates Earned
                                </p>

                                <p className="text-2xl font-semibold">
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

                        <Card className="border border-indigo-200/40 overflow-hidden">

                            <div className="bg-gradient-to-r from-indigo-500/10 via-indigo-400/5 to-transparent p-6 border-b">

                                <h2 className="text-xl font-semibold">
                                    Financial Literacy Fundamentals
                                </h2>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Master the core principles of money, investing, and wealth.
                                </p>

                            </div>

                            <CardContent className="p-6 space-y-6">

                                <div>

                                    <div className="flex justify-between text-sm mb-2">

                                        <span className="text-muted-foreground">
                                            Overall progress
                                        </span>

                                        <span className="font-medium">
                                            {progressPct}%
                                        </span>

                                    </div>

                                    <Progress value={progressPct} />

                                </div>

                                <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">

                                    <Link href="/courses">

                                        {completedLessons === 0
                                            ? "Start Course"
                                            : "Continue Learning"}

                                        <ChevronRight className="h-4 w-4" />

                                    </Link>

                                </Button>

                            </CardContent>

                        </Card>


                        {/* Activity */}

                        <Card className="border border-border/60 bg-background/80 backdrop-blur">

                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                {progress.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        No lessons completed yet.
                                    </p>
                                ) : (
                                    progress.slice(0, 5).map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/40 transition"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="h-2 w-2 rounded-full bg-indigo-500" />

                                                <span className="text-sm">
                                                    {p.lesson.title}
                                                </span>

                                            </div>

                                            <Badge variant={p.completed ? "default" : "secondary"}>
                                                {p.completed ? "Completed" : "In Progress"}
                                            </Badge>

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