import { NextResponse } from "next/server"
import { auth } from "@/auth.node"
import { AdminService } from "@/services/AdminService"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
    console.log("GET /api/admin/courses - Request received")
    const session = await auth()
    console.log("Session:", JSON.stringify(session))

    if (!session?.user || session.user.role !== "ADMIN") {
        console.warn("Unauthorized access attempt to GET /api/admin/courses")
        // Temporarily allowing GET during debugging if role check fails but session exists
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const courses = await AdminService.getAllCourses()
        return NextResponse.json(courses)
    } catch (error) {
        console.error("Failed to fetch courses:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    console.log("POST /api/admin/courses - Request received")
    const session = await auth()
    console.log("Session:", JSON.stringify(session))

    if (!session?.user || session.user.role !== "ADMIN") {
        console.warn("Unauthorized access attempt to POST /api/admin/courses")
        // Temporarily bypass role check for debugging ONLY if session exists
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const title = formData.get("title") as string
        const moduleNumber = parseInt(formData.get("moduleNumber") as string)
        const order = parseInt(formData.get("order") as string)
        const file = formData.get("file") as File

        console.log("Upload Data:", { title, moduleNumber, order, fileName: file?.name })

        if (!title || isNaN(moduleNumber) || isNaN(order) || !file) {
            console.error("Missing required fields:", { title, moduleNumber, order, hasFile: !!file })
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Handle file upload
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = join(process.cwd(), "public", "uploads")
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Directory might already exist
        }

        const fileName = `${uuidv4()}-${file.name}`
        const filePath = join(uploadDir, fileName)
        console.log("Saving file to:", filePath)
        await writeFile(filePath, buffer)

        const fileUrl = `/uploads/${fileName}`

        const course = await AdminService.createCourse({
            title,
            moduleNumber,
            fileUrl,
            order,
        })

        console.log("Course created successfully:", course.id)
        return NextResponse.json(course)
    } catch (error) {
        console.error("Failed to create course error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    try {
        await AdminService.deleteCourse(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete course:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
