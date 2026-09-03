"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Zap, Users, Send, Activity, Loader2, MessageCircle, ArrowUpRight, Search, TrendingUp, Trash2, Film, Image, Layers, X, Check, ExternalLink } from "lucide-react"
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

interface MediaItem {
    id: string
    caption: string
    media_type: string
    media_url?: string
    thumbnail_url?: string
    permalink: string
    timestamp: string
    media_product_type?: string
}

export default function DashboardPage() {
    const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchFocused, setSearchFocused] = useState(false)

    // Media/Reels search
    const [media, setMedia] = useState<MediaItem[]>([])
    const [mediaLoading, setMediaLoading] = useState(false)
    const [mediaLoaded, setMediaLoaded] = useState(false)

    // Quick automation setup for selected reel
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
    const [autoKeywords, setAutoKeywords] = useState("")
    const [autoMessage, setAutoMessage] = useState("")
    const [autoName, setAutoName] = useState("")
    const [creating, setCreating] = useState(false)

    const searchRef = useRef<HTMLDivElement>(null)

    // Fetch stats
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

    // Fetch media/reels when search bar is focused
    const fetchMedia = useCallback(async () => {
        if (!userId || mediaLoaded) return
        setMediaLoading(true)
        try {
            const res = await fetch(`/api/instagram/media?userId=${userId}`)
            const data = await res.json()
            if (data.data && Array.isArray(data.data)) setMedia(data.data)
            else if (Array.isArray(data)) setMedia(data)
            setMediaLoaded(true)
        } catch (err) {
            console.error("Failed to load media:", err)
        } finally {
            setMediaLoading(false)
        }
    }, [userId, mediaLoaded])

    useEffect(() => {
        if (searchFocused && !mediaLoaded) fetchMedia()
    }, [searchFocused, mediaLoaded, fetchMedia])

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchFocused(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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

    // Create automation for selected media
    const handleCreateAutomation = async () => {
        if (!userId || !selectedMedia) return
        if (!autoKeywords.trim()) { toast.error("Add at least one keyword"); return }
        if (!autoMessage.trim()) { toast.error("Enter a reply message"); return }

        setCreating(true)
        try {
            const name = autoName.trim() || `${autoKeywords.split(",")[0].trim()} → Auto Reply`
            const res = await fetch("/api/automations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    name,
                    trigger_source: "comment",
                    trigger_type: "keyword",
                    trigger_value: autoKeywords.trim(),
                    content: { message: autoMessage.trim() },
                    specific_media_id: selectedMedia.id,
                }),
            })

            if (res.ok) {
                toast.success("Automation Created! 🎉", {
                    description: `Auto-reply set for "${selectedMedia.caption?.slice(0, 30) || 'this post'}"`
                })
                setSelectedMedia(null)
                setAutoKeywords("")
                setAutoMessage("")
                setAutoName("")
                // Refresh stats
                const statsRes = await fetch(`/api/dashboard/stats?userId=${userId}`)
                const statsData = await statsRes.json()
                if (statsData && !statsData.error) setStats(statsData)
            } else {
                toast.error("Failed to create automation")
            }
        } catch (err) {
            toast.error("Network Error")
        } finally {
            setCreating(false)
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

    // Filter media based on search query
    const filteredMedia = searchQuery.trim()
        ? media.filter(m =>
            m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.caption || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
        : media

    const getMediaTypeLabel = (m: MediaItem) => {
        if (m.media_product_type === 'REELS' || m.media_type === 'VIDEO') return 'Reel'
        if (m.media_type === 'CAROUSEL_ALBUM') return 'Carousel'
        if (m.media_type === 'IMAGE') return 'Post'
        return m.media_type
    }

    const getMediaIcon = (m: MediaItem) => {
        if (m.media_product_type === 'REELS' || m.media_type === 'VIDEO') return <Film className="w-3.5 h-3.5" />
        if (m.media_type === 'CAROUSEL_ALBUM') return <Layers className="w-3.5 h-3.5" />
        return <Image className="w-3.5 h-3.5" />
    }

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
                    Search your posts & reels to set up automations
                </p>

                {/* Google-style Search Bar with Dropdown */}
                <div className="w-full max-w-xl relative" ref={searchRef}>
                    <div className={`flex items-center w-full h-12 md:h-[52px] rounded-full border bg-background px-5 gap-3 transition-all duration-200 ${searchFocused ? 'border-[#1a73e8] shadow-md ring-1 ring-[#1a73e8]/20' : 'border-border shadow-sm hover:shadow-md'
                        }`}>
                        <Search className={`w-5 h-5 shrink-0 transition-colors ${searchFocused ? 'text-[#1a73e8]' : 'text-muted-foreground/50'}`} />
                        <input
                            type="text"
                            placeholder="Search by Post ID, Reel ID, or caption..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchFocused && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                            {mediaLoading ? (
                                <div className="p-6 text-center">
                                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Loading your posts & reels...</p>
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Film className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery ? "No matching posts found" : "No posts found"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="px-4 py-2.5 border-b border-border bg-secondary/30">
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {searchQuery ? `${filteredMedia.length} results` : `Your Posts & Reels (${filteredMedia.length})`} — Click to set up automation
                                        </p>
                                    </div>
                                    {filteredMedia.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setSelectedMedia(m)
                                                setSearchFocused(false)
                                                setSearchQuery("")
                                                setAutoName(`${(m.caption || "Post").slice(0, 25)} → Auto Reply`)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors text-left border-b border-border/50 last:border-0 cursor-pointer"
                                        >
                                            {/* Thumbnail */}
                                            {m.thumbnail_url || m.media_url ? (
                                                <img
                                                    src={m.thumbnail_url || m.media_url}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-secondary"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                    <Film className="w-5 h-5 text-muted-foreground/40" />
                                                </div>
                                            )}
                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground font-medium truncate">
                                                    {m.caption || "Untitled Post"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                                        {getMediaIcon(m)} {getMediaTypeLabel(m)}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground/60">•</span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {new Date(m.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <Zap className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Action Buttons */}
                {!selectedMedia && (
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
                )}
            </div>

            {/* ── Quick Automation Setup Panel (shows when a reel is selected) ── */}
            {selectedMedia && (
                <div className="w-full max-w-2xl mx-auto px-4 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="border border-border rounded-2xl bg-background overflow-hidden">
                        {/* Selected Media Header */}
                        <div className="flex items-center gap-3 p-4 bg-secondary/30 border-b border-border">
                            {selectedMedia.thumbnail_url || selectedMedia.media_url ? (
                                <img
                                    src={selectedMedia.thumbnail_url || selectedMedia.media_url}
                                    alt=""
                                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                    <Film className="w-6 h-6 text-muted-foreground/40" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {selectedMedia.caption || "Untitled Post"}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {getMediaIcon(selectedMedia)} {getMediaTypeLabel(selectedMedia)}
                                    </span>
                                    <a
                                        href={selectedMedia.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-[#1a73e8] hover:underline"
                                    >
                                        View on Instagram <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={() => { setSelectedMedia(null); setAutoKeywords(""); setAutoMessage(""); setAutoName("") }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Automation Setup Form */}
                        <div className="p-4 space-y-4">
                            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#1a73e8]" />
                                Set Up Automation
                            </h3>

                            {/* Automation Name */}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Automation Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Price inquiry auto-reply"
                                    value={autoName}
                                    onChange={(e) => setAutoName(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 transition-all"
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Trigger Keywords</label>
                                <input
                                    type="text"
                                    placeholder="price, how much, cost, rate (comma-separated)"
                                    value={autoKeywords}
                                    onChange={(e) => setAutoKeywords(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 transition-all"
                                />
                                {autoKeywords && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {autoKeywords.split(",").filter(k => k.trim()).map((k, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-md bg-[#1a73e8]/8 text-[#1a73e8] text-xs font-medium">
                                                {k.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reply Message */}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Auto-Reply DM Message</label>
                                <textarea
                                    placeholder="Hi! Thanks for your interest. The price is ₹999. DM us for more details!"
                                    value={autoMessage}
                                    onChange={(e) => setAutoMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 transition-all resize-none"
                                />
                                <p className="text-[11px] text-muted-foreground mt-1 text-right">{autoMessage.length}/500</p>
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCreateAutomation}
                                disabled={creating || !autoKeywords.trim() || !autoMessage.trim()}
                                className="w-full h-11 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <><Zap className="w-4 h-4" /> Create Automation</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
