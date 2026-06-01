"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Activity, Users, MessageCircle, Zap, Loader2 } from "lucide-react"
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
        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome back, {username}</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your automations today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Automations"
                    value={stats?.metrics.totalAutomations.toString() || "0"}
                    trend="Active"
                    icon={<Zap className="w-5 h-5 text-blue-500" />}
                />
                <StatCard
                    title="Messages Sent"
                    value={stats?.metrics.messagesSent.toString() || "0"}
                    trend="Lifetime"
                    icon={<MessageCircle className="w-5 h-5 text-green-500" />}
                />
                <StatCard
                    title="Active Triggers"
                    value={stats?.metrics.activeTriggers.toString() || "0"}
                    trend="Running"
                    icon={<Activity className="w-5 h-5 text-yellow-500" />}
                />
                <StatCard
                    title="Audience Reached"
                    value={stats?.metrics.audienceReached.toString() || "0"}
                    trend="Unique Users"
                    icon={<Users className="w-5 h-5 text-red-500" />}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 bg-card border-border backdrop-blur-sm lg:col-span-2 shadow-sm">
                    <h3 className="font-bold text-foreground mb-4 text-base">Recent Activity</h3>
                    <div className="space-y-3">
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((msg) => (
                                <Link 
                                    key={msg.id} 
                                    href="/dashboard/inbox"
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/40 transition-colors border border-transparent hover:border-border cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-foreground font-semibold truncate">
                                            Auto-reply to @{msg.recipient?.recipient_username || "user"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate w-full max-w-[300px] mt-0.5">{msg.content}</p>
                                    </div>
                                    <div className="ml-auto text-[10px] text-muted-foreground font-medium whitespace-nowrap bg-secondary px-2 py-1 rounded">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6 bg-card border-border backdrop-blur-sm shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-foreground mb-4 text-base">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/dashboard/automations" className="h-20 rounded-xl border border-dashed border-border flex flex-row items-center px-4 hover:bg-secondary/40 hover:border-blue-500/50 cursor-pointer transition-all group gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-foreground block">New Rule</span>
                                    <span className="text-xs text-muted-foreground">Configure a reply trigger</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/inbox" className="h-20 rounded-xl border border-dashed border-border flex flex-row items-center px-4 hover:bg-secondary/40 hover:border-green-500/50 cursor-pointer transition-all group gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-foreground block">View Audience</span>
                                    <span className="text-xs text-muted-foreground">Manage your DM inbox</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-border text-center">
                        <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">Powered by V-AutoChat</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <span className="p-2.5 bg-secondary rounded-xl ring-1 ring-border group-hover:ring-primary/30 group-hover:bg-primary/5 transition-all">{icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground tracking-wider uppercase`}>
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

