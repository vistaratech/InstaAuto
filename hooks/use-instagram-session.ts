"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export function useInstagramSession() {
    const [username, setUsername] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const code = searchParams.get("code")

        const handleSession = async () => {
            // CASE A: New Login from Instagram
            if (code) {
                // Prevent double-fire: check if we already processed this code
                const processedCode = sessionStorage.getItem("ig_processed_code")
                if (processedCode === code) {
                    // Already processed, just restore session
                    const savedId = localStorage.getItem("ig_user_id")
                    const savedName = localStorage.getItem("ig_username")
                    if (savedId && savedName) {
                        setUserId(savedId)
                        setUsername(savedName)
                        router.replace("/dashboard")
                    }
                    setIsLoading(false)
                    return
                }

                try {
                    console.log("[Insta Autobot] 🔄 Exchanging code for token...")
                    const res = await fetch("/api/instagram/callback", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                    })
                    const data = await res.json()
                    console.log("[Insta Autobot] 📋 Callback response:", data)

                    if (data.success) {
                        localStorage.setItem("ig_user_id", data.userId)
                        localStorage.setItem("ig_username", data.username)
                        sessionStorage.setItem("ig_processed_code", code)

                        setUserId(data.userId)
                        setUsername(data.username)
                        setError(null)
                        // Remove code from URL
                        router.replace("/dashboard")
                    } else {
                        console.error("[Insta Autobot] ❌ Login failed:", data.error)
                        setError(data.error || "Login failed")
                    }
                } catch (err: any) {
                    console.error("[Insta Autobot] ❌ Login error:", err)
                    setError(err.message || "Network error during login")
                }
            }
            // CASE B: Restore Session from LocalStorage
            else {
                const savedId = localStorage.getItem("ig_user_id")
                const savedName = localStorage.getItem("ig_username")

                if (savedId && savedName) {
                    setUserId(savedId)
                    setUsername(savedName)
                }
            }
            setIsLoading(false)
        }

        handleSession()
    }, [searchParams, router])

    const logout = () => {
        localStorage.removeItem("ig_user_id")
        localStorage.removeItem("ig_username")
        sessionStorage.removeItem("ig_processed_code")
        document.cookie = "insta_session=; Max-Age=0; path=/;"
        setUsername(null)
        setUserId(null)
        setError(null)
        router.push("/")
    }

    return { userId, username, isLoading, error, logout }
}

