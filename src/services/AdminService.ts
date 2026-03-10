import { prisma } from "@/lib/prisma"

export class AdminService {
    /**
     * Get total number of registered users
     */
    static async getUserCount() {
        return prisma.user.count()
    }

    /**
     * Get a list of the most recently registered users
     */
    static async getRecentUsers(limit: number = 8): Promise<any[]> {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                country: true,
                role: true,
                createdAt: true
            },
        })
    }

    /**
     * Get recent blog posts with author info for the admin dashboard
     */
    static async getRecentPosts(limit: number = 10): Promise<any[]> {
        return prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: { author: { select: { name: true } } },
        })
    }

    /**
     * Get overall platform metrics (users, certificates, blogs, courses)
     */
    static async getPlatformMetrics() {
        const [users, certificates, blogs, courses] = await Promise.all([
            this.getUserCount(),
            prisma.certificate.count(),
            prisma.blogPost.count(),
            prisma.course.count()
        ])

        return { users, certificates, blogs, courses }
    }
    /**
     * Get all users for the admin user management list
     */
    static async getAllUsers() {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                country: true,
                role: true,
                createdAt: true,
            }
        })
    }

    /**
     * Get a specific user by ID with their progress and certificates
     */
    static async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                progress: {
                    include: { lesson: { select: { title: true } } }
                },
                courseProgress: {
                    include: { course: { select: { title: true, moduleNumber: true } } }
                },
                certificates: {
                    include: { course: { select: { title: true } } }
                }
            }
        })
    }

    /**
     * Create a new course for the Course Management System
     */
    static async createCourse(data: { title: string; moduleNumber: number; fileUrl: string; order: number }) {
        return prisma.course.create({
            data: {
                title: data.title,
                description: `Module ${data.moduleNumber}: ${data.title}`,
                moduleNumber: data.moduleNumber,
                fileUrl: data.fileUrl,
                order: data.order,
            }
        })
    }

    /**
     * Get all courses for the admin management list
     */
    static async getAllCourses() {
        return prisma.course.findMany({
            orderBy: { order: "asc" }
        })
    }

    /**
     * Delete a course
     */
    static async deleteCourse(id: string) {
        return prisma.course.delete({
            where: { id }
        })
    }
}

