"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"
import { Activity, Users, MessageCircle, Zap, TrendingUp, Sparkles, Plus, ArrowUpRight, MessageSquare, Shield, Clock } from "lucide-react"
import Link from "next/link"

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

function MiniSparkline({ color, data }: { color: string; data: number[] }) {
    const max = Math.max(...data, 1)
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - (v / max) * 80
        return `${x},${y}`
    }).join(" ")

    return (
        <svg viewBox="0 0 100 100" className="w-full h-10 mt-2 opacity-60" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    )
}

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
}

export default function WhatsAppDashboardPage() {
    const { waUsername, waUserId } = useWhatsAppSession()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="p-4 md:p-8 space-y-6 text-foreground min-h-[90vh] flex flex-col justify-between font-sans relative z-10 animate-in fade-in duration-500">
            
            {/* Top Header Panel */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mb-1 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Workspace
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        {getGreeting()}, <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{waUsername || "WhatsApp Business"}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-semibold">
                        Your WhatsApp auto-reply flows are active and running.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
                        <Link href="/whatsapp-dashboard/automations">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Rule
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Metrics cards grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <Card className="p-5 bg-card/60 backdrop-blur-md border border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                        <span className="text-[10px] font-black text-muted-foreground/60 tracking-wider uppercase">Active WhatsApp Rules</span>
                        <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Zap className="w-4 h-4" />
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            <AnimatedCounter value={5} />
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Trigger keywords listening
                        </p>
                    </div>
                </Card>

                <Card className="p-5 bg-card/60 backdrop-blur-md border border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                        <span className="text-[10px] font-black text-muted-foreground/60 tracking-wider uppercase">WhatsApp Messages Sent</span>
                        <span className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
                            <MessageSquare className="w-4 h-4" />
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            <AnimatedCounter value={284} />
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                            Replies sent globally
                        </p>
                        <MiniSparkline color="#14b8a6" data={[5, 10, 8, 15, 20, 18, 28]} />
                    </div>
                </Card>

                <Card className="p-5 bg-card/60 backdrop-blur-md border border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                        <span className="text-[10px] font-black text-muted-foreground/60 tracking-wider uppercase">Contacts Reached</span>
                        <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                            <Users className="w-4 h-4" />
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            <AnimatedCounter value={94} />
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                            Unique business clients
                        </p>
                    </div>
                </Card>

                <Card className="p-5 bg-card/60 backdrop-blur-md border border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                        <span className="text-[10px] font-black text-muted-foreground/60 tracking-wider uppercase">Campaign Conversion</span>
                        <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <TrendingUp className="w-4 h-4" />
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            32.5%
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                            Link click-through success
                        </p>
                        <MiniSparkline color="#10b981" data={[30, 28, 32, 29, 35, 30, 32.5]} />
                    </div>
                </Card>
            </div>

            {/* Main Area: Recent Webhook Logs and Quick Access */}
            <div className={`flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 items-stretch transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                
                {/* Left Columns: Recent activity logs */}
                <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur-md border-border shadow-sm flex flex-col justify-between min-h-[300px]">
                    <div className="space-y-4 flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2.5 shrink-0 select-none">
                            <h3 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" /> Live Activity Feed
                            </h3>
                            <span className="text-[10px] text-muted-foreground font-semibold">Real-time webhooks</span>
                        </div>

                        {/* Logs */}
                        <div className="flex-1 overflow-y-auto hover-scrollbar space-y-2.5 pr-1 py-1 max-h-[220px]">
                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center justify-between text-xs font-semibold leading-relaxed hover:bg-secondary/50 transition-colors">
                                <span className="text-slate-700 dark:text-slate-350">💬 +91 98765 43210: "price info"</span>
                                <span className="text-emerald-500 font-extrabold flex items-center gap-1">Sent Auto DM <ArrowUpRight className="w-3.5 h-3.5" /></span>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center justify-between text-xs font-semibold leading-relaxed hover:bg-secondary/50 transition-colors">
                                <span className="text-slate-700 dark:text-slate-350">💬 +91 88776 55443: "coupon discount"</span>
                                <span className="text-emerald-500 font-extrabold flex items-center gap-1">Sent Auto DM <ArrowUpRight className="w-3.5 h-3.5" /></span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border/40 text-center shrink-0">
                            <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Awaiting WhatsApp triggers...</span>
                        </div>
                    </div>
                </Card>

                {/* Right Column: Quick Feature setup checklist */}
                <Card className="p-5 bg-card/60 backdrop-blur-md border-border shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-foreground text-sm tracking-tight border-b border-border/50 pb-2.5">
                            WhatsApp Quick Guide
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Configure webhook</h4>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-semibold">Copy your verification challenge token in Settings and add it to your Facebook App console.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Configure replies</h4>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-semibold">Build WhatsApp templates and associate them to keyword message rules in the Automations tab.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-primary">
                        <Link href="/whatsapp-dashboard/settings" className="hover:underline flex items-center gap-1">
                            Settings <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        </Link>
                    </div>
                </Card>

            </div>

        </div>
    )
}
