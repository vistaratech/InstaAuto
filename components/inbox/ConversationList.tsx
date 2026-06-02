"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, Loader2, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/db"

interface ConversationListProps {
    userId: string
    selectedId: string | null
    onSelect: (id: string, username: string, recipientId: string) => void
}

export function ConversationList({ userId, selectedId, onSelect }: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchConversations = useCallback(async () => {
        if (!userId) return
        try {
            const res = await fetch(`/api/inbox/conversations?userId=${userId}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setConversations(data)
            }
        } catch (error) {
            console.error("Failed to load conversations", error)
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchConversations()
    }, [fetchConversations])

    // Poll for new conversations every 15 seconds
    useEffect(() => {
        if (!userId) return
        const interval = window.setInterval(() => {
            fetchConversations()
        }, 15000)
        return () => window.clearInterval(interval)
    }, [userId, fetchConversations])

    // Filter conversations by search query
    const filtered = searchQuery.trim()
        ? conversations.filter(c =>
            c.recipient_username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : conversations

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">Inbox</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        className="w-full bg-secondary/80 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 hover-scrollbar">
                {filtered.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        {searchQuery ? "No matching conversations." : "No conversations yet."}
                    </div>
                ) : (
                    filtered.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id, conv.recipient_username, conv.recipient_id.toString())}
                            className={cn(
                                "p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors border border-transparent",
                                selectedId === conv.id
                                    ? "bg-primary/10 border-primary/20"
                                    : "hover:bg-secondary/40 hover:border-border"
                             )}
                        >
                            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                                <UserCircle className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={cn(
                                        "font-semibold text-sm truncate",
                                        selectedId === conv.id ? "text-primary" : "text-foreground"
                                    )}>
                                        {conv.recipient_username}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {new Date(conv.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    Tap to view conversation
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

