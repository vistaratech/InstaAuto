"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Zap, Users, Send, Activity, Loader2, MessageCircle, ArrowUpRight, Search, TrendingUp, Trash2, Film, Image, Layers, X, Check, ExternalLink, Mic, Camera, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DMSparkGoogleLogo } from "@/components/ui/dmspark-logo"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"
import { InstagramReelsIcon } from "@/components/ui/instagram-reels-icon"

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

    // Full-page celebration animation state
    const [showCelebration, setShowCelebration] = useState(false)
    const [celebrationData, setCelebrationData] = useState<{
        postTitle?: string
        thumbnail?: string
        keywords?: string
        message?: string
    }>({})

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

    // Animated rotating search placeholders (compact on mobile)
    const searchPlaceholders = [
        "Search Reels or Posts...",
        "Search 'price' or 'link'...",
        "Paste Reel ID to automate...",
        "Tap to browse recent Reels...",
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
                // Trigger full-page celebration animation & modal
                setCelebrationData({
                    postTitle: selectedMedia.caption?.slice(0, 45) || 'Instagram Post',
                    thumbnail: selectedMedia.thumbnail_url || selectedMedia.media_url,
                    keywords: autoKeywords.trim(),
                    message: autoMessage.trim(),
                })
                setShowCelebration(true)

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
            shortLabel: "Automate",
            href: "/dashboard/automations?create=true",
            icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />,
            hoverClass: "hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400",
        },
        {
            label: "Open Inbox",
            shortLabel: "Inbox",
            href: "/dashboard/inbox",
            icon: <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a73e8] group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300" />,
            hoverClass: "hover:border-[#1a73e8]/40 hover:bg-[#1a73e8]/5 hover:text-[#1a73e8]",
        },
        {
            label: "View Analytics",
            shortLabel: "Analytics",
            href: "/dashboard/analytics",
            icon: <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 group-hover:scale-125 group-hover:translate-x-0.5 transition-all duration-300" />,
            hoverClass: "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400",
        },
    ]

    return (
        <div className={`min-h-[calc(100vh-3.5rem)] w-full flex flex-col justify-between transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            {/* Full-Page Celebration Animation & Success Modal */}
            <CelebrationAnimation
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                {...celebrationData}
            />

            {/* Google Search–style Clean Centered Hero Section (Optically elevated slightly upwards) */}
            <main className={`flex-1 flex flex-col items-center px-4 w-full max-w-3xl mx-auto text-center transition-all duration-500 ${
                selectedMedia ? 'pt-8 md:pt-10 pb-12 justify-start' : 'justify-center pb-20 sm:pb-28 pt-2 sm:-mt-6'
            }`}>

                {/* Google-Style DMSpark Brand Logo (Adapts size when automation panel is open so it NEVER clips) */}
                <div className={`group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 select-none ${
                    selectedMedia ? 'mb-2 md:mb-3' : 'mb-4 md:mb-5'
                }`}>
                    <DMSparkGoogleLogo size={selectedMedia ? "lg" : "xl"} showIcon={true} layout="vertical" />
                </div>

                {/* Clean, Elegant Single Line Greeting & Status (Mobile Responsive) */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 md:mb-8 text-xs md:text-sm text-muted-foreground font-medium select-none max-w-full px-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{greeting}, <strong className="text-foreground font-semibold">@{username}</strong></span>
                    <span className="hidden sm:inline text-muted-foreground/40">•</span>
                    <span className="hidden sm:inline text-muted-foreground/80">Search posts to automate</span>
                </div>

                {/* Google-style Search Bar with Dropdown & Animations */}
                <div className="w-full max-w-2xl relative" ref={searchRef}>
                    <div className={`flex items-center w-full h-12 md:h-14 rounded-full border bg-background px-4 md:px-6 gap-3 transition-all duration-300 ${
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
                                className="w-full h-full bg-transparent border-none outline-none text-sm md:text-base text-foreground z-10"
                            />
                            {/* Animated Rotating Placeholder when empty */}
                            {!searchQuery && (
                                <span 
                                    key={placeholderIndex} 
                                    className="absolute inset-0 flex items-center text-sm md:text-base text-muted-foreground/50 pointer-events-none select-none truncate animate-in fade-in slide-in-from-bottom-1 duration-500"
                                >
                                    {searchPlaceholders[placeholderIndex]}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(""); searchInputRef.current?.focus() }} 
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer mr-0.5"
                                    title="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            {/* Official Instagram Reels Icon */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchFocused(true)
                                    searchInputRef.current?.focus()
                                }}
                                className="group/reel p-1.5 rounded-full hover:bg-secondary/80 transition-all duration-300 cursor-pointer"
                                title="Browse your Instagram Reels & Posts"
                            >
                                <InstagramReelsIcon gradient={true} className="w-5 h-5 group-hover/reel:scale-115 transition-transform" />
                            </button>
                        </div>
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

                {/* Quick Action Buttons with Mobile-Responsive Layout */}
                {!selectedMedia && (
                    <div className="grid grid-cols-3 gap-2 w-full max-w-sm sm:flex sm:items-center sm:justify-center sm:gap-3 sm:max-w-none mt-6 sm:mt-8">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={`group flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-2.5 sm:px-7 rounded-full bg-secondary/80 border border-border/70 text-xs sm:text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${action.hoverClass} cursor-pointer active:scale-95`}
                            >
                                {action.icon}
                                <span className="hidden sm:inline">{action.label}</span>
                                <span className="sm:hidden truncate">{action.shortLabel}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* ── Quick Automation Setup Panel (shows when a reel is selected) ── */}
                {selectedMedia && (
                    <div className="w-full max-w-2xl mx-auto mt-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                                <div className="flex-1 min-w-0 text-left">
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
                            <div className="p-4 space-y-4 text-left">
                                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#1a73e8]" />
                                    Set Up Automation
                                </h3>

                                {/* Automation Name */}
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rule Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Price Query Auto-Reply"
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
            </main>

            {/* Clean Google-Style Footer with Meta Review Compliance */}
            <footer className="w-full shrink-0 border-t border-border/60 py-3 px-4 md:px-8 text-[11px] sm:text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 select-none text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
                    <span>© 2026 DMSpark</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground/75">Not affiliated with Meta Platforms Inc. or Instagram</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 font-medium text-[11px] sm:text-xs">
                    <Link href="/privacy" className="hover:text-foreground transition-colors hover:underline">
                        Privacy Policy
                    </Link>
                    <span className="text-muted-foreground/40">•</span>
                    <Link href="/terms" className="hover:text-foreground transition-colors hover:underline">
                        Terms of Service
                    </Link>
                    <span className="text-muted-foreground/40">•</span>
                    <Link href="/data-deletion" className="hover:text-foreground transition-colors hover:underline">
                        Data Deletion
                    </Link>
                </div>
            </footer>
        </div>
    )
}
