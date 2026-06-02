"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Compass, 
  Zap, 
  MessageSquare, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  UserCheck 
} from "lucide-react"
import Link from "next/link"

export default function HowToUsePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-play loop for the simulated smartphone automation preview
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const onboardingSteps = [
    {
      num: "01",
      title: "Connect Instagram Profile",
      desc: "Connect your Instagram Business or Creator account in a click through secure Meta OAuth authorization.",
      icon: <UserCheck className="w-5 h-5 text-blue-500" />,
      action: "Connect Page",
      href: "/dashboard"
    },
    {
      num: "02",
      title: "Set Keyword Triggers",
      desc: "Specify keyword triggers (e.g. price, promo, DM) that will watch comments, DMs, or story mentions.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      action: "Build Flow",
      href: "/dashboard/flow-builder"
    },
    {
      num: "03",
      title: "Construct Responses",
      desc: "Build instant text responses or design rich product cards with clickable URLs, discount codes, or links.",
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
      action: "Create Rules",
      href: "/dashboard/automations"
    },
    {
      num: "04",
      title: "Monitor Performance",
      desc: "Track real-time interaction metrics, lifetime messages sent, conversions, and total audience reached.",
      icon: <Sparkles className="w-5 h-5 text-violet-500" />,
      action: "View Analytics",
      href: "/dashboard/analytics"
    }
  ]

  return (
    <div className="p-4 md:p-8 space-y-6 text-foreground min-h-[90vh] flex flex-col justify-between font-sans relative z-10 animate-in fade-in duration-500">
      
      {/* Top Header Utilities */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <span className="text-xs font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 text-primary" /> Onboarding Tutorial
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            How to Use DMSpark
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Learn how to deploy high-converting Instagram automations in less than 5 minutes.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch relative mt-4 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        
        {/* Left Columns: Stepper List */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingSteps.map((stepItem, idx) => (
              <Card 
                key={stepItem.num}
                className="p-4 bg-card/60 backdrop-blur-md border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                    <span className="text-[10px] font-black text-muted-foreground/50 tracking-widest uppercase">Step {stepItem.num}</span>
                    <span className="p-1.5 rounded-lg bg-secondary/50 border border-border/50">
                      {stepItem.icon}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">{stepItem.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-semibold">{stepItem.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/30">
                  <Link 
                    href={stepItem.href}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline w-fit"
                  >
                    {stepItem.action} <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4.5 bg-primary/5 border-primary/20 shadow-sm flex items-start gap-3.5 mt-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Need manual assistance?</h4>
              <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                Connect with our product specialist at virtualrevolution02@gmail.com for setup auditing or custom flow construction!
              </p>
            </div>
          </Card>
        </div>

        {/* Right Columns: Interactive Smartphone Simulator Onboarding On Looping Animation */}
        <Card className="lg:col-span-2 p-5 bg-card/60 backdrop-blur-md border-border shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[500px]">
          {/* subtle gradient glaze */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-transparent to-violet-500/[0.01] pointer-events-none rounded-xl" />
          
          <div className="space-y-4 flex flex-col h-full justify-between relative z-10">
            <h3 className="font-extrabold text-foreground text-sm tracking-tight border-b border-border/50 pb-2.5 flex items-center gap-2 shrink-0">
              <span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-blue-500" />
              </span>
              Live Automation Preview
            </h3>

            {/* Simulated Phone UI Container */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div className="w-[230px] h-[360px] rounded-[36px] border-[6px] border-slate-700 dark:border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                
                {/* Phone Notch/Speaker */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-full bg-slate-700 dark:bg-slate-800 z-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-1.5" />
                  <div className="w-6 h-0.5 rounded-full bg-slate-900" />
                </div>

                {/* Phone Header */}
                <div className="bg-slate-900 border-b border-slate-800/80 px-4 pt-6 pb-2.5 flex items-center gap-2 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a73e8] to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                    S
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white leading-none">DMSpark Bot</p>
                    <p className="text-[7px] text-emerald-400 font-bold leading-none mt-1 uppercase flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                    </p>
                  </div>
                </div>

                {/* Phone Chat Feed Container */}
                <div className="flex-1 p-3 space-y-2 overflow-y-auto flex flex-col justify-end bg-slate-950 relative">
                  
                  {/* Step 1: User Comment Notification Bubble */}
                  {animationStep >= 1 && (
                    <div className="self-start max-w-[80%] bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none p-2.5 text-left text-slate-100 shadow-sm animate-in slide-in-from-left-3 duration-300">
                      <p className="text-[8px] font-bold text-[#1a73e8] uppercase tracking-wider mb-0.5">User Comment</p>
                      <p className="text-[9px] font-semibold leading-relaxed">
                        "Send me the coupon link!"
                      </p>
                    </div>
                  )}

                  {/* Step 2: System processing overlay indicator */}
                  {animationStep === 2 && (
                    <div className="self-center bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-full text-blue-400 text-[8px] font-bold flex items-center gap-1.5 animate-pulse">
                      <Zap className="w-2.5 h-2.5 text-blue-400" /> Webhook Triggered
                    </div>
                  )}

                  {/* Step 3: Bot Typing Bubble */}
                  {animationStep === 3 && (
                    <div className="self-end max-w-[80%] bg-[#1a73e8] text-white rounded-2xl rounded-tr-none p-2.5 text-left shadow-md flex items-center gap-1.5 animate-in slide-in-from-right-3 duration-300">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Bot Automated Instant Reply */}
                  {animationStep >= 4 && (
                    <div className="self-end max-w-[80%] bg-[#1a73e8] border border-blue-600/25 text-white rounded-2xl rounded-tr-none p-2.5 text-left shadow-md space-y-1 animate-in slide-in-from-right-3 duration-300">
                      <p className="text-[8px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-0.5">
                        <CheckCircle2 className="w-2 h-2 text-blue-100" /> Sent Automated DM
                      </p>
                      <p className="text-[9px] font-semibold leading-relaxed">
                        Here is your 50% discount coupon code: **DMSPARK50**!
                      </p>
                    </div>
                  )}

                </div>

                {/* Phone Input Box footer */}
                <div className="bg-slate-900 border-t border-slate-800/80 p-2 flex items-center justify-between shrink-0">
                  <div className="h-5 flex-1 bg-slate-950 rounded-full border border-slate-800 px-2 flex items-center justify-start text-[7px] text-slate-500 font-bold uppercase select-none">
                    Type a message...
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#1a73e8]/20 border border-[#1a73e8]/30 flex items-center justify-center ml-1.5 text-[#1a73e8]">
                    <Zap className="w-2.5 h-2.5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Stepper dynamic guide label */}
            <div className="pt-2.5 border-t border-border/50 text-center shrink-0">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest block opacity-75">
                {animationStep === 0 && "01. Automation is Idle (Waiting for Trigger)"}
                {animationStep === 1 && "02. Instagram comment trigger keyword captured"}
                {animationStep === 2 && "03. Processing Webhook trigger via Meta API"}
                {animationStep === 3 && "04. Processing response delay rules..."}
                {animationStep === 4 && "05. Response delivered successfully to User's DM!"}
              </span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
