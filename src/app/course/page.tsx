import { auth } from "@/auth.node"
import { AdminService } from "@/services/AdminService"
import { CourseService } from "@/services/CourseService"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Lock, BookOpen, Star, ShieldCheck, Clock, Users } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ClientAnimations } from "./ClientAnimations"

export const dynamic = "force-dynamic"

export default async function CourseLandingPage() {
    const session = await auth()
    const courses = await AdminService.getAllCourses()

    // For progress display if logged in
    let userCourses: any[] = []
    if (session?.user) {
        userCourses = await CourseService.getCoursesWithUserProgress(session.user.id)
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
            {/* Elegant Hero Section */}
            <section className="relative pt-6 pb-20 md:pt-8 md:pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-30" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full opacity-20" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ClientAnimations type="hero">
                            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 text-xs font-medium tracking-wider uppercase">
                                Premier Financial Education
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-[1.1]">
                                Master the Art of <br />
                                <span className="text-blue-500 italic font-serif">Wealth Creation</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
                                Join 10,000+ students in our most comprehensive course yet.
                                From stock market fundamentals to advanced real estate strategies,
                                we provide the blueprints for financial freedom.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-14 rounded-full text-base font-semibold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                                    <Link href={session ? "/dashboard" : "/register"}>
                                        {session ? "Continue Learning" : "Start For Free"} <ChevronRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="flex -space-x-3 ml-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-blue-400">
                                        +2k
                                    </div>
                                </div>
                                <span className="text-sm text-slate-500 font-medium ml-2">Trusted by 10k+ learners</span>
                            </div>
                        </ClientAnimations>

                        {/* Premium Hero Image */}
                        <div className="hidden lg:block relative">
                            <ClientAnimations type="hero">
                                <div className="relative z-10 p-4 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    <img
                                        src="/images/hero-premium.png"
                                        alt="Financial Excellence"
                                        className="rounded-[2.5rem] w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Glassmorphism accent */}
                                    <div className="absolute bottom-10 -left-6 p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl animate-bounce-slow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Star className="h-5 w-5 text-emerald-400 fill-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold">Lifetime Access</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Limited Offer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Background glow for image */}
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full z-0" />
                                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full z-0" />
                            </ClientAnimations>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Ribbon */}
            <section className="py-12 bg-slate-950/50 backdrop-blur-md border-b border-white/5 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: BookOpen, label: "Modules", value: courses.length || "12+" },
                            { icon: Clock, label: "Learning Hours", value: "48h+" },
                            { icon: Users, label: "Community", value: "10k+" },
                            { icon: ShieldCheck, label: "Accredited", value: "Yes" }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                    <stat.icon className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Curriculum Section */}
            <section className="py-24 md:py-32 relative">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Curriculum Overview</h2>
                            <p className="text-slate-400">
                                Our curriculum is designed to take you from foundational understanding to
                                advanced professional analysis across all asset classes.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span>Rated 4.9/5 by graduates</span>
                        </div>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-slate-800 to-transparent z-0" />

                        {courses.map((course, index) => {
                            const isLocked = session ? !userCourses.find(c => c.id === course.id)?.isUnlocked : (index > 0);
                            const isCompleted = session ? userCourses.find(c => c.id === course.id)?.isCompleted : false;

                            return (
                                <ClientAnimations key={course.id} type="module" index={index}>
                                    <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center`}>
                                        <div className={`order-2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                                            <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent">
                                                <Card className="bg-slate-900/60 backdrop-blur-xl border-white/5 rounded-[2.4rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                                                    <CardContent className="p-8">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-black shadow-lg shadow-blue-600/40">
                                                                    {course.moduleNumber || index + 1}
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Module</div>
                                                                    <div className="text-lg font-bold">Phase {Math.ceil((index + 1) / 3)}</div>
                                                                </div>
                                                            </div>
                                                            {isLocked ? (
                                                                <Lock className="h-5 w-5 text-slate-600" />
                                                            ) : isCompleted ? (
                                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Mastered</Badge>
                                                            ) : (
                                                                <div className="flex gap-1">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse delay-150" />
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500/10 animate-pulse delay-300" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                            {course.description || "In-depth training module covering professional strategies, analysis frameworks, and real-case studies."}
                                                        </p>

                                                        {!isLocked ? (
                                                            <Button asChild variant="ghost" className="p-0 text-blue-400 hover:text-blue-300 hover:bg-transparent group/btn">
                                                                <Link href={session ? `/courses/${course.id}` : "/register"} className="flex items-center gap-2">
                                                                    Explore Module <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <div className="text-xs text-slate-600 flex items-center gap-2 italic">
                                                                <Lock className="h-3 w-3" /> Requires Module {index} Completion
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>

                                        <div className={`order-1 ${index % 2 === 0 ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'} hidden md:block`}>
                                            <div className="text-6xl font-black text-slate-900/50 mb-2">0{index + 1}</div>
                                            <div className="h-1 w-24 bg-blue-600 rounded-full inline-block mb-4" />
                                            <div className="text-slate-500 font-medium">
                                                {index === 0 ? "Entry Level" : index === courses.length - 1 ? "Expert Finale" : "Advanced Progression"}
                                            </div>
                                        </div>
                                    </div>
                                </ClientAnimations>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 z-0" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 italic">Ready to redefine your <br /> financial future?</h2>
                        <p className="text-slate-400 text-lg mb-12">
                            Join thousands of students who have already taken the leap.
                            Start your journey today and get lifetime access to all future updates.
                        </p>
                        <Button asChild size="xl" className="rounded-full bg-white text-slate-950 hover:bg-slate-200 px-12 h-16 text-lg font-bold shadow-2xl">
                            <Link href="/register">Enroll Today <ChevronRight className="ml-2 h-6 w-6" /></Link>
                        </Button>
                        <p className="mt-8 text-sm text-slate-500">Sign up in less than 60 seconds. No credit card required.</p>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-xl font-bold mb-4 tracking-tighter">NODLEARN<span className="text-blue-500">.</span></div>
                    <p className="text-slate-500 text-sm">© 2026 Nodlearn Education. Professional Financial Excellence.</p>
                </div>
            </footer>
        </div>
    )
}
