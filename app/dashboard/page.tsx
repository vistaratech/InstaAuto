"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Zap, Users, Send, Activity, Loader2, MessageCircle, ArrowUpRight, Search, TrendingUp, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface DashboardStats {
    metrics: {
        totalAutomations: number
        activeTriggers: number
        audienceReached: number
        messagesSent: number
    }
    recentActivity: Array<{
        id: string
        content: string
        created_at: string
        recipient?: {
            recipient_username: string
        }
    }>
}

export default function DashboardPage() {
    const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (!userId) return
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard/stats?userId=${userId}`)
                const data = await res.json()
                if (data && !data.error) setStats(data)
            } catch (err) {
                console.error("Failed to load dashboard stats", err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [userId])

    const handleClearActivity = async () => {
        if (!userId) return
        const confirmClear = window.confirm("Are you sure you want to clear your Recent Activity log?")
        if (!confirmClear) return
        try {
            if (stats) setStats({ ...stats, recentActivity: [] })
            const res = await fetch(`/api/dashboard/clear-activity?userId=${userId}`, { method: "POST" })
            if (res.ok) toast.success("Recent Activity cleared successfully!")
            else toast.error("Failed to clear Recent Activity log.")
        } catch (err) {
            console.error("Failed to clear Recent Activity log:", err)
            toast.error("Failed to clear Recent Activity log.")
        }
    }

    useEffect(() => {
        if (!loading) setTimeout(() => setIsVisible(true), 80)
    }, [loading])

    if (isSessionLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-muted-foreground/40 animate-spin" />
            </div>
        )
    }

    // Greeting based on time
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

    const quickActions = [
        { label: "New Automation", href: "/dashboard/automations?create=true", icon: <Zap className="w-4 h-4" /> },
        { label: "Open Inbox", href: "/dashboard/inbox", icon: <MessageCircle className="w-4 h-4" /> },
        { label: "View Analytics", href: "/dashboard/analytics", icon: <TrendingUp className="w-4 h-4" /> },
    ]

    const statChips = [
        { label: "Automations", value: stats?.metrics.totalAutomations || 0, href: "/dashboard/automations" },
        { label: "Messages Sent", value: stats?.metrics.messagesSent || 0, href: "/dashboard/inbox" },
        { label: "Active Triggers", value: stats?.metrics.activeTriggers || 0, href: "/dashboard/automations" },
        { label: "Audience Reached", value: stats?.metrics.audienceReached || 0, href: "/dashboard/analytics" },
    ]

    return (
        <div className={`flex flex-col items-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Google Search–style Hero Section */}
            <div className="flex flex-col items-center justify-center pt-12 md:pt-20 pb-6 md:pb-10 px-4 w-full max-w-2xl mx-auto">
                
                {/* Large Logo */}
                <img 
                    src="/logo.png" 
                    alt="DMSpark" 
                    className="w-20 h-20 md:w-28 md:h-28 object-contain mb-4 md:mb-6"
                />
                
                {/* Greeting */}
                <h1 className="text-xl md:text-2xl font-normal text-foreground mb-1 text-center">
                    {greeting}, <span className="font-semibold">{username}</span>
                </h1>
                <p className="text-sm text-muted-foreground mb-6 md:mb-8 text-center">
                    What would you like to do today?
                </p>

                {/* Google-style Search/Action Bar */}
                <div className="w-full max-w-xl relative group">
                    <div className="flex items-center w-full h-12 md:h-[52px] rounded-full border border-border bg-background shadow-sm hover:shadow-md transition-shadow duration-200 px-5 gap-3">
                        <Search className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search automations, messages, or actions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                {/* Quick Action Buttons (like "Google Search" & "I'm Feeling Lucky") */}
                <div className="flex items-center gap-2 md:gap-3 mt-6 md:mt-8 flex-wrap justify-center">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/50 hover:border-border text-sm font-medium text-foreground transition-all duration-200 hover:shadow-sm"
                        >
                            {action.icon}
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-border" />

            {/* Stats + Activity Section */}
            <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6">
                
                {/* Stat Chips Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statChips.map((chip) => (
                        <Link
                            key={chip.label}
                            href={chip.href}
                            className="flex flex-col items-center p-4 rounded-xl border border-border bg-background hover:bg-secondary/30 hover:border-border transition-all duration-200 group"
                        >
                            <span className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-[#1a73e8] transition-colors">
                                {chip.value}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1 font-medium">
                                {chip.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
                        <div className="flex items-center gap-3">
                            {stats?.recentActivity && stats.recentActivity.length > 0 && (
                                <button
                                    onClick={handleClearActivity}
                                    className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear
                                </button>
                            )}
                            <Link href="/dashboard/inbox" className="text-xs text-[#1a73e8] font-medium hover:underline flex items-center gap-0.5">
                                View All <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.slice(0, 8).map((msg) => (
                                <Link
                                    key={msg.id}
                                    href="/dashboard/inbox"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#1a73e8]/8 flex items-center justify-center text-[#1a73e8] shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-foreground font-medium truncate group-hover:text-[#1a73e8] transition-colors">
                                            Auto-reply to @{msg.recipient?.recipient_username || "user"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.content}</p>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
                                <MessageCircle className="w-8 h-8 text-muted-foreground/20" />
                                <span>No recent activity yet.</span>
                                <Link href="/dashboard/automations?create=true" className="text-[#1a73e8] font-medium text-xs hover:underline">
                                    Create your first automation →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
