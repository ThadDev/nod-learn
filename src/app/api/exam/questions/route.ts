import { NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { ExamService } from "@/lib/exam/examService"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const attemptId = searchParams.get("attemptId")

    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 })
    }

    // Verify the attempt belongs to the user and is not submitted
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: true },
    })

    if (!attempt || attempt.userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid attempt" }, { status: 403 })
    }

    if (attempt.submittedAt) {
      return NextResponse.json({ error: "Attempt already submitted" }, { status: 403 })
    }

    const questions = await ExamService.getQuestionsForExam(attempt.examId)

    return NextResponse.json({
      questions,
      duration: attempt.exam.duration,
      startedAt: attempt.startedAt,
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
