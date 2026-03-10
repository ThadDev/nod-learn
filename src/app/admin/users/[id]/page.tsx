import { AdminService } from "@/services/AdminService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Mail,
    MapPin,
    Calendar,
    ArrowLeft,
    BookOpen,
    Award,
    CheckCircle2,
    Clock,
    UserIcon
} from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth.node"

export const dynamic = "force-dynamic"

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const user = await AdminService.getUserById(id)

    if (!user) {
        notFound()
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <Link href="/admin/users" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to User Management
            </Link>

            {/* Profile Header Block */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-card p-8 rounded-2xl border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-lg">
                    <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                        {user.name?.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                        <Badge className="font-bold">{user.role}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {user.country || "Location unknown"}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Reset Password</Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10" disabled>Deactivate</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Course Progress Section */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <CardTitle>Lesson Progress</CardTitle>
                        </div>
                        <CardDescription>Courses and lessons completed by the student.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.progress.length === 0 ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-muted-foreground italic">No progress recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {user.progress.slice(0, 10).map((prog) => (
                                    <div key={prog.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-sm font-medium">{prog.lesson.title}</span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                            {new Date(prog.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                                {user.progress.length > 10 && (
                                    <p className="text-xs text-center text-muted-foreground italic pt-2">
                                        + {user.progress.length - 10} more completed lessons
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Certificates Section */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            <CardTitle>Earned Certificates</CardTitle>
                        </div>
                        <CardDescription>Valid certificates issued for course completion.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.certificates.length === 0 ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                                <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                                <p className="text-sm text-muted-foreground italic">No certificates earned yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {user.certificates.map((cert) => (
                                    <Link
                                        key={cert.id}
                                        href={`/certificate/${cert.id}`}
                                        className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 hover:shadow-md transition-shadow group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400 font-bold group-hover:scale-110 transition-transform">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold">{cert.course.title}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono">{cert.certificateCode}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-amber-400" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
