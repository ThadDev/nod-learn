"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    showIcon?: boolean
    fullWidth?: boolean
}

export function LogoutButton({
    className,
    variant = "ghost",
    showIcon = true,
    fullWidth = false
}: LogoutButtonProps) {
    return (
        <Button
            variant={variant}
            size="sm"
            className={`${fullWidth ? "w-full justify-start" : ""} ${className}`}
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            {showIcon && <LogOut className="mr-2 h-4 w-4" />}
            Logout
        </Button>
    )
}
