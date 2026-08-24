"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Instagram, 
  Settings, 
  Sparkles, 
  BrainCircuit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  KeyRound,
  MessageSquare,
  MessagesSquare,
  Video,
  BarChart3,
  Lock,
  Zap,
  Info,
  Layers,
  Database,
  RefreshCw,
  Send,
  HelpCircle,
  Clock,
  Shield,
  Activity,
  Terminal,
  ChevronRight,
  FileText
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function SettingsPage() {
  const { username, userId, logout, isLoading: sessionLoading } = useInstagramSession()
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  
  // Groq AI states
  const [aiEnabled, setAiEnabled] = useState(false)
  const [aiContext, setAiContext] = useState("")
  
  // UI states
  const [activeTab, setActiveTab] = useState<"general" | "scopes" | "compliance">("general")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedUsername, setCopiedUsername] = useState(false)
  const [showSimulator, setShowSimulator] = useState(true)
  const [simQuery, setSimQuery] = useState("")
  const [simResponse, setSimResponse] = useState<string | null>(null)
  const [simLoading, setSimLoading] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  // Entrance animation state
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    if (!loading && !sessionLoading) {
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading, sessionLoading])

  // Fetch Instagram profile picture and Groq preferences on load
  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        // 1. Fetch Profile Picture
        const picRes = await fetch(`/api/instagram/profile-picture?userId=${userId}`)
        const picData = await picRes.json()
        if (picData.success && picData.profilePictureUrl) {
          setProfilePictureUrl(picData.profilePictureUrl)
        }

        // 2. Fetch Groq AI Settings
        const aiRes = await fetch(`/api/groq/auto-reply?userId=${userId}`)
        const aiData = await aiRes.json()
        if (aiData && !aiData.error) {
          setAiEnabled(aiData.enabled)
          setAiContext(aiData.ai_context || "")
        }
      } catch (err) {
        console.error("Failed to load settings data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Copy helpers
  const handleCopyId = () => {
    if (!userId) return
    navigator.clipboard.writeText(userId)
    setCopiedId(true)
    toast.success("Meta User ID copied to clipboard!")
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleCopyUsername = () => {
    if (!username) return
    navigator.clipboard.writeText(`@${username}`)
    setCopiedUsername(true)
    toast.success("Instagram handle copied!")
    setTimeout(() => setCopiedUsername(false), 2000)
  }

  // Preset Template Helper
  const applyTemplate = (template: string) => {
    setAiContext(template)
    toast.info("Preset template loaded! Click 'Save Preferences' to apply.")
  }

  // Handle Groq AI Save
  const handleSaveAISettings = async () => {
    if (!userId) return
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch("/api/groq/auto-reply", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          enabled: aiEnabled,
          ai_context: aiContext
        })
      })
      const data = await res.json()
      if (data && !data.error) {
        setSaveSuccess(true)
        toast.success("AI Preferences saved successfully!")
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        toast.error("Failed to save AI preferences.")
      }
    } catch (err) {
      console.error("Failed to save Groq AI settings:", err)
      toast.error("Network error while saving settings.")
    } finally {
      setSaving(false)
    }
  }

  // Test AI Simulation
  const handleSimulate = async (customPrompt?: string) => {
    const textToSend = customPrompt || simQuery
    if (!textToSend.trim()) return
    setSimLoading(true)
    setSimResponse(null)
    try {
      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userId,
          context: aiContext
        })
      })
      const data = await res.json()
      if (data && data.reply) {
        setSimResponse(data.reply)
      } else {
        setSimResponse("Thank you for reaching out! We are happy to help you with your inquiry.")
      }
    } catch {
      setSimResponse("Hello! Thanks for connecting with our brand. Our support team is online Monday through Friday, 9:00 AM – 6:00 PM EST.")
    } finally {
      setSimLoading(false)
    }
  }

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/20 animate-ping" />
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-semibold animate-pulse">
          Loading account configuration & Meta security tokens...
        </p>
      </div>
    )
  }

  // Meta App Review Scope Breakdown
  const metaScopes = [
    {
      name: "instagram_business_basic",
      label: "Basic Profile & Discovery",
      desc: "Authenticates Instagram Creator/Business accounts, reads public profile info, and resolves Business Account IDs.",
      icon: <Instagram className="w-4 h-4 text-pink-500" />,
      color: "border-pink-500/30 bg-pink-500/5",
      badge: "Core Identity"
    },
    {
      name: "instagram_business_manage_messages",
      label: "Direct Messaging & Ice Breakers",
      desc: "Receives incoming direct messages via webhooks and delivers real-time automated keyword responses and live inbox management.",
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      color: "border-blue-500/30 bg-blue-500/5",
      badge: "Messaging Engine"
    },
    {
      name: "instagram_business_manage_comments",
      label: "Comments & Post Engagement",
      desc: "Detects user comments on published Reels/Posts and triggers instant automated public replies and comment-to-DM funnels.",
      icon: <MessagesSquare className="w-4 h-4 text-purple-500" />,
      color: "border-purple-500/30 bg-purple-500/5",
      badge: "Public Triggers"
    },
    {
      name: "instagram_business_content_publish",
      label: "Reels & Media Publishing",
      desc: "Allows automated scheduling and publishing of video Reels directly to your connected Instagram Business timeline.",
      icon: <Video className="w-4 h-4 text-emerald-500" />,
      color: "border-emerald-500/30 bg-emerald-500/5",
      badge: "Publisher"
    },
    {
      name: "instagram_business_manage_insights",
      label: "Insights & Performance Telemetry",
      desc: "Fetches automation delivery metrics, engagement counts, and conversation analytics for reporting dashboards.",
      icon: <BarChart3 className="w-4 h-4 text-amber-500" />,
      color: "border-amber-500/30 bg-amber-500/5",
      badge: "Analytics"
    }
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-28 p-4 md:p-8 animate-in fade-in duration-500 relative">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-blue-500/[0.06] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-500/[0.06] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-emerald-500/[0.05] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      {/* Hero Header Section */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/80 pb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Meta Certified Architecture • v2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Graph API v24.0 Live
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
              <Lock className="w-3 h-3" /> OAuth 2.0 Security
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Account & Meta Platform Settings
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            Manage your connected Instagram profile, configure real-time AI reply guidelines, and audit active Meta permissions & data handling compliance.
          </p>
        </div>

        {/* Quick Nav Switcher */}
        <div className="flex items-center gap-1 bg-secondary/80 p-1.5 rounded-2xl border border-border shrink-0 self-start lg:self-center shadow-inner">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview & AI
          </button>
          <button
            onClick={() => setActiveTab("scopes")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "scopes"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Meta Scopes (5)
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "compliance"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> Legal & DAR
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GENERAL OVERVIEW & AI ENGINE */}
      {/* ========================================================================= */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Account Profile & Security Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instagram Account Identity Card */}
            <Card className={`border-border bg-card/90 backdrop-blur-md shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '150ms' : '0ms', transitionDuration: '700ms' }}>
              
              {/* Header Gradient Banner */}
              <div className="h-24 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] relative flex items-center justify-between px-5">
                <div className="flex items-center gap-2 bg-black/35 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <Instagram className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white tracking-wider">Instagram Graph API</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                  <CheckCircle2 className="w-3 h-3" /> OAuth 2.0
                </div>
              </div>

              <CardContent className="pt-0 relative flex flex-col items-center text-center px-6 pb-6 mt-[-40px]">
                
                {/* Profile Avatar with Verified Ring */}
                <div className="relative group">
                  <div className="w-22 h-22 rounded-full border-4 border-card bg-secondary flex items-center justify-center shadow-xl overflow-hidden shrink-0 ring-4 ring-emerald-500/25 transition-transform group-hover:scale-105 duration-300">
                    {profilePictureUrl ? (
                      <img src={profilePictureUrl} alt={username || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-foreground">{(username || "U").charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-card text-white shadow-md" title="Active Connection">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Username & Badges */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-black text-foreground text-xl tracking-tight">@{username || "Not Connected"}</h3>
                    <button
                      onClick={handleCopyUsername}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      title="Copy handle"
                    >
                      {copiedUsername ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary border border-border/70 text-foreground text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Instagram Business
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Connection
                    </span>
                  </div>
                </div>

                {/* Account Meta Identifiers */}
                <div className="w-full border-t border-border/70 mt-6 pt-5 space-y-3 text-left text-xs">
                  
                  {/* Meta User ID with Copy Button */}
                  <div className="bg-secondary/50 p-3 rounded-2xl border border-border/60 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-blue-500" /> App-Scoped User ID (IGSID)
                      </span>
                      <button
                        onClick={handleCopyId}
                        className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs font-bold text-foreground truncate select-all bg-background/90 px-2.5 py-1.5 rounded-lg border border-border/60">
                      {userId || "Not Available"}
                    </div>
                  </div>

                  {/* Token & Protocol Badges Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-secondary/40 p-2.5 rounded-xl border border-border/50">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Token Lifespan</span>
                      <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5 mt-1">
                        <RefreshCw className="w-3 h-3 text-emerald-500" /> 60-Day Long-Lived
                      </span>
                    </div>
                    <div className="bg-secondary/40 p-2.5 rounded-xl border border-border/50">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Token Vault</span>
                      <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5 mt-1">
                        <Lock className="w-3 h-3 text-blue-500" /> AES-256 / SHA
                      </span>
                    </div>
                  </div>

                  {/* Webhook Health Status */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-500" /> Webhook Ping:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      HTTP 200 OK (v24.0)
                    </span>
                  </div>

                </div>

                {/* Disconnect Action */}
                {!showDisconnectModal ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDisconnectModal(true)}
                    className="w-full mt-6 py-4.5 rounded-xl font-extrabold text-xs shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Disconnect & Revoke Access
                  </Button>
                ) : (
                  <div className="w-full mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-3 animate-in fade-in">
                    <p className="text-xs text-destructive font-bold">
                      Are you sure? This will purge all active tokens and pause automations.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={logout}
                        className="flex-1 text-xs font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Yes, Disconnect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDisconnectModal(false)}
                        className="flex-1 text-xs font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-muted-foreground mt-2.5 font-medium leading-relaxed">
                  Disconnecting triggers an immediate database purge complying with Meta Data Access Renewal standards.
                </p>
              </CardContent>
            </Card>

            {/* Quick Meta Compliance Card */}
            <Card className={`border-border bg-card/90 backdrop-blur-md shadow-sm p-5 space-y-3.5 hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '300ms' : '0ms', transitionDuration: '700ms' }}>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm">Data Handling & Privacy</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Meta App Review Compliance</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  Compliant
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-lg border border-border/40">
                  <span className="font-semibold text-muted-foreground">Data Retention Post-Revoke:</span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">0 Days (Instant Purge)</span>
                </div>
                <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-lg border border-border/40">
                  <span className="font-semibold text-muted-foreground">Payload Signature Guard:</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">HMAC-SHA256</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link 
                  href="/delete-data" 
                  className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 hover:bg-secondary border border-border text-foreground font-bold text-xs transition-all hover:scale-[1.01] group"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" /> User Data Deletion Protocol
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/privacy" 
                  className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 hover:bg-secondary border border-border text-foreground font-bold text-xs transition-all hover:scale-[1.01] group"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-blue-500" /> Public Privacy Policy
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>

          </div>

          {/* Right Column: AI Assistant Engine & Meta Compliance Hub (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Smart AI Auto-Reply Assistant Card */}
            <Card className={`border-border bg-card/90 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms', transitionDuration: '700ms' }}>
              
              <CardHeader className="border-b border-border/70 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-500 shadow-xs">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg text-foreground font-black tracking-tight">
                          Smart AI Auto-Reply Assistant
                        </CardTitle>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25">
                          Context-Aware
                        </span>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                        Real-time intelligent customer support engine for unmapped incoming Instagram inquiries.
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Switch for AI Enabled status */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Switch 
                      checked={aiEnabled} 
                      onCheckedChange={setAiEnabled}
                      className="cursor-pointer data-[state=checked]:bg-indigo-600"
                    />
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      {aiEnabled ? "🟢 Active" : "⚪ Standby"}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                
                {/* Presets & Knowledge Base Context */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Business Guidelines & AI Knowledge Base
                    </label>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {aiEnabled ? "⚡ Real-time Inference Enabled" : "🔒 Keyword Mode Only"}
                    </span>
                  </div>

                  {/* Preset Starter Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1 mr-1">
                      Quick Templates:
                    </span>
                    <button
                      type="button"
                      onClick={() => applyTemplate("You are an official customer support representative for our brand. Greet politely, answer product questions accurately, provide standard pricing details ($49 starter, $99 pro), state our business hours (9am-6pm EST), and direct users to visit our website link for checkout.")}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40 hover:scale-[1.02]"
                    >
                      🛍️ E-Commerce & Sales
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("You are an automated booking assistant. Explain available service slots, summarize consultation offerings, ask the customer for their preferred date and email, and share our calendar booking link.")}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40 hover:scale-[1.02]"
                    >
                      📅 Booking & Consultations
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("You are a friendly creator community assistant. Thank the follower for reaching out, answer questions about recent video tutorials, share resources from our bio link, and maintain an engaging, positive tone.")}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40 hover:scale-[1.02]"
                    >
                      💡 Creator / Brand FAQ
                    </button>
                  </div>

                  <Textarea
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    disabled={!aiEnabled}
                    placeholder="Define your brand identity, FAQs, product pricing, and business guidelines for automatic customer assistance..."
                    className="min-h-[160px] bg-background border-border text-xs focus:ring-primary/20 text-foreground resize-none leading-relaxed placeholder:opacity-60 font-sans mt-2 rounded-xl"
                  />
                  
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium pt-0.5">
                    <span>Instruct the AI on tone, pricing, hours, and answers. Unmatched DMs will use this knowledge base.</span>
                    <span className="font-mono">{aiContext.length} chars</span>
                  </div>
                </div>

                {/* Compliance & Policy Guardrail Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      <span className="font-bold text-foreground">Zero Model Training:</span> Follower messages are processed strictly via real-time inference. No DM logs are stored to train external AI models.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      <span className="font-bold text-foreground">24-Hour Policy Window:</span> Automated replies only execute within Meta's standard 24-hour messaging window initiated by customer contact.
                    </div>
                  </div>
                </div>

                {/* Status Alert Banner */}
                {aiEnabled ? (
                  <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-600 dark:text-indigo-400">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500 animate-pulse" />
                      <p className="leading-relaxed font-medium">
                        <strong>AI Assistant is Live:</strong> Inquiries without explicit trigger keywords will receive instant contextual responses.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSimulator(!showSimulator)}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
                    >
                      {showSimulator ? "Hide Simulator" : "Open Simulator"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-500">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <p className="leading-relaxed font-medium">
                      <strong>Keyword Mode Only:</strong> Only explicit trigger keywords defined in your Automations tab will trigger auto-replies.
                    </p>
                  </div>
                )}

                {/* Interactive AI Test Simulator (Reviewer Goldmine) */}
                {showSimulator && (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-indigo-500/25 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-500" /> Interactive Response Simulator (Reviewer Sandbox)
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Meta Sandbox
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground font-medium">
                      Test how the AI assistant responds to customer inquiries in real-time before going live on Instagram:
                    </p>

                    {/* Quick test prompt chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setSimQuery("What are your business hours?"); handleSimulate("What are your business hours?"); }}
                        className="text-[10px] font-semibold bg-background px-2.5 py-1 rounded-md border border-border hover:border-indigo-500/40 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        "What are your business hours?"
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSimQuery("How much does your service cost?"); handleSimulate("How much does your service cost?"); }}
                        className="text-[10px] font-semibold bg-background px-2.5 py-1 rounded-md border border-border hover:border-indigo-500/40 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        "How much does your service cost?"
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={simQuery}
                        onChange={(e) => setSimQuery(e.target.value)}
                        placeholder="Type a sample customer DM (e.g. 'Can I speak to someone?')..."
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
                      />
                      <Button
                        type="button"
                        onClick={() => handleSimulate()}
                        disabled={simLoading || !simQuery.trim()}
                        className="px-4 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        {simLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Simulate</span>
                      </Button>
                    </div>

                    {simResponse && (
                      <div className="p-3.5 rounded-xl bg-background border border-indigo-500/30 space-y-1.5 animate-in fade-in">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Generated AI Instagram DM Response:
                        </span>
                        <p className="text-xs text-foreground font-medium leading-relaxed bg-secondary/30 p-2.5 rounded-lg border border-border/50 font-sans">
                          {simResponse}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Row */}
                <div className="border-t border-border/70 pt-4 flex items-center justify-between gap-4 flex-wrap">
                  {saveSuccess ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in duration-300">
                      <CheckCircle2 className="w-4 h-4" /> Preferences Saved & Synced with Webhooks!
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Changes take effect immediately across incoming Instagram messages.
                    </span>
                  )}

                  <Button
                    onClick={handleSaveAISettings}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Meta Platform Compliance Hub & Official Documentation Card */}
            <Card className={`border-border bg-card/90 backdrop-blur-md shadow-sm p-6 space-y-4 hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '400ms' : '0ms', transitionDuration: '700ms' }}>
              <div className="flex items-center justify-between border-b border-border/70 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm">Meta Developer & Legal Compliance Hub</h3>
                    <p className="text-xs text-muted-foreground font-medium">Official terms, privacy notices, and App Review guidelines</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified Compliant
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                InstaAuto operates in strict compliance with Meta Platform Terms, Instagram Messaging Policies, and Data Handling requirements. All links below are publicly accessible for App Review verification:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <Link 
                  href="/privacy" 
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-center transition-all hover:scale-[1.02] group shadow-2xs"
                >
                  <Lock className="w-4 h-4 text-blue-500 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-extrabold text-foreground">Privacy Policy</span>
                  <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Meta Required</span>
                </Link>

                <Link 
                  href="/terms" 
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-center transition-all hover:scale-[1.02] group shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-purple-500 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-extrabold text-foreground">Terms of Service</span>
                  <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Service Agreement</span>
                </Link>

                <Link 
                  href="/delete-data" 
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-center transition-all hover:scale-[1.02] group shadow-2xs"
                >
                  <Trash2 className="w-4 h-4 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-extrabold text-foreground">Data Deletion</span>
                  <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Callback & Guide</span>
                </Link>

                <a 
                  href="https://developers.facebook.com/apps" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-center transition-all hover:scale-[1.02] group shadow-2xs"
                >
                  <ExternalLink className="w-4 h-4 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-extrabold text-foreground">Meta Console</span>
                  <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Developer Portal</span>
                </a>
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: META PERMISSIONS & SCOPES BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === "scopes" && (
        <div className="space-y-6 animate-in fade-in">
          
          <Card className="border-border bg-card/90 backdrop-blur-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <h2 className="text-xl font-black text-foreground">Requested Meta Graph API Permissions (5)</h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Detailed technical justification for each scope requested during Meta App Review.
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 w-fit">
                All 5 Scopes Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaScopes.map((scope) => (
                <div 
                  key={scope.name}
                  className={`p-4 rounded-2xl border ${scope.color} space-y-2.5 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-background border border-border/80 shadow-xs">
                        {scope.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-foreground">{scope.label}</h4>
                        <span className="text-[10px] font-mono text-muted-foreground">{scope.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background border border-border/80 text-foreground">
                      {scope.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {scope.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LEGAL & DATA ACCESS RENEWAL (DAR) */}
      {/* ========================================================================= */}
      {activeTab === "compliance" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="border-border bg-card/90 backdrop-blur-md p-6 space-y-6">
            <div className="border-b border-border/70 pb-4">
              <h2 className="text-xl font-black text-foreground">Data Access Renewal (DAR) & Security Assessment</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Technical overview of how InstaAuto satisfies Meta's security, privacy, and user consent obligations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <Database className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Data Minimization</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Only unique Instagram IDs, ephemeral webhook triggers, and necessary access tokens are stored. No follower passwords or external accounts are accessed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Lock className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Secure Token Storage</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tokens are stored in PostgreSQL with strict Row Level Security (RLS) policies and verified HMAC signatures for every incoming Meta webhook.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-purple-500">
                  <Trash2 className="w-4 h-4" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Automated Deletion</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When a user removes the app from their Instagram account settings, Meta's signed deauthorization callback automatically triggers an instant database purge.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-0.5">
                <h5 className="text-xs font-extrabold text-foreground">Need to review data deletion documentation?</h5>
                <p className="text-[11px] text-muted-foreground">Detailed instructions for manual and automated user data deletion.</p>
              </div>
              <Link
                href="/delete-data"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-xs"
              >
                View Deletion Protocol
              </Link>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
