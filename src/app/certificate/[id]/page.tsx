import { auth } from "@/auth.node"
export const dynamic = "force-dynamic"

import { redirect, notFound } from "next/navigation"
import { CertificateService } from "@/services/CertificateService"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, Download, Share2 } from "lucide-react"

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

export default async function CertificatePage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const session = await auth()
    if (!session?.user) redirect("/api/auth/signin")

    const cert = await CertificateService.getById(id)

    if (!cert || cert.userId !== session.user.id!) notFound()

    return (
        <div className="py-10 md:py-16 bg-muted/20 min-h-screen">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-1">Your Certificate</h1>
                    <p className="text-muted-foreground">Congratulations on completing the course!</p>
                </div>

                {/* Certificate Visual */}
                <div
                    id="certificate"
                    className="bg-white dark:bg-slate-900 border-8 border-double border-yellow-400 dark:border-yellow-600 rounded-2xl p-10 md:p-16 shadow-2xl text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "30px 30px" }}
                    />
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <Award className="h-16 w-16 text-yellow-500" />
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 font-semibold">Certificate of Completion</p>
                        <h2 className="text-4xl font-bold mb-1 text-slate-900 dark:text-white">Nodlearn</h2>
                        <p className="text-muted-foreground mb-8 text-sm">Financial Education Platform</p>

                        <p className="text-muted-foreground mb-2">This certifies that</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{cert.user.name}</p>

                        <p className="text-muted-foreground mb-2">has successfully completed</p>
                        <p className="text-2xl font-semibold text-primary mb-8">{cert.course.title}</p>

                        <div className="flex justify-center gap-12 text-sm">
                            <div>
                                <p className="text-muted-foreground">Date Issued</p>
                                <p className="font-semibold">{formatDate(cert.issueDate)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Certificate ID</p>
                                <p className="font-mono text-xs font-semibold">{cert.certificateCode}</p>
                            </div>
                        </div>

                        <div className="mt-10 border-t pt-6">
                            <div className="inline-block border-b-2 border-slate-900 dark:border-white pb-1 px-8 text-lg font-script italic">
                                Nodlearn Education
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Platform Director</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Button size="lg" className="gap-2">
                        <Download className="h-5 w-5" /> Download PDF
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                        <Share2 className="h-5 w-5" /> Share on LinkedIn
                    </Button>
                    <Button size="lg" variant="ghost" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
