"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Instagram, 
  Settings, 
  Sparkles, 
  BrainCircuit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { username, userId, logout, isLoading: sessionLoading } = useInstagramSession()
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  
  // Groq AI states
  const [aiEnabled, setAiEnabled] = useState(false)
  const [aiContext, setAiContext] = useState("")
  
  // Loading & Saving states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save Groq AI settings:", err)
    } finally {
      setSaving(false)
    }
  }

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/20 animate-ping" />
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading your settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 p-4 md:p-8 animate-in fade-in duration-500 relative">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-purple-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-blue-500/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      {/* Title Header */}
      <div className={`flex flex-col gap-1.5 border-b border-border pb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
          <h1 className="text-3xl font-bold text-foreground">Account & Automation Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-[1.15rem]">
          Manage your connected accounts, customize AI replies, and review Meta compliance status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & compliance info */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Instagram Account Details */}
          <Card className={`border-border bg-card/65 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '150ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="h-16 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 relative flex items-center justify-center">
              <Instagram className="absolute top-2.5 right-3 w-4 h-4 text-white/50" />
            </div>
            <CardContent className="pt-0 relative flex flex-col items-center text-center px-4 pb-6 mt-[-32px]">
              
              {/* Profile image container */}
              <div className="w-20 h-20 rounded-full border-4 border-card bg-secondary flex items-center justify-center shadow-md overflow-hidden shrink-0">
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt={username || "User"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-foreground">{(username || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>

              <h3 className="font-bold text-foreground text-base mt-3 leading-none">@{username}</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1 uppercase tracking-wider">Instagram Business</p>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Connection
              </div>

              <div className="w-full border-t border-border mt-6 pt-5 space-y-3.5 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Meta User ID</span>
                  <span className="text-xs text-foreground font-semibold block truncate bg-secondary px-2.5 py-1.5 rounded-md mt-1 border border-border/40 font-mono">{userId}</span>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={logout}
                className="w-full mt-6 py-4.5 rounded-xl font-bold text-xs shadow-md shadow-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Disconnect Account
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Card */}
          <Card className={`border-border bg-card/65 shadow-sm p-5 space-y-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '300ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Meta Compliance</h3>
            </div>
            <div className="space-y-3.5 text-xs text-muted-foreground font-medium">
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded border border-border/20">
                <span>Webhook Status</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded border border-border/20">
                <span>Data Protection</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded">Compliant</span>
              </div>
              <p className="text-[11px] leading-relaxed mt-2.5">
                Our database deletes all tokens and custom trigger flows instantly upon disconnect.
              </p>
              <Link 
                href="/delete-data" 
                className="inline-flex items-center text-blue-500 hover:text-blue-600 font-bold hover:underline gap-1 mt-1 group"
              >
                Data Deletion Portal <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Card>

        </div>

        {/* Right Side: AI Configuration form */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className={`border-border bg-card/65 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms', transitionDuration: '700ms' }}>
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20">
                    <BrainCircuit className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground font-bold flex items-center gap-2">
                      Smart AI Auto-Reply Assistant
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        Context-Aware
                      </span>
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Intelligent customer service assistant powered by secure real-time inference
                    </p>
                  </div>
                </div>
                
                {/* Switch for AI Enabled status */}
                <Switch 
                  checked={aiEnabled} 
                  onCheckedChange={setAiEnabled}
                  className="cursor-pointer"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground block">
                    AI Knowledge Base & Business Context
                  </label>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {aiEnabled ? "🟢 Active Engine" : "⚪ Standby Mode"}
                  </span>
                </div>
                <Textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  disabled={!aiEnabled}
                  placeholder="Example: You are a friendly customer helper for our brand. You answer questions politely and accurately. You provide pricing, business hours, service details, and guide users to our website..."
                  className="min-h-[160px] bg-background border-border text-xs focus:ring-primary/20 text-foreground resize-none leading-relaxed placeholder:opacity-60 font-sans"
                />
                <p className="text-[10px] text-muted-foreground font-medium">
                  Define your brand identity, FAQs, product pricing, and business guidelines for automatic customer assistance.
                </p>
              </div>

              {/* Data Privacy & Compliance Disclosure for Meta App Review */}
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/70 flex items-start gap-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-foreground">Meta Platform Data Compliance:</span> AI processing only operates in real-time to generate instant replies for customer inquiries. No follower messages or personal data are stored for model training or shared with unauthorized third parties.
                </div>
              </div>

              {/* Status information depending on switch */}
              {aiEnabled ? (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-400">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400 animate-pulse" />
                  <p className="leading-relaxed font-medium">
                    <strong>AI Responses Active:</strong> Messages that do not match exact trigger keywords will receive smart, contextual answers based on your business instructions above.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-500">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed font-medium">
                    <strong>Keyword Mode Only:</strong> Only explicit trigger keywords defined in your Automations tab will trigger auto-replies.
                  </p>
                </div>
              )}

              <div className="border-t border-border/50 pt-4 flex items-center justify-between gap-4">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold animate-in fade-in duration-300">
                    <CheckCircle className="w-4 h-4" /> Preferences Saved Successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Changes take effect immediately on incoming messages.
                  </span>
                )}

                <Button
                  onClick={handleSaveAISettings}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Meta Platform Compliance & Official Documentation Card */}
          <Card className={`border-border bg-card/65 shadow-sm p-6 space-y-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '400ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
              <h3 className="font-bold text-foreground text-sm">Meta Developer & Platform Compliance</h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              DMSpark operates strictly in compliance with Meta Platform Terms, Instagram Messaging Policies, and user data privacy standards.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <Link 
                href="/privacy" 
                className="flex items-center justify-center gap-1.5 border border-border hover:bg-secondary/60 font-bold text-[11px] px-3 py-2.5 rounded-xl text-foreground transition-all"
              >
                Privacy Policy <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link 
                href="/terms" 
                className="flex items-center justify-center gap-1.5 border border-border hover:bg-secondary/60 font-bold text-[11px] px-3 py-2.5 rounded-xl text-foreground transition-all"
              >
                Terms of Service <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link 
                href="/delete-data" 
                className="flex items-center justify-center gap-1.5 border border-border hover:bg-secondary/60 font-bold text-[11px] px-3 py-2.5 rounded-xl text-foreground transition-all"
              >
                Data Deletion <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <a 
                href="https://developers.facebook.com/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 border border-border hover:bg-secondary/60 font-bold text-[11px] px-3 py-2.5 rounded-xl text-foreground transition-all"
              >
                Meta Console <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
