"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, CheckCircle2, PlayCircle, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"

interface Course {
    id: string;
    moduleNumber: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

export function CourseList({ courses }: { courses: Course[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    if (courses.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
            >
                <BookOpen className="h-16 w-16 mx-auto text-blue-400/50 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">No courses available yet</h2>
                <p className="text-slate-400">Check back soon for new content!</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
            {courses.map((course) => (
                <motion.div key={course.id} variants={item}>
                    <Card
                        className={`group relative h-full flex flex-col overflow-hidden border-white/10 transition-all duration-500 ${!course.isUnlocked
                                ? "bg-slate-900/40 opacity-60 grayscale cursor-not-allowed"
                                : "bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] shadow-2xl"
                            }`}
                    >
                        {/* Background Decorative Element */}
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />

                        <CardHeader className="pb-4 relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-600/20 rounded-lg">
                                        <GraduationCap className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                        Module {course.moduleNumber}
                                    </span>
                                </div>
                                {course.isCompleted ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Completed
                                    </div>
                                ) : !course.isUnlocked && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <Lock className="h-3 w-3" />
                                        Locked
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent leading-tight group-hover:from-blue-100 group-hover:to-white transition-all">
                                {course.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 pb-6 relative z-10">
                            {!course.isUnlocked ? (
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 mt-2">
                                    <p className="text-sm text-slate-400 leading-relaxed italic">
                                        Complete previous module to unlock this secret knowledge.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {course.isCompleted
                                        ? "Mastered! Revisit the materials to solidify your financial advantage."
                                        : "Deep dive into premium financial assets. Your next level awaits."}
                                </p>
                            )}
                        </CardContent>

                        <CardFooter className="pt-2 pb-8 relative z-10">
                            {course.isUnlocked ? (
                                <Link href={`/courses/${course.id}`} className="w-full">
                                    <Button
                                        className={`w-full h-12 rounded-2xl font-bold transition-all duration-300 ${course.isCompleted
                                                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                                                : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-600/30"
                                            }`}
                                    >
                                        <PlayCircle className="mr-2 h-5 w-5" />
                                        {course.isCompleted ? "Review Material" : "Start Learning"}
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 font-bold"
                                >
                                    <Lock className="mr-2 h-5 w-5" />
                                    Locked
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}
