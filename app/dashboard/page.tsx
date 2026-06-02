"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Activity, Users, MessageCircle, Zap, Loader2, Settings, MessageSquare, ArrowUpRight, Sparkles, TrendingUp, Send, Plus, ChevronDown } from "lucide-react"
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

// Animated Counter Component
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (value === 0) { setCount(0); return }
        
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            countRef.current = Math.floor(eased * value)
            setCount(countRef.current)
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }
        
        startTimeRef.current = null
        requestAnimationFrame(animate)
    }, [value, duration])

    return <>{count}</>
}

// Mini Sparkline Component
function MiniSparkline({ color, data }: { color: string; data: number[] }) {
    const max = Math.max(...data, 1)
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - (v / max) * 80
        return `${x},${y}`
    }).join(" ")

    return (
        <svg viewBox="0 0 100 100" className="w-full h-10 mt-2 opacity-60" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="drop-shadow-sm"
            />
            <polygon
                fill={`url(#grad-${color})`}
                points={`0,100 ${points} 100,100`}
            />
        </svg>
    )
}

// Greeting based on time
function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
}

export default function DashboardPage() {
    const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsQuickAccessOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

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

    // Trigger entrance animations
    useEffect(() => {
        if (!loading) {
            setTimeout(() => setIsVisible(true), 100)
        }
    }, [loading])

    if (isSessionLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium animate-pulse">Loading your dashboard...</span>
                </div>
            </div>
        )
    }

    const brandColor = "#1a73e8"

    const statCards = [
        {
            title: "Total Automations",
            value: stats?.metrics.totalAutomations || 0,
            trend: "Active",
            icon: <Zap className="w-5 h-5" />,
            href: "/dashboard/automations",
            color: brandColor,
            gradient: "from-[#1a73e8]/10 to-[#1a73e8]/5",
            borderHover: "hover:border-[#1a73e8]/40",
            iconBg: "bg-[#1a73e8]/10",
            iconBorder: "border-[#1a73e8]/20",
            sparkData: [1, 3, 2, 5, 4, 6, stats?.metrics.totalAutomations || 2],
        },
        {
            title: "Messages Sent",
            value: stats?.metrics.messagesSent || 0,
            trend: "Lifetime",
            icon: <Send className="w-5 h-5" />,
            href: "/dashboard/inbox",
            color: brandColor,
            gradient: "from-[#1a73e8]/10 to-[#1a73e8]/5",
            borderHover: "hover:border-[#1a73e8]/40",
            iconBg: "bg-[#1a73e8]/10",
            iconBorder: "border-[#1a73e8]/20",
            sparkData: [2, 4, 3, 7, 5, 8, stats?.metrics.messagesSent || 3],
        },
        {
            title: "Active Triggers",
            value: stats?.metrics.activeTriggers || 0,
            trend: "Running",
            icon: <Activity className="w-5 h-5" />,
            href: "/dashboard/automations",
            color: brandColor,
            gradient: "from-[#1a73e8]/10 to-[#1a73e8]/5",
            borderHover: "hover:border-[#1a73e8]/40",
            iconBg: "bg-[#1a73e8]/10",
            iconBorder: "border-[#1a73e8]/20",
            sparkData: [1, 2, 1, 3, 2, 4, stats?.metrics.activeTriggers || 1],
        },
        {
            title: "Audience Reached",
            value: stats?.metrics.audienceReached || 0,
            trend: "Unique Users",
            icon: <Users className="w-5 h-5" />,
            href: "/dashboard/analytics",
            color: brandColor,
            gradient: "from-[#1a73e8]/10 to-[#1a73e8]/5",
            borderHover: "hover:border-[#1a73e8]/40",
            iconBg: "bg-[#1a73e8]/10",
            iconBorder: "border-[#1a73e8]/20",
            sparkData: [1, 3, 2, 4, 3, 5, stats?.metrics.audienceReached || 2],
        },
    ]

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-5 font-sans min-h-full flex flex-col pb-8">
            
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] bg-[#1a73e8]/[0.04] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-[#1a73e8]/[0.03] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#1a73e8]/[0.02] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
            </div>

            {/* Welcome Section */}
            <div 
                className={`flex items-center justify-between relative shrink-0 z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg md:text-xl">👋</span>
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">{getGreeting()}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-none">
                        Welcome back, <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{username}</span>
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1.5 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Your automations are running smoothly.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full border border-border/50 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid with Animated Cards */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 shrink-0 z-10 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {statCards.map((stat, index) => (
                    <Link 
                        key={stat.title}
                        href={stat.href}
                    >
                        <Card 
                            className={`relative overflow-hidden p-3 md:p-4 bg-gradient-to-br ${stat.gradient} border-border ${stat.borderHover} transition-all duration-500 shadow-sm hover:shadow-lg cursor-pointer group h-full`}
                            style={{ transitionDelay: `${index * 75}ms` }}
                        >
                            {/* Hover Glow Effect */}
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}10, transparent 70%)` }}
                            />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <span className={`p-2 ${stat.iconBg} rounded-xl border ${stat.iconBorder} group-hover:scale-110 transition-transform duration-300`}
                                    style={{ color: stat.color }}>
                                    {stat.icon}
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground tracking-wider uppercase border border-border/30 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#1a73e8] animate-pulse" />
                                    {stat.trend}
                                </span>
                            </div>
                            
                            <div className="mt-3 md:mt-4 relative z-10">
                                <p className="text-2xl md:text-3xl font-black text-foreground tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                                    <AnimatedCounter value={stat.value} />
                                </p>
                                <p className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">{stat.title}</p>
                            </div>

                            {/* Mini Sparkline */}
                            <MiniSparkline color={stat.color} data={stat.sparkData} />
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Bottom Section */}
            <div className={`grid grid-cols-1 gap-4 md:gap-6 md:flex-1 md:min-h-0 shrink-0 md:shrink z-10 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Recent Activity */}
                <Card className="p-3.5 md:p-4.5 bg-card/80 backdrop-blur-md border-border shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow duration-300 w-full">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2.5 shrink-0">
                        <h3 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                            Recent Activity
                        </h3>
                        <Link href="/dashboard/inbox" className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 md:space-y-2 mt-2 md:mt-3 pr-1 scrollbar-thin max-h-[250px] md:max-h-none">
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((msg, index) => (
                                <Link 
                                    key={msg.id} 
                                    href="/dashboard/inbox"
                                    className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/60 cursor-pointer group/item"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Live Pulse Indicator */}
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200/50 dark:border-blue-500/30 group-hover/item:scale-105 transition-transform">
                                            <MessageCircle className="w-4 h-4" />
                                        </div>
                                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-foreground font-bold truncate leading-none group-hover/item:text-primary transition-colors">
                                            Auto-reply to @{msg.recipient?.recipient_username || "user"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate w-full max-w-[300px] mt-1 font-medium">{msg.content}</p>
                                    </div>
                                    <div className="ml-auto text-[9px] text-muted-foreground font-bold whitespace-nowrap bg-secondary/80 px-2 py-1 rounded-lg border border-border/30">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
                                <MessageCircle className="w-8 h-8 text-muted-foreground/30" />
                                <span>No recent activity yet.</span>
                                <Link href="/dashboard/automations" className="text-primary font-bold text-[10px] hover:underline">Create your first automation →</Link>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Floating Quick Access FAB & Popup */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={popupRef}>
                {isQuickAccessOpen && (
                    <div className="mb-3 w-[260px] bg-card border border-border/80 rounded-2xl shadow-2xl p-2.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
                        <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-1">
                            <span className="w-5 h-5 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center">
                                <Zap className="w-3 h-3 text-[#1a73e8]" />
                            </span>
                            <span className="text-xs font-extrabold text-foreground tracking-tight">Quick Access Menu</span>
                        </div>
                        
                        {/* New Automation */}
                        <Link 
                            href="/dashboard/automations" 
                            onClick={() => setIsQuickAccessOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-500/5 hover:border-blue-500/35 border border-transparent transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <span className="text-[11px] font-extrabold text-foreground block group-hover:text-blue-500 transition-colors">New Automation</span>
                                <span className="text-[9px] text-muted-foreground block truncate">Configure active replies</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>

                        {/* Live Inbox */}
                        <Link 
                            href="/dashboard/inbox" 
                            onClick={() => setIsQuickAccessOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1a73e8]/5 hover:border-[#1a73e8]/35 border border-transparent transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#1a73e8]/15 flex items-center justify-center text-[#1a73e8] group-hover:scale-105 transition-transform">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <span className="text-[11px] font-extrabold text-foreground block group-hover:text-[#1a73e8] transition-colors">Live Inbox</span>
                                <span className="text-[9px] text-muted-foreground block truncate">Manage interactive chats</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-[#1a73e8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>

                        {/* AI Settings */}
                        <Link 
                            href="/dashboard/settings" 
                            onClick={() => setIsQuickAccessOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1a73e8]/5 hover:border-[#1a73e8]/35 border border-transparent transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#1a73e8]/15 flex items-center justify-center text-[#1a73e8] group-hover:scale-105 transition-transform">
                                <Settings className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <span className="text-[11px] font-extrabold text-foreground block group-hover:text-[#1a73e8] transition-colors">AI Settings</span>
                                <span className="text-[9px] text-muted-foreground block truncate">Configure preferences</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-[#1a73e8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>
                    </div>
                )}
                
                <button
                    onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a73e8] to-blue-600 text-white flex items-center justify-center shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 group relative border border-white/10"
                >
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a73e8] to-blue-600 blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-300" />
                    <Plus className={`w-6 h-6 relative z-10 transition-transform duration-300 ${isQuickAccessOpen ? 'rotate-45' : ''}`} />
                </button>
            </div>
        </div>
    )
}
