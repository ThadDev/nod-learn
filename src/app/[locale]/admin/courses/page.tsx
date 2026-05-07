"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Trash2, Plus, FileText, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Course {
    id: string
    title: string
    moduleNumber: number
    fileUrl: string
    order: number
}

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form states
    const [title, setTitle] = useState("")
    const [moduleNumber, setModuleNumber] = useState("")
    const [order, setOrder] = useState("")
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/admin/courses")
            if (res.ok) {
                const data = await res.json()
                setCourses(data)
            }
        } catch (error) {
            toast.error("Failed to fetch courses")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            toast.error("Please select a PDF file")
            return
        }

        setSubmitting(true)
        const formData = new FormData()
        formData.append("title", title)
        formData.append("moduleNumber", moduleNumber)
        formData.append("order", order)
        formData.append("file", file)

        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                toast.success("Course uploaded successfully")
                setTitle("")
                setModuleNumber("")
                setOrder("")
                setFile(null)
                // Reset file input
                const fileInput = document.getElementById("file-upload") as HTMLInputElement
                if (fileInput) fileInput.value = ""
                fetchCourses()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to upload course")
            }
        } catch (error) {
            toast.error("An error occurred during upload")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return

        try {
            const res = await fetch(`/api/admin/courses?id=${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success("Course deleted")
                fetchCourses()
            } else {
                toast.error("Failed to delete course")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Course Management</h1>
                    <p className="text-muted-foreground">Upload and manage sequential modules</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Upload Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Upload New Module
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="space-y-2 col-span-1">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Intro to Finance"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="module">Module #</Label>
                                <Input
                                    id="module"
                                    type="number"
                                    placeholder="1"
                                    value={moduleNumber}
                                    onChange={(e) => setModuleNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order (1-5)</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="1"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">PDF File</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                    className="cursor-pointer"
                                />
                            </div>
                            <div className="md:col-span-4 flex justify-end">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Save Course"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Course List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                No courses uploaded yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">Order</th>
                                            <th className="px-4 py-3 text-left font-medium">Module #</th>
                                            <th className="px-4 py-3 text-left font-medium">Title</th>
                                            <th className="px-4 py-3 text-left font-medium">File</th>
                                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {courses.map((course) => (
                                            <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{course.order}</td>
                                                <td className="px-4 py-3 text-muted-foreground">Module {course.moduleNumber}</td>
                                                <td className="px-4 py-3 font-semibold">{course.title}</td>
                                                <td className="px-4 py-3">
                                                    <a
                                                        href={course.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        PDF
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(course.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
