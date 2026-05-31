"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Send, Loader2, MoreVertical, Zap, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/db"

interface ChatWindowProps {
    conversationId: string | null
    recipientId?: string
    recipientName: string | null
    userId: string
    onBack?: () => void
}

export function ChatWindow({ conversationId, recipientId, recipientName, userId, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [inputText, setInputText] = useState("")
    const [sending, setSending] = useState(false)
    const [isAutomationOpen, setIsAutomationOpen] = useState(false)
    const [automations, setAutomations] = useState<any[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/inbox/messages?conversationId=${conversationId}&userId=${userId}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setMessages(data)
            }
        } catch (error) {
            console.error("Failed to load messages", error)
        } finally {
            setLoading(false)
        }
    }, [conversationId, userId])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    // Poll for new messages every 10 seconds
    useEffect(() => {
        if (!conversationId) return
        const interval = window.setInterval(() => {
            // Silent refresh without loading spinner
            fetch(`/api/inbox/messages?conversationId=${conversationId}&userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data)
                })
                .catch(() => {})
        }, 10000)
        return () => window.clearInterval(interval)
    }, [conversationId, userId])

    // Fetch automations for quick reply
    useEffect(() => {
        if (userId) {
            fetch(`/api/automations?userId=${userId}`).then(res => res.json()).then(data => {
                if (Array.isArray(data)) setAutomations(data)
            })
        }
    }, [userId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (text: string = inputText) => {
        if (!text.trim() || !recipientId || !userId) return

        setSending(true)
        try {
            const res = await fetch("/api/inbox/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    recipientId,
                    message: text
                })
            })

            if (res.ok) {
                setInputText("")
                // Optimistic update
                const newMsg: Message = {
                    id: `temp_${Date.now()}`,
                    conversation_id: conversationId!,
                    user_id: userId,
                    sender_id: "me",
                    sender_username: "Me",
                    content: text,
                    is_from_instagram: false,
                    created_at: new Date().toISOString()
                }
                setMessages(prev => [...prev, newMsg])
            }
        } catch (e) {
            console.error("Send failed", e)
        } finally {
            setSending(false)
            setIsAutomationOpen(false)
        }
    }

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center bg-card/10 h-full">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border">
                    <Send className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">Your Messages</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                        Select a conversation from the left to start chatting live with your audience.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent relative">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    )}
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shrink-0 font-bold text-xs uppercase">
                        {recipientName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm truncate">@{recipientName}</h3>
                        <span className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                            via Instagram
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><MoreVertical className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = !msg.is_from_instagram
                        return (
                            <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm break-words",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-secondary text-foreground rounded-bl-none border border-border"
                                )}>
                                    {msg.content}
                                    <div className={cn(
                                        "text-[10px] mt-1 opacity-70",
                                        isMe ? "text-primary-foreground/80 text-right" : "text-muted-foreground"
                                    )}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Automation Popup */}
            {isAutomationOpen && (
                <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-popover border border-border rounded-xl shadow-2xl backdrop-blur-xl p-2 z-50">
                    <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Quick Responses</div>
                    <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-hide">
                        {automations.map(auto => (
                            <button
                                key={auto.id}
                                onClick={() => handleSendMessage(auto.response_content?.message || auto.name)}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm text-foreground transition-colors flex items-center gap-2 cursor-pointer font-medium"
                            >
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span className="truncate">{auto.name}</span>
                            </button>
                        ))}
                        {automations.length === 0 && (
                            <div className="px-3 py-4 text-center text-muted-foreground text-xs">No automations found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-3 md:p-4 border-t border-border bg-card/30 shrink-0">
                <div className="flex items-center gap-2 bg-secondary/60 rounded-xl border border-border p-1.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsAutomationOpen(!isAutomationOpen)}
                        className={cn("h-9 w-9 hover:bg-secondary text-muted-foreground hover:text-yellow-500 transition-colors shrink-0 cursor-pointer", isAutomationOpen && "text-yellow-500 bg-yellow-500/10")}
                    >
                        <Zap className="w-5 h-5" />
                    </Button>
                    <input
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 min-w-0"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !sending) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        disabled={sending}
                    />
                    <Button
                        onClick={() => handleSendMessage()}
                        disabled={sending || !inputText.trim()}
                        size="icon"
                        className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}

