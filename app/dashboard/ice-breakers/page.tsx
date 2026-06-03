"use client"

import { useState } from "react"
import { Snowflake, Sparkles, MessageCircle, ArrowLeft, Mail, CheckCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IceBreakersPage() {
  const [requested, setRequested] = useState(false)

  return (
    <div className="min-h-0 md:min-h-[85vh] flex items-center justify-center p-4 md:p-8 relative overflow-x-hidden select-none">
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10 animate-in fade-in duration-700">
        
        {/* Back Link */}
        <div className="text-left">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-foreground transition-all hover:translate-x-[-3px] duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Feature Icon Header */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl blur-[12px] opacity-35 animate-pulse" />
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 shadow-xl flex items-center justify-center relative">
            <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
              <Snowflake className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-black tracking-widest">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Coming Soon
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Ice Breakers Customization
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed font-medium">
            Personalize the welcoming interface. Add customized question buttons to your Instagram chat window to start high-converting interactions instantly.
          </p>
        </div>

        {/* Highlighted bullets */}
        <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-3.5 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Interactive Greeting Prompts</h4>
              <p className="text-[10px] text-muted-foreground">Setup up to 4 custom questions that appear instantly when a customer first starts a conversation with you on Instagram.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">1-Tap Fast Automation Response</h4>
              <p className="text-[10px] text-muted-foreground">Attach specific automation triggers and responses directly to each custom ice-breaker question.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Action */}
        <div className="max-w-xs mx-auto">
          {requested ? (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold animate-in zoom-in-95 duration-200">
              <CheckCircle className="w-4 h-4" /> Request for Beta Access Sent!
            </div>
          ) : (
            <Button 
              onClick={() => setRequested(true)}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Mail className="w-4 h-4 mr-2" /> Request Early Access
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
