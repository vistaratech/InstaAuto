"use client"

import React, { useState, useEffect, useRef } from "react"
import { TopNavbar } from "@/components/layout/top-navbar"
import { DMSparkGoogleLogo } from "@/components/ui/dmspark-logo"
import { Search, Zap, Instagram, MessageCircle, Shield, Clock, ArrowRight, X, ExternalLink, Sparkles, Check, Send, Bot, TrendingUp, Play } from "lucide-react"
import Link from "next/link"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"

interface PresetTrigger {
  keyword: string
  label: string
  icon: string
  replyText: string
  buttonText: string
}

const PRESET_TRIGGERS: PresetTrigger[] = [
  {
    keyword: "price",
    label: "Price / Cost",
    icon: "🏷️",
    replyText: "Hey! Thanks for asking. Our premium collection starts at ₹999. Here is your direct order link: dmspark.in/store",
    buttonText: "Shop Collection",
  },
  {
    keyword: "link",
    label: "Product Link",
    icon: "🔗",
    replyText: "Hi there! Here is the exact link to the product you saw in the Reel: dmspark.in/p/summer-drop",
    buttonText: "View Product",
  },
  {
    keyword: "guide",
    label: "Free Ebook",
    icon: "📚",
    replyText: "Thanks for your comment! Here is your free 2026 Growth Blueprint download: dmspark.in/blueprint.pdf",
    buttonText: "Download PDF",
  },
  {
    keyword: "collab",
    label: "Brand Collab",
    icon: "⭐",
    replyText: "We'd love to work together! Check out our influencer kit and apply here: dmspark.in/creators",
    buttonText: "Apply Now",
  },
]

