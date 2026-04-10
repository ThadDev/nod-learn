import { NextResponse } from "next/server"
import { CertificateService } from "@/services/CertificateService"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Certificate code is required" }, { status: 400 })
    }

    const verification = await CertificateService.verifyCertificate(code)

    if (!verification) {
      return NextResponse.json({ isValid: false }, { status: 404 })
    }

    return NextResponse.json(verification)
  } catch (error) {
    console.error("Error verifying certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
