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
  Pause,
  CheckCircle2, 
  Clock, 
  UserCheck,
  Laptop,
  Smartphone,
  MousePointerClick,
  Database,
  TrendingUp,
  RefreshCw,
  Info
} from "lucide-react"
import Link from "next/link"

export default function HowToUsePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [deviceMode, setDeviceMode] = useState<"mobile" | "laptop">("mobile")
  const [animationStep, setAnimationStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Dynamic Auto-Play loop transitions through steps 0 to 4
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5)
    }, 4500)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleStepSelect = (stepIdx: number) => {
    setIsPlaying(false)
    setAnimationStep(stepIdx)
  }

  const onboardingSteps = [
    {
      num: 1,
      stepLabel: "01",
      title: "Connect Instagram Profile",
      desc: "Connect your Instagram Creator or Business account in seconds through Meta OAuth verification.",
      icon: <UserCheck className="w-5 h-5 text-blue-500" />,
      action: "Integrate Now",
      href: "/dashboard"
    },
    {
      num: 2,
      stepLabel: "02",
      title: "Set Keyword Triggers",
      desc: "Specify exact keyword matches (like 'coupon', 'price') that watch comments or story tags.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      action: "Configure Keywords",
      href: "/dashboard/flow-builder"
    },
    {
      num: 3,
      stepLabel: "03",
      title: "Construct Responses",
      desc: "Design templates with links, dynamic discount coupon codes, and automated reply text blocks.",
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
      action: "Write DM Templates",
      href: "/dashboard/automations"
    },
    {
      num: 4,
      stepLabel: "04",
      title: "Monitor Performance",
      desc: "Watch analytics capture automated messages sent, conversion triggers, and target reach charts.",
      icon: <Sparkles className="w-5 h-5 text-violet-500" />,
      action: "Analyze Traffic",
      href: "/dashboard/analytics"
    }
  ]

  return (
    <div className="p-4 md:p-8 space-y-6 text-foreground min-h-[90vh] flex flex-col justify-between font-sans relative z-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <span className="text-xs font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '10s' }} /> Interactive Guide
          </span>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            How to Use DMSpark
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Click on any step card below to interactively test the live simulation flow in mobile or laptop viewports.
          </p>
        </div>

        {/* Global Autoplay Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs font-bold gap-1.5 h-9 bg-card/50 border-border/80 rounded-full"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Paused Autoplay
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 animate-pulse" /> Resume Autoplay
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAnimationStep(0)}
            className="text-xs font-bold h-9 hover:bg-secondary/60 rounded-full"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Main Workspace split in Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch relative mt-2">
        
        {/* Left Side: Step cards */}
        <div className={`lg:col-span-3 space-y-4 flex flex-col justify-between transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Overview / Introduction Step (Step 0) */}
            <Card 
              onClick={() => handleStepSelect(0)}
              className={`p-4 bg-card/60 backdrop-blur-md cursor-pointer transition-all duration-300 col-span-1 md:col-span-2 group relative overflow-hidden border-2 ${
                animationStep === 0 
                  ? 'border-primary shadow-lg ring-2 ring-primary/10 -translate-y-0.5 bg-gradient-to-br from-primary/[0.03] to-violet-500/[0.03]' 
                  : 'border-border/60 hover:border-border hover:-translate-y-0.5'
              }`}
            >
              {animationStep === 0 && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/50 uppercase tracking-widest">
                      Getting Started
                    </span>
                    {animationStep === 0 && (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                    DMSpark Automation Engine Overview
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                    DMSpark automates interactive user funnels by listening to keyword mentions across Instagram and dispatching custom high-conversion Direct Messages instantly. Explore the interactive walkthrough in Mobile or Laptop mode!
                  </p>
                </div>
              </div>
            </Card>

            {/* Stepper Cards */}
            {onboardingSteps.map((step) => {
              const isActiveStep = animationStep === step.num
              return (
                <Card 
                  key={step.num}
                  onClick={() => handleStepSelect(step.num)}
                  className={`p-4 bg-card/60 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden border-2 ${
                    isActiveStep 
                      ? 'border-primary shadow-lg ring-2 ring-primary/10 -translate-y-0.5 bg-gradient-to-br from-primary/[0.03] to-violet-500/[0.03]' 
                      : 'border-border/60 hover:border-border hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-muted-foreground/60 tracking-widest uppercase">
                          Step {step.stepLabel}
                        </span>
                        {isActiveStep && (
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                      <span className={`p-1.5 rounded-lg border transition-all duration-300 ${
                        isActiveStep 
                          ? 'bg-primary/10 border-primary/20 scale-105' 
                          : 'bg-secondary/50 border-border/50 group-hover:bg-secondary'
                      }`}>
                        {step.icon}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <Link 
                      href={step.href}
                      className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline w-fit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {step.action} <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Expert help assistance banner */}
          <Card className="p-4.5 bg-primary/5 border-primary/20 shadow-sm flex items-start gap-3.5 mt-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-inner">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Setup audit or customization?</h4>
              <p className="text-[11px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                Connect with our automation engineers at virtualrevolution02@gmail.com for custom webhook configurations, CRM pipelines, or advanced interactive triggers.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Side: Interactive Device Simulator Mockup */}
        <Card className={`lg:col-span-2 p-5 bg-card/60 backdrop-blur-md border-border shadow-md flex flex-col justify-between relative overflow-hidden min-h-[520px] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-transparent to-violet-500/[0.01] pointer-events-none rounded-xl" />
          
          <div className="space-y-4 flex flex-col h-full justify-between relative z-10">
            
            {/* Device Toggle Selector Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5 shrink-0 gap-2">
              <h3 className="font-extrabold text-foreground text-xs tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Flow Simulation
              </h3>
              
              {/* Segmented Device Toggle buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border/40 shadow-inner">
                <button
                  onClick={() => setDeviceMode("mobile")}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    deviceMode === "mobile"
                      ? "bg-background text-primary shadow-sm border border-border/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
                <button
                  onClick={() => setDeviceMode("laptop")}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    deviceMode === "laptop"
                      ? "bg-background text-primary shadow-sm border border-border/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Laptop className="w-3 h-3" /> Laptop
                </button>
              </div>
            </div>

            {/* Simulated Frame Display container */}
            <div className="flex-1 flex items-center justify-center py-4 min-h-[360px]">
              
              {/* MOBILE SIMULATOR */}
              {deviceMode === "mobile" ? (
                <div className="w-[230px] h-[365px] rounded-[38px] border-[6px] border-slate-700 dark:border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between animate-in zoom-in-95 duration-500">
                  
                  {/* Phone Speaker/Camera Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-full bg-slate-700 dark:bg-slate-800 z-50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-1.5 animate-pulse" />
                    <div className="w-6 h-0.5 rounded-full bg-slate-900" />
                  </div>

                  {/* Phone Instagram App Header */}
                  <div className="bg-slate-900 border-b border-slate-800/80 px-4 pt-6 pb-2.5 flex items-center gap-2 shrink-0 select-none">
                    <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-[9px] font-black text-white shadow-md">
                      D
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] font-black text-white leading-none">@vistaratech</p>
                      <p className="text-[6.5px] text-emerald-400 font-bold leading-none mt-1 uppercase flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </p>
                    </div>
                  </div>

                  {/* Phone Chat Feed Frame content */}
                  <div className="flex-1 p-3 space-y-2.5 overflow-y-auto flex flex-col justify-end bg-slate-950 relative">
                    
                    {/* STEP 0: Idle State / Inbox feed */}
                    {animationStep === 0 && (
                      <div className="absolute inset-0 p-3 flex flex-col justify-start space-y-2 text-slate-400 select-none animate-in fade-in duration-300">
                        <p className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Direct Messages</p>
                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/50">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[8px] font-bold">@I</div>
                          <div className="flex-1 min-w-0">
                            <div className="h-1.5 w-16 bg-slate-700 rounded mb-1" />
                            <div className="h-1 w-20 bg-slate-800 rounded" />
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/30">
                          <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[8px] font-bold">@S</div>
                          <div className="flex-1 min-w-0">
                            <div className="h-1.5 w-12 bg-slate-800 rounded mb-1" />
                            <div className="h-1 w-16 bg-slate-800 rounded" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                          <Compass className="w-6 h-6 mb-1 text-slate-500" />
                          <p className="text-[7.5px] font-bold">Waiting for Keyword Triggers</p>
                        </div>
                      </div>
                    )}

                    {/* STEP 1: OAuth Connect Permission popup */}
                    {animationStep === 1 && (
                      <div className="absolute inset-x-3 bottom-3 top-auto bg-slate-900 rounded-2xl border border-slate-800 p-3 text-center space-y-2.5 animate-in slide-in-from-bottom-6 duration-300 shadow-xl">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto text-blue-400">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[9px] font-black text-white">Meta Integration Request</h4>
                          <p className="text-[7px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                            Allow **DMSpark Integration** to read and write Instagram direct messaging comments?
                          </p>
                        </div>
                        <Button className="h-6 w-full text-[8px] font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white shrink-0 shadow-md">
                          Authorize Business Profile
                        </Button>
                        <p className="text-[5.5px] text-slate-500 font-bold uppercase tracking-wider">Secured OAuth 2.0 via Meta Inc.</p>
                      </div>
                    )}

                    {/* STEP 2: Instagram Post and comment triggers keyword */}
                    {animationStep === 2 && (
                      <div className="absolute inset-0 p-3 flex flex-col justify-between animate-in fade-in duration-300 text-slate-100">
                        {/* Simulated Post Image */}
                        <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20" />
                          <div className="text-center p-2">
                            <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">Giveaway</span>
                            <p className="text-[8px] font-black mt-1 text-slate-200">50% DISCOUNT COUPON</p>
                            <p className="text-[6px] text-slate-400 mt-0.5">Comment keyword "coupon" to receive code</p>
                          </div>
                        </div>
                        {/* Comment slider bubble */}
                        <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-2 flex items-start gap-2 shadow-lg ring-4 ring-blue-500/10 animate-in slide-in-from-bottom-4 duration-300">
                          <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[7px] font-bold border border-slate-700 text-slate-200">U</div>
                          <div className="flex-1">
                            <p className="text-[7px] font-extrabold text-blue-400">@insta_shopper</p>
                            <p className="text-[8px] font-semibold text-white mt-0.5">"coupon"</p>
                          </div>
                          <span className="text-[6px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold animate-pulse uppercase">Match</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Automated DM Chat bubble with link */}
                    {animationStep === 3 && (
                      <>
                        <div className="self-start max-w-[80%] bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none p-2 text-left text-slate-100 shadow-sm animate-in slide-in-from-left-3 duration-300 select-none">
                          <p className="text-[7px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">User Comment Trigger</p>
                          <p className="text-[8.5px] font-semibold">"coupon"</p>
                        </div>

                        <div className="self-center bg-blue-500/10 border border-blue-500/25 px-2 py-0.8 rounded-full text-blue-400 text-[7px] font-black uppercase flex items-center gap-1 animate-pulse">
                          <RefreshCw className="w-2 h-2 animate-spin" /> Processing Rules...
                        </div>

                        {/* Bot Reply bubble with link */}
                        <div className="self-end max-w-[85%] bg-[#1a73e8] border border-blue-600/25 text-white rounded-2xl rounded-tr-none p-2.5 text-left shadow-md space-y-1 animate-in slide-in-from-right-3 duration-300">
                          <p className="text-[7px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-blue-100" /> Automated Reply Sent
                          </p>
                          <p className="text-[8.5px] font-semibold leading-relaxed">
                            Here is your 50% discount coupon code: **DMSPARK50**! 🎟️
                          </p>
                          <div className="pt-1.5 border-t border-white/20">
                            <span className="text-[7px] font-black uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded flex items-center justify-between hover:bg-white/20">
                              Claim Coupon Code <ArrowUpRight className="w-2 h-2" />
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* STEP 4: Double Tap engagement heart reaction */}
                    {animationStep === 4 && (
                      <>
                        <div className="self-end max-w-[85%] bg-[#1a73e8] border border-blue-600/25 text-white rounded-2xl rounded-tr-none p-2.5 text-left shadow-md space-y-1 select-none relative">
                          <p className="text-[7px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-blue-100" /> Automated Reply Sent
                          </p>
                          <p className="text-[8.5px] font-semibold leading-relaxed">
                            Here is your 50% discount coupon code: **DMSPARK50**! 🎟️
                          </p>
                          <div className="absolute -bottom-1.5 -left-1.5 bg-slate-900 border border-red-500/40 w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                            <span className="text-[8px] text-red-500">❤️</span>
                          </div>
                        </div>
                        <div className="self-center bg-violet-500/10 border border-violet-500/25 px-2 py-1 rounded-full text-violet-400 text-[7px] font-black uppercase flex items-center gap-1.5 animate-pulse mt-1">
                          <TrendingUp className="w-2 h-2 text-violet-400" /> Engagement Captured!
                        </div>
                      </>
                    )}

                  </div>

                  {/* Phone Footer chat bar */}
                  <div className="bg-slate-900 border-t border-slate-800/80 p-2 flex items-center justify-between shrink-0 select-none">
                    <div className="h-5 flex-1 bg-slate-950 rounded-full border border-slate-800 px-2.5 flex items-center justify-start text-[6px] text-slate-500 font-bold uppercase">
                      Type a message...
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#1a73e8]/20 border border-[#1a73e8]/30 flex items-center justify-center ml-1.5 text-[#1a73e8]">
                      <Zap className="w-2.5 h-2.5" />
                    </div>
                  </div>

                </div>
              ) : (
                
                /* LAPTOP SIMULATOR (CSS Macbook Frame) */
                <div className="w-[330px] sm:w-[350px] aspect-[16/10] rounded-xl border-[4px] border-slate-700/90 dark:border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none animate-in zoom-in-95 duration-500">
                  
                  {/* Laptop Camera sensor */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 z-50" />
                  
                  {/* Laptop Screen Content Display */}
                  <div className="flex-1 bg-slate-950 flex flex-col text-[8.5px] text-slate-300 font-sans overflow-hidden p-2 relative">
                    
                    {/* Inner Application Dashboard Header */}
                    <div className="border-b border-slate-800 pb-1.5 mb-1.5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[7.5px] text-[#1a73e8] tracking-tight">DMSpark Workspace</span>
                        <span className="text-[5.5px] px-1 py-0.2 rounded bg-[#1a73e8]/10 text-[#1a73e8] font-bold border border-[#1a73e8]/20">v1.5.1</span>
                      </div>
                      <div className="flex items-center gap-0.8">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                        <div className="w-1 h-1 rounded-full bg-yellow-500" />
                        <div className="w-1 h-1 rounded-full bg-green-500" />
                      </div>
                    </div>

                    {/* DYNAMIC SCREENS FOR LAPTOP VIEW */}
                    
                    {/* STEP 0: Idle State / Dashboard overview metrics */}
                    {animationStep === 0 && (
                      <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="font-black text-white text-[8px] uppercase tracking-wide">System Dashboard</h4>
                          <span className="text-[6.5px] text-emerald-400 font-bold uppercase flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Connected
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex-1 items-center">
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-center">
                            <p className="text-[6px] text-slate-400 font-bold uppercase">Replies Sent</p>
                            <p className="text-sm font-extrabold text-white mt-0.5">2</p>
                          </div>
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-center">
                            <p className="text-[6px] text-slate-400 font-bold uppercase">Audience Reached</p>
                            <p className="text-sm font-extrabold text-white mt-0.5">1</p>
                          </div>
                        </div>
                        <div className="h-6 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-center text-[7px] text-slate-400 uppercase tracking-widest font-black animate-pulse">
                          Awaiting Keyword Event Triggers...
                        </div>
                      </div>
                    )}

                    {/* STEP 1: OAuth Connect Integrations page */}
                    {animationStep === 1 && (
                      <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="font-black text-white text-[8px] uppercase tracking-wide">Instagram Profile Integration</h4>
                        </div>
                        <div className="flex-1 border border-slate-800 rounded-lg bg-slate-900/60 p-2 flex flex-col justify-between relative">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">IG</div>
                            <div>
                              <p className="font-extrabold text-white text-[7.5px]">Instagram Connection Status</p>
                              <p className="text-[6px] text-slate-400 font-semibold mt-0.5">Authorized business page handles</p>
                            </div>
                          </div>
                          
                          {/* Animated cursor integration clicking connection button */}
                          <div className="flex items-center justify-center py-1">
                            <Button className="h-5 text-[6.5px] px-3.5 font-black uppercase tracking-wider rounded bg-blue-500 hover:bg-blue-600 text-white shadow relative">
                              Connecting Account...
                              <MousePointerClick className="w-2.5 h-2.5 text-white absolute -bottom-1 -right-1.5 animate-bounce shadow-md" />
                            </Button>
                          </div>

                          <div className="border-t border-slate-800/50 pt-1.5 flex items-center justify-between">
                            <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide">Meta Secure Proxy</span>
                            <span className="text-[6px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold animate-pulse uppercase">OAuth Staging</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Setting trigger keywords block workspace */}
                    {animationStep === 2 && (
                      <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="font-black text-white text-[8px] uppercase tracking-wide">Rule Node Flow Builder</h4>
                        </div>
                        
                        {/* Simulated Automation nodes flow graph */}
                        <div className="flex-1 border border-slate-800 rounded-lg bg-slate-900 p-2.5 flex items-center justify-between relative">
                          <div className="p-1.5 bg-slate-950 border border-amber-500/30 rounded-md text-center w-20 z-10 relative">
                            <span className="text-[5.5px] text-amber-500 font-black uppercase tracking-wider block">Trigger Comment</span>
                            <span className="text-[7.5px] font-extrabold text-white block mt-0.5">"coupon"</span>
                          </div>

                          {/* Animated flowing vector line */}
                          <div className="flex-1 h-[2px] bg-slate-800 relative mx-1">
                            <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-md animate-ping" style={{ left: '50%' }} />
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-blue-400 shadow-md" style={{ left: '50%' }} />
                          </div>

                          <div className="p-1.5 bg-slate-950 border border-blue-500/30 rounded-md text-center w-20 z-10">
                            <span className="text-[5.5px] text-blue-400 font-black uppercase tracking-wider block">Action DM</span>
                            <span className="text-[7.5px] font-extrabold text-white block mt-0.5">Send Response</span>
                          </div>
                        </div>
                        <p className="text-[6.5px] text-center font-bold text-amber-400 uppercase tracking-widest animate-pulse">Keyword Match Detected!</p>
                      </div>
                    )}

                    {/* STEP 3: Automated webhook logging console screen */}
                    {animationStep === 3 && (
                      <div className="flex-1 flex flex-col justify-between space-y-1.5 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="font-black text-white text-[8px] uppercase tracking-wide">Meta Graph Webhook Live Logs</h4>
                        </div>
                        
                        {/* Simulated terminal logging scrolling */}
                        <div className="flex-1 bg-slate-950 border border-slate-850 rounded-lg p-2 font-mono text-[6.5px] text-emerald-400/90 leading-normal space-y-1">
                          <p className="text-slate-500 select-none">[2026-06-02T16:21:40] INIT Webhook Meta Stream</p>
                          <p className="text-blue-400">[Webhook] Received IG comment: "coupon" from @insta_shopper</p>
                          <p className="text-amber-400">[Engine] Match index: keyword matches "coupon". Matching Rule #104</p>
                          <p className="text-white flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            [Graph API] POST /me/messages {"->"} HTTP 200 OK (Msg sent successfully)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Deep Analytics page with counter increase */}
                    {animationStep === 4 && (
                      <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="font-black text-white text-[8px] uppercase tracking-wide">Deep Engagement Analytics</h4>
                          <span className="text-[6px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase animate-pulse">Updated</span>
                        </div>
                        
                        {/* Dynamic counter cards */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-md relative overflow-hidden">
                            <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider block">Replies Sent</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xs font-black text-white">3</span>
                              <span className="text-[6px] font-bold text-emerald-400 select-none animate-pulse">▲ +1</span>
                            </div>
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          
                          <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-md">
                            <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider block">Conversion Rate</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xs font-black text-white">33%</span>
                              <span className="text-[6px] font-bold text-emerald-400 select-none animate-pulse">▲ +33%</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Simulated chart bars */}
                        <div className="h-10 bg-slate-900/60 border border-slate-800/80 rounded-md flex items-end justify-between px-4 py-1.5 relative">
                          <div className="w-4 bg-slate-800 rounded-t h-3" />
                          <div className="w-4 bg-slate-800 rounded-t h-4" />
                          <div className="w-4 bg-[#1a73e8] rounded-t h-8 shadow-lg shadow-blue-500/20 animate-in slide-in-from-bottom duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Laptop keyboard lip bottom */}
                  <div className="h-4 bg-slate-800 border-t border-slate-700 flex items-center justify-center relative shrink-0">
                    <div className="w-14 h-1 rounded-t-sm bg-slate-900 absolute top-0" />
                  </div>

                </div>
              )}
            </div>

            {/* Stepper dynamic visual state message text banner */}
            <div className="pt-2.5 border-t border-border/50 text-center shrink-0">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest block opacity-85 leading-normal">
                {animationStep === 0 && "Overview: Interactive automation pipeline active"}
                {animationStep === 1 && "Step 01: Connect via Meta OAuth authorization"}
                {animationStep === 2 && "Step 02: Specify comment triggers keyword"}
                {animationStep === 3 && "Step 03: Construct automated DM templates"}
                {animationStep === 4 && "Step 04: Watch real-time engagement analytics update"}
              </span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
