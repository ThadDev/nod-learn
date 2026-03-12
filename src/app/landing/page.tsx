"use client"

import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, ChevronRight, Award, Users, BookOpen } from "lucide-react"

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}
const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-red-950/30 to-slate-900 text-white py-28 md:py-40">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(239,68,68,0.1),transparent_70%)]" />
                <div className="container relative z-10 mx-auto px-4">
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-3xl text-center">
                        <motion.div variants={fadeUp}>
                            <Badge className="mb-6 bg-red-600/20 text-red-300 border-red-500/30 px-4 py-1.5 text-sm">
                                The #1 Mistake New Investors Make
                            </Badge>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight">
                            Most New Investors Lose Money Because They{" "}
                            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                Skip This Step
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-6 text-xl text-slate-300 leading-relaxed">
                            Learn how global markets work <strong className="text-white">before</strong> investing a single cent.
                            Our free course gives you the foundation that protects your money.
                        </motion.p>
                        <motion.div variants={fadeUp} className="mt-10">
                            <Button asChild size="xl" className="bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/30 text-white">
                                <Link href="/course">Start Free Course Now <ChevronRight className="h-5 w-5" /></Link>
                            </Button>
                            <p className="mt-4 text-sm text-slate-400">No credit card required. Completely free.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto">
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold md:text-4xl text-center mb-12">
                            Why Do Beginners Keep Losing Money?
                        </motion.h2>
                        <motion.div variants={fadeUp} className="grid gap-4">
                            {[
                                "They invest based on social media tips, not knowledge",
                                "They don't understand how markets actually move",
                                "They can't distinguish between volatility and real risk",
                                "They panic-sell during downturns and miss recoveries",
                                "They never learn the fundamentals — stocks, crypto, real estate",
                            ].map((p) => (
                                <div key={p} className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-foreground">{p}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-20 md:py-28 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto">
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold md:text-4xl text-center mb-4">
                            The Solution: Proper Financial Education
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-muted-foreground text-lg text-center mb-12">
                            Our free course teaches you what the pros know — structured, beginner-friendly, and comprehensive.
                        </motion.p>
                        <motion.div variants={fadeUp} className="grid gap-4">
                            {[
                                "Understand stock markets, blockchain, and real estate from scratch",
                                "Learn risk management strategies used by professional investors",
                                "Distinguish between speculation and informed investing",
                                "Build long-term investment thinking with real frameworks",
                                "Earn a certificate to showcase your financial literacy",
                            ].map((p) => (
                                <div key={p} className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-foreground">{p}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Course Modules Preview */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold md:text-4xl">Course Module Preview</motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mx-auto space-y-4">
                        {[
                            { no: "01", title: "Introduction to Financial Markets", lessons: "8 lessons" },
                            { no: "02", title: "Stock Market Fundamentals", lessons: "12 lessons" },
                            { no: "03", title: "Blockchain & Crypto", lessons: "10 lessons" },
                            { no: "04", title: "Real Estate Investing", lessons: "9 lessons" },
                            { no: "05", title: "Portfolio Building & Risk", lessons: "7 lessons" },
                        ].map((m) => (
                            <motion.div key={m.no} variants={fadeUp}>
                                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="flex items-center gap-5 p-5">
                                        <span className="text-3xl font-bold text-primary/30">{m.no}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold">{m.title}</p>
                                            <p className="text-sm text-muted-foreground">{m.lessons}</p>
                                        </div>
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-3 gap-8 text-center">
                        {[
                            { value: "12K+", label: "Students enrolled" },
                            { value: "4.9/5", label: "Average rating" },
                            { value: "Free", label: "Always & forever" },
                        ].map((s) => (
                            <motion.div key={s.label} variants={fadeUp}>
                                <div className="text-4xl font-bold mb-2">{s.value}</div>
                                <div className="text-primary-foreground/70 text-sm">{s.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-background text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="container mx-auto px-4">
                    <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                        <Award className="h-16 w-16 text-yellow-500" />
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-3xl font-bold md:text-5xl mb-6">
                        Start Learning. Get Certified. Invest Smarter.
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                        Join thousands who took the first step toward financial literacy. The course is free — always.
                    </motion.p>
                    <motion.div variants={fadeUp}>
                        <Button asChild size="xl" className="shadow-lg bg-blue-500 rounded hover:bg-blue-600">
                            <Link href="/course">
                                <Users className="h-5 w-5" /> Enroll Now — It&apos;s Free
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    )
}
