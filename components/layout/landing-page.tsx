"use client"

import { Button } from "@/components/ui/button"
import { Zap, MessageCircle, Shield, Clock } from "lucide-react"

export function LandingPage() {
  const handleLogin = () => {
    window.location.href = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Subtle bg glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1a73e8]/[0.05] rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-50 h-20 flex items-center justify-between px-6 md:px-12 border-b border-border bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DMSpark" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold tracking-tight text-[#1a73e8]">DMSpark</span>
        </div>
        <Button
          onClick={handleLogin}
          variant="outline"
          className="rounded-full px-6 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all bg-transparent border-border"
        >
          Login
        </Button>
      </nav>

      <main className="relative z-10 pt-20 md:pt-32 px-6 md:px-12 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-black/5 border border-black/10 rounded-full px-4 py-1.5 text-xs text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34a853] animate-pulse" />
            Instagram Automation Tool
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Auto Reply.
            <br />
            <span className="text-[#1a73e8]">Auto Grow.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
            Set keyword triggers on comments & DMs. 
            Let <strong className="text-slate-900 font-bold">DMSpark</strong> handle the replies — 
            so you can focus on creating content.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleLogin}
              className="bg-[#1a73e8] text-white h-14 px-10 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-[#1a73e8]/20 hover:bg-[#1557b0]"
            >
              Connect Instagram
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-24 grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<MessageCircle className="w-5 h-5" />}
            title="Comment & DM Replies"
            description="Auto-reply to keywords in comments and direct messages instantly."
            color="text-[#1a73e8]"
            bg="bg-[#1a73e8]/10"
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" />}
            title="Follow Gate"
            description="Only reply to followers — grow your community the smart way."
            color="text-[#34a853]"
            bg="bg-[#34a853]/10"
          />
          <FeatureCard
            icon={<Clock className="w-5 h-5" />}
            title="Always On"
            description="Works 24/7. Never miss a lead, even when you're sleeping."
            color="text-[#fbbc04]"
            bg="bg-[#fbbc04]/10"
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description, color, bg }: { icon: React.ReactNode; title: string; description: string; color: string; bg: string }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} mb-4 transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}
