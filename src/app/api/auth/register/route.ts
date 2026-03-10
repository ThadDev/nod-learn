import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { EmailService } from "@/services/EmailService"

export async function POST(req: Request) {
    console.log("REGISTRATION_START: Attempting to parse request body")
    try {
        const body = await req.json()
        console.log("REGISTRATION_BODY_RECEIVED:", { ...body, password: "[REDACTED]" })

        const { fullName, email, password, agreeToTerms } = body

        if (!fullName || !email || !password || !agreeToTerms) {
            console.log("REGISTRATION_VALIDATION_FAILED: Missing fields")
            return NextResponse.json(
                { message: "All fields are required and you must agree to terms." },
                { status: 400 }
            )
        }

        console.log("REGISTRATION_PRISMA_CHECK: Looking for existing user", email)
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.log("REGISTRATION_USER_EXISTS:", email)
            return NextResponse.json(
                { message: "A user with this email already exists." },
                { status: 400 }
            )
        }

        console.log("REGISTRATION_HASHING_PASSWORD")
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        console.log("REGISTRATION_PRISMA_CREATE: Creating user record")
        // Create user
        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                role: "USER",
            },
        })

        console.log("REGISTRATION_SUCCESS: User created", user.id)

        // Send welcome email (non-blocking)
        try {
            console.log("REGISTRATION_EMAIL_SERVICE: Triggering emails")
            EmailService.sendWelcomeEmail(email, fullName).catch(err =>
                console.error("Welcome email failed:", err)
            )
            EmailService.sendAdminNewUserEmail(fullName, email).catch(err =>
                console.error("Admin notification failed:", err)
            )
        } catch (emailErr) {
            console.error("Email service trigger failed:", emailErr)
        }

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("DETAILED REGISTRATION ERROR:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        })
        return NextResponse.json(
            { message: "Internal server error: " + (error.message || "Unknown error") },
            { status: 500 }
        )
    }
}
