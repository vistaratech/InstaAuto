"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Shield, Clock, ArrowRight, Instagram, Flame, Inbox, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const [viewMode, setViewMode] = useState<'mobile' | 'laptop'>('mobile')

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`

  return (
    <div className="min-h-screen md:h-screen bg-background text-foreground md:overflow-hidden flex flex-col relative select-none">
      {/* Dynamic Keyframe Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-right {
          opacity: 0;
          animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-comment {
          animation: commentPop 10s infinite ease-in-out;
        }
        .anim-reply {
          animation: replyPop 10s infinite ease-in-out;
        }
        .dot-1 { animation: dotPulse 1.2s infinite 0s; }
        .dot-2 { animation: dotPulse 1.2s infinite 0.2s; }
        .dot-3 { animation: dotPulse 1.2s infinite 0.4s; }

        .laptop-mockup-scaler {
          transform: scale(0.55);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        @media (min-width: 380px) {
          .laptop-mockup-scaler {
            transform: scale(0.68);
          }
        }
        @media (min-width: 640px) {
          .laptop-mockup-scaler {
            transform: scale(0.8);
          }
        }
        @media (min-width: 768px) {
          .laptop-mockup-scaler {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-[#1a73e8]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] right-1/4 w-[500px] h-[500px] bg-[#34a853]/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Navigation Bar - Smaller Height */}
      <nav className="relative z-50 h-16 shrink-0 flex items-center justify-between px-6 md:px-12 border-b border-border bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DMSpark" className="w-10 h-10 object-contain" />
          <span className="text-xl font-black tracking-tight text-[#1a73e8]">DMSpark</span>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-full px-5 h-9 text-xs font-bold uppercase tracking-widest hover:bg-[#1a73e8]/5 hover:text-[#1a73e8] hover:border-[#1a73e8]/30 transition-all bg-transparent border-border flex items-center gap-1.5 cursor-pointer"
        >
          <a href={instagramAuthUrl}>
            <Instagram className="w-3.5 h-3.5" /> Login
          </a>
        </Button>
      </nav>

      {/* Split Hero Layout */}
      <main className="relative z-10 flex-1 grid md:grid-cols-12 gap-8 items-center px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full pt-6 pb-12 md:py-0 md:overflow-hidden">
        
        {/* Left Side: Copy and Actions */}
        <div className="md:col-span-6 space-y-5 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          {/* Badge constrained to text width using w-fit */}
          <div 
            className="w-fit inline-flex items-center gap-2 bg-slate-100 border border-slate-200/60 rounded-full px-4 py-1.5 text-[11px] text-slate-600 font-bold uppercase tracking-wider animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
            Instagram Automation Tool
          </div>

          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Auto Reply.
            <br />
            <span className="text-[#1a73e8] bg-gradient-to-r from-[#1a73e8] to-[#1a73e8]/80 bg-clip-text">Auto Grow.</span>
          </h1>

          <p 
            className="text-sm sm:text-base md:text-lg text-slate-500 max-w-lg leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            Connect DMSpark to your Instagram. Auto-reply to comments & DMs using simple keyword triggers. Grow your followers 24/7 without lifting a finger.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in-up w-full justify-center md:justify-start"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              asChild
              className="bg-[#1a73e8] text-white h-13 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:scale-[1.03] transition-all duration-300 shadow-xl shadow-[#1a73e8]/20 hover:bg-[#1557b0] flex items-center justify-center gap-2 group w-full sm:w-auto cursor-pointer"
            >
              <a href={instagramAuthUrl}>
                Connect Instagram <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right Side: Mockups & Switcher */}
        <div className="md:col-span-6 flex flex-col gap-6 justify-center items-center w-full">
          
          {/* Switcher Toggle (Mobile vs Laptop View) */}
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/60 shrink-0 select-none w-fit animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'mobile' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mobile View
            </button>
            <button
              onClick={() => setViewMode('laptop')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'laptop' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Laptop View
            </button>
          </div>

          {/* Conditional Rendering of Mockups */}
          {viewMode === 'mobile' ? (
            /* Smartphone Frame Mockup */
            <div 
              className="relative bg-white border-[6px] border-slate-900 rounded-[34px] shadow-2xl animate-slide-in-right w-[230px] h-[340px] flex flex-col justify-between overflow-hidden select-none shrink-0"
              style={{ animationDelay: "200ms" }}
            >
              {/* Phone Notch/Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-900 rounded-b-lg z-20" />

              {/* Instagram Mock Header */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 pt-4 px-3 shrink-0 bg-white/90 backdrop-blur-sm z-10">
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

              {/* Scrolling Chat Content Area */}
              <div className="relative flex-1 bg-slate-50/50 p-3 overflow-hidden">
                
                {/* Comment Bubble (Looping Animation) */}
                <div className="anim-comment absolute left-2.5 right-2.5 top-3 flex items-start gap-1.5">
                  <div className="w-5.5 h-5.5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">U</div>
                  <div className="bg-white rounded-xl rounded-tl-none p-2 max-w-[80%] border border-slate-200/50 shadow-sm">
                    <p className="text-[8px] font-black text-slate-800 leading-none">user_101</p>
                    <p className="text-[9px] text-slate-600 mt-0.5 font-semibold flex items-center gap-0.5">
                      price? <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    </p>
                  </div>
                </div>

                {/* DM Reply Bubble (Looping Animation) */}
                <div className="anim-reply absolute left-2.5 right-2.5 top-3 flex items-start gap-1.5 justify-end">
                  <div className="bg-[#1a73e8] text-white rounded-xl rounded-tr-none p-2 max-w-[80%] shadow-lg shadow-blue-500/10">
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

              </div>

              {/* Interaction footer bar */}
              <div className="border-t border-slate-100 p-2.5 flex items-center justify-between text-[8px] text-slate-500 font-bold shrink-0 bg-white">
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
            /* Laptop Frame Mockup (Mini DMSpark Web Dashboard) */
            <div className="w-full flex items-center justify-center h-[180px] min-[380px]:h-[220px] sm:h-[250px] md:h-[280px] shrink-0">
              <div className="laptop-mockup-scaler shrink-0">
                <div 
                  className="flex flex-col items-center animate-slide-in-right shrink-0 select-none w-full"
                  style={{ animationDelay: "200ms" }}
                >
                  {/* Laptop Screen */}
                  <div className="relative w-[420px] h-[270px] bg-white border-[8px] border-slate-800 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Browser Top Bar */}
                    <div className="h-6 bg-slate-100 border-b border-slate-200/60 px-3 flex items-center gap-2 shrink-0">
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
                      <div className="w-[70px] border-r border-slate-200 bg-white p-2 space-y-1.5 shrink-0 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
                          <span className="font-black text-[8px] text-[#1a73e8] leading-none">DMSpark</span>
                        </div>
                        <div className="h-4 w-full bg-blue-50 text-[#1a73e8] font-bold px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0">📊 Dash</div>
                        <div className="h-4 w-full text-slate-400 px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0">⚡ Rules</div>
                        <div className="h-4 w-full text-slate-400 px-1.5 rounded flex items-center gap-1 text-[7px] shrink-0">📥 Inbox</div>
                      </div>

                      {/* Main Panel Content */}
                      <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden">
                        <div>
                          <p className="font-black text-slate-800 text-[10px] leading-tight">Welcome back, user!</p>
                          <p className="text-[7px] text-slate-400">Here's your automation stats today.</p>
                        </div>

                        {/* Stats blocks (Colored accents) */}
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

                        {/* Live Activity Feed (Looping Animation) */}
                        <div className="bg-white p-1.5 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-[50px] relative overflow-hidden">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-0.5 mb-1 shrink-0 select-none">
                            <span className="font-black text-[6px] text-slate-500 uppercase tracking-wider flex items-center gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-[#ea4335] animate-ping" /> Live Activity Feed
                            </span>
                            <span className="text-[5px] text-slate-400">Real-time</span>
                          </div>
                          
                          <div className="flex-1 relative">
                            {/* Log Item 1 */}
                            <div className="anim-log-1 absolute left-0 right-0 top-0 flex items-center justify-between text-[6.5px] leading-none">
                              <span className="text-slate-600 font-bold">💬 @user_101: "price?"</span>
                              <span className="text-[#34a853] font-black flex items-center gap-0.5">➡️ Sent DM <Inbox className="w-2.5 h-2.5" /></span>
                            </div>
                            
                            {/* Log Item 2 */}
                            <div className="anim-log-2 absolute left-0 right-0 top-0 flex items-center justify-between text-[6.5px] leading-none">
                              <span className="text-slate-600 font-bold">💬 @maria_2: "link"</span>
                              <span className="text-[#34a853] font-black flex items-center gap-0.5">➡️ Sent DM <Inbox className="w-2.5 h-2.5" /></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Laptop Keyboard Base */}
                  <div className="w-[470px] h-[10px] bg-slate-300 rounded-b-md shadow-lg relative border-b-[3px] border-slate-400">
                    {/* Macbook opening notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-400 rounded-b" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[450px] shrink-0">
            <MiniCard 
              icon={<MessageCircle className="w-4 h-4 text-[#1a73e8]" />}
              title="Auto Reply"
              bg="bg-[#1a73e8]/10"
            />
            <MiniCard 
              icon={<Shield className="w-4 h-4 text-[#34a853]" />}
              title="Follow Gate"
              bg="bg-[#34a853]/10"
            />
            <MiniCard 
              icon={<Clock className="w-4 h-4 text-[#fbbc04]" />}
              title="Always On"
              bg="bg-[#fbbc04]/10"
            />
          </div>

        </div>

      </main>

      {/* Sleek, Premium Compliance Footer */}
      <footer className="w-full py-3 border-t border-slate-100 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between px-6 text-[10px] text-muted-foreground z-20 gap-3 shrink-0">
        <p>© {new Date().getFullYear()} DMSpark. All rights reserved. Not affiliated with Meta Platforms Inc. or Instagram.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground font-semibold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground font-semibold transition-colors">
            Terms of Service
          </Link>
          <Link href="/delete-data" className="hover:text-foreground font-semibold transition-colors">
            Data Deletion Instructions
          </Link>
        </div>
      </footer>
    </div>
  )
}

function MiniCard({ icon, title, bg }: { icon: React.ReactNode; title: string; bg: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/50 bg-white/70 shadow-sm backdrop-blur-sm justify-center text-center sm:text-left w-full">
      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-black text-slate-800 tracking-tight leading-none">{title}</span>
    </div>
  )
}
