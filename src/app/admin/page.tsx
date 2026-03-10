import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AdminService } from "@/services/AdminService"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Users, BookOpen, Award, FileText, Plus, Pencil, Trash2 } from "lucide-react"
import { LogoutButton } from "@/components/layout/LogoutButton"

export default async function AdminDashboard() {

    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

    const [metrics, recentUsers, posts] = await Promise.all([
        AdminService.getPlatformMetrics(),
        AdminService.getRecentUsers(),
        AdminService.getRecentPosts(),
    ])

    const { users: userCount, certificates: certCount, blogs: blogCount, courses: courseCount } = metrics

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-background to-background dark:from-indigo-950/30">

            <div className="container max-w-7xl mx-auto px-6 py-12">

                {/* Header */}

                <div className="flex items-center justify-between mb-12">

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Admin Dashboard
                        </h1>

                        <p className="text-muted-foreground mt-1">
                            Manage the Nodlearn learning platform
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <LogoutButton variant="ghost" className="bg-white/5 hover:bg-white/10" />
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1 text-xs">
                            ADMIN
                        </Badge>
                    </div>

                </div>


                {/* Analytics */}

                <div className="grid gap-6 md:grid-cols-4 mb-12">

                    {[
                        {
                            icon: Users,
                            label: "Users",
                            value: userCount,
                            color: "from-blue-500/15 to-blue-500/5",
                            iconColor: "text-blue-600",
                            href: "/admin/users"
                        },
                        {
                            icon: BookOpen,
                            label: "Courses",
                            value: courseCount,
                            color: "from-emerald-500/15 to-emerald-500/5",
                            iconColor: "text-emerald-600",
                            href: "/admin/courses"
                        },
                        {
                            icon: Award,
                            label: "Certificates",
                            value: certCount,
                            color: "from-yellow-500/15 to-yellow-500/5",
                            iconColor: "text-yellow-600",
                            href: "/admin/users"
                        },
                        {
                            icon: FileText,
                            label: "Blog Posts",
                            value: blogCount,
                            color: "from-violet-500/15 to-violet-500/5",
                            iconColor: "text-violet-600",
                            href: "/admin/blog"
                        }
                    ].map((card) => (

                        <Link key={card.label} href={card.href}>

                            <Card className={`border border-border/60 bg-gradient-to-b ${card.color} backdrop-blur hover:shadow-xl transition-all cursor-pointer`}>

                                <CardContent className="p-6 flex items-center gap-5">

                                    <div className="h-12 w-12 rounded-lg border bg-background flex items-center justify-center">

                                        <card.icon className={`h-5 w-5 ${card.iconColor}`} />

                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {card.label}
                                        </p>

                                        <p className="text-2xl font-semibold">
                                            {card.value}
                                        </p>
                                    </div>

                                </CardContent>

                            </Card>

                        </Link>

                    ))}

                </div>


                {/* Content grid */}

                <div className="grid gap-8 lg:grid-cols-2">


                    {/* Users */}

                    <Card className="border border-border/60 bg-background/80 backdrop-blur">

                        <CardHeader className="flex flex-row items-center justify-between">

                            <CardTitle>
                                Recent Users
                            </CardTitle>

                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin/users">
                                    Manage Users
                                </Link>
                            </Button>

                        </CardHeader>

                        <CardContent className="p-0">

                            <div className="divide-y">

                                {recentUsers.map((u) => (

                                    <Link
                                        key={u.id}
                                        href={`/admin/users/${u.id}`}
                                        className="flex items-center gap-3 px-6 py-4 hover:bg-muted/40 transition"
                                    >

                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">

                                            {u.name?.[0] ?? "?"}

                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <p className="font-medium truncate">
                                                {u.name}
                                            </p>

                                            <p className="text-xs text-muted-foreground truncate">
                                                {u.email}
                                            </p>

                                        </div>

                                        <Badge
                                            variant={u.role === "ADMIN" ? "default" : "secondary"}
                                            className="text-[10px]"
                                        >
                                            {u.role}
                                        </Badge>

                                    </Link>

                                ))}

                            </div>

                        </CardContent>

                    </Card>


                    {/* Blog management */}

                    <Card className="border border-border/60 bg-background/80 backdrop-blur">

                        <CardHeader className="flex flex-row items-center justify-between">

                            <CardTitle>
                                Blog Posts
                            </CardTitle>

                            <Button asChild size="sm">
                                <Link href="/admin/blog/new">
                                    <Plus className="h-4 w-4 mr-1" />
                                    New Post
                                </Link>
                            </Button>

                        </CardHeader>


                        <CardContent className="p-0">

                            {posts.length === 0 ? (

                                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                                    No blog posts yet
                                </div>

                            ) : (

                                <div className="divide-y">

                                    {posts.map((post) => (

                                        <div
                                            key={post.id}
                                            className="flex items-center gap-3 px-6 py-4 hover:bg-muted/40 transition"
                                        >

                                            <div className="flex-1">

                                                <p className="font-medium truncate">
                                                    {post.title}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    by {post.author.name} · {post.publishedAt ? "Published" : "Draft"}
                                                </p>

                                            </div>

                                            <div className="flex gap-2">

                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-indigo-500/10 hover:text-indigo-600"
                                                >
                                                    <Link href={`/admin/blog/${post.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-red-500/10 text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    )
}