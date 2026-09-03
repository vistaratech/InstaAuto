"use client"

import { useState, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { ConversationList } from "@/components/inbox/ConversationList"
import { ChatWindow } from "@/components/inbox/ChatWindow"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InboxPage() {
    const { userId, username, isLoading } = useInstagramSession()
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [selectedRecipientName, setSelectedRecipientName] = useState<string | null>(null)
    const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    const handleSelect = (id: string, name: string, recipientId: string) => {
        setSelectedConversationId(id)
        setSelectedRecipientName(name)
        setSelectedRecipientId(recipientId)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="relative flex items-center justify-center">
                    {/* Outer pulsing ring */}
                    <div
                        className="absolute rounded-full border-2 border-primary/30"
                        style={{
                            width: 56, height: 56,
                            animation: "inbox-pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
                        }}
                    />
                    {/* Inner spinning icon */}
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading conversations…</p>
                <style jsx>{`
                    @keyframes inbox-pulse-ring {
                        0% { transform: scale(0.8); opacity: 0.7; }
                        50% { transform: scale(1.15); opacity: 0.2; }
                        100% { transform: scale(0.8); opacity: 0.7; }
                    }
                `}</style>
            </div>
        )
    }

    if (!userId) {
        return null
    }

    return (
        <div
            className="relative"
            style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.55s cubic-bezier(0.23,1,0.32,1), transform 0.55s cubic-bezier(0.23,1,0.32,1)",
            }}
        >
            {/* Subtle ambient glow */}
            <div
                className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl"
                style={{
                    background: "radial-gradient(ellipse 60% 45% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
                    filter: "blur(28px)",
                }}
            />

            <div className="h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border border-border bg-card/30 backdrop-blur-xl shadow-xl flex relative">
                {/* Left Sidebar: Conversation List */}
                <div className={cn(
                    "w-full md:w-[350px] flex-shrink-0 border-r border-border bg-card/20 absolute md:static inset-0 z-10 transition-transform duration-300 md:translate-x-0 h-full",
                    selectedConversationId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
                )}>
                    <ConversationList
                        userId={userId}
                        currentUsername={username}
                        selectedId={selectedConversationId}
                        onSelect={handleSelect}
                    />
                </div>

                {/* Right Main: Chat Window */}
                <div className={cn(
                    "flex-1 w-full absolute md:static inset-0 z-20 bg-background md:bg-transparent transition-transform duration-300 md:translate-x-0 h-full",
                    selectedConversationId ? "translate-x-0" : "translate-x-full md:translate-x-0"
                )}>
                    <ChatWindow
                        conversationId={selectedConversationId}
                        recipientName={selectedRecipientName}
                        recipientId={selectedRecipientId || undefined}
                        userId={userId}
                        currentUsername={username}
                        onBack={() => setSelectedConversationId(null)}
                    />
                </div>
            </div>
        </div>
    )
}

