import { NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { CourseService } from "@/services/CourseService"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { courseId } = await req.json()
        if (!courseId) {
            return NextResponse.json({ error: "Missing Course ID" }, { status: 400 })
        }

        await CourseService.markCourseComplete(session.user.id, courseId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update progress:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
