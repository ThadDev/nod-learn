import { AdminService } from "@/services/AdminService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail, MapPin, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth.node"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const users = await AdminService.getAllUsers()

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1 text-lg italic">Oversee all registered students and their access.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center gap-2 border border-primary/20">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">{users.length} Total Users</span>
                </div>
            </div>

            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>All Registered Users</CardTitle>
                    <CardDescription>Click on a user to view their detailed progress and certificates.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-y">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-sm">User</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Location</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Role</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-sm"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-primary/10">
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                        {user.name?.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {user.name}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3.5 h-3.5" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {user.country || "Not specified"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="font-bold px-2 py-0">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
