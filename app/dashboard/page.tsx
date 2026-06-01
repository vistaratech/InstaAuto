"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Activity, Users, MessageCircle, Zap, Loader2, Settings, MessageSquare, Plus, Clapperboard, X } from "lucide-react"
import Link from "next/link"

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
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (!userId) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard/stats?userId=${userId}`)
                const data = await res.json()
                if (data && !data.error) {
                    setStats(data)
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [userId])

    if (isSessionLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-5 animate-in fade-in duration-500 max-h-[95vh] overflow-hidden flex flex-col justify-between font-sans">
            {/* Welcome Section with Floating Action Button */}
            <div className="flex items-center justify-between relative shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-none">Welcome back, {username}</h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Here's what's happening with your automations today.</p>
                </div>

                {/* Floating Plus (+) Interactive Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/10 z-50 ${menuOpen ? 'rotate-45' : ''}`}
                        title="Quick Options"
                    >
                        {menuOpen ? <X className="w-4 h-4 md:w-5 md:h-5 transition-transform" /> : <Plus className="w-4 h-4 md:w-5 md:h-5 transition-transform" />}
                    </button>

                    {/* Pop-up Menu */}
                    {menuOpen && (
                        <>
                            {/* Backdrop overlay to close when clicking outside */}
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                            
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                                <div className="px-3 py-2 border-b border-border/50 mb-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Quick Options</span>
                                </div>
                                
                                {/* Option 1: Add Automation */}
                                <Link 
                                    href="/dashboard/automations" 
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-500/10 text-left transition-colors group cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold text-foreground block group-hover:text-blue-500 transition-colors leading-none">Add Automation</span>
                                        <span className="text-[9px] text-muted-foreground mt-1 block">New keyword trigger</span>
                                    </div>
                                </Link>

                                {/* Option 2: View Reels */}
                                <Link 
                                    href="/dashboard/publisher" 
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-500/10 text-left transition-colors group cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                                        <Clapperboard className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold text-foreground block group-hover:text-pink-500 transition-colors leading-none">View Reels</span>
                                        <span className="text-[9px] text-muted-foreground mt-1 block">Schedule content</span>
                                    </div>
                                </Link>

                                {/* Option 3: AI Settings */}
                                <Link 
                                    href="/dashboard/settings" 
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-violet-500/10 text-left transition-colors group cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 group-hover:scale-105 transition-transform">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold text-foreground block group-hover:text-violet-500 transition-colors leading-none">AI Settings</span>
                                        <span className="text-[9px] text-muted-foreground mt-1 block">Manage LLaMA 3 rules</span>
                                    </div>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <StatCard
                    title="Total Automations"
                    value={stats?.metrics.totalAutomations.toString() || "0"}
                    trend="Active"
                    icon={<Zap className="w-4.5 h-4.5 text-blue-500" />}
                />
                <StatCard
                    title="Messages Sent"
                    value={stats?.metrics.messagesSent.toString() || "0"}
                    trend="Lifetime"
                    icon={<MessageCircle className="w-4.5 h-4.5 text-green-500" />}
                />
                <StatCard
                    title="Active Triggers"
                    value={stats?.metrics.activeTriggers.toString() || "0"}
                    trend="Running"
                    icon={<Activity className="w-4.5 h-4.5 text-yellow-500" />}
                />
                <StatCard
                    title="Audience Reached"
                    value={stats?.metrics.audienceReached.toString() || "0"}
                    trend="Unique Users"
                    icon={<Users className="w-4.5 h-4.5 text-red-500" />}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <Card className="p-4.5 bg-card border-border backdrop-blur-sm lg:col-span-2 shadow-sm flex flex-col justify-between overflow-hidden">
                    <h3 className="font-extrabold text-foreground text-sm tracking-tight border-b border-border/50 pb-2.5 shrink-0">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1 scrollbar-thin">
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((msg) => (
                                <Link 
                                    key={msg.id} 
                                    href="/dashboard/inbox"
                                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/60 cursor-pointer"
                                >
                                    <div className="w-8.5 h-8.5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                                        <MessageCircle className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-foreground font-bold truncate leading-none">
                                            Auto-reply to @{msg.recipient?.recipient_username || "user"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate w-full max-w-[300px] mt-1 font-medium">{msg.content}</p>
                                    </div>
                                    <div className="ml-auto text-[9px] text-muted-foreground font-bold whitespace-nowrap bg-secondary px-2 py-0.5 rounded border border-border/30">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-4.5 bg-card/60 border-border backdrop-blur-sm shadow-sm flex flex-col justify-between hover:border-sidebar-border/80 transition-all duration-300 overflow-hidden">
                    <div className="space-y-4 flex flex-col h-full justify-between">
                        <h3 className="font-extrabold text-foreground text-sm tracking-tight border-b border-border/50 pb-2.5 flex items-center gap-2 shrink-0">
                            <Zap className="w-4 h-4 text-blue-500 animate-pulse" /> Quick Access
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5 flex-1 justify-center flex-col flex mt-2">
                            {/* New Automation */}
                            <Link 
                                href="/dashboard/automations" 
                                className="h-14 rounded-xl border border-border bg-card/40 flex flex-row items-center px-3.5 hover:bg-blue-500/5 hover:border-blue-500/35 cursor-pointer transition-all duration-300 group gap-3 shadow-sm hover:shadow-md hover:shadow-blue-500/5"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform duration-200">
                                    <Zap className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                    <span className="text-[11px] font-bold text-foreground block group-hover:text-blue-500 transition-colors duration-200 leading-none">New Automation</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 block truncate font-medium">Configure active replies</span>
                                </div>
                            </Link>

                            {/* Live Inbox */}
                            <Link 
                                href="/dashboard/inbox" 
                                className="h-14 rounded-xl border border-border bg-card/40 flex flex-row items-center px-3.5 hover:bg-emerald-500/5 hover:border-emerald-500/35 cursor-pointer transition-all duration-300 group gap-3 shadow-sm hover:shadow-md hover:shadow-emerald-500/5"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform duration-200">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                    <span className="text-[11px] font-bold text-foreground block group-hover:text-emerald-500 transition-colors duration-200 leading-none">Live Inbox</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 block truncate font-medium">Manage interactive chats</span>
                                </div>
                            </Link>

                            {/* System Preferences */}
                            <Link 
                                href="/dashboard/settings" 
                                className="h-14 rounded-xl border border-border bg-card/40 flex flex-row items-center px-3.5 hover:bg-violet-500/5 hover:border-violet-500/35 cursor-pointer transition-all duration-300 group gap-3 shadow-sm hover:shadow-md hover:shadow-violet-500/5"
                            >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 group-hover:scale-105 transition-transform duration-200">
                                    <Settings className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                    <span className="text-[11px] font-bold text-foreground block group-hover:text-violet-500 transition-colors duration-200 leading-none">AI Settings</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5 block truncate font-medium">Configure preferences</span>
                                </div>
                            </Link>
                        </div>
                        <div className="pt-2.5 border-t border-border text-center shrink-0">
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest block opacity-75">DMSpark Enterprise Edition</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <Card className="p-3.5 bg-card border-border hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <span className="p-2 bg-secondary rounded-lg ring-1 ring-border group-hover:ring-primary/30 group-hover:bg-primary/5 transition-all shrink-0">{icon}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground tracking-wider uppercase">
                    {trend}
                </span>
            </div>
            <div className="mt-6">
                <p className="text-3xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{value}</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">{title}</p>
            </div>
        </Card>
    )
}

