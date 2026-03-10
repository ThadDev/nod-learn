"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

function SignInForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [registered, setRegistered] = useState(false)

    useEffect(() => {
        if (searchParams.get("registered")) {
            setRegistered(true)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setRegistered(false)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            })

            if (res?.error) {
                setError("Invalid email or password. Please try again.")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            setError("Something went wrong. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-10">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center text-primary">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Nodlearn</h1>
                    <p className="text-muted-foreground italic">Elevate your financial literacy.</p>
                </div>

                <Card className="shadow-2xl border-t-4 border-t-primary overflow-hidden">
                    <CardHeader className="space-y-1 bg-primary/5 pb-8">
                        <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg -rotate-3">
                            <Lock className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center italic">
                            Sign in to continue your progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {registered && (
                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex gap-3 items-center animate-in fade-in slide-in-from-top-4">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                Registration successful! Please sign in with your credentials.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-11"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center border-t pt-6">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SignInForm />
        </Suspense>
    )
}
