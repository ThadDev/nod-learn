"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MessageSquare } from "lucide-react"
import { useState } from "react"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false)

    return (
        <div className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl mx-auto">
                    <motion.div variants={fadeUp} className="text-center mb-12">
                        <h1 className="text-4xl font-bold md:text-5xl mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg">
                            Have a question or feedback? We&apos;d love to hear from you.
                        </p>
                    </motion.div>

                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 border rounded-2xl bg-muted/30">
                            <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                            <p className="text-muted-foreground">We&apos;ll get back to you within 24–48 hours.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            variants={fadeUp}
                            onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
                            className="space-y-5 border rounded-2xl p-8 shadow-sm bg-card"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                                    <Input required placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                                    <Input required type="email" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                                <Input required placeholder="How can we help?" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Tell us more..."
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full">
                                <Mail className="h-4 w-4" /> Send Message
                            </Button>
                        </motion.form>
                    )}

                    <motion.div variants={fadeUp} className="mt-10 text-center text-sm text-muted-foreground">
                        Or email us directly at{" "}
                        <a href="mailto:hello@nodlearn.com" className="text-primary hover:underline">hello@nodlearn.com</a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
