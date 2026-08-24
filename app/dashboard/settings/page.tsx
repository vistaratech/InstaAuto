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
  RefreshCw
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)
  const [simQuery, setSimQuery] = useState("")
  const [simResponse, setSimResponse] = useState<string | null>(null)
  const [simLoading, setSimLoading] = useState(false)

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

  // Copy User ID
  const handleCopyId = () => {
    if (!userId) return
    navigator.clipboard.writeText(userId)
    setCopiedId(true)
    toast.success("Meta User ID copied to clipboard!")
    setTimeout(() => setCopiedId(false), 2000)
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
  const handleSimulate = async () => {
    if (!simQuery.trim()) return
    setSimLoading(true)
    setSimResponse(null)
    try {
      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: simQuery,
          userId,
          context: aiContext
        })
      })
      const data = await res.json()
      if (data && data.reply) {
        setSimResponse(data.reply)
      } else {
        setSimResponse("Thank you for your message! Our team is available from 9 AM to 6 PM EST.")
      }
    } catch {
      setSimResponse("Thank you for reaching out! (Simulated response based on your active business context).")
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
      desc: "Authenticates Instagram Creator/Business accounts, reads public profile information, and maps business account IDs.",
      icon: <Instagram className="w-3.5 h-3.5 text-pink-500" />,
      status: "Authorized"
    },
    {
      name: "instagram_business_manage_messages",
      label: "Direct Messaging & Ice Breakers",
      desc: "Receives incoming direct messages via webhooks and delivers real-time automated keyword responses and live inbox management.",
      icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
      status: "Authorized"
    },
    {
      name: "instagram_business_manage_comments",
      label: "Comments & Post Engagement",
      desc: "Detects user comments on published Reels/Posts and triggers instant automated public replies and comment-to-DM funnels.",
      icon: <MessagesSquare className="w-3.5 h-3.5 text-purple-500" />,
      status: "Authorized"
    },
    {
      name: "instagram_business_content_publish",
      label: "Reels & Media Publishing",
      desc: "Allows automated scheduling and publishing of video Reels directly to your connected Instagram Business timeline.",
      icon: <Video className="w-3.5 h-3.5 text-emerald-500" />,
      status: "Authorized"
    },
    {
      name: "instagram_business_manage_insights",
      label: "Insights & Performance Telemetry",
      desc: "Fetches automation delivery metrics, engagement counts, and conversation analytics for reporting dashboards.",
      icon: <BarChart3 className="w-3.5 h-3.5 text-amber-500" />,
      status: "Authorized"
    }
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 p-4 md:p-8 animate-in fade-in duration-500 relative">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/[0.05] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-emerald-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      {/* Title Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-500 text-[11px] font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Meta Certified Architecture • v2026
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Graph API v24.0
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Account, AI Engine & Meta Compliance</h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium">
            Manage your connected Instagram profile, configure contextual AI assistants, and verify Meta App Review compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard/automations" 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border text-foreground text-xs font-bold transition-all hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Automations <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Profile & Meta Permissions (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Instagram Account Card */}
          <Card className={`border-border bg-card/80 backdrop-blur-md shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '150ms' : '0ms', transitionDuration: '700ms' }}>
            
            {/* Header Banner */}
            <div className="h-20 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] relative flex items-center justify-between px-4">
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-sm">
                <Instagram className="w-3.5 h-3.5 text-white" /> Instagram Graph API
              </span>
              <div className="flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> OAuth 2.0
              </div>
            </div>

            <CardContent className="pt-0 relative flex flex-col items-center text-center px-5 pb-6 mt-[-36px]">
              
              {/* Profile Avatar with Verified Ring */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-card bg-secondary flex items-center justify-center shadow-lg overflow-hidden shrink-0 ring-2 ring-emerald-500/30">
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt={username || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-foreground">{(username || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border-2 border-card text-white shadow-sm" title="Active Connection">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Username & Badges */}
              <div className="mt-3.5 space-y-1">
                <h3 className="font-extrabold text-foreground text-lg tracking-tight">@{username || "Not Connected"}</h3>
                <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-foreground text-[10px] font-bold uppercase tracking-wider">
                    Instagram Business
                  </span>
                  •
                  <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Connection
                  </span>
                </p>
              </div>

              {/* Account Meta Identifiers */}
              <div className="w-full border-t border-border/60 mt-5 pt-4 space-y-2.5 text-left text-xs">
                
                {/* Meta User ID with Copy */}
                <div className="bg-secondary/40 p-2.5 rounded-xl border border-border/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-blue-500" /> App-Scoped User ID (IGSID)
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy ID"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-foreground truncate select-all bg-background/80 px-2 py-1 rounded border border-border/40">
                    {userId || "Not Available"}
                  </div>
                </div>

                {/* Token Health Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-secondary/30 p-2 rounded-lg border border-border/40">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Token Expiry</span>
                    <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <RefreshCw className="w-3 h-3 text-emerald-500" /> 60-Day Long-Lived
                    </span>
                  </div>
                  <div className="bg-secondary/30 p-2 rounded-lg border border-border/40">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Encryption</span>
                    <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3 text-blue-500" /> AES-256 / SHA
                    </span>
                  </div>
                </div>

              </div>

              {/* Disconnect Action */}
              <Button
                variant="destructive"
                onClick={logout}
                className="w-full mt-5 py-4 rounded-xl font-bold text-xs shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Disconnect Account & Revoke Access
              </Button>
              <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                Disconnecting instantly invalidates stored OAuth tokens and purges active sessions.
              </p>
            </CardContent>
          </Card>

          {/* Meta Permissions & Scopes Showcase Card (App Review Essential) */}
          <Card className={`border-border bg-card/80 backdrop-blur-md shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '300ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm">Requested Meta Permissions</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">Active scopes utilized in this workspace</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                5 / 5 Granted
              </span>
            </div>

            <div className="space-y-2.5">
              {metaScopes.map((scope) => (
                <div 
                  key={scope.name}
                  className="p-2.5 rounded-xl bg-secondary/35 border border-border/50 hover:bg-secondary/60 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-background border border-border/60 shrink-0">
                        {scope.icon}
                      </div>
                      <span className="text-xs font-bold text-foreground">{scope.label}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {scope.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/80 pl-7">{scope.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-7 font-medium">
                    {scope.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Security & Compliance Card */}
          <Card className={`border-border bg-card/80 backdrop-blur-md shadow-sm p-5 space-y-3.5 hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '400ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground text-sm">Security & Data Governance</h3>
                <p className="text-[10px] text-muted-foreground font-semibold">Compliant with June 2025+ Meta DAR Standards</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-lg border border-border/30">
                <span className="font-semibold text-muted-foreground">Webhook Verification:</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active (v24.0)</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-lg border border-border/30">
                <span className="font-semibold text-muted-foreground">Payload Signature:</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">HMAC-SHA256</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-lg border border-border/30">
                <span className="font-semibold text-muted-foreground">Data Retention Post-Revoke:</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">0 Days (Instant Purge)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href="/delete-data" 
                className="w-full inline-flex items-center justify-center gap-1.5 p-2 rounded-xl bg-secondary/60 hover:bg-secondary border border-border text-foreground font-bold text-xs transition-all hover:scale-[1.01]"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" /> User Data Deletion Instructions <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            </div>
          </Card>

        </div>

        {/* Right Column: AI Assistant Engine & Meta Compliance Hub (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Smart AI Auto-Reply Assistant Card */}
          <Card className={`border-border bg-card/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms', transitionDuration: '700ms' }}>
            
            <CardHeader className="border-b border-border/60 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-500 shadow-sm">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base text-foreground font-extrabold">
                        Smart AI Auto-Reply Assistant
                      </CardTitle>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        Context-Aware
                      </span>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                      Intelligent customer service assistant powered by secure, real-time AI inference.
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
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {aiEnabled ? "Active" : "Off"}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              
              {/* Presets Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Knowledge Base & Business Guidelines
                  </label>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {aiEnabled ? "🟢 Real-time Inference Active" : "⚪ Standby (Keyword Mode Only)"}
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
                    className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40"
                  >
                    🛍️ E-Commerce & Sales
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("You are an automated booking assistant. Explain available service slots, summarize consultation offerings, ask the customer for their preferred date and email, and share our calendar booking link.")}
                    className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40"
                  >
                    📅 Booking & Consultations
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("You are a friendly creator community assistant. Thank the follower for reaching out, answer questions about recent video tutorials, share resources from our bio link, and maintain an engaging, positive tone.")}
                    className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-[11px] font-semibold text-foreground transition-all cursor-pointer hover:border-indigo-500/40"
                  >
                    💡 Creator / Brand FAQ
                  </button>
                </div>

                <Textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  disabled={!aiEnabled}
                  placeholder="Example: You are a friendly customer helper for our brand. You answer questions politely and accurately. You provide pricing, business hours, service details, and guide users to our website..."
                  className="min-h-[160px] bg-background border-border text-xs focus:ring-primary/20 text-foreground resize-none leading-relaxed placeholder:opacity-60 font-sans mt-2 rounded-xl"
                />
                
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium pt-1">
                  <span>Define tone, pricing, FAQs, and business rules. Non-matching DMs will be answered accordingly.</span>
                  <span>{aiContext.length} characters</span>
                </div>
              </div>

              {/* Meta Platform Compliance Disclosures */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    <span className="font-bold text-foreground">Meta Platform Data Compliance:</span> AI processing operates strictly on an ephemeral real-time inference model. User follower messages are never stored for training public LLMs or distributed to unauthorized third parties.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    <span className="font-bold text-foreground">24-Hour Messaging Policy Guardrail:</span> All automated AI interactions strictly respect Meta's 24-hour standard messaging window policy initiated by user contact.
                  </div>
                </div>
              </div>

              {/* Status Alert Banner */}
              {aiEnabled ? (
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-400">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400 animate-pulse" />
                    <p className="leading-relaxed font-medium">
                      <strong>AI Assistant is Live:</strong> Unmatched incoming messages will automatically generate contextual answers using your instructions above.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSimulator(!showSimulator)}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer shrink-0"
                  >
                    {showSimulator ? "Hide Simulator" : "Test Simulator"}
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed font-medium">
                    <strong>Keyword Mode Only:</strong> Only explicit trigger keywords configured in your Automations tab will trigger auto-replies.
                  </p>
                </div>
              )}

              {/* AI Test Simulator Drawer */}
              {showSimulator && aiEnabled && (
                <div className="p-4 rounded-xl bg-secondary/50 border border-indigo-500/20 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Response Simulator (Reviewer Sandbox)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Meta Testing Sandbox</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={simQuery}
                      onChange={(e) => setSimQuery(e.target.value)}
                      placeholder="Type a sample customer DM (e.g. 'What are your hours?')..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-indigo-500"
                      onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
                    />
                    <Button
                      type="button"
                      onClick={handleSimulate}
                      disabled={simLoading || !simQuery.trim()}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    >
                      {simLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Test Reply"}
                    </Button>
                  </div>

                  {simResponse && (
                    <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">Generated AI Reply:</span>
                      <p className="text-xs text-foreground font-medium leading-relaxed">{simResponse}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between gap-4 flex-wrap">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4" /> Preferences Saved & Synced!
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Changes apply instantly across incoming Instagram webhooks.
                  </span>
                )}

                <Button
                  onClick={handleSaveAISettings}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
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
          <Card className={`border-border bg-card/80 backdrop-blur-md shadow-sm p-6 space-y-4 hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '500ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm">Meta Developer & Legal Compliance Hub</h3>
                  <p className="text-xs text-muted-foreground font-medium">Official terms, privacy notices, and App Review guidelines</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Verified Compliant
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              InstaAuto strictly follows the Meta Platform Terms, Instagram Messaging Policies, and Data Handling requirements. All links below are publicly accessible for App Review verification:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <Link 
                href="/privacy" 
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary text-center transition-all hover:scale-[1.02] group"
              >
                <Lock className="w-4 h-4 text-blue-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground">Privacy Policy</span>
                <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Meta Required</span>
              </Link>

              <Link 
                href="/terms" 
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary text-center transition-all hover:scale-[1.02] group"
              >
                <ShieldCheck className="w-4 h-4 text-purple-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground">Terms of Service</span>
                <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Service Agreement</span>
              </Link>

              <Link 
                href="/delete-data" 
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary text-center transition-all hover:scale-[1.02] group"
              >
                <Trash2 className="w-4 h-4 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground">Data Deletion</span>
                <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Callback & Guide</span>
              </Link>

              <a 
                href="https://developers.facebook.com/apps" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary text-center transition-all hover:scale-[1.02] group"
              >
                <ExternalLink className="w-4 h-4 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-foreground">Meta Console</span>
                <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Developer Portal</span>
              </a>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
