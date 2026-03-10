"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CompletionButtonProps {
    courseId: string
    isCompleted: boolean
}

export function CompletionButton({ courseId, isCompleted }: CompletionButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleComplete = async () => {
        if (isCompleted) {
            router.push("/courses")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/courses/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            })

            if (res.ok) {
                toast.success("Module completed! Next course unlocked.")
                router.refresh()
                // Small delay to allow refresh to show updated state
                setTimeout(() => router.push("/courses"), 500)
            } else {
                toast.error("Failed to update progress")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size="lg"
            className={`w-full max-w-xs font-bold text-lg h-14 transition-all gap-2 ${isCompleted
                    ? "bg-emerald-500 hover:bg-emerald-600 border-none"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                }`}
            onClick={handleComplete}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : isCompleted ? (
                <>
                    <CheckCircle2 className="h-5 w-5" />
                    Back to Courses
                </>
            ) : (
                <>
                    Mark as Complete
                    <ArrowRight className="h-5 w-5" />
                </>
            )}
        </Button>
    )
}
