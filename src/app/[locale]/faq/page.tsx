"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }

const faqs = [
    { q: "Is this course really free?", a: "Yes — 100% free, always. We believe financial education should be accessible to everyone. There are no hidden fees, no premium tiers, and no credit card required." },
    { q: "Do I need any prior financial knowledge?", a: "None whatsoever. The course is designed for complete beginners. We start from the very basics and build up gradually to more advanced concepts." },
    { q: "How long does the course take?", a: "Most students complete the full course in 1-2 weeks at their own pace. The total video content is approximately 8 hours, with additional reading materials per lesson." },
    { q: "What topics does the course cover?", a: "The course covers three major investment categories: Stock Market Basics, Blockchain & Cryptocurrency, and Real Estate Investing. We also include a module on Portfolio Building & Risk Management." },
    { q: "What is the certificate and is it official?", a: "Upon completing all course modules, you receive a digital certificate with a unique ID that can be verified on our platform. While it is not an accredited academic qualification, it demonstrates your commitment to financial literacy." },
    { q: "Can I download and share the certificate?", a: "Yes. Your certificate can be downloaded as a PDF and shared directly on LinkedIn or other platforms. Each certificate has a unique verification code." },
    { q: "Is this financial advice?", a: "No. Nodlearn is an educational platform. The content is designed to improve your financial literacy, not to advise you on specific investments. Always consult a licensed financial advisor before making investment decisions." },
    { q: "How do I track my progress?", a: "Once you create an account and enroll, your progress is automatically saved. Your dashboard shows which lessons you've completed and your overall course progress." },
    { q: "I forgot my login. What do I do?", a: "We use passwordless email sign-in via magic links. Simply enter your email on the login screen and we'll send you a sign-in link instantly — no password needed." },
]

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="border rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-muted/50 transition-colors"
            >
                {q}
                {open ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
            </button>
            {open && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>
            )}
        </div>
    )
}

export default function FAQPage() {
    return (
        <div className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-14">
                    <motion.h1 variants={fadeUp} className="text-4xl font-bold md:text-5xl mb-4">Frequently Asked Questions</motion.h1>
                    <motion.p variants={fadeUp} className="text-muted-foreground text-lg">
                        Everything you need to know about Nodlearn.
                    </motion.p>
                </motion.div>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div key={i} variants={fadeUp}>
                            <FAQItem q={faq.q} a={faq.a} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
