import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { LessonService } from "@/services/LessonService"
import { NextResponse } from "next/server"

export async function GET(_: Request, props: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = await props.params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const lesson = await LessonService.getLessonById(lessonId)
    if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const completed = await LessonService.isLessonCompleted(session.user.id!, lessonId)

    return NextResponse.json({ lesson, completed })
}
