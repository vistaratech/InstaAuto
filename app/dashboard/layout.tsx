"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Loader2, ChevronLeft, ChevronRight, Compass, Copy, Check, ExternalLink, MoreVertical, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { username, userId, logout, isLoading, error } = useInstagramSession()
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>(undefined)
    const [isInAppBrowser, setIsInAppBrowser] = useState(false)
    const [copied, setCopied] = useState(false)

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

    // Load collapsed state preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        if (saved === "true") {
            setIsCollapsed(true)
        }
    }, [])

    const handleToggleCollapse = () => {
        const nextState = !isCollapsed
        setIsCollapsed(nextState)
        localStorage.setItem("sidebar-collapsed", String(nextState))
    }

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

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 relative">
            {/* Collapse Toggle Button (Desktop Only) */}
            <button
                onClick={handleToggleCollapse}
                className={cn(
                    "hidden md:inline-flex fixed top-[36px] z-[60] w-6 h-6 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95",
                    isCollapsed ? "left-[52px]" : "left-[244px]"
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                )}
            </button>

            {/* Desktop Sidebar */}
            <div className={cn(
                "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-40 transition-all duration-300",
                isCollapsed ? "md:w-16" : "md:w-64"
            )}>
                <Sidebar
                    className="h-full border-r border-sidebar-border bg-sidebar"
                    username={username || "User"}
                    profilePictureUrl={profilePictureUrl}
                    onLogout={logout}
                    isCollapsed={isCollapsed}
                />
            </div>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isCollapsed ? "md:pl-16" : "md:pl-64"
            )}>
                {/* Mobile Header (Visible only on small screens) */}
                <header className="md:hidden h-16 border-b border-border bg-card flex items-center justify-start gap-2 px-4 sticky top-0 z-40 transition-colors duration-300">
                    <MobileNav username={username || "User"} profilePictureUrl={profilePictureUrl} onLogout={logout} />
                    <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent ml-1">DMSpark</span>
                </header>

                <main className="flex-1 relative overflow-auto md:overflow-hidden h-[calc(100dvh-4rem)] md:h-dvh flex flex-col">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm m-4 rounded-lg shrink-0 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
                            <span>Login Error: {error}</span>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto w-full h-full flex flex-col relative">
                        {/* Premium Global Fixed Ambient Background Glows */}
                        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                            <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[100px] animate-pulse animate-duration-10000" />
                        </div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
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


