"use client"

import React, { useState, useEffect, useRef } from "react"
import { TopNavbar } from "@/components/layout/top-navbar"
import { DMSparkGoogleLogo } from "@/components/ui/dmspark-logo"
import { Search, Zap, Instagram, MessageCircle, Shield, Clock, ArrowRight, X, ExternalLink, Sparkles, Check, Mic, Camera } from "lucide-react"
import Link from "next/link"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"

export function GoogleSearchHome() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [waEmail, setWaEmail] = useState("")
  const [waSubmitted, setWaSubmitted] = useState(false)
  const { loginWhatsApp } = useWhatsAppSession()

  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights#weblink`

  // Animated rotating search placeholders
  const placeholders = [
    "Try: 'price' to auto-send catalog in DMs...",
    "Try: 'link' to auto-reply to post comments...",
    "Connect Instagram to auto-grow your followers 24/7...",
    "Type any keyword to create instant reply funnels...",
  ]
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3200)
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

  const featurePills = [
    { label: "Instant Comment Auto-Reply", icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Follower Growth Gate", icon: <Shield className="w-3.5 h-3.5 text-[#1a73e8]" /> },
    { label: "24/7 Always On Autopilot", icon: <Clock className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Direct Message Funnels", icon: <MessageCircle className="w-3.5 h-3.5 text-indigo-500" /> },
  ]

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-hidden select-none">
      {/* Top Navbar */}
      <TopNavbar isConnected={false} />

      {/* Main Google Search Body — Perfectly Optically Centered in Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-6 sm:-mt-10 px-4 w-full max-w-3xl mx-auto text-center">

        {/* Google-Style Centered Logo */}
        <div className="mb-4 md:mb-5 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 select-none">
          <DMSparkGoogleLogo size="xl" showIcon={true} layout="vertical" />
        </div>

        {/* Clean, Elegant Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8 text-xs md:text-sm text-muted-foreground font-medium select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Instagram Comment & DM Automation</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground/80">24/7 Autopilot</span>
        </div>

        {/* Google-style Search Bar with Dropdown */}
        <div className="w-full max-w-2xl relative" ref={searchRef}>
          <div
            className={`flex items-center w-full h-12 md:h-14 rounded-full border bg-background px-4 md:px-6 gap-3 transition-all duration-300 ${
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
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full h-full bg-transparent border-none outline-none text-sm md:text-base text-foreground z-10"
              />
              {!searchQuery && (
                <span
                  key={placeholderIndex}
                  className="absolute inset-0 flex items-center text-sm md:text-base text-muted-foreground/50 pointer-events-none select-none truncate animate-in fade-in slide-in-from-bottom-1 duration-500"
                >
                  {placeholders[placeholderIndex]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    searchInputRef.current?.focus()
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer mr-0.5"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {/* Google Mic Icon */}
              <button
                type="button"
                onClick={() => {
                  setSearchFocused(true)
                  searchInputRef.current?.focus()
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#4285F4] hover:bg-[#4285F4]/10 transition-colors cursor-pointer"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
              {/* Google Lens / Camera Icon */}
              <button
                type="button"
                onClick={() => {
                  setSearchFocused(true)
                  searchInputRef.current?.focus()
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#EA4335] hover:bg-[#EA4335]/10 transition-colors cursor-pointer"
                title="Search with Reels & Posts"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Dropdown on Focus — Connect Prompt */}
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8]" />
                <span className="text-xs font-bold text-foreground">
                  {searchQuery ? `Auto-Reply Trigger: "${searchQuery}"` : "Instant Instagram Automation"}
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

        {/* Action Buttons (from Landing Page: Connect Instagram & WhatsApp) */}
        <div className="flex items-center gap-3 mt-7 md:mt-8 flex-wrap justify-center">
          <a
            href={instagramAuthUrl}
            className="group flex items-center gap-2 h-11 md:h-12 px-6 md:px-7 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Connect Instagram</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            onClick={() => setWaModalOpen(true)}
            className="group flex items-center gap-2 h-11 md:h-12 px-6 md:px-7 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 hover:border-emerald-500/40 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connect WhatsApp</span>
          </button>
        </div>

        {/* Feature Pills Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 md:mt-10 max-w-2xl">
          {featurePills.map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors select-none"
            >
              {pill.icon}
              {pill.label}
            </span>
          ))}
        </div>
      </main>

      {/* Clean Google-Style Footer with Meta Review Compliance */}
      <footer className="w-full shrink-0 border-t border-border/60 py-3 px-4 md:px-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2.5 select-none">
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
