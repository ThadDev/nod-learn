import { NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { ExamService } from "@/lib/exam/examService"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the global certification exam
    const exam = await ExamService.getGlobalExam()
    if (!exam) {
      return NextResponse.json({ error: "Global certification exam not found" }, { status: 404 })
    }

    // 3. Start attempt (Validate attempts < 3)
    try {
      const attempt = await ExamService.startAttempt(session.user.id, exam.id)
      return NextResponse.json({ attemptId: attempt.id })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
  } catch (error) {
    console.error("Error starting exam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
