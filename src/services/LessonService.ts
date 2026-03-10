import { prisma } from "@/lib/prisma"
import { CertificateService } from "@/services/CertificateService"

export class LessonService {
    /**
     * Get a specific lesson by ID
     */
    static async getLessonById(lessonId: string) {
        return prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: { include: { course: true } } },
        })
    }

    /**
     * Check if a user has completed a specific lesson
     */
    static async isLessonCompleted(userId: string, lessonId: string) {
        const progress = await prisma.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        })
        return progress?.completed ?? false
    }

    /**
     * Mark a lesson as completed for a user, and auto-issue certificate if course is finished
     */
    static async markComplete(userId: string, lessonId: string) {
        await prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: { completed: true },
            create: { userId, lessonId, completed: true },
        })

        // Auto-check for course completion
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: {
                    include: {
                        course: {
                            include: {
                                modules: { include: { lessons: true } }
                            }
                        }
                    }
                }
            },
        })

        if (lesson) {
            const course = lesson.module.course
            const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))

            const completedCount = await prisma.progress.count({
                where: { userId, lessonId: { in: allLessonIds }, completed: true },
            })

            if (completedCount >= allLessonIds.length) {
                await CertificateService.issueCertificate(userId, course.id)
            }
        }
    }
}
