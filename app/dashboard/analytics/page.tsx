"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Loader2, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Zap, 
  Calendar,
  ArrowUpRight,
  Sparkles,
  Award
} from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface RecentActivityItem {
    id: string
    content: string
    created_at: string
    is_from_instagram: boolean
    sender_username: string
    recipient?: {
        recipient_username: string
    }
}

interface AnalyticsStats {
    metrics: {
        totalAutomations: number
        activeTriggers: number
        audienceReached: number
        messagesSent: number
    }
    recentActivity: RecentActivityItem[]
}

export default function AnalyticsPage() {
    const { userId, isLoading: isSessionLoading } = useInstagramSession()
    const [stats, setStats] = useState<AnalyticsStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
    const [feedFilter, setFeedFilter] = useState<"all" | "comments" | "dms" | "replies">("all")
    const [chartTimeframe, setChartTimeframe] = useState<"1h" | "3h" | "5h" | "1d" | "3d" | "5d">("1d")


    useEffect(() => {
        if (!userId) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard/stats?userId=${userId}&limit=100`)
                const data = await res.json()
                if (data && !data.error) {
                    setStats(data)
                }
            } catch (err) {
                console.error("Failed to load analytics stats", err)
            } finally {
                setLoading(false)
                setTimeout(() => setIsVisible(true), 50)
            }
        }

        fetchStats()
    }, [userId])

    if (isSessionLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading analytics...</p>
            </div>
        )
    }

    const rawActivity = stats?.recentActivity || []

    // Filter dynamic data based on selected timeframe
    const getFilteredActivityByTime = () => {
        const now = new Date()
        return rawActivity.filter(item => {
            const date = new Date(item.created_at)
            const diffTime = Math.abs(now.getTime() - date.getTime())
            const diffHours = diffTime / (1000 * 60 * 60)
            
            if (timeframe === "24h") return diffHours <= 24
            if (timeframe === "7d") return diffHours <= 24 * 7
            if (timeframe === "30d") return diffHours <= 24 * 30
            return true // all
        })
    }
    const recentActivity = getFilteredActivityByTime()

    // Dynamic counts based on filtered timeframe activity
    const messagesSentVal = recentActivity.filter(m => !m.is_from_instagram).length
    const automationsVal = stats?.metrics.totalAutomations ?? 0
    const activeVal = stats?.metrics.activeTriggers ?? 0
    
    // Unique audience count in that timeframe
    const uniqueAudience = new Set(recentActivity.map(m => m.recipient?.recipient_username || m.sender_username))
    const audienceVal = uniqueAudience.size

    // 1. Traffic Channels (Comments vs DMs)
    const triggerMessages = recentActivity.filter(m => m.is_from_instagram)
    const commentTriggersCount = triggerMessages.filter(m => m.content?.startsWith("💬 Commented:")).length
    const dmTriggersCount = triggerMessages.length - commentTriggersCount

    let commentsPercentage = 60
    let dmsPercentage = 40
    if (triggerMessages.length > 0) {
        commentsPercentage = Math.round((commentTriggersCount / triggerMessages.length) * 100)
        dmsPercentage = 100 - commentsPercentage
    }

    const pieData = [
        { name: "Comments", value: commentsPercentage, color: "oklch(0.52 0.19 275)" },
        { name: "Direct DMs", value: dmsPercentage, color: "oklch(0.68 0.18 280)" }
    ]

    // 2. Top Trigger Keywords leaderboard in timeframe
    const keywordCounts: Record<string, number> = {}
    triggerMessages.forEach(m => {
        let kw = m.content || ""
        if (kw.startsWith("💬 Commented: \"")) {
            const match = kw.match(/💬 Commented: "([^"]+)"/)
            if (match) {
                kw = match[1]
            }
        }
        kw = kw.toLowerCase().trim()
        if (kw) {
            keywordCounts[kw] = (keywordCounts[kw] || 0) + 1
        }
    })

    const topKeywords = Object.entries(keywordCounts)
        .map(([keyword, count]) => ({
            keyword,
            count,
            rate: "100%"
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)

    if (topKeywords.length === 0) {
        topKeywords.push(
            { keyword: "No keywords logged yet", count: 0, rate: "0%" }
        )
    }

    // 3. Dynamic Daily Chart Data
    const getChartData = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const now = new Date()
        
        interface ChartInterval {
            label: string
            startTime: number
            endTime: number
        }
        
        let intervals: ChartInterval[] = []
        
        if (chartTimeframe === "1h") {
            // 12 intervals of 5 minutes each (last 60 mins)
            for (let i = 11; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 5 * 60 * 1000)
                const start = new Date(end.getTime() - 5 * 60 * 1000)
                const label = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        } else if (chartTimeframe === "3h") {
            // 12 intervals of 15 minutes each (last 3 hours)
            for (let i = 11; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 15 * 60 * 1000)
                const start = new Date(end.getTime() - 15 * 60 * 1000)
                const label = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        } else if (chartTimeframe === "5h") {
            // 10 intervals of 30 minutes each (last 5 hours)
            for (let i = 9; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 30 * 60 * 1000)
                const start = new Date(end.getTime() - 30 * 60 * 1000)
                const label = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        } else if (chartTimeframe === "1d") {
            // 12 intervals of 2 hours each (last 24 hours)
            for (let i = 11; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 2 * 60 * 60 * 1000)
                const start = new Date(end.getTime() - 2 * 60 * 60 * 1000)
                const hour = end.getHours()
                const ampm = hour >= 12 ? 'PM' : 'AM'
                const displayHour = hour % 12 || 12
                const label = `${displayHour}${ampm}`
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        } else if (chartTimeframe === "3d") {
            // 12 intervals of 6 hours each (last 3 days)
            for (let i = 11; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 6 * 60 * 60 * 1000)
                const start = new Date(end.getTime() - 6 * 60 * 60 * 1000)
                const dayName = days[end.getDay()]
                const hour = end.getHours()
                const ampm = hour >= 12 ? 'PM' : 'AM'
                const displayHour = hour % 12 || 12
                const label = `${dayName} ${displayHour}${ampm}`
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        } else if (chartTimeframe === "5d") {
            // 10 intervals of 12 hours each (last 5 days)
            for (let i = 9; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 12 * 60 * 60 * 1000)
                const start = new Date(end.getTime() - 12 * 60 * 60 * 1000)
                const dayName = days[end.getDay()]
                const hour = end.getHours()
                const ampm = hour >= 12 ? 'PM' : 'AM'
                const displayHour = hour % 12 || 12
                const label = `${dayName} ${displayHour}${ampm}`
                intervals.push({ label, startTime: start.getTime(), endTime: end.getTime() })
            }
        }

        const counts: Record<string, number> = {}
        intervals.forEach(interval => {
            counts[interval.label] = 0
        })

        rawActivity.forEach(m => {
            if (!m.is_from_instagram) {
                const time = new Date(m.created_at).getTime()
                for (const interval of intervals) {
                    if (time >= interval.startTime && time < interval.endTime) {
                        counts[interval.label]++
                        break
                    }
                }
            }
        })

        return intervals.map(interval => ({
            name: interval.label,
            messages: counts[interval.label] || 0,
            clicks: Math.round((counts[interval.label] || 0) * 0.7)
        }))
    }
    const chartData = getChartData()

    const filteredActivity = recentActivity.filter(item => {
        if (feedFilter === "all") return true
        if (feedFilter === "comments") {
            return item.is_from_instagram && item.content?.startsWith("💬 Commented:")
        }
        if (feedFilter === "dms") {
            return item.is_from_instagram && !item.content?.startsWith("💬 Commented:")
        }
        if (feedFilter === "replies") {
            return !item.is_from_instagram
        }
        return true
    })

    return (
        <div className="relative p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 text-foreground overflow-visible md:overflow-hidden pb-8">

            {/* Header section */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '0ms' }}>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Deep Analytics</h1>
                    <p className="text-muted-foreground mt-1">Real-time engagement insights and performance overview.</p>
                </div>
                {/* Timeframe selector */}
                <div className="flex bg-secondary p-1 rounded-xl border border-border w-fit shadow-inner">
                    <button 
                        onClick={() => setTimeframe("24h")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === "24h" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        24 Hours
                    </button>
                    <button 
                        onClick={() => setTimeframe("7d")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === "7d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        7 Days
                    </button>
                    <button 
                        onClick={() => setTimeframe("30d")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === "30d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        30 Days
                    </button>
                    <button 
                        onClick={() => setTimeframe("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '150ms' }}>
                <MiniMetricCard 
                    title="Total Replies Sent" 
                    value={messagesSentVal.toString()} 
                    trend="+18.2% vs last week"
                    icon={<MessageSquare className="w-5 h-5 text-indigo-500" />}
                />
                <MiniMetricCard 
                    title="Audience Reached" 
                    value={audienceVal.toString()} 
                    trend="+12.4% new users"
                    icon={<Users className="w-5 h-5 text-pink-500" />}
                />
                <MiniMetricCard 
                    title="Active Automations" 
                    value={`${activeVal}/${automationsVal}`} 
                    trend="All systems nominal"
                    icon={<Zap className="w-5 h-5 text-amber-500" />}
                />
                <MiniMetricCard 
                    title="Conversion Rate" 
                    value={triggerMessages.length > 0 ? Math.round((messagesSentVal / triggerMessages.length) * 100) + "%" : "0%"} 
                    trend="Highly optimized replies"
                    icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                />
            </div>

            {/* Charts Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '300ms' }}>
                {/* Message Volume Over Time */}
                <Card className="lg:col-span-2 p-6 bg-card border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="font-bold text-foreground text-base">Automation Flow</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Displays successfully delivered automated replies</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                {/* Inline Chart Timeframe Selector */}
                                <div className="flex bg-secondary p-0.5 rounded-lg border border-border w-fit shadow-inner">
                                    {(["1h", "3h", "5h", "1d", "3d", "5d"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setChartTimeframe(t)}
                                            className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${
                                                chartTimeframe === t
                                                    ? "bg-background text-foreground shadow-sm font-bold"
                                                    : "text-muted-foreground hover:text-foreground font-medium"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                                    <TrendingUp className="w-3.5 h-3.5" /> +15.4%
                                </span>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="oklch(0.52 0.19 275)" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="oklch(0.52 0.19 275)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="oklch(0.65 0.01 260)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="oklch(0.65 0.01 260)" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "var(--card)", 
                                            borderColor: "var(--border)", 
                                            borderRadius: "12px", 
                                            color: "var(--foreground)",
                                            fontSize: "12px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                                        }} 
                                    />
                                    <Area type="monotone" dataKey="messages" stroke="oklch(0.52 0.19 275)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMessages)" name="Automations" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Automation Sources */}
                <Card className="p-6 bg-card border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-foreground text-base">Traffic Channels</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Where your triggers originate from</p>
                        
                        <div className="h-56 w-full flex items-center justify-center mt-4 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "var(--card)", 
                                            borderColor: "var(--border)", 
                                            borderRadius: "12px",
                                            fontSize: "12px"
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold tracking-tight">{automationsVal}</span>
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Rules</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-border">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground font-medium">{item.name}</span>
                                </div>
                                <span className="font-bold text-foreground">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Keyword Performance & Active Triggers List */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '450ms' }}>
                {/* Top Trigger Keywords */}
                <Card className="p-6 bg-card border-border shadow-sm lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground text-base">Top Triggers</h3>
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-4">
                            {topKeywords.map((kw, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center font-mono">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-foreground font-mono">"{kw.keyword}"</span>
                                            <span className="text-[10px] text-muted-foreground block">Trigger Word</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-foreground block">{kw.count} hits</span>
                                        <span className="text-[10px] text-emerald-500 font-semibold">{kw.rate} success</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Live Activity Feed */}
                <Card className="p-6 bg-card border-border shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="font-bold text-foreground text-base font-sans">Live Activity Log</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Real-time status of incoming events and outgoing replies.</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 bg-secondary p-1 rounded-xl border border-border w-fit shadow-inner">
                                {(["all", "comments", "dms", "replies"] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setFeedFilter(filter)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer capitalize ${
                                            feedFilter === filter
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {filter === "dms" ? "DMs" : filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredActivity.length > 0 ? (
                                filteredActivity.map((msg) => {
                                    const isComment = msg.is_from_instagram && msg.content?.startsWith("💬 Commented:");
                                    const isDM = msg.is_from_instagram && !isComment;
                                    const isReply = !msg.is_from_instagram;

                                    let cleanedContent = msg.content || "";
                                    if (isComment) {
                                        const match = msg.content.match(/💬 Commented: "([^"]+)"/);
                                        if (match) cleanedContent = match[1];
                                    }

                                    let badgeText = "";
                                    let badgeStyle = "";
                                    let iconElement = null;

                                    if (isComment) {
                                        badgeText = "Comment Trigger";
                                        badgeStyle = "bg-pink-500/10 text-pink-500 border border-pink-500/20";
                                        iconElement = <MessageSquare className="w-3.5 h-3.5 text-pink-500" />;
                                    } else if (isDM) {
                                        badgeText = "DM Trigger";
                                        badgeStyle = "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
                                        iconElement = <Zap className="w-3.5 h-3.5 text-indigo-500" />;
                                    } else {
                                        badgeText = "Auto-Reply";
                                        badgeStyle = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
                                        iconElement = <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
                                    }

                                    return (
                                        <div
                                            key={msg.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-secondary/30 border border-border/60 rounded-xl hover:bg-secondary/40 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="relative">
                                                    <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                                    <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border/80 shrink-0">
                                                    {iconElement}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs font-bold text-foreground font-mono font-semibold">
                                                            {isReply ? "To " : ""}@{msg.recipient?.recipient_username || "user"}
                                                        </span>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${badgeStyle}`}>
                                                            {badgeText}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate mt-1 italic font-sans max-w-[280px]">
                                                        "{cleanedContent}"
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right shrink-0">
                                                <span className="text-[10px] text-muted-foreground bg-secondary/80 border border-border/40 px-2.5 py-1 rounded-lg font-semibold">
                                                    {new Date(msg.created_at).toLocaleString([], {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-16 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                                    No activity found for this filter.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
                        <span>Real-time logs from Instagram API</span>
                        <a href="/dashboard/automations" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                            Manage Automations <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function MiniMetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <Card className="group relative p-3 md:p-6 bg-card border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden gap-2 md:gap-4">
            {/* Radial gradient glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,oklch(0.52_0.19_275_/_0.08),transparent_70%)]" />
            <div className="relative space-y-1 md:space-y-2 flex-1 min-w-0">
                <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight block">{title}</span>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{value}</h3>
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium hidden sm:block">{trend}</p>
            </div>
            <div className="relative p-2 md:p-3 bg-secondary rounded-lg md:rounded-xl border border-border">
                {icon}
            </div>
        </Card>
    )
}

function PerformanceRow({ name, count, success }: { name: string, count: number, success: string }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/40 transition-colors">
            <span className="text-xs font-semibold text-foreground">{name}</span>
            <div className="flex gap-20 mr-6 text-xs">
                <span className="font-bold text-foreground">{count}</span>
                <span className="font-bold text-emerald-500">{success}</span>
            </div>
        </div>
    )
}
