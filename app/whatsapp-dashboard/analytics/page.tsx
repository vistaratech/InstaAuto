"use client"

import { useEffect, useState, useRef } from "react"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"
import { Card } from "@/components/ui/card"
import { 
  Loader2, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Zap, 
  ArrowUpRight,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie,
  Cell
} from "recharts"

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (value === 0) { setCount(0); return }
        
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
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

export default function WhatsAppAnalyticsPage() {
    const { waUsername, waUserId, isLoading: sessionLoading } = useWhatsAppSession()
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
    const [feedFilter, setFeedFilter] = useState<"all" | "incoming" | "reply">("all")
    const [chartTimeframe, setChartTimeframe] = useState<"1d" | "3d" | "5d">("1d")

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
            setIsVisible(true)
        }, 600)
        return () => clearTimeout(timer)
    }, [])

    if (sessionLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-emerald-500/30 animate-ping" />
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading WhatsApp analytics...</p>
            </div>
        )
    }

    // Static Mock Data for WhatsApp Dashboard
    const mockWebhooks = [
        { id: "w1", type: "incoming", phone: "+91 98765 43210", content: "price details", time: "10:30 AM", trigger: "price" },
        { id: "w2", type: "reply", phone: "+91 98765 43210", content: "Here is our catalog with details!", time: "10:30 AM", status: "delivered" },
        { id: "w3", type: "incoming", phone: "+91 88776 55443", content: "discount code", time: "09:15 AM", trigger: "discount" },
        { id: "w4", type: "reply", phone: "+91 88776 55443", content: "Use coupon code DMSPARK50 for 50% off!", time: "09:15 AM", status: "read" },
        { id: "w5", type: "incoming", phone: "+91 76543 21098", content: "hi, is this open?", time: "Yesterday", trigger: "hi" },
        { id: "w6", type: "reply", phone: "+91 76543 21098", content: "Hello! Yes, we are open until 8 PM.", time: "Yesterday", status: "read" }
    ]

    const filteredWebhooks = mockWebhooks.filter(w => {
        if (feedFilter === "all") return true
        return w.type === feedFilter
    })

    // Recharts Data
    const chartDataMap = {
        "1d": [
            { name: "08:00", messages: 12, deliveries: 12 },
            { name: "10:00", messages: 28, deliveries: 28 },
            { name: "12:00", messages: 34, deliveries: 33 },
            { name: "14:00", messages: 45, deliveries: 45 },
            { name: "16:00", messages: 29, deliveries: 29 },
            { name: "18:00", messages: 52, deliveries: 51 },
            { name: "20:00", messages: 68, deliveries: 68 },
            { name: "22:00", messages: 16, deliveries: 16 }
        ],
        "3d": [
            { name: "Day 1", messages: 184, deliveries: 183 },
            { name: "Day 2", messages: 242, deliveries: 241 },
            { name: "Day 3 (Today)", messages: 284, deliveries: 284 }
        ],
        "5d": [
            { name: "Day 1", messages: 120, deliveries: 120 },
            { name: "Day 2", messages: 164, deliveries: 163 },
            { name: "Day 3", messages: 184, deliveries: 183 },
            { name: "Day 4", messages: 242, deliveries: 241 },
            { name: "Day 5 (Today)", messages: 284, deliveries: 284 }
        ]
    }

    const pieData = [
        { name: "Automated Rules", value: 72, color: "#10b981" }, // emerald-500
        { name: "Custom Manual DMs", value: 28, color: "#14b8a6" } // teal-500
    ]

    const topKeywords = [
        { keyword: "price", count: 142, rate: "100%" },
        { keyword: "discount", count: 98, rate: "98.9%" },
        { keyword: "location", count: 34, rate: "100%" },
        { keyword: "catalog", count: 10, rate: "100%" }
    ]

    return (
        <div className="relative p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 text-foreground overflow-visible md:overflow-hidden pb-8">
            
            {/* Header section */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">WhatsApp Analytics</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-semibold">Real-time WhatsApp API engagement insights and template delivery status.</p>
                </div>
                {/* Timeframe Selector */}
                <div className="flex bg-secondary p-1 rounded-xl border border-border w-fit shadow-inner">
                    {(["24h", "7d", "30d", "all"] as const).map((t) => (
                        <button 
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${timeframe === t ? "bg-background text-emerald-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            {t === "all" ? "All Time" : t === "24h" ? "24 Hours" : t === "7d" ? "7 Days" : "30 Days"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '100ms' }}>
                <Card className="group relative p-3 md:p-6 bg-card/60 border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-500/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden gap-2 md:gap-4">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    <div className="relative space-y-1 md:space-y-2 flex-1 min-w-0">
                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight block">Total WhatsApp Replies</span>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground"><AnimatedCounter value={284} /></h3>
                        <p className="text-[9px] md:text-[10px] text-emerald-500 font-bold hidden sm:block">+24.5% vs last week</p>
                    </div>
                    <div className="relative p-2 md:p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                </Card>

                <Card className="group relative p-3 md:p-6 bg-card/60 border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-500/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden gap-2 md:gap-4">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    <div className="relative space-y-1 md:space-y-2 flex-1 min-w-0">
                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight block">Contacts Reached</span>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground"><AnimatedCounter value={94} /></h3>
                        <p className="text-[9px] md:text-[10px] text-teal-500 font-bold hidden sm:block">+12.3% active chat threads</p>
                    </div>
                    <div className="relative p-2 md:p-3 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
                        <Users className="w-5 h-5" />
                    </div>
                </Card>

                <Card className="group relative p-3 md:p-6 bg-card/60 border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-500/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden gap-2 md:gap-4">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    <div className="relative space-y-1 md:space-y-2 flex-1 min-w-0">
                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight block">Active Rules</span>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground">5/5</h3>
                        <p className="text-[9px] md:text-[10px] text-emerald-500 font-bold hidden sm:block">Automations listener active</p>
                    </div>
                    <div className="relative p-2 md:p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                        <Zap className="w-5 h-5" />
                    </div>
                </Card>

                <Card className="group relative p-3 md:p-6 bg-card/60 border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-500/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden gap-2 md:gap-4">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    <div className="relative space-y-1 md:space-y-2 flex-1 min-w-0">
                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight block">Template Delivery Rate</span>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground">99.6%</h3>
                        <p className="text-[9px] md:text-[10px] text-emerald-500 font-bold hidden sm:block">Meta API healthy</p>
                    </div>
                    <div className="relative p-2 md:p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '200ms' }}>
                
                {/* Delivery Flow Chart */}
                <Card className="lg:col-span-2 p-6 bg-card/60 border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="font-extrabold text-foreground text-base">WhatsApp Msg delivery volume</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Total messages processed and successfully sent via Webhook API</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                <div className="flex bg-secondary p-0.5 rounded-lg border border-border w-fit shadow-inner">
                                    {(["1d", "3d", "5d"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setChartTimeframe(t)}
                                            className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${
                                                chartTimeframe === t
                                                    ? "bg-background text-emerald-500 shadow-sm font-bold"
                                                    : "text-muted-foreground hover:text-foreground font-medium"
                                            }`}
                                        >
                                            {t === "1d" ? "Today" : t === "3d" ? "3 Days" : "5 Days"}
                                        </button>
                                    ))}
                                </div>
                                <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                                    <TrendingUp className="w-3.5 h-3.5" /> +24.5%
                                </span>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartDataMap[chartTimeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                                    <Area type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWa)" name="Total Messages" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Message Breakdown Channel */}
                <Card className="p-6 bg-card/60 border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-extrabold text-foreground text-base">Traffic Channels</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Message automation trigger types</p>
                        
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
                                <span className="text-2xl font-black tracking-tight">5</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rules Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-border">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground font-medium">{item.name}</span>
                                </div>
                                <span className="font-extrabold text-foreground">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Keyword Performance & Webhook Logs */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '300ms' }}>
                {/* Keywords leaderboard */}
                <Card className="p-6 bg-card/60 border-border shadow-sm lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-extrabold text-foreground text-sm tracking-tight">Top Keyword Triggers</h3>
                            <Award className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            {topKeywords.map((kw, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 font-extrabold text-xs flex items-center justify-center font-mono">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-foreground font-mono">"{kw.keyword}"</span>
                                            <span className="text-[10px] text-muted-foreground block font-semibold mt-0.5">Trigger Word</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-foreground block">{kw.count} hits</span>
                                        <span className="text-[10px] text-emerald-500 font-bold">{kw.rate} success</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Webhook log feed */}
                <Card className="p-6 bg-card/60 border-border shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="font-extrabold text-foreground text-sm tracking-tight font-sans">Live Webhook Log Feed</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Real-time status of incoming events and template replies.</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 bg-secondary p-1 rounded-xl border border-border w-fit shadow-inner">
                                {(["all", "incoming", "reply"] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setFeedFilter(filter)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer capitalize ${
                                            feedFilter === filter
                                                ? "bg-background text-emerald-500 shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {filter === "reply" ? "Outgoing Replies" : filter === "incoming" ? "Incoming Triggers" : "All Events"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredWebhooks.map((msg) => {
                                const isIncoming = msg.type === "incoming";
                                let badgeText = isIncoming ? "Trigger Detected" : "Reply Sent";
                                let badgeStyle = isIncoming 
                                    ? "bg-teal-500/10 text-teal-500 border border-teal-500/20" 
                                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
                                let iconElement = isIncoming 
                                    ? <Users className="w-3.5 h-3.5 text-teal-500" /> 
                                    : <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;

                                return (
                                    <div
                                        key={msg.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-secondary/35 border border-border/60 rounded-xl hover:bg-secondary/40 transition-all duration-200"
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
                                                    <span className="text-xs font-bold text-foreground font-mono">
                                                        {msg.phone}
                                                    </span>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeStyle}`}>
                                                        {badgeText}
                                                    </span>
                                                    {msg.trigger && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700 font-mono">
                                                            KW: {msg.trigger}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate mt-1 italic font-sans max-w-[280px]">
                                                    "{msg.content}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right shrink-0">
                                            <span className="text-[10px] text-muted-foreground bg-secondary/80 border border-border/40 px-2.5 py-1 rounded-lg font-bold">
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground font-semibold">
                        <span>Real-time logs from WhatsApp Cloud API webhook</span>
                        <a href="/whatsapp-dashboard/automations" className="text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                            Manage Templates <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </Card>

            </div>
            
        </div>
    )
}
