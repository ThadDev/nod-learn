"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface ClientAnimationsProps {
    children: ReactNode
    type: "hero" | "module"
    index?: number
}

const variants: Record<string, Variants> = {
    hero: {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.2
            }
        }
    },
    module: {
        initial: { opacity: 0, y: 50 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    }
}

const itemVariants = {
    hero: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    }
}

export function ClientAnimations({ children, type, index = 0 }: ClientAnimationsProps) {
    if (type === "hero") {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                variants={variants.hero}
            >
                {/* We wrap children to apply stagger if they are individual elements, 
                    but here we just apply the main animation to the container */}
                {children}
            </motion.div>
        )
    }

    if (type === "module") {
        return (
            <motion.div
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                variants={variants.module}
            >
                {children}
            </motion.div>
        )
    }

    return <>{children}</>
}
