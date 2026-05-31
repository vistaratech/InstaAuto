"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
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
                    "hidden md:flex fixed top-[20px] z-[60] w-8 h-8 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95",
                    isCollapsed ? "left-[48px]" : "left-[240px]"
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
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
                <header className="md:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-40 transition-colors duration-300">
                    <span className="font-bold text-lg tracking-tight text-foreground">Insta Autobot</span>
                    <MobileNav username={username || "User"} onLogout={logout} />
                </header>

                <main className="flex-1 relative overflow-auto">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm m-4 rounded-lg">
                            ⚠️ Login Error: {error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    )
}


