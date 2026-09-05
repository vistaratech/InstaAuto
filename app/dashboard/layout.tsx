"use client"

import { useState, useEffect, useCallback } from "react"
import { TopNavbar } from "@/components/layout/top-navbar"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { WelcomeScreen } from "@/components/ui/welcome-screen"
import { Loader2, Compass, Copy, Check, MoreVertical, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { username, userId, logout, isLoading, error } = useInstagramSession()
    const router = useRouter()
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>(undefined)
    const [isInAppBrowser, setIsInAppBrowser] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showWelcome, setShowWelcome] = useState(false)

    // Show welcome screen for first-time connections
    useEffect(() => {
        if (!userId || !username) return
        const welcomed = sessionStorage.getItem("dmspark_welcomed")
        if (!welcomed) {
            setShowWelcome(true)
        }
    }, [userId, username])

    const handleWelcomeComplete = useCallback(() => {
        sessionStorage.setItem("dmspark_welcomed", "true")
        setShowWelcome(false)
    }, [])

    // Detect Instagram App in-app browser webview
    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInstagramWebView = ua.indexOf("Instagram") > -1 || ua.indexOf("FBAN/Instagram") > -1 || ua.indexOf("FBAV") > -1;
        setIsInAppBrowser(isInstagramWebView);
    }, [])

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Fetch Instagram profile picture dynamically
    useEffect(() => {
        if (!userId) return

        const fetchProfilePicture = async () => {
            try {
                const res = await fetch(`/api/instagram/profile-picture?userId=${userId}`)
                const data = await res.json()
                if (data.success && data.profilePictureUrl) {
                    setProfilePictureUrl(data.profilePictureUrl)
                }
            } catch (err) {
                console.error("Failed to fetch profile picture:", err)
            }
        }

        fetchProfilePicture()
    }, [userId])

    useEffect(() => {
        if (!isLoading && !userId) {
            router.replace("/")
        }
    }, [isLoading, userId, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Show Welcome to DMSpark screen for first-time connections
    if (showWelcome && userId && username) {
        return (
            <WelcomeScreen
                username={username}
                userId={userId}
                onComplete={handleWelcomeComplete}
            />
        )
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300 relative">
            {/* Google-style Top Navigation Bar */}
            <TopNavbar
                username={username || "User"}
                profilePictureUrl={profilePictureUrl}
                onLogout={logout}
            />

            {/* Main Content Area — full width, scrollable, centered */}
            <main className="w-full min-h-[calc(100vh-3.5rem)]">
                {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm mx-4 mt-4 rounded-lg flex items-center gap-2 max-w-4xl lg:mx-auto">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
                        <span>Login Error: {error}</span>
                    </div>
                )}
                {children}
            </main>

            {/* Instagram Webview Browser Breakout Overlay */}
            {isInAppBrowser && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/98 backdrop-blur-xl p-4 sm:p-6 text-white select-none font-sans">
                    <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                        {/* Glowing Background Art */}
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                        
                        <div className="relative flex flex-col items-center">
                            {/* Animated Glowing Icon Ring */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-bounce">
                                <Compass className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Almost Connected! 🚀
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                                You are currently inside the Instagram App browser. To access your Dashboard securely, please open this link in your standard web browser (Safari or Chrome).
                            </p>
                        </div>

                        {/* Interactive Steps */}
                        <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 text-left space-y-3.5">
                            <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                                <p className="leading-relaxed font-semibold">
                                    Click the **three dots menu (<MoreVertical className="inline-block w-4 h-4 text-slate-400 align-middle" />)** or **Share icon** at the top right corner of your screen.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                                <p className="leading-relaxed font-semibold">
                                    Select **"Open in System Browser"** or **"Open in Safari"** from the options.
                                </p>
                            </div>
                        </div>

                        {/* Quick Copy Link Helper */}
                        <div className="pt-2">
                            <button
                                onClick={handleCopyLink}
                                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 font-bold text-xs uppercase tracking-wider transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-white"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-400" /> Link Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 text-slate-300" /> Copy Dashboard Link
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            DMSpark Secure Redirect
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
