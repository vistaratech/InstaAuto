"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Zap, Users, Send, Activity, Loader2, MessageCircle, ArrowUpRight, Search, TrendingUp, Trash2, Film, Image, Layers, X, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DMSparkGoogleLogo } from "@/components/ui/dmspark-logo"

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
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Animated rotating search placeholders
    const searchPlaceholders = [
        "Search by Post ID, Reel ID, or caption...",
        "Try: Search 'price' or 'link' to auto-reply...",
        "Click to browse your latest Reels & Posts...",
        "Paste any Post ID to create instant DM funnel...",
    ]
    const [placeholderIndex, setPlaceholderIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length)
        }, 3200)
        return () => clearInterval(interval)
    }, [searchPlaceholders.length])

    // Keyboard shortcut (⌘K or Ctrl+K) to focus search bar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

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
        {
            label: "New Automation",
            href: "/dashboard/automations?create=true",
            icon: <Zap className="w-4 h-4 text-amber-500 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />,
            hoverClass: "hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400",
        },
        {
            label: "Open Inbox",
            href: "/dashboard/inbox",
            icon: <MessageCircle className="w-4 h-4 text-[#1a73e8] group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300" />,
            hoverClass: "hover:border-[#1a73e8]/40 hover:bg-[#1a73e8]/5 hover:text-[#1a73e8]",
        },
        {
            label: "View Analytics",
            href: "/dashboard/analytics",
            icon: <TrendingUp className="w-4 h-4 text-emerald-500 group-hover:scale-125 group-hover:translate-x-0.5 transition-all duration-300" />,
            hoverClass: "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400",
        },
    ]

    const statChips = [
        { label: "Automations", value: stats?.metrics.totalAutomations || 0, href: "/dashboard/automations" },
        { label: "Messages Sent", value: stats?.metrics.messagesSent || 0, href: "/dashboard/inbox" },
        { label: "Active Triggers", value: stats?.metrics.activeTriggers || 0, href: "/dashboard/automations" },
        { label: "Audience Reached", value: stats?.metrics.audienceReached || 0, href: "/dashboard/analytics" },
    ]

    return (
        <div className={`flex flex-col items-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            {/* Google Search–style Hero Section with Animations */}
            <div className="flex flex-col items-center justify-center pt-10 md:pt-16 pb-6 md:pb-10 px-4 w-full max-w-2xl mx-auto">

                {/* Google-Style DMSpark Brand Logo (No Box / 100% Transparent) */}
                <div className="mb-5 mt-1 group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
                    <DMSparkGoogleLogo size="xl" showIcon={true} />
                </div>

                {/* Live Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/70 text-muted-foreground text-[11px] font-medium tracking-wide mb-3 shadow-xs hover:border-[#1a73e8]/30 transition-colors select-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50" />
                    <span>Instagram Business Active</span>
                </div>

                {/* Greeting with Gradient Accent */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1.5 text-center tracking-tight">
                    {greeting}, <span className="bg-gradient-to-r from-[#1a73e8] via-blue-600 to-indigo-600 bg-clip-text text-transparent">{username}</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mb-6 md:mb-8 text-center max-w-md font-medium">
                    Search your posts & reels to set up instant DM automations
                </p>

                {/* Google-style Search Bar with Dropdown & Animations */}
                <div className="w-full max-w-xl relative" ref={searchRef}>
                    <div className={`flex items-center w-full h-12 md:h-[52px] rounded-full border bg-background px-4 md:px-5 gap-3 transition-all duration-300 ${
                        searchFocused 
                            ? 'border-[#1a73e8] shadow-xl shadow-[#1a73e8]/10 ring-4 ring-[#1a73e8]/15 scale-[1.01]' 
                            : 'border-border/90 shadow-sm hover:shadow-md hover:border-border'
                    }`}>
                        <Search className={`w-5 h-5 shrink-0 transition-all duration-300 ${searchFocused ? 'text-[#1a73e8] scale-110' : 'text-muted-foreground/50'}`} />
                        <div className="relative flex-1 h-full flex items-center">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                className="w-full h-full bg-transparent border-none outline-none text-sm text-foreground z-10"
                            />
                            {/* Animated Rotating Placeholder when empty */}
                            {!searchQuery && (
                                <span 
                                    key={placeholderIndex} 
                                    className="absolute inset-0 flex items-center text-sm text-muted-foreground/50 pointer-events-none select-none truncate animate-in fade-in slide-in-from-bottom-1 duration-500"
                                >
                                    {searchPlaceholders[placeholderIndex]}
                                </span>
                            )}
                        </div>
                        {searchQuery ? (
                            <button 
                                onClick={() => { setSearchQuery(""); searchInputRef.current?.focus() }} 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) : (
                            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/70 bg-secondary/80 border border-border/80 rounded-md select-none">
                                ⌘K
                            </kbd>
                        )}
                    </div>

                    {/* Search Results Dropdown with Staggered Animations */}
                    {searchFocused && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            {mediaLoading ? (
                                <div className="p-8 text-center">
                                    <div className="relative w-8 h-8 mx-auto mb-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                                        <Loader2 className="w-8 h-8 text-[#1a73e8] animate-spin" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium animate-pulse">Loading your posts & reels...</p>
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Film className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2.5" />
                                    <p className="text-sm font-medium text-foreground">
                                        {searchQuery ? "No matching posts found" : "No posts found"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {searchQuery ? "Try searching by Reel caption or different keywords" : "No media detected in connected account"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground font-semibold">
                                            {searchQuery ? `${filteredMedia.length} results found` : `Your Posts & Reels (${filteredMedia.length})`}
                                        </p>
                                        <span className="text-[10px] text-[#1a73e8] font-medium bg-[#1a73e8]/10 px-2 py-0.5 rounded-full">
                                            Click any post to automate
                                        </span>
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
                                            className="w-full flex items-center gap-3.5 px-4 py-3 hover:bg-secondary/60 hover:pl-5 transition-all duration-200 text-left border-b border-border/50 last:border-0 cursor-pointer group/item"
                                        >
                                            {/* Thumbnail with hover scale */}
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary border border-border/50 shadow-xs">
                                                {m.thumbnail_url || m.media_url ? (
                                                    <img
                                                        src={m.thumbnail_url || m.media_url}
                                                        alt=""
                                                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Film className="w-5 h-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground font-semibold truncate group-hover/item:text-[#1a73e8] transition-colors">
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
                                            {/* Arrow pill */}
                                            <span className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground group-hover/item:bg-[#1a73e8] group-hover/item:text-white transition-all duration-200 shrink-0">
                                                <Zap className="w-4 h-4" />
                                            </span>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Action Buttons with Micro-Animations */}
                {!selectedMedia && (
                    <div className="flex items-center gap-2 md:gap-3 mt-6 md:mt-8 flex-wrap justify-center">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/60 text-xs md:text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${action.hoverClass} cursor-pointer active:scale-95`}
                            >
                                {action.icon}
                                <span>{action.label}</span>
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
