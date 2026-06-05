"use client"

import { useState } from "react"
import { Zap, Sparkles, MessageSquare, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WhatsAppAutomationsPage() {
  const [requested, setRequested] = useState(false)

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 md:p-8 relative overflow-x-hidden select-none">
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10 animate-in fade-in duration-700">
        
        {/* Back Link */}
        <div className="text-left">
          <Link 
            href="/whatsapp-dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-foreground transition-all hover:translate-x-[-3px] duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Feature Icon Header */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-2xl blur-[12px] opacity-35 animate-pulse" />
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-0.5 shadow-xl flex items-center justify-center relative">
            <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
              <Zap className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-black tracking-widest">
            <Sparkles className="w-3 h-3 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} /> Coming Soon
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            WhatsApp Keyword Rules
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed font-medium">
            Configure custom WhatsApp trigger keywords (e.g. price, catalog) and instantly reply to incoming messages with pre-defined text, images, or interactive buttons.
          </p>
        </div>

        {/* Highlighted bullets */}
        <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-3.5 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Interactive Response Templates</h4>
              <p className="text-[10px] text-muted-foreground">Construct rich cards, quick reply buttons, and templates approved by Meta Cloud API.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Keyword Detection Engine</h4>
              <p className="text-[10px] text-muted-foreground">Instantly triggers custom flow sequences upon receiving matched text from users.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Action */}
        <div className="max-w-xs mx-auto">
          {requested ? (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold animate-in zoom-in-95 duration-200">
              <CheckCircle className="w-4 h-4" /> Request for Beta Access Sent!
            </div>
          ) : (
            <Button 
              onClick={() => setRequested(true)}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-600 text-white font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Mail className="w-4 h-4 mr-2" /> Request Early Access
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
