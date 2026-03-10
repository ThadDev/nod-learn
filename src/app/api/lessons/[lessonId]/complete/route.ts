import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { LessonService } from "@/services/LessonService"
import { NextResponse } from "next/server"

export async function POST(_: Request, props: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = await props.params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = session.user.id!

    await LessonService.markComplete(userId, lessonId)

    return NextResponse.json({ success: true })
}
