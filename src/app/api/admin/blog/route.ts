import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { BlogService } from "@/services/BlogService"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(1),
    coverImage: z.string().optional(),
})

export async function GET() {
    const posts = await BlogService.getPublishedPosts()
    return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const post = await BlogService.createPost({
        ...parsed.data,
        authorId: session.user.id!,
    })

    return NextResponse.json({ post }, { status: 201 })
}
