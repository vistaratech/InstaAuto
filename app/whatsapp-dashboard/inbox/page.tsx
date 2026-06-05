"use client"

import { useState } from "react"
import { Search, Send, UserCircle2, ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, CheckCheck } from "lucide-react"

interface ChatMessage {
  id: string
  text: string
  isSent: boolean
  time: string
}

export default function WhatsAppInboxPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: "Hello! Is the store open today?", isSent: false, time: "10:30 AM" },
    { id: "2", text: "Hi! Yes, we are open until 8 PM today. How can we help you?", isSent: true, time: "10:31 AM" },
    { id: "3", text: "Do you have the coupon code for today's discount?", isSent: false, time: "10:32 AM" },
    { id: "4", text: "Here is your 50% discount coupon code: DMSPARK50!", isSent: true, time: "10:32 AM" },
  ])
  const [inputText, setInputText] = useState("")

  const handleSend = () => {
    if (!inputText.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, newMsg])
    setInputText("")
  }

  return (
    <div className="h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border border-border bg-card/30 backdrop-blur-xl shadow-xl flex relative select-none animate-in fade-in duration-500">
      
      {/* Left Chat List Column */}
      <div className="w-[320px] shrink-0 border-r border-border bg-card/10 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="text-base font-extrabold text-foreground tracking-tight">WhatsApp Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60 font-semibold"
              placeholder="Search chats..."
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto hover-scrollbar p-2 space-y-1">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 font-bold">
              +91
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate text-emerald-500">+91 98765 43210</span>
                <span className="text-[9px] text-muted-foreground">10:32 AM</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate font-semibold mt-0.5">DMSPARK50!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Chat feed (WhatsApp Web themed layout) */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 relative">
        
        {/* Chat Header */}
        <div className="h-14 bg-white dark:bg-slate-900 border-b border-border px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
              +91
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-white">+91 98765 43210</p>
              <p className="text-[9px] text-emerald-500 font-bold mt-0.5">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Phone className="w-4 h-4 cursor-pointer hover:text-slate-600" />
            <Video className="w-4 h-4 cursor-pointer hover:text-slate-600" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        {/* WhatsApp Background Chat feed */}
        <div 
          className="flex-1 p-4 overflow-y-auto hover-scrollbar space-y-3 flex flex-col justify-end"
          style={{
            backgroundImage: "url('/whatsapp-bg.png')", // fallback to grid patterns or custom gradient
            backgroundColor: "rgb(230, 221, 212)"
          }}
        >
          {/* Subtle light pattern helper overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed shadow-sm relative z-10 flex flex-col ${
                msg.isSent
                  ? "self-end bg-[#d9fdd3] text-slate-800 rounded-tr-none"
                  : "self-start bg-white text-slate-800 rounded-tl-none border border-slate-200/50"
              }`}
            >
              <p className="pr-8">{msg.text}</p>
              <span className="text-[8px] text-slate-400 font-bold self-end mt-1 flex items-center gap-0.5">
                {msg.time}
                {msg.isSent && <CheckCheck className="w-3 h-3 text-sky-500" />}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="bg-[#f0f2f5] dark:bg-slate-900 px-4 py-3 flex items-center gap-3 shrink-0 border-t border-border">
          <Smile className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
          <Paperclip className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
          <input
            className="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none font-semibold shadow-sm"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  )
}
