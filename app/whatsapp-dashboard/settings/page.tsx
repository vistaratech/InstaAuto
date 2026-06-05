"use client"

import { useEffect, useState } from "react"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  MessageSquare, 
  Sparkles, 
  BrainCircuit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react"
import Link from "next/link"

export default function WhatsAppSettingsPage() {
  const { waUsername, waUserId, logoutWhatsApp, isLoading: sessionLoading } = useWhatsAppSession()
  
  // WhatsApp API Settings
  const [appId, setAppId] = useState("189274019284712")
  const [businessAccountId, setBusinessAccountId] = useState("9832749102384")
  const [accessToken, setAccessToken] = useState("EAAGz0XpC6FwBO7ZCa...")
  const [showToken, setShowToken] = useState(false)
  
  // Groq AI states
  const [aiEnabled, setAiEnabled] = useState(false)
  const [aiContext, setAiContext] = useState("")
  
  // Loading & Saving states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Clipboard copy feedback states
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  // Entrance animation state
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setIsVisible(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Load Groq settings from local storage if present
  useEffect(() => {
    if (!waUserId) return
    const savedAiEnabled = localStorage.getItem(`wa_ai_enabled_${waUserId}`)
    const savedAiContext = localStorage.getItem(`wa_ai_context_${waUserId}`)
    
    if (savedAiEnabled === "true") {
      setAiEnabled(true)
    }
    if (savedAiContext) {
      setAiContext(savedAiContext)
    }
  }, [waUserId])

  const handleSaveAISettings = () => {
    if (!waUserId) return
    setSaving(true)
    setSaveSuccess(false)
    
    // Simulate API request saving preferences
    setTimeout(() => {
      localStorage.setItem(`wa_ai_enabled_${waUserId}`, String(aiEnabled))
      localStorage.setItem(`wa_ai_context_${waUserId}`, aiContext)
      setSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://dmspark.in/api/hooks/whatsapp")
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText("dmspark_wa_verify_challenge_2026")
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-emerald-500/20 animate-ping" />
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading WhatsApp settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 p-4 md:p-8 animate-in fade-in duration-500 relative select-none">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-teal-500/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>
      
      {/* Title Header */}
      <div className={`flex flex-col gap-1.5 border-b border-border pb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">WhatsApp Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm font-semibold ml-[1.15rem]">
          Manage your Meta Cloud API connection, set webhook URLs, and configure Groq LLaMA 3 AI responses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & compliance info */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Account Details */}
          <Card className={`border-border bg-card/65 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '100ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="h-16 bg-gradient-to-tr from-emerald-500 to-teal-650 relative flex items-center justify-center">
              <MessageSquare className="absolute top-2.5 right-3 w-4 h-4 text-white/50 fill-current" />
            </div>
            <CardContent className="pt-0 relative flex flex-col items-center text-center px-4 pb-6 mt-[-32px]">
              
              <div className="w-20 h-20 rounded-full border-4 border-card bg-emerald-500/10 border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-md overflow-hidden shrink-0 font-black text-xl">
                {waUsername ? waUsername.charAt(0).toUpperCase() : "W"}
              </div>

              <h3 className="font-extrabold text-foreground text-base mt-3 leading-none truncate max-w-full">{waUsername}</h3>
              <p className="text-[10px] text-muted-foreground font-bold mt-1.5 uppercase tracking-wider">WhatsApp Business Profile</p>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Connection
              </div>

              <div className="w-full border-t border-border mt-6 pt-5 space-y-3.5 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Phone Number (ID)</span>
                  <span className="text-xs text-foreground font-mono font-semibold block truncate bg-secondary px-2.5 py-1.5 rounded-md mt-1 border border-border/40">{waUserId}</span>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={logoutWhatsApp}
                className="w-full mt-6 py-4.5 rounded-xl font-bold text-xs shadow-md shadow-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Disconnect Business
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Card */}
          <Card className={`border-border bg-card/65 shadow-sm p-5 space-y-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms', transitionDuration: '700ms' }}>
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-foreground text-sm">Security & Privacy</h3>
            </div>
            <div className="space-y-3.5 text-xs text-muted-foreground font-semibold">
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded border border-border/20">
                <span>Webhook SSL</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">Enforced</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/40 p-2 rounded border border-border/20">
                <span>Data Protection</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">Compliant</span>
              </div>
              <p className="text-[11px] leading-relaxed mt-2.5">
                Our servers handle incoming webhook JSON feeds via end-to-end HTTPS protection. Access tokens are encrypted.
              </p>
            </div>
          </Card>

        </div>

        {/* Right Side: API Config & AI Configuration form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* API Keys Configuration */}
          <Card className={`border-border bg-card/65 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '150ms' : '0ms', transitionDuration: '700ms' }}>
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <Settings className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-foreground font-extrabold">Meta Developer App Settings</CardTitle>
              </div>
              <CardDescription className="text-xs mt-2.5">
                These settings associate your DMSpark profile to your Meta Developer Cloud App.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Meta App ID</label>
                  <Input 
                    type="text" 
                    value={appId} 
                    onChange={(e) => setAppId(e.target.value)}
                    className="h-10 text-xs bg-background border-border font-semibold focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">WhatsApp Business Account ID</label>
                  <Input 
                    type="text" 
                    value={businessAccountId} 
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    className="h-10 text-xs bg-background border-border font-semibold focus:border-emerald-500/40"
                  />
                </div>
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Permanent Access Token</label>
                <div className="relative">
                  <Input 
                    type={showToken ? "text" : "password"} 
                    value={accessToken} 
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="h-10 text-xs bg-background border-border font-semibold focus:border-emerald-500/40 pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration Details */}
          <Card className={`border-border bg-card/65 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms', transitionDuration: '700ms' }}>
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-foreground font-extrabold">Webhook callback URL</CardTitle>
              </div>
              <CardDescription className="text-xs mt-2.5">
                Copy these details and paste them into the Webhooks section of your Meta Developer App Dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider block">Callback URL</label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    readOnly 
                    value="https://dmspark.in/api/hooks/whatsapp" 
                    className="h-10 text-xs bg-secondary border-border font-semibold focus:outline-none flex-grow"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCopyUrl}
                    className="h-10 px-3 border-border hover:bg-secondary flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider block">Verify Token</label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    readOnly 
                    value="dmspark_wa_verify_challenge_2026" 
                    className="h-10 text-xs bg-secondary border-border font-semibold focus:outline-none flex-grow"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCopyToken}
                    className="h-10 px-3 border-border hover:bg-secondary flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {copiedToken ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groq AI Settings */}
          <Card className={`border-border bg-card/65 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '250ms' : '0ms', transitionDuration: '700ms' }}>
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base text-foreground font-extrabold">Groq LLaMA 3 Auto-Reply Context</CardTitle>
                </div>
                <Switch 
                  checked={aiEnabled} 
                  onCheckedChange={setAiEnabled}
                  className="cursor-pointer"
                />
              </div>
              <CardDescription className="text-xs mt-2.5">
                When active, any WhatsApp message that does not trigger a keyword rule will fall back to the Groq AI model.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-foreground block">AI Assistant System Prompt Context</label>
                <Textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  disabled={!aiEnabled}
                  placeholder="Example: You are a friendly customer agent for Sun Rockers. Reply to WhatsApp users. Offer discount coupons and help coordinate bookings..."
                  className="min-h-[160px] bg-background border-border text-xs focus:ring-emerald-500/20 text-foreground resize-none leading-relaxed placeholder:opacity-60"
                />
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Custom instructions for the AI bot when replying to WhatsApp client messages.
                </p>
              </div>

              {aiEnabled ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500 animate-pulse" />
                  <p className="leading-relaxed">
                    <strong>AI Active:</strong> Groq auto-reply context is active for all WhatsApp chats. Standard casual questions will be handled automatically.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-500 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed">
                    <strong>AI Disabled:</strong> Casual user text queries will not get automated answers. Only keyword rules set under Automations will be triggered.
                  </p>
                </div>
              )}

              <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-4">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-extrabold animate-in fade-in duration-300">
                    <CheckCircle className="w-4 h-4" /> WhatsApp Preferences Saved!
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    Ensure AI instructions are comprehensive to get maximum conversion.
                  </span>
                )}

                <Button
                  onClick={handleSaveAISettings}
                  disabled={saving}
                  className="px-6 py-4.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0 border-none"
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
          
        </div>

      </div>

    </div>
  )
}
