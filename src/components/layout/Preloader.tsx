"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Preloader() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Prevent preloader if already shown in this session
        const hasShown = sessionStorage.getItem("nodlearn-preloader")
        if (hasShown) {
            setIsVisible(false)
            return
        }

        // Set duration for the total animation (3 pulses + text reveal + exit)
        const timer = setTimeout(() => {
            setIsVisible(false)
            sessionStorage.setItem("nodlearn-preloader", "true")
        }, 3500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F19]"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: 1
                            }}
                            transition={{
                                scale: {
                                    repeat: 2, // Total 3 times (initial + 2 repeats)
                                    duration: 0.8,
                                    ease: "easeInOut"
                                },
                                opacity: {
                                    duration: 0.5
                                }
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                                height={120}
                                className="drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]"
                            />
                        </motion.div>

                        {/* Name Animation */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
                            className="mt-10 text-center"
                        >
                            <h1 className="text-3xl md:text-5xl font-bold tracking-[0.25em] text-white">
                                NODLEARN<span className="text-blue-500">.</span>
                            </h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 2.8, duration: 0.8 }}
                                className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-4 opacity-70"
                            />
                        </motion.div>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
