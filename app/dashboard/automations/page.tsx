"use client"

import { useState, useCallback, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { AutomationList } from "@/components/dashboard/AutomationList"
import { CreateRuleForm } from "@/components/dashboard/CreateRuleForm"
import { MessageCircle, Send, Sparkles, Zap, Plus, Loader2, X, RefreshCw, Eye, Flame, Inbox, Heart, MessageSquare } from "lucide-react"
import { IceBreakersManager } from "@/components/dashboard/IceBreakersManager"
import type { Automation } from "@/lib/types"

export default function AutomationsPage() {
    const { userId, isLoading: isSessionLoading } = useInstagramSession()
    const [automations, setAutomations] = useState<Automation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'comment' | 'dm' | 'story'>('comment')
    const [showCreateForm, setShowCreateForm] = useState(false)

    // Simulation states
    const [previewAutomation, setPreviewAutomation] = useState<Automation | null>(null)
    const [previewStep, setPreviewStep] = useState<"trigger" | "delay" | "reply" | "done">("trigger")
    const [isSimulating, setIsSimulating] = useState(false)

    const fetchAutomations = useCallback(async () => {
        if (!userId) return
        try {
            const res = await fetch(`/api/automations?userId=${userId}`)
            const data = await res.json()
            if (res.ok) setAutomations(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (userId) fetchAutomations()
    }, [userId, fetchAutomations])

    const handleDeleteRule = async (id: string) => {
        await fetch(`/api/automations?id=${id}&userId=${userId}`, { method: "DELETE" })
        fetchAutomations()
    }

    // Trigger simulation sequence
    const runSimulation = useCallback((rule: Automation) => {
        setPreviewStep("trigger")
        setIsSimulating(true)
        
        const delaySeconds = rule.response_content?.delay_seconds || 0
        
        setTimeout(() => {
            if (delaySeconds > 0) {
                setPreviewStep("delay")
                // Custom 2.5 seconds typing bubble in simulation mode for immediate user feedback
                setTimeout(() => {
                    setPreviewStep("reply")
                    setTimeout(() => {
                        setIsSimulating(false)
                        setPreviewStep("done")
                    }, 1200)
                }, 2200)
            } else {
                setPreviewStep("reply")
                setTimeout(() => {
                    setIsSimulating(false)
                    setPreviewStep("done")
                }, 1200)
            }
        }, 1200)
    }, [])

    useEffect(() => {
        if (previewAutomation) {
            runSimulation(previewAutomation)
        }
    }, [previewAutomation, runSimulation])

    if (isSessionLoading) return <div className="h-screen flex items-center justify-center bg-background"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
    if (!userId) return <div className="h-screen flex items-center justify-center bg-background text-muted-foreground">Please log in</div>

    const filteredAutomations = automations.filter(a => a.trigger_source === activeTab)
    const counts = {
        comment: automations.filter(a => a.trigger_source === 'comment').length,
        dm: automations.filter(a => a.trigger_source === 'dm').length,
        story: automations.filter(a => a.trigger_source === 'story').length,
    }

    const tabs = [
        { key: 'comment' as const, icon: <MessageCircle className="w-4 h-4" />, label: 'Comments', count: counts.comment },
        { key: 'dm' as const, icon: <Send className="w-4 h-4" />, label: 'DMs', count: counts.dm },
        { key: 'story' as const, icon: <Sparkles className="w-4 h-4" />, label: 'Stories', count: counts.story },
    ]

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 text-foreground transition-colors duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Automations
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {automations.length} active rule{automations.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                                showCreateForm 
                                    ? 'bg-secondary text-foreground border border-border' 
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/15'
                            }`}
                        >
                            <Plus className={`w-4 h-4 transition-transform duration-200 ${showCreateForm ? 'rotate-45' : ''}`} />
                            {showCreateForm ? 'Close' : 'New Rule'}
                        </button>
                    </div>
                </div>

                {/* Pill Tabs */}
                <div className="flex gap-1 bg-secondary p-1 rounded-xl border border-border transition-colors duration-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === tab.key
                                    ? 'bg-background text-foreground shadow-sm border border-border/40'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-all ${
                                    activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground border border-border'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Create Form (Collapsible) */}
                {showCreateForm && (
                    <div className="rounded-2xl border border-border bg-card/40 p-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                        <CreateRuleForm
                            userId={userId}
                            triggerSource={activeTab}
                            onSuccess={() => {
                                fetchAutomations()
                                setShowCreateForm(false)
                            }}
                        />
                    </div>
                )}

                {/* Ice Breakers (DM only) */}
                {activeTab === 'dm' && (
                    <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
                        <IceBreakersManager />
                    </div>
                )}

                {/* Automation List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    <AutomationList
                        automations={filteredAutomations}
                        onDelete={handleDeleteRule}
                        userId={userId}
                        onPreview={(rule) => setPreviewAutomation(rule)}
                    />
                )}
            </div>

            {/* Premium Smartphone Automation Simulation Modal */}
            {previewAutomation && (
                <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
                    {/* Backdrop closer */}
                    <div className="absolute inset-0" onClick={() => setPreviewAutomation(null)} />

                    <div className="relative bg-card/95 border border-border rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 w-full max-w-[280px] animate-in zoom-in-95 duration-200 z-10 text-center">
                        <button
                            onClick={() => setPreviewAutomation(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors h-7 w-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer border border-border/50"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-1">
                            <h3 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-1.5 justify-center">
                                <Eye className="w-4 h-4 text-green-500" /> Automation Live Preview
                            </h3>
                            <p className="text-[10.5px] text-muted-foreground truncate w-full max-w-[220px] font-medium leading-none">
                                Rule: {previewAutomation.name}
                            </p>
                        </div>

                        {/* Interactive Smartphone Mockup */}
                        <div className="relative bg-white border-[6px] border-slate-900 rounded-[34px] shadow-2xl w-[200px] h-[360px] flex flex-col justify-between overflow-hidden shrink-0 select-none bg-slate-50">
                            {/* Smartphone Island/Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-900 rounded-b-lg z-20" />

                            {/* Instagram Header Mock */}
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 pt-4 px-3 shrink-0 bg-white/95 backdrop-blur-sm z-10">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#fbbc04] via-[#ea4335] to-[#1a73e8] p-0.5">
                                    <div className="w-full h-full rounded-full bg-white p-0.5">
                                        <img src="/logo.png" alt="Profile" className="w-full h-full object-contain rounded-full" />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-800 leading-none">dmspark_bot</p>
                                    <p className="text-[6.5px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">Instagram Direct</p>
                                </div>
                            </div>

                            {/* Scrolling Chat Canvas Content */}
                            <div className="relative flex-1 bg-slate-50/50 p-2.5 flex flex-col gap-2.5 overflow-hidden">
                                
                                {/* Step 1: User comment/DM trigger */}
                                {(previewStep === "trigger" || previewStep === "delay" || previewStep === "reply" || previewStep === "done") && (
                                    <div className="flex items-start gap-1.5 animate-in slide-in-from-left duration-300">
                                        <div className="w-5.5 h-5.5 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-500 shrink-0 select-none uppercase">U</div>
                                        <div className="bg-white rounded-xl rounded-tl-none p-1.5 max-w-[85%] border border-slate-200/50 shadow-sm text-left">
                                            <p className="text-[7px] font-black text-slate-800 leading-none">user_101</p>
                                            <p className="text-[8.5px] text-slate-600 mt-0.5 font-bold leading-normal">
                                                {previewAutomation.trigger_source === "comment" ? `Commented: "${previewAutomation.trigger_value}"` : `DM: "${previewAutomation.trigger_value}"`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Delay Wait typing indicators */}
                                {previewStep === "delay" && (
                                    <div className="flex items-start gap-1.5 justify-end">
                                        <div className="bg-slate-200/60 rounded-xl rounded-tr-none px-2 py-1.5 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0s' }} />
                                            <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                        <div className="w-5.5 h-5.5 rounded-full bg-blue-100 flex items-center justify-center p-0.5 border border-blue-200/30 shrink-0">
                                            <img src="/logo.png" alt="Profile" className="w-full h-full object-contain rounded-full" />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Bot DM auto-reply bubble */}
                                {(previewStep === "reply" || previewStep === "done") && (
                                    <div className="flex items-start gap-1.5 justify-end animate-in slide-in-from-right duration-300">
                                        <div className="flex flex-col gap-1 items-end max-w-[85%]">
                                            {previewAutomation.response_content?.card ? (
                                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-left w-full">
                                                    {previewAutomation.response_content.card.image_url && (
                                                        <img 
                                                            src={previewAutomation.response_content.card.image_url} 
                                                            alt="Preview Card" 
                                                            className="w-full h-20 object-cover border-b border-slate-100"
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <div className="p-2 space-y-1">
                                                        <p className="text-[8px] font-black text-slate-800 leading-tight">
                                                            {previewAutomation.response_content.card.title}
                                                        </p>
                                                        {previewAutomation.response_content.card.subtitle && (
                                                            <p className="text-[7px] text-slate-500 font-medium leading-tight">
                                                                {previewAutomation.response_content.card.subtitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {previewAutomation.response_content.card.buttons && previewAutomation.response_content.card.buttons.length > 0 && (
                                                        <div className="border-t border-slate-100 flex flex-col text-center divide-y divide-slate-100">
                                                            {previewAutomation.response_content.card.buttons.map((btn: any, btnIdx: number) => (
                                                                <div 
                                                                    key={btnIdx} 
                                                                    className="py-1 text-[7px] font-bold text-blue-500 bg-white hover:bg-slate-50 cursor-pointer select-none truncate px-1"
                                                                >
                                                                    {btn.title || "Button"}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-[#1a73e8] text-white rounded-xl rounded-tr-none p-1.5 shadow-md shadow-blue-500/10 text-left w-fit">
                                                    <div className="flex items-center gap-1 shrink-0 select-none">
                                                        <img src="/logo.png" alt="DMSpark" className="w-2.5 h-2.5 object-contain brightness-0 invert" />
                                                        <span className="text-[6.5px] font-black uppercase tracking-wider opacity-85">DMSpark</span>
                                                    </div>
                                                    <p className="text-[8.5px] mt-0.5 leading-snug font-semibold text-white break-words">
                                                        {previewAutomation.response_content?.message || "Sent!"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-5.5 h-5.5 rounded-full bg-blue-100 flex items-center justify-center p-0.5 border border-blue-200/30 shrink-0">
                                            <img src="/logo.png" alt="Profile" className="w-full h-full object-contain rounded-full" />
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Interaction Footer Bar */}
                            <div className="border-t border-slate-100 p-2 flex items-center justify-between text-[7px] text-slate-500 font-bold shrink-0 bg-white select-none">
                                <span className="text-slate-400">Simulation View</span>
                                {previewStep === "delay" && (
                                    <span className="text-amber-500 font-black animate-pulse uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                                        ⏳ Waiting {previewAutomation.response_content?.delay_seconds || 0}s...
                                    </span>
                                )}
                                {previewStep === "reply" && (
                                    <span className="text-green-500 font-black uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                                        <span className="w-1 h-1 rounded-full bg-green-500 animate-ping" /> Sent!
                                    </span>
                                )}
                                {previewStep === "done" && (
                                    <span className="text-blue-500 font-black uppercase tracking-wider shrink-0">
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Replay Option */}
                        <button
                            onClick={() => runSimulation(previewAutomation)}
                            disabled={isSimulating}
                            className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-border hover:bg-secondary cursor-pointer mt-1 bg-transparent text-foreground transition-all"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} /> Replay Simulation
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
