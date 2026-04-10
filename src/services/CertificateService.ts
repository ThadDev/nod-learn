import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { PDFGeneratorService } from "@/lib/certificate/pdfGenerator"

export class CertificateService {
    /**
     * Fetch a certificate by ID with user, course, and exam relations
     */
    static async getById(certificateId: string) {
        return prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { user: true, course: true, exam: true },
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
     * Issue a new certificate for a completed exam or course
     */
    static async issueCertificate(userId: string, targetId: string, examAttemptId?: string, isExam: boolean = true) {
        // Prevent duplicate issuance
        const where = isExam 
            ? { userId, examId: targetId } 
            : { userId, courseId: targetId };
            
        // We need a custom check since @@unique is [userId, courseId]
        // Actually, let's just use findFirst for simplicity if it's an exam
        const existing = await prisma.certificate.findFirst({
            where: {
                userId,
                OR: [
                    { examId: isExam ? targetId : undefined },
                    { courseId: !isExam ? targetId : undefined }
                ]
            }
        })

        if (!existing) {
            const certificateCode = `NOD-${nanoid(10).toUpperCase()}`
            const certificate = await prisma.certificate.create({
                data: {
                    userId,
                    courseId: isExam ? null : targetId,
                    examId: isExam ? targetId : null,
                    examAttemptId,
                    certificateCode,
                },
                include: { user: true, course: true, exam: true }
            })

            // Trigger background PDF generation
            this.generateAndStorePDF(certificate.id, certificate.certificateCode)

            return certificate
        }
        return existing
    }

    /**
     * Internal method to generate and store PDF after issuance
     */
    static async generateAndStorePDF(certificateId: string, certificateCode: string) {
        try {
            // The preview URL we will build
            // Use local machine env for the BASE_URL in production, 
            // but for now let's assume it's publicly reachable or local dev
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const previewUrl = `${baseUrl}/certificate/${certificateId}?preview=true`
            
            const pdfUrl = await PDFGeneratorService.generateCertificatePDF(certificateCode, previewUrl)

            await prisma.certificate.update({
                where: { id: certificateId },
                data: { 
                    // @ts-ignore
                    certificateUrl: pdfUrl 
                }
            })
        } catch (error) {
            console.error("Failed to generate PDF for certificate:", certificateId, error)
        }
    }

    /**
     * Verification API logic
     */
    static async verifyCertificate(certificateCode: string) {
        if (!certificateCode) return null

        const cert = await prisma.certificate.findUnique({
            where: { certificateCode },
            include: { user: true, course: true, exam: true }
        })

        if (!cert) return null

        return {
            name: cert.user?.name || "N/A",
            course: cert.exam?.title || cert.course?.title || "Financial Literacy Certification",
            date: cert.issuedAt,
            isValid: true,
            id: cert.certificateCode
        }
    }
}
