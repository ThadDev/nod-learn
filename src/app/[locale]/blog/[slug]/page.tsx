import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock } from "lucide-react"
import { Metadata } from "next"

const posts: Record<string, {
    title: string; category: string; readTime: string; date: string; image: string;
    content: string;
}> = {
    "stock-market-beginners-guide": {
        title: "A Beginner's Complete Guide to the Stock Market",
        category: "Stocks", readTime: "8 min read", date: "March 1, 2026", image: "📈",
        content: `
## What Is the Stock Market?

The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. Think of it as an auction — the price of a stock reflects what people are willing to pay for a slice of ownership in a company.

## Why Do Companies Issue Stocks?

Companies issue shares to raise capital without taking on debt. When you buy a share, you become a partial owner of that company, which entitles you to a portion of its profits (dividends) and a say in major decisions (voting rights).

## How Does a Stock's Price Change?

Stock prices fluctuate based on **supply and demand**. If more people want to buy a stock than sell it, the price rises. The factors influencing demand include:

- Company earnings reports
- Economic data and interest rates
- Investor sentiment and media coverage
- Industry trends

## Reading a Stock Listing

When looking at a stock, you'll see these key figures:

- **Price**: The current value per share
- **Market Cap**: Total value of all shares (price × total shares)
- **P/E Ratio**: Price-to-earnings ratio — a measure of how expensive a stock is relative to its profits
- **52-Week High/Low**: The range the stock has traded over the past year
- **Volume**: The number of shares traded in a day

## The Difference Between Investing and Speculating

**Investing** is buying based on the underlying value and long-term prospects of a company. **Speculating** is betting on short-term price movements. Most beginners lose money because they speculate without realising it.

## Next Steps

Ready to go deeper? Our free course covers all of this — and more — with practical examples and quizzes.
    `,
    },
    "blockchain-explained-simply": {
        title: "Blockchain Explained Simply — No Jargon",
        category: "Blockchain", readTime: "6 min read", date: "February 22, 2026", image: "⛓️",
        content: `
## What Is a Blockchain?

A blockchain is a type of database. Unlike a traditional database stored on a company's server, a blockchain is distributed across thousands of computers worldwide. Each "block" stores a batch of transaction records, and these blocks are chained together in chronological order.

## Why Does It Matter?

The key innovation is **trustless verification**. Two parties can transact without needing a bank, government, or corporation to confirm the exchange. The network itself validates every transaction through a process called consensus.

## How a Transaction Works

1. You initiate a transaction (e.g., sending cryptocurrency)
2. The transaction is broadcast to the network
3. Nodes (computers) validate the transaction
4. The transaction is added to a new block
5. The block is appended to the chain permanently

## Bitcoin vs. Ethereum

- **Bitcoin** is primarily a digital currency — designed to store and transfer value
- **Ethereum** is a programmable blockchain — it can run smart contracts (self-executing code)

## What Are Smart Contracts?

Smart contracts are programs stored on a blockchain that run automatically when conditions are met. They're the backbone of DeFi, NFTs, and Web3 applications.

## Is It Safe?

Blockchain itself is highly secure. However, the **applications built on top** of it (like exchanges and wallets) can have vulnerabilities. Our course covers crypto security in depth.
    `,
    },
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await props.params
    const post = posts[slug]
    return {
        title: post ? `${post.title} | Nodlearn Blog` : "Blog | Nodlearn",
        description: post?.content.slice(0, 160) ?? "",
    }
}

export default async function BlogArticlePage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const post = posts[slug] ?? {
        title: "Article Not Found",
        category: "Blog",
        readTime: "",
        date: "",
        image: "📰",
        content: "This article doesn't exist yet. Check back soon!",
    }

    return (
        <div className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                <div className="mb-8 aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-7xl">
                    {post.image}
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Badge>{post.category}</Badge>
                    {post.readTime && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" /> {post.readTime}
                        </span>
                    )}
                    {post.date && <span className="text-sm text-muted-foreground">{post.date}</span>}
                </div>

                <h1 className="text-3xl font-bold md:text-4xl leading-tight mb-8">{post.title}</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {post.content.split("\n").map((line, i) => {
                        if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace("## ", "")}</h2>
                        if (line.startsWith("- **")) {
                            const [bold, rest] = line.replace("- **", "").split("**:")
                            return <li key={i} className="mb-1 list-disc ml-6"><strong>{bold}</strong>:{rest}</li>
                        }
                        if (line.startsWith("- ")) return <li key={i} className="mb-1 list-disc ml-6">{line.replace("- ", "")}</li>
                        if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. "))
                            return <li key={i} className="mb-1 list-decimal ml-6">{line.replace(/^\d+\. /, "")}</li>
                        if (line.trim() === "") return <br key={i} />
                        return <p key={i} className="mb-4 text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
                        />
                    })}
                </div>

                <div className="mt-12 p-8 rounded-2xl bg-primary/5 border text-center">
                    <h3 className="text-xl font-bold mb-2">Learn More in Our Free Course</h3>
                    <p className="text-muted-foreground mb-6">This article covers just a fraction of what our structured course teaches. Enroll for free and earn a certificate.</p>
                    <Button asChild size="lg">
                        <Link href="/course">Start the Free Course</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
