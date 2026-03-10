"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

const posts = [
    {
        slug: "stock-market-beginners-guide",
        title: "A Beginner's Complete Guide to the Stock Market",
        excerpt: "Everything you need to know before buying your first stock — from understanding ticker symbols to reading financial statements.",
        category: "Stocks",
        readTime: "8 min read",
        date: "March 1, 2026",
        image: "📈",
    },
    {
        slug: "blockchain-explained-simply",
        title: "Blockchain Explained Simply — No Jargon",
        excerpt: "Cut through the crypto hype. Here's what blockchain actually is, how it works, and why it matters for investors.",
        category: "Blockchain",
        readTime: "6 min read",
        date: "February 22, 2026",
        image: "⛓️",
    },
    {
        slug: "real-estate-vs-stocks",
        title: "Real Estate vs. Stocks: Which Is Right for You?",
        excerpt: "A detailed, unbiased comparison of two of the most popular wealth-building asset classes for new investors.",
        category: "Investing",
        readTime: "10 min read",
        date: "February 14, 2026",
        image: "🏠",
    },
    {
        slug: "what-is-defi",
        title: "What is DeFi and Should You Be Paying Attention?",
        excerpt: "Decentralised finance is reshaping banking. Here's a clear breakdown of what it is and the risks involved.",
        category: "Blockchain",
        readTime: "7 min read",
        date: "February 8, 2026",
        image: "💎",
    },
    {
        slug: "reit-investing-guide",
        title: "REIT Investing: Real Estate Without Buying Property",
        excerpt: "REITs allow anyone to invest in real estate with minimal capital. Here's how they work and how to evaluate them.",
        category: "Real Estate",
        readTime: "9 min read",
        date: "January 29, 2026",
        image: "🏢",
    },
    {
        slug: "portfolio-diversification",
        title: "How to Diversify Your Investment Portfolio",
        excerpt: "Don't put all your eggs in one basket. Learn the principles of diversification and how to apply them.",
        category: "Investing",
        readTime: "5 min read",
        date: "January 18, 2026",
        image: "📊",
    },
]

export default function BlogPage() {
    return (
        <div className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-14">
                    <motion.h1 variants={fadeUp} className="text-4xl font-bold md:text-5xl mb-4">Financial Education Blog</motion.h1>
                    <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
                        In-depth articles on stocks, blockchain, real estate, and personal finance — written for real people.
                    </motion.p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <motion.div key={post.slug} variants={fadeUp}>
                            <Link href={`/blog/${post.slug}`}>
                                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                    <CardContent className="p-0">
                                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-xl flex items-center justify-center text-5xl">
                                            {post.image}
                                        </div>
                                        <div className="p-6">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{post.category}</span>
                                            <h2 className="mt-2 text-xl font-bold leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
                                            <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                                            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</div>
                                                <span>{post.date}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
