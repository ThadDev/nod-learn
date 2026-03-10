"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function NewBlogPostPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ title: "", slug: "", content: "", coverImage: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        await fetch("/api/admin/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        router.push("/admin")
    }

    const generateSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    return (
        <div className="py-10 md:py-16 bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Admin</Link>
                    </Button>
                    <h1 className="text-2xl font-bold">New Blog Post</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 bg-card border rounded-2xl p-8 shadow-sm">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Title *</label>
                        <Input
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                            placeholder="Enter post title"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Slug</label>
                        <Input
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="url-friendly-slug"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Cover Image URL</label>
                        <Input
                            value={form.coverImage}
                            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Content (Markdown) *</label>
                        <textarea
                            required
                            rows={12}
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="## Introduction&#10;&#10;Write your content in Markdown..."
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y font-mono"
                        />
                    </div>
                    <Button type="submit" size="lg" disabled={saving} className="w-full gap-2">
                        <Save className="h-4 w-4" /> {saving ? "Publishing..." : "Publish Post"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
