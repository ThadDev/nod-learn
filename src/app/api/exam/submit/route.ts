import { NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { ExamService } from "@/lib/exam/examService"
import { CertificateService } from "@/services/CertificateService"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { attemptId, answers } = await req.json()
    if (!attemptId || !answers) {
      return NextResponse.json({ error: "Attempt ID and answers are required" }, { status: 400 })
    }

    // 1. Grade the exam
    const result = await ExamService.submitAttempt(attemptId, answers)

    // 2. If passed, generate certificate
    if (result.passed) {
      try {
        // Updated to use the new issueCertificate signature
        await CertificateService.issueCertificate(session.user.id, result.examId, attemptId, true)
      } catch (certError) {
        console.error("Error generating certificate on submit:", certError)
        // We don't fail the whole request if certificate generation fails, 
        // the user can still trigger it from the dashboard later.
      }
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error submitting exam:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
