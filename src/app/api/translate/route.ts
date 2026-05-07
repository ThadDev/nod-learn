// ============================================================
// app/api/translate/route.ts
// Proxy endpoint for Google Translate API to handle dynamic
// translations securely (keeps API key on the server).
// ============================================================

import { NextRequest, NextResponse } from "next/server"

// Basic in-memory cache for dynamic translations to reduce API calls
// Key format: `${targetLang}:${text}`
const translationCache = new Map<string, string>()

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json()

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `${targetLang}:${text}`
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ translatedText: translationCache.get(cacheKey) })
    }

    // ── GOOGLE TRANSLATE IMPLEMENTATION ─────────────────────────
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    let translatedText = `[${targetLang.toUpperCase()}] ${text}`; // Fallback mock

    if (apiKey) {
      try {
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              q: text,
              target: targetLang,
              format: "text",
            }),
          }
        );

        const data = await response.json();
        
        if (response.ok && data.data?.translations?.[0]?.translatedText) {
          translatedText = data.data.translations[0].translatedText;
          // Clean up HTML entities Google sometimes returns (e.g. &#39; -> ')
          translatedText = translatedText.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        } else {
          console.warn("[Translation API] API call failed or returned no data:", data.error?.message || "Unknown error");
        }
      } catch (err) {
        console.error("[Translation API] Network error:", err);
      }
    } else {
      console.warn("[Translation API] GOOGLE_TRANSLATE_API_KEY is missing in .env.local. Using mock prefix.");
    }
    // ────────────────────────────────────────────────────────────

    // Store in cache
    translationCache.set(cacheKey, translatedText)

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("[Translation API Error]", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
