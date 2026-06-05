"use client"

import { useState, useEffect } from "react"
import { useWhatsAppSession } from "@/hooks/use-whatsapp-session"
import { Loader2, ChevronLeft, ChevronRight, Compass, MessageSquare, LayoutDashboard, Zap, BarChart3, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WhatsAppDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { waUsername, waUserId, logoutWhatsApp, isLoading } = useWhatsAppSession()
    const router = useRouter()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Redirect to landing page if not logged in
    useEffect(() => {
        if (!isLoading && !waUserId) {
            router.replace("/")
        }
    }, [isLoading, waUserId, router])

    const isActive = (path: string) => path === "/whatsapp-dashboard" ? pathname === path : pathname.startsWith(path)

    if (isLoading || !waUserId) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen md:h-screen md:overflow-hidden bg-background text-foreground transition-colors duration-300 relative">
            
            {/* Collapse Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "hidden md:inline-flex fixed top-[36px] z-[60] w-6 h-6 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95",
                    isCollapsed ? "left-[52px]" : "left-[244px]"
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5 text-emerald-500" />
                )}
            </button>

            {/* Desktop Sidebar (Green themed for WhatsApp) */}
            <div className={cn(
                "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-40 transition-all duration-300",
                isCollapsed ? "md:w-16" : "md:w-64"
            )}>
                <aside className="flex flex-col bg-slate-900 border-r border-slate-800 text-white h-full transition-all duration-300">
                    {/* Sidebar Header */}
                    <div className={cn("flex shrink-0 select-none items-center", isCollapsed ? "p-4 justify-center" : "p-6 gap-3")}>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
                            <MessageSquare className="w-6 h-6 fill-current" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-xl tracking-tight text-emerald-400 leading-none">
                                        DMSpark
                                    </span>
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 select-none animate-pulse shrink-0">
                                        WA
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">
                                    WhatsApp Auto
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-800 mx-6" />

                    {/* Nav Items */}
                    <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto hover-scrollbar">
                        {!isCollapsed && (
                            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main</div>
                        )}
                        <NavItem
                            href="/whatsapp-dashboard"
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            label="Dashboard"
                            active={isActive("/whatsapp-dashboard") && pathname === "/whatsapp-dashboard"}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            href="/whatsapp-dashboard/automations"
                            icon={<Zap className="w-4 h-4" />}
                            label="Automations"
                            active={isActive("/whatsapp-dashboard/automations")}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            href="/whatsapp-dashboard/inbox"
                            icon={<MessageSquare className="w-4 h-4" />}
                            label="Inbox"
                            active={isActive("/whatsapp-dashboard/inbox")}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            href="/whatsapp-dashboard/analytics"
                            icon={<BarChart3 className="w-4 h-4" />}
                            label="Analytics"
                            active={isActive("/whatsapp-dashboard/analytics")}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            href="/whatsapp-dashboard/settings"
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                            active={isActive("/whatsapp-dashboard/settings")}
                            isCollapsed={isCollapsed}
                        />
                    </div>

                    {/* Profile & Logout Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                        <div className={cn(
                            "flex items-center rounded-xl bg-slate-800/60 border border-slate-800 group",
                            isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-3"
                        )}>
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner shrink-0 text-emerald-400 font-bold">
                                {waUsername ? waUsername.charAt(0).toUpperCase() : "W"}
                            </div>
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs font-bold text-white truncate">{waUsername}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={logoutWhatsApp}
                                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                        {isCollapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={logoutWhatsApp}
                                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer mt-2 mx-auto block"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </aside>
            </div>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isCollapsed ? "md:pl-16" : "md:pl-64"
            )}>
                {/* Mobile Header (Visible only on small screens) */}
                <header className="md:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                            <MessageSquare className="w-5 h-5 fill-current" />
                        </div>
                        <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">DMSpark WA</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logoutWhatsApp} className="text-muted-foreground hover:text-red-500">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </header>

                <main className="flex-1 relative overflow-hidden h-[calc(100dvh-4rem)] md:h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto hover-scrollbar w-full h-full flex flex-col relative">
                        {/* Premium WhatsApp-Branded Green & Teal Ambient Background Glows */}
                        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
                            <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] animate-pulse animate-duration-10000" />
                        </div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}

function NavItem({
  icon,
  label,
  active = false,
  href,
  isCollapsed = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  href: string
  isCollapsed?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-[13px] group relative overflow-hidden hover:translate-x-1",
        active 
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:shadow-md",
        isCollapsed ? "justify-center px-2 hover:translate-x-0" : ""
      )}
      title={isCollapsed ? label : undefined}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
      )}
      <span className={active ? "text-white" : "text-slate-400 group-hover:text-white transition-colors duration-200"}>{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}
