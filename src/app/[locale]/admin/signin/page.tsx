"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminSignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/admin",
            })

            if (res?.error) {
                setError("Invalid admin credentials.")
            } else {
                router.push("/admin")
                router.refresh()
            }
        } catch (error) {
            setError("Authentication failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950 relative overflow-hidden text-white">
            {/* Dark Mode Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-900/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/20 rounded-full blur-3xl opacity-50" />
            </div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors z-10">
                <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Access Only
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">NODLEARN</h1>
                    <p className="text-zinc-500 font-medium">Console Management Interface</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
                    <CardHeader className="space-y-1 pb-8 border-b border-zinc-800">
                        <CardTitle className="text-2xl text-center font-bold">Administrator Login</CardTitle>
                        <CardDescription className="text-center text-zinc-500">
                            Enter secure credentials to access the console
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-shake text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Admin Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                                    <Input
                                        type="email"
                                        placeholder="admin@nodlearn.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-zinc-950 border-zinc-800 focus:ring-red-900 text-white placeholder:text-zinc-700"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Security Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 bg-zinc-950 border-zinc-800 focus:ring-red-900 text-white placeholder:text-zinc-700"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 text-base font-black bg-white text-black hover:bg-zinc-200 transition-all shadow-xl" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        AUTHERIZING...
                                    </>
                                ) : (
                                    "IDENTIFY"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-zinc-600 font-mono">
                    SECURED BY NODLEARN INFRASTRUCTURE © 2026
                </p>
            </motion.div>
        </div>
    )
}
