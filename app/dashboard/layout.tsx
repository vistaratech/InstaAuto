"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { username, userId, logout, isLoading, error } = useInstagramSession()
    const router = useRouter()

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
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
                <Sidebar
                    className="h-full border-r border-sidebar-border bg-sidebar"
                    username={username || "User"}
                    onLogout={logout}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
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

