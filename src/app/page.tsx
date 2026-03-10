"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  BookOpen,
  BarChart3,
  Bitcoin,
  Home,
  Star,
  Users,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="relative border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

        <div className="relative container mx-auto px-6 py-8 max-w-6xl text-center">

          <Badge className="border border-white/20 bg-white/5 text-white mb-6">
            Financial Education
          </Badge>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight"
          >
            Learn Modern
            <span className="block text-blue-400">
              Investing Skills
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-lg text-slate-300 max-w-xl mx-auto"
          >
            Nodlearn helps beginners understand how stocks,
            crypto and real estate actually work —
            without the hype or complicated jargon.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex justify-center gap-4 mt-10 flex-wrap"
          >
            <Button
              asChild
              size="lg"
              className="border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur"
            >
              <Link href="/course">
                Start Free Course
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border border-white/20 hover:bg-white/10"
            >
              <Link href="/community">
                Join WhatsApp Community
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-14 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Users size={16} /> 12,000+ learners
            </div>

            <div className="flex items-center gap-2">
              <Star size={16} /> 4.9 rating
            </div>

            <div className="flex items-center gap-2">
              <BookOpen size={16} /> Beginner friendly
            </div>
          </div>
        </div>
      </section>


      {/* WHY SECTION */}
      <section className="py-28 border-b border-white/10">

        <div className="container mx-auto px-6 max-w-6xl">

          <div className="text-center mb-20">

            <h2 className="text-4xl md:text-5xl font-semibold">
              Why Financial Education Matters
            </h2>

            <p className="mt-6 text-slate-400 max-w-xl mx-auto">
              Many people start investing after hearing hype online.
              Understanding the fundamentals helps you make smarter
              decisions and avoid costly mistakes.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                title: "Understand how markets work",
                desc: "Learn the mechanics behind stocks, crypto and property markets.",
              },
              {
                title: "Avoid beginner mistakes",
                desc: "Most investors lose money because they start without knowledge.",
              },
              {
                title: "Build long-term financial skills",
                desc: "Knowledge compounds just like investments.",
              },
            ].map((item, i) => (

              <Card
                key={i}
                className="bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition"
              >
                <CardContent className="p-8">

                  <h3 className="text-xl font-semibold mb-4">
                    {item.title}
                  </h3>

                  <p className="text-slate-400">
                    {item.desc}
                  </p>

                </CardContent>
              </Card>

            ))}

          </div>
        </div>
      </section>


      {/* CURRICULUM */}
      <section className="py-28 border-b border-white/10">

        <div className="container mx-auto px-6 max-w-6xl">

          <div className="text-center mb-20">

            <h2 className="text-4xl md:text-5xl font-semibold">
              What You’ll Learn
            </h2>

            <p className="mt-6 text-slate-400">
              Three pillars of modern investing.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                icon: BarChart3,
                title: "Stock Market",
                items: [
                  "How stocks work",
                  "Risk & diversification",
                  "Long-term investing",
                ],
              },
              {
                icon: Bitcoin,
                title: "Crypto & Blockchain",
                items: [
                  "Blockchain explained",
                  "Crypto fundamentals",
                  "Wallet security",
                ],
              },
              {
                icon: ShieldCheck,
                title: "Risk Management",
                items: [
                  "Understanding financial risks",
                  "Diversification strategies",
                  "Protecting investments",
                ],
              },

            ].map((course, i) => {

              const Icon = course.icon

              return (
                <Card
                  key={i}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <CardContent className="p-8">

                    <Icon className="text-blue-400 mb-6" />

                    <h3 className="text-xl font-semibold mb-6">
                      {course.title}
                    </h3>

                    <ul className="space-y-2 text-slate-400">

                      {course.items.map((item, j) => (
                        <li key={j}>
                          {item}
                        </li>
                      ))}

                    </ul>

                  </CardContent>
                </Card>
              )
            })}

          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="py-28 border-b border-white/10">

        <div className="container mx-auto px-6 max-w-6xl">

          <div className="text-center mb-20">

            <h2 className="text-4xl font-semibold">
              What Students Say
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                name: "Sarah K.",
                text: "Clear explanations and practical lessons. Perfect for beginners.",
              },
              {
                name: "James M.",
                text: "Finally understand crypto without the hype.",
              },
              {
                name: "Amara T.",
                text: "Great foundation before starting investing.",
              },
            ].map((review, i) => (

              <Card
                key={i}
                className="bg-white/5 border border-white/10"
              >
                <CardContent className="p-8">

                  <div className="flex mb-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-slate-400 mb-6">
                    {review.text}
                  </p>

                  <div className="font-medium">
                    {review.name}
                  </div>

                </CardContent>
              </Card>

            ))}

          </div>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="py-32 text-center">

        <div className="container mx-auto px-6 max-w-3xl">

          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Start Learning Today
          </h2>

          <p className="text-slate-400 mb-10">
            Join thousands of students building real financial knowledge.
          </p>

          <Button
            asChild
            size="lg"
            className="border border-white/20 bg-white/10 hover:bg-white/20"
          >
            <Link href="/course">
              Start Free Course
              <ChevronRight className="ml-2" size={18} />
            </Link>
          </Button>

        </div>
      </section>

    </div>
  )
}