"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"

interface StudyHubViewerProps {
    fileUrl: string
    title: string
}

/**
 * iOS Safari cannot render PDFs inline via iframes — it shows a blank area
 * or a single non-scrollable page. This component detects iOS/iPadOS and
 * uses Google Docs Viewer (which renders PDFs as scrollable HTML) as a
 * universal fallback. Desktop browsers get the native iframe experience.
 */
export function StudyHubViewer({ fileUrl, title }: StudyHubViewerProps) {
    const [isIOS, setIsIOS] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Detect iOS and iPadOS (iPadOS reports as MacIntel with touch)
        const ua = navigator.userAgent
        const isIOSDevice = /iPhone|iPad|iPod/.test(ua) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
        setIsIOS(isIOSDevice)
    }, [])

    // Google Docs Viewer works universally — renders PDFs as scrollable HTML pages
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`

    // For non-iOS, use native iframe with the PDF URL directly
    const viewerSrc = isIOS ? googleViewerUrl : `${fileUrl}#toolbar=0`

    return (
        <div className="w-full h-full min-h-[70vh] relative">
            {/* Loading state */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950/80">
                    <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-3" />
                    <p className="text-xs text-slate-400 font-medium">Loading study material...</p>
                </div>
            )}

            {/* PDF Viewer */}
            <iframe
                src={viewerSrc}
                className="w-full h-full min-h-[70vh] border-none"
                title={title}
                onLoad={() => setIsLoading(false)}
                allow="autoplay"
                style={{
                    /* iOS momentum scrolling for embedded content */
                    WebkitOverflowScrolling: "touch",
                }}
            />

            {/* Floating "Open in new tab" button — especially useful on mobile */}
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Full Document</span>
                <span className="sm:hidden">Open</span>
            </a>
        </div>
    )
}