export function GoogleSearchHome() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [activePreset, setActivePreset] = useState<PresetTrigger | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStep, setSimStep] = useState<"idle" | "typing" | "sent">("idle")
  
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [waEmail, setWaEmail] = useState("")
  const [waSubmitted, setWaSubmitted] = useState(false)
  const { loginWhatsApp } = useWhatsAppSession()

  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights#weblink`

  // Animated rotating search placeholders
  const placeholders = [
    "Try clicking 'price' below to test live auto-reply...",
    "Try clicking 'link' to see how instant DMs work...",
    "Connect Instagram to auto-grow your followers 24/7...",
    "Type any keyword to preview automated reply funnels...",
  ]
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3400)
    return () => clearInterval(interval)
  }, [placeholders.length])

  // Keyboard shortcut Ctrl+K
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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Run simulation when a preset is selected
  const handleSelectPreset = (preset: PresetTrigger) => {
    setActivePreset(preset)
    setSearchQuery(preset.keyword)
    setSimStep("typing")
    setIsSimulating(true)

    setTimeout(() => {
      setSimStep("sent")
      setIsSimulating(false)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between select-none font-sans">
      {/* Top Navbar */}
      <TopNavbar isConnected={false} />

      {/* Main Google Search Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-2xl mx-auto w-full text-center">

        {/* Google-Style Centered Logo (100% Symmetrical) */}
        <div className="mb-3 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 select-none">
          <DMSparkGoogleLogo size="xl" showIcon={true} layout="vertical" />
        </div>

        {/* Clean, Elegant Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs md:text-sm text-muted-foreground font-medium select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Instagram Comment & DM Automation</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground/80">24/7 Autopilot</span>
        </div>

        {/* Google-style Search Bar with Dropdown */}
        <div className="w-full max-w-xl relative" ref={searchRef}>
          <div
            className={`flex items-center w-full h-12 md:h-[52px] rounded-full border bg-background px-4 md:px-5 gap-3 transition-all duration-300 ${
              searchFocused
                ? "border-[#1a73e8] shadow-xl shadow-[#1a73e8]/10 ring-4 ring-[#1a73e8]/15 scale-[1.01]"
                : "border-border/90 shadow-sm hover:shadow-md hover:border-border"
            }`}
          >
            <Search className={`w-5 h-5 shrink-0 transition-all duration-300 ${searchFocused ? "text-[#1a73e8] scale-110" : "text-muted-foreground/50"}`} />
            
            <div className="relative flex-1 h-full flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (!e.target.value) setActivePreset(null)
                }}
                onFocus={() => setSearchFocused(true)}
                className="w-full h-full bg-transparent border-none outline-none text-sm text-foreground z-10"
              />
              {!searchQuery && (
                <span
                  key={placeholderIndex}
                  className="absolute inset-0 flex items-center text-sm text-muted-foreground/50 pointer-events-none select-none truncate animate-in fade-in slide-in-from-bottom-1 duration-500"
                >
                  {placeholders[placeholderIndex]}
                </span>
              )}
            </div>

            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActivePreset(null)
                  searchInputRef.current?.focus()
                }}
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

          {/* Search Dropdown on Focus — Connect Prompt */}
          {searchFocused && !activePreset && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8]" />
                <span className="text-xs font-bold text-foreground">
                  {searchQuery ? `Auto-Reply Rule: "${searchQuery}"` : "Instant Instagram Automation"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Connect your Instagram account to start auto-replying to comments and sending automated DMs whenever users comment {searchQuery ? `"${searchQuery}"` : "your keywords"}!
              </p>
              <a
                href={instagramAuthUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/15 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                <span>Connect Instagram to Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Trending Keywords Quick Chips (Google Style) */}
        <div className="flex items-center justify-center gap-1.5 mt-3.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground/70 font-medium mr-1">Popular triggers:</span>
          {PRESET_TRIGGERS.map((preset) => (
            <button
              key={preset.keyword}
              onClick={() => handleSelectPreset(preset)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                activePreset?.keyword === preset.keyword
                  ? "bg-[#1a73e8]/10 text-[#1a73e8] border-[#1a73e8]/30 font-semibold"
                  : "bg-secondary/60 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{preset.icon}</span>
              <span>"{preset.keyword}"</span>
            </button>
          ))}
        </div>

        {/* Interactive Live Simulator Card (Appears when testing a trigger) */}
        {activePreset && (
          <div className="w-full max-w-xl mt-5 p-4 rounded-2xl border border-[#1a73e8]/30 bg-secondary/30 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">Live Simulation Preview</span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md border border-border/40">Trigger: "{activePreset.keyword}"</span>
              </div>
              <button
                onClick={() => { setActivePreset(null); setSearchQuery("") }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated Interaction */}
            <div className="space-y-3">
              {/* Step 1: User Comment */}
              <div className="flex items-start gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-600 font-bold flex items-center justify-center shrink-0 text-[10px]">U</div>
                <div className="bg-background border border-border/80 rounded-xl px-3 py-1.5 max-w-[80%]">
                  <span className="font-semibold text-foreground">@customer: </span>
                  <span className="text-foreground">{activePreset.keyword} please! 🔥</span>
                </div>
              </div>

              {/* Step 2: DMSpark Bot Instant DM */}
              <div className="flex items-start gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#1a73e8]/20 text-[#1a73e8] font-bold flex items-center justify-center shrink-0 text-[10px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#1a73e8] text-white rounded-2xl rounded-tl-xs px-3.5 py-2.5 max-w-[85%] shadow-md shadow-blue-500/10">
                  <p className="leading-relaxed">{activePreset.replyText}</p>
                  <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                    <span className="bg-white text-[#1a73e8] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {activePreset.buttonText} →
                    </span>
                    <span className="text-[9px] text-white/80">⚡ 0.8s delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Ready to automate this on your Instagram?</span>
              <a
                href={instagramAuthUrl}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Connect & Activate</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons (Connect Instagram & WhatsApp) */}
        <div className="flex items-center gap-2.5 md:gap-3 mt-6 md:mt-7 flex-wrap justify-center">
          <a
            href={instagramAuthUrl}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs md:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Connect Instagram</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            onClick={() => setWaModalOpen(true)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 hover:border-emerald-500/40 text-xs md:text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connect WhatsApp</span>
          </button>
        </div>

        {/* Google-Style Minimal Trust & Capability Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-8 md:mt-10 w-full max-w-xl">
          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border/50 text-center">
            <Zap className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-xs font-semibold text-foreground">Instant Reply</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">&lt; 1s response</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border/50 text-center">
            <Shield className="w-4 h-4 text-[#1a73e8] mb-1" />
            <span className="text-xs font-semibold text-foreground">Follower Gate</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Grow 24/7</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border/50 text-center">
            <Clock className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-xs font-semibold text-foreground">Always On</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">100% Autopilot</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border/50 text-center">
            <TrendingUp className="w-4 h-4 text-indigo-500 mb-1" />
            <span className="text-xs font-semibold text-foreground">Meta Verified</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Official Graph API</span>
          </div>
        </div>
      </main>

      {/* Clean Google-Style Footer with Meta Review Compliance */}
      <footer className="w-full border-t border-border/60 py-4 px-4 md:px-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span>© 2026 DMSpark</span>
          <span>•</span>
          <span>Not affiliated with Meta Platforms Inc. or Instagram</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/privacy" className="hover:text-foreground transition-colors hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors hover:underline">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="hover:text-foreground transition-colors hover:underline">
            Data Deletion Instructions
          </Link>
        </div>
      </footer>

      {/* WhatsApp Modal */}
      {waModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-background border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm text-foreground">WhatsApp Business API</h3>
              </div>
              <button
                onClick={() => setWaModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              WhatsApp automation is currently in private Beta. Enter your email to receive early access notification, or test the demo sandbox.
            </p>

            {waSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>You are on the early access waitlist!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={waEmail}
                  onChange={(e) => setWaEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/50 text-xs text-foreground outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
                <button
                  onClick={() => {
                    if (!waEmail || !waEmail.includes("@")) {
                      alert("Please enter a valid email address.")
                      return
                    }
                    setWaSubmitted(true)
                  }}
                  className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Join Beta Waitlist
                </button>
              </div>
            )}

            <button
              onClick={() => {
                loginWhatsApp("+919876543210", "WhatsApp Sandbox")
                setWaModalOpen(false)
              }}
              className="w-full h-9 rounded-xl bg-secondary hover:bg-muted text-foreground text-xs font-medium border border-border/80 transition-colors cursor-pointer"
            >
              Try Sandbox Demo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
