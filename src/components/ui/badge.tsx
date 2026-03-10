import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "success" | "outline" }
>(({ className, variant = "default", ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                {
                    "border-transparent bg-primary text-primary-foreground": variant === "default",
                    "border-transparent bg-secondary text-secondary-foreground": variant === "secondary",
                    "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200": variant === "success",
                    "text-foreground": variant === "outline",
                },
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = "Badge"

export { Badge }
