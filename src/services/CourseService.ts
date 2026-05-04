import { prisma } from "@/lib/prisma"

export class CourseService {
    /**
     * Fetch all courses with module and lesson structure
     */
    static async getFullCourseStructure() {
        return prisma.course.findMany({
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        })
    }

    /**
     * Fetch a user's progress for all lessons
     */
    static async getUserProgress(userId: string) {
        return prisma.progress.findMany({
            where: { userId },
            include: { lesson: true },
        })
    }

    /**
     * Get total number of lessons across all courses
     */
    static async getTotalLessonCount() {
        const courses = await this.getFullCourseStructure()
        return courses.reduce(
            (acc: number, course: any) =>
                acc + course.modules.reduce((mAcc: number, mod: any) => mAcc + mod.lessons.length, 0),
            0
        )
    }

    /**
     * Get total courses count
     */
    static async getCourseCount() {
        return prisma.course.count()
    }

    /**
     * Get all courses with lock status for a user
     */
    static async getCoursesWithUserProgress(userId: string) {
        const [courses, userProgress, userAttempts, userCertificates] = await Promise.all([
            prisma.course.findMany({
                orderBy: { order: "asc" },
            }),
            prisma.courseProgress.findMany({
                where: { userId },
            }),
            prisma.examAttempt.findMany({
                where: { userId },
            }),
            prisma.certificate.findMany({
                where: { userId },
            })
        ])

        const completedCourseIds = new Set(
            userProgress.filter((p: any) => p.completed).map((p: any) => p.courseId)
        )

        // Exam is global (not per-course) — check if the user has any passing attempt
        const hasPassed = userAttempts.some((a: any) => a.passed)
        const attemptCount = userAttempts.length

        return courses.map((course: any) => {
            // Module 1 (order 1) is always unlocked
            const isFirst = course.order === 1

            // Unlocked if it's the first one OR if the previous one is completed
            let isUnlocked = isFirst
            if (!isFirst) {
                const previousCourse = courses.find((c: any) => c.order === course.order - 1)
                if (previousCourse && completedCourseIds.has(previousCourse.id)) {
                    isUnlocked = true
                }
            }

            const progress = userProgress.find((p: any) => p.courseId === course.id)
            const certificate = userCertificates.find((c: any) => c.courseId === course.id)

            return {
                ...course,
                isUnlocked,
                isCompleted: progress?.completed ?? false,
                hasPassedExam: hasPassed,
                certificateId: certificate?.id,
                attemptCount,
            }
        })
    }

    /**
     * Mark a course as complete for a user
     */
    static async markCourseComplete(userId: string, courseId: string) {
        return prisma.courseProgress.upsert({
            where: {
                userId_courseId: { userId, courseId },
            },
            update: {
                completed: true,
                completedAt: new Date(),
            },
            create: {
                userId,
                courseId,
                completed: true,
                completedAt: new Date(),
            },
        })
    }
    /**
     * Fetch a user's course progress
     */
    static async getUserCourseProgress(userId: string) {
        return prisma.courseProgress.findMany({
            where: { userId },
            include: { course: true },
        })
    }
}
