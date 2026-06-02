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
  Info,
  Flame,
  Inbox,
  Heart
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
      
      {/* Global CSS keyframes matching landing-page.tsx exactly */}
      <style jsx global>{`
        @keyframes commentPop {
          0%, 100% { opacity: 0; transform: translateY(10px) scale(0.95); }
          5%, 45% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        @keyframes replyPop {
          0%, 45%, 100% { opacity: 0; transform: translateY(10px) scale(0.95); }
          50%, 95% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .anim-comment {
          animation: commentPop 8s infinite ease-in-out;
        }
        .anim-reply {
          animation: replyPop 8s infinite ease-in-out;
        }
        .dot-1 { animation: dotPulse 1.2s infinite 0s; }
        .dot-2 { animation: dotPulse 1.2s infinite 0.2s; }
        .dot-3 { animation: dotPulse 1.2s infinite 0.4s; }

        .laptop-mockup-scaler-help {
          transform: scale(0.68);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        @media (min-width: 480px) {
          .laptop-mockup-scaler-help {
            transform: scale(0.78);
          }
        }
        @media (min-width: 1200px) {
          .laptop-mockup-scaler-help {
            transform: scale(0.92);
          }
        }
        @media (min-width: 1400px) {
          .laptop-mockup-scaler-help {
            transform: scale(1);
          }
        }
      `}</style>

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
                /* EXTACT iPhone Mockup from landing-page.tsx */
                <div 
                  className="relative bg-white border-[6px] border-slate-900 rounded-[34px] shadow-2xl w-[200px] h-[360px] flex flex-col justify-between overflow-hidden select-none shrink-0 animate-in zoom-in-95 duration-500"
                >
                  {/* Phone Notch/Island */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-900 rounded-b-lg z-20" />

                  {/* Instagram Mock Header */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 pt-4 px-3 shrink-0 bg-white/90 backdrop-blur-sm z-10 select-none">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#fbbc04] via-[#ea4335] to-[#1a73e8] p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        <img src="/logo.png" alt="Profile" className="w-full h-full object-contain rounded-full" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 leading-none">dmspark_bot</p>
                      <p className="text-[7px] text-slate-400 mt-0.5">Instagram Reel</p>
                    </div>
                  </div>

                  {/* Chat Content Area depending on Step state */}
                  <div className="relative flex-1 bg-slate-50/50 p-3 overflow-hidden">
                    
                    {/* STEP 0: Loop animation exactly like landing page */}
                    {animationStep === 0 && (
                      <>
                        {/* Looping Comment Bubble */}
                        <div className="anim-comment absolute left-2.5 right-2.5 top-3 flex items-start gap-1.5">
                          <div className="w-5.5 h-5.5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">U</div>
                          <div className="bg-white rounded-xl rounded-tl-none p-2 max-w-[80%] border border-slate-200/50 shadow-sm text-left">
                            <p className="text-[8px] font-black text-slate-800 leading-none">user_101</p>
                            <p className="text-[9px] text-slate-600 mt-0.5 font-semibold flex items-center gap-0.5">
                              price? <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                            </p>
                          </div>
                        </div>

                        {/* Looping DM Reply Bubble */}
                        <div className="anim-reply absolute left-2.5 right-2.5 top-3 flex items-start gap-1.5 justify-end">
                          <div className="bg-[#1a73e8] text-white rounded-xl rounded-tr-none p-2 max-w-[80%] shadow-lg shadow-blue-500/10 text-left">
                            <div className="flex items-center gap-1">
                              <img src="/logo.png" alt="DMSpark" className="w-2.5 h-2.5 object-contain brightness-0 invert" />
                              <span className="text-[7px] font-black uppercase tracking-wider opacity-85">DMSpark</span>
                            </div>
                            <p className="text-[9px] mt-0.5 leading-snug font-medium flex items-center gap-0.5">
                              Sent! Check DMs <Inbox className="w-2.5 h-2.5 opacity-90" />
                            </p>
                          </div>
                          <div className="w-5.5 h-5.5 rounded-full bg-blue-100 flex items-center justify-center p-0.5 border border-blue-200/30 shrink-0">
                            <img src="/logo.png" alt="Profile" className="w-full h-full object-contain rounded-full" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* STEP 1: OAuth Connect authorization window */}
                    {animationStep === 1 && (
                      <div className="absolute inset-x-2.5 bottom-2.5 top-2 bg-white rounded-2xl border border-slate-200 p-2.5 text-center flex flex-col justify-between animate-in slide-in-from-bottom-5 duration-300 shadow-xl select-none">
                        <div className="space-y-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-500 border border-blue-100">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <h4 className="text-[9px] font-extrabold text-slate-800">Meta Integration</h4>
                          <p className="text-[7.5px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                            Connect your profile to allow DMSpark to auto-reply to your business comments and story mentions.
                          </p>
                        </div>
                        <Button className="h-6 w-full text-[8.5px] font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-1">
                          Connect Instagram <ArrowRight className="w-2.5 h-2.5" />
                        </Button>
                        <p className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider">Secured OAuth 2.0 via Meta Inc.</p>
                      </div>
                    )}

                    {/* STEP 2: Instgram Post comments matching trigger keyword */}
                    {animationStep === 2 && (
                      <div className="absolute inset-0 p-2.5 flex flex-col justify-between animate-in fade-in duration-300 select-none">
                        {/* Simulated Post Image layout */}
                        <div className="h-28 rounded-xl bg-slate-900 relative flex items-center justify-center overflow-hidden border border-slate-200">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />
                          <div className="text-center p-2">
                            <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">Giveaway</span>
                            <p className="text-[8px] font-black mt-1 text-slate-100">50% DISCOUNT COUPON</p>
                            <p className="text-[6px] text-slate-400 mt-0.5">Comment word "coupon" to auto get code</p>
                          </div>
                        </div>
                        {/* Interactive comment bubble matching keyword */}
                        <div className="bg-white border border-blue-500/30 rounded-xl p-2 flex items-start gap-1.5 shadow-lg ring-4 ring-blue-500/5 animate-in slide-in-from-bottom-3 duration-350 text-left">
                          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold border border-slate-300 text-slate-600">U</div>
                          <div className="flex-1">
                            <p className="text-[7.5px] font-extrabold text-blue-500">@insta_shopper</p>
                            <p className="text-[8px] font-semibold text-slate-700 mt-0.5 flex items-center gap-0.5">
                              coupon <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500 animate-pulse" />
                            </p>
                          </div>
                          <span className="text-[6px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold animate-pulse uppercase">Match</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Animated DM message template with dynamic click button */}
                    {animationStep === 3 && (
                      <div className="flex flex-col justify-end space-y-2 h-full animate-in fade-in duration-300 text-left select-none pb-1">
                        <div className="self-start max-w-[80%] bg-slate-100 border border-slate-200 rounded-xl rounded-tl-none p-2 text-left text-slate-800 shadow-sm animate-in slide-in-from-left-3 duration-300">
                          <p className="text-[7px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">User Comment Trigger</p>
                          <p className="text-[8.5px] font-semibold">coupon</p>
                        </div>

                        {/* Bot DM Reply Bubble */}
                        <div className="self-end max-w-[85%] bg-[#1a73e8] border border-blue-600/25 text-white rounded-xl rounded-tr-none p-2 shadow-md space-y-1 animate-in slide-in-from-right-3 duration-300">
                          <div className="flex items-center gap-1">
                            <img src="/logo.png" alt="DMSpark" className="w-2.5 h-2.5 object-contain brightness-0 invert" />
                            <span className="text-[7px] font-black uppercase tracking-wider opacity-85">DMSpark Reply</span>
                          </div>
                          <p className="text-[8.5px] font-semibold leading-relaxed">
                            Here is your 50% discount coupon code: **DMSPARK50**! 🎟️
                          </p>
                          <div className="pt-1.5 border-t border-white/20">
                            <span className="text-[7px] font-black uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded flex items-center justify-between hover:bg-white/20 cursor-pointer">
                              Claim Coupon Code <ArrowUpRight className="w-2 h-2" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Double Tap heart reaction bubble for conversions */}
                    {animationStep === 4 && (
                      <div className="flex flex-col justify-end space-y-2 h-full animate-in fade-in duration-300 text-left select-none pb-1">
                        <div className="self-end max-w-[85%] bg-[#1a73e8] border border-blue-600/25 text-white rounded-xl rounded-tr-none p-2 shadow-md space-y-1 relative">
                          <div className="flex items-center gap-1">
                            <img src="/logo.png" alt="DMSpark" className="w-2.5 h-2.5 object-contain brightness-0 invert" />
                            <span className="text-[7px] font-black uppercase tracking-wider opacity-85">DMSpark Reply</span>
                          </div>
                          <p className="text-[8.5px] font-semibold leading-relaxed">
                            Here is your 50% discount coupon code: **DMSPARK50**! 🎟️
                          </p>
                          
                          {/* Pulsing red heart bubble reaction */}
                          <div className="absolute -bottom-1.5 -left-1.5 bg-white border border-red-500/20 w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                            <span className="text-[8px] text-red-500">❤️</span>
                          </div>
                        </div>
                        <div className="self-center bg-violet-500/10 border border-violet-500/25 px-2 py-0.8 rounded-full text-violet-500 text-[6.5px] font-black uppercase flex items-center gap-1 animate-pulse mt-0.5">
                          <TrendingUp className="w-2 h-2 text-violet-500" /> Goal Achieved!
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Interaction footer bar */}
                  <div className="border-t border-slate-100 p-2.5 flex items-center justify-between text-[8px] text-slate-500 font-bold shrink-0 bg-white select-none">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-[#ea4335]">
                        <Heart className="w-2.5 h-2.5 fill-current" /> 1.2k
                      </span>
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <MessageSquare className="w-2.5 h-2.5 text-slate-400" /> Auto Active
                      </span>
                    </div>
                    <span className="text-[#34a853] flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-[#34a853] animate-pulse" /> Live
                    </span>
                  </div>

                </div>
              ) : (
                
                /* LAPTOP SIMULATOR (CSS Macbook Frame matching landing-page.tsx scaled correctly) */
                <div className="laptop-mockup-scaler-help shrink-0 flex items-center justify-center">
                  <div className="flex flex-col items-center select-none animate-in zoom-in-95 duration-500">
                    
                    {/* Laptop Screen matching landing-page.tsx exactly */}
                    <div className="relative w-[420px] h-[270px] bg-white border-[8px] border-slate-800 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
                      
                      {/* Browser Top Bar */}
                      <div className="h-6 bg-slate-100 border-b border-slate-200/60 px-3 flex items-center gap-2 shrink-0 select-none">
                        <div className="flex gap-1 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ea4335]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
                        </div>
                        <div className="bg-white rounded border border-slate-200/60 px-2 py-0.5 text-[8px] text-slate-400 w-36 mx-auto text-center font-bold">
                          dmspark.in/dashboard
                        </div>
                      </div>

                      {/* Dashboard layout inside Screen */}
                      <div className="flex-1 flex text-[9px] bg-slate-50">
                        
                        {/* Left Mini Sidebar */}
                        <div className="w-[70px] border-r border-slate-200 bg-white p-2 space-y-1.5 shrink-0 flex flex-col text-left">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
                            <span className="font-black text-[8px] text-[#1a73e8] leading-none">DMSpark</span>
                          </div>
                          <div className={`h-4 w-full px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0 font-bold transition-all ${
                            animationStep === 0 || animationStep === 4 ? "bg-blue-50 text-[#1a73e8]" : "text-slate-400"
                          }`}>📊 Dash</div>
                          <div className={`h-4 w-full px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0 font-bold transition-all ${
                            animationStep === 2 ? "bg-blue-50 text-[#1a73e8]" : "text-slate-400"
                          }`}>⚡ Rules</div>
                          <div className={`h-4 w-full px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0 font-bold transition-all ${
                            animationStep === 1 || animationStep === 3 ? "bg-blue-50 text-[#1a73e8]" : "text-slate-400"
                          }`}>📥 Inbox</div>
                        </div>

                        {/* Main Screen Panel depending on step state */}
                        <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden text-left">
                          
                          {/* STEP 0: Overview mini dashboard identical to landing page */}
                          {animationStep === 0 && (
                            <>
                              <div>
                                <p className="font-black text-slate-800 text-[10px] leading-tight">Welcome back, user!</p>
                                <p className="text-[7px] text-slate-400">Here's your automation stats today.</p>
                              </div>

                              {/* Stats blocks */}
                              <div className="grid grid-cols-3 gap-1.5">
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Automations</div>
                                  <div className="text-[10px] font-black text-blue-600 leading-tight">12</div>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Replies</div>
                                  <div className="text-[10px] font-black text-[#34a853] leading-tight">1.4K</div>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Triggers</div>
                                  <div className="text-[10px] font-black text-[#fbbc04] leading-tight">8</div>
                                </div>
                              </div>

                              {/* Live Activity Feed */}
                              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-[50px] relative overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5 mb-1 shrink-0 select-none">
                                  <span className="font-black text-[6px] text-slate-500 uppercase tracking-wider flex items-center gap-0.5">
                                    <span className="w-1 h-1 rounded-full bg-[#ea4335] animate-ping" /> Live Activity Feed
                                  </span>
                                  <span className="text-[5px] text-slate-400">Real-time</span>
                                </div>
                                
                                <div className="flex-1 relative font-semibold text-[6.5px]">
                                  <div className="flex items-center justify-between text-slate-600 leading-none">
                                    <span>💬 @user_101: "price?"</span>
                                    <span className="text-[#34a853] font-black flex items-center gap-0.5">➡️ Sent DM <Inbox className="w-2 h-2" /></span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* STEP 1: OAuth Connect Integrations panel */}
                          {animationStep === 1 && (
                            <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                              <div>
                                <p className="font-black text-slate-800 text-[10px] leading-tight">Instagram Integrations</p>
                                <p className="text-[7px] text-slate-400">Link your Instagram Business Account.</p>
                              </div>
                              <div className="flex-1 border border-slate-200 rounded-lg bg-white p-2 flex flex-col justify-between relative shadow-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 text-[8px] font-bold">IG</div>
                                  <div>
                                    <p className="font-extrabold text-slate-800 text-[7.5px]">Instagram Connection Status</p>
                                    <p className="text-[6.5px] text-slate-400 font-semibold mt-0.5">Authorized business page handle</p>
                                  </div>
                                </div>
                                
                                {/* Animated cursor clicking connection button */}
                                <div className="flex items-center justify-center py-1">
                                  <Button className="h-5 text-[6.5px] px-3 font-black uppercase tracking-wider rounded bg-blue-500 hover:bg-blue-600 text-white shadow relative">
                                    Connecting Account...
                                    <MousePointerClick className="w-2.5 h-2.5 text-blue-900 absolute -bottom-1 -right-1 animate-bounce" />
                                  </Button>
                                </div>

                                <div className="border-t border-slate-100 pt-1 flex items-center justify-between">
                                  <span className="text-[6px] font-bold text-slate-400 uppercase tracking-wide">Meta Secure Protocol</span>
                                  <span className="text-[6px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold animate-pulse uppercase">Staging</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* STEP 2: Rule Node Flow Builder display */}
                          {animationStep === 2 && (
                            <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                              <div>
                                <p className="font-black text-slate-800 text-[10px] leading-tight">Keyword Rule Builder</p>
                                <p className="text-[7px] text-slate-400">Map comments keyword triggers to actions.</p>
                              </div>
                              
                              {/* Simulated automation node flow chart */}
                              <div className="flex-1 border border-slate-200 rounded-lg bg-white p-2.5 flex items-center justify-between relative shadow-sm">
                                <div className="p-1 bg-slate-50 border border-amber-500/30 rounded text-center w-20 z-10">
                                  <span className="text-[5px] text-amber-500 font-black uppercase tracking-wider block">Trigger Comment</span>
                                  <span className="text-[7px] font-extrabold text-slate-700 block mt-0.5">"coupon"</span>
                                </div>

                                {/* Flow line with moving spark */}
                                <div className="flex-1 h-[2px] bg-slate-100 relative mx-1">
                                  <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-md animate-ping" style={{ left: '50%' }} />
                                  <div className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-blue-400 shadow-md" style={{ left: '50%' }} />
                                </div>

                                <div className="p-1 bg-slate-50 border border-blue-500/30 rounded text-center w-20 z-10">
                                  <span className="text-[5px] text-blue-400 font-black uppercase tracking-wider block">Action Send DM</span>
                                  <span className="text-[7px] font-extrabold text-slate-700 block mt-0.5">Discount Template</span>
                                </div>
                              </div>
                              <p className="text-[6.5px] text-center font-bold text-amber-500 uppercase tracking-widest animate-pulse">Match Event Active!</p>
                            </div>
                          )}

                          {/* STEP 3: Automated webhook logging console screen */}
                          {animationStep === 3 && (
                            <div className="flex-1 flex flex-col justify-between space-y-1.5 animate-in fade-in duration-300">
                              <div>
                                <p className="font-black text-slate-800 text-[10px] leading-tight">API Webhook Console Logs</p>
                                <p className="text-[7px] text-slate-400">Meta comment delivery callback stream.</p>
                              </div>
                              
                              {/* Simulated terminal logging scrolling */}
                              <div className="flex-1 bg-slate-950 border border-slate-900 rounded-lg p-2 font-mono text-[6.5px] text-emerald-400/90 leading-normal space-y-1 shadow-inner">
                                <p className="text-slate-500 select-none">[2026-06-02T16:21:40] INIT Webhook Meta Stream</p>
                                <p className="text-blue-400">[Webhook] Received comment: "coupon" from @insta_shopper</p>
                                <p className="text-amber-400">[Engine] Match index: keyword matches "coupon". Matching Rule #104</p>
                                <p className="text-white flex items-center gap-1 select-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  [Graph API] POST /me/messages {"->"} HTTP 200 OK (Msg sent successfully)
                                </p>
                              </div>
                            </div>
                          )}

                          {/* STEP 4: Deep Analytics page with counter increase */}
                          {animationStep === 4 && (
                            <div className="flex-1 flex flex-col justify-between space-y-2 animate-in fade-in duration-300">
                              <div>
                                <p className="font-black text-slate-800 text-[10px] leading-tight">Automation Insights</p>
                                <p className="text-[7px] text-slate-400">Real-time engagement performance.</p>
                              </div>
                              
                              {/* Dynamic stats cards */}
                              <div className="grid grid-cols-3 gap-1.5">
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center relative overflow-hidden">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Automations</div>
                                  <div className="text-[10px] font-black text-blue-600 leading-tight">12</div>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center relative overflow-hidden">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Replies</div>
                                  <div className="flex items-baseline gap-0.5 mt-0.5">
                                    <span className="text-[10px] font-black text-[#34a853] leading-tight">1,401</span>
                                    <span className="text-[5.5px] font-bold text-emerald-500 animate-pulse">▲ +1</span>
                                  </div>
                                  <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-200/50 shadow-sm flex flex-col justify-center">
                                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Conversion</div>
                                  <div className="text-[10px] font-black text-violet-600 leading-tight">33%</div>
                                </div>
                              </div>
                              
                              {/* Small simulated analytics chart bar */}
                              <div className="h-10 bg-white border border-slate-200/60 rounded-md flex items-end justify-between px-5 py-1 relative">
                                <div className="w-4 bg-slate-100 rounded-t h-4" />
                                <div className="w-4 bg-slate-100 rounded-t h-5" />
                                <div className="w-4 bg-[#1a73e8] rounded-t h-8 shadow-md shadow-blue-500/10 animate-in slide-in-from-bottom duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] select-none pointer-events-none">
                                  <TrendingUp className="w-5 h-5 text-slate-900" />
                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>

                    {/* Laptop Keyboard Base matching landing-page.tsx exactly */}
                    <div className="w-[470px] h-[10px] bg-slate-350 rounded-b-md shadow-lg relative border-b-[3px] border-slate-400 shrink-0">
                      {/* Macbook opening notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-400 rounded-b" />
                    </div>

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
