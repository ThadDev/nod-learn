import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"

export class CertificateService {
    /**
     * Fetch a certificate by ID with user and course relations
     */
    static async getById(certificateId: string) {
        return prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { user: true, course: true },
        })
    }

    /**
     * Get all certificates earned by a user
     */
    static async getUserCertificates(userId: string) {
        return prisma.certificate.findMany({
            where: { userId },
            include: { course: true },
        })
    }

    /**
     * Get total number of certificates issued
     */
    static async getCertificateCount() {
        return prisma.certificate.count()
    }

    /**
     * Issue a new certificate for a completed course
     */
    static async issueCertificate(userId: string, courseId: string) {
        // Prevent duplicate issuance
        const existing = await prisma.certificate.findUnique({
            where: { userId_courseId: { userId, courseId } },
        })

        if (!existing) {
            return prisma.certificate.create({
                data: {
                    userId,
                    courseId,
                    certificateCode: nanoid(12).toUpperCase(),
                },
            })
        }
        return existing
    }
}
