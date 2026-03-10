"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Users2 } from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
                        <motion.h1 variants={fadeUp} className="text-4xl font-bold md:text-6xl mb-6">
                            Our Mission
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-slate-300 text-xl leading-relaxed">
                            Nodlearn was built on a simple belief: financial education should be accessible to everyone,
                            not just the privileged few who can afford advisors and courses.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 md:grid-cols-3">
                        {[
                            { icon: Target, title: "Our Mission", body: "To democratise financial education and empower individuals to make informed decisions with their money — regardless of their background or starting capital." },
                            { icon: Eye, title: "Our Vision", body: "A world where no one loses money simply because they lacked access to fundamental financial knowledge. Informed investors build stronger economies." },
                            { icon: Users2, title: "Our Community", body: "Over 12,000 students from 85+ countries have enrolled in Nodlearn. We're building a global community of financially literate individuals." },
                        ].map((item) => (
                            <motion.div key={item.title} variants={fadeUp}>
                                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-shadow">
                                    <CardContent className="p-8">
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-6">Our Story</motion.h2>
                        <motion.div variants={fadeUp} className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Nodlearn was founded after observing a pattern: brilliant, hard-working people consistently
                                making poor investment decisions — <strong className="text-foreground">not because they were foolish, but because they were uninformed</strong>.
                            </p>
                            <p>
                                The financial world is full of jargon, gatekeeping, and conflicting advice. Most &ldquo;educational&rdquo; content
                                online is really just disguised marketing for financial products.
                            </p>
                            <p>
                                We built Nodlearn to change that. Our curriculum is objective, structured, and completely free.
                                We cover the three most impactful investment categories — stocks, blockchain, and real estate —
                                in a way that any beginner can understand.
                            </p>
                            <p>
                                When you complete our course, you receive a verifiable certificate. Not a participation trophy —
                                a genuine credential that shows you&apos;ve taken the time to understand how modern investing works.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
