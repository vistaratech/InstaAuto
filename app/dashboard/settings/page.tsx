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
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">Account & Automation Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your connected accounts, customize AI replies, and review Meta compliance status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & compliance info */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Instagram Account Details */}
          <Card className="border-border bg-card/65 shadow-sm overflow-hidden">
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
          <Card className="border-border bg-card/65 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
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
          
          <Card className="border-border bg-card/65 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-500" />
                  <CardTitle className="text-base text-foreground font-bold">Dynamic AI Responses (Groq LLaMA 3)</CardTitle>
                </div>
                
                {/* Switch for AI Enabled status */}
                <Switch 
                  checked={aiEnabled} 
                  onCheckedChange={setAiEnabled}
                  className="cursor-pointer"
                />
              </div>
              <CardDescription className="text-xs mt-2.5">
                When enabled, incoming DMs and comments will be automatically answered by our context-aware AI engine using Groq's high-speed intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-foreground block">AI Assistant Instructions & Context</label>
                <Textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  disabled={!aiEnabled}
                  placeholder="Example: You are a friendly customer helper for Sun Rockers Events. Answer questions in Tamil and English. We offer event planning, decor, and DJ services. Always end with a call to action..."
                  className="min-h-[180px] bg-background border-border text-xs focus:ring-primary/20 text-foreground resize-none leading-relaxed placeholder:opacity-60"
                />
                <p className="text-[10px] text-muted-foreground font-medium">
                  Provide instructions regarding your brand identity, product prices, event services, or dynamic answers.
                </p>
              </div>

              {/* Status information depending on switch */}
              {aiEnabled ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-400">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400 animate-pulse" />
                  <p className="leading-relaxed font-medium">
                    <strong>AI Responses Active:</strong> All incoming messages not caught by specific keyword trigger templates will automatically fall back to Groq dynamic AI processing using the instructions provided above.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-500">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed font-medium">
                    <strong>AI Responses Disabled:</strong> Only exact keyword matches defined in your trigger templates will trigger auto-replies. Standard casual questions will be ignored.
                  </p>
                </div>
              )}

              <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-4">
                
                {/* Success Feedback message */}
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold animate-in fade-in duration-300">
                    <CheckCircle className="w-4 h-4" /> Preferences Saved Successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Ensure AI instructions are comprehensive to get maximum conversion.
                  </span>
                )}

                <Button
                  onClick={handleSaveAISettings}
                  disabled={saving}
                  className="px-6 py-4.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
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

          {/* Additional settings placeholder */}
          <Card className="border-border bg-card/65 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-foreground text-sm">Meta Developer & Webhook Settings</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              If you are integrating a custom Meta App with our system, make sure the App Token matches the database environment. For developer support, refer to Meta's guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="https://developers.facebook.com/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border hover:bg-secondary/40 font-bold text-xs px-4 py-2.5 rounded-xl text-foreground transition-all cursor-pointer"
              >
                Meta Developer Console <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
