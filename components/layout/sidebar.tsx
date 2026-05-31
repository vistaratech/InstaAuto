"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Instagram, 
  LayoutDashboard, 
  Zap, 
  LogOut, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Snowflake, 
  Clapperboard,
  Sun,
  Moon
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string
  className?: string
  onLogout?: () => void
  onNavigate?: () => void
}

export function Sidebar({ className, username = "Demo User", onLogout, onNavigate, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => path === "/dashboard" ? pathname === path : pathname.startsWith(path)

  return (
    <aside className={cn("flex flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground h-full transition-colors duration-300", className)} {...props}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-md shadow-primary/10">
          <Instagram className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-base tracking-tight text-foreground leading-none">Insta Autobot</h2>
          <span className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1 inline-block">Pro</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto scrollbar-hide">
        <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Main</div>
        <NavItem
          href="/dashboard"
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Dashboard"
          active={isActive("/dashboard")}
          onClick={onNavigate}
        />
        <NavItem
          href="/dashboard/automations"
          icon={<Zap className="w-4 h-4" />}
          label="Automations"
          active={isActive("/dashboard/automations")}
          onClick={onNavigate}
        />
        <NavItem
          href="/dashboard/publisher"
          icon={<Clapperboard className="w-4 h-4" />}
          label="Publisher"
          active={isActive("/dashboard/publisher")}
          onClick={onNavigate}
        />
        <NavItem
          href="/dashboard/ice-breakers"
          icon={<Snowflake className="w-4 h-4" />}
          label="Ice Breakers"
          active={isActive("/dashboard/ice-breakers")}
          onClick={onNavigate}
        />
        <NavItem
          href="/dashboard/inbox"
          icon={<MessageSquare className="w-4 h-4" />}
          label="Inbox"
          active={isActive("/dashboard/inbox")}
          onClick={onNavigate}
        />
        <NavItem
          href="/dashboard/analytics"
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analytics"
          active={isActive("/dashboard/analytics")}
          onClick={onNavigate}
        />

        <div className="px-2 mb-2 mt-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          System
        </div>
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          active={isActive("/dashboard/settings")}
          onClick={onNavigate}
        />

        {/* Dynamic Light/Dark Switcher */}
        <div className="pt-4 border-t border-sidebar-border mt-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center justify-between px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent/60 transition-all font-medium text-[13px] group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
              <span>Theme Mode</span>
            </div>
            <div className="w-8 h-4 rounded-full bg-sidebar-border relative p-0.5 transition-colors group-hover:bg-sidebar-accent border border-sidebar-border/50">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full bg-foreground shadow-sm transition-all",
                mounted && theme === "dark" ? "translate-x-3.5" : "translate-x-0"
              )} />
            </div>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border backdrop-blur-sm group">
          <div className="w-9 h-9 rounded-full bg-secondary border border-sidebar-border flex items-center justify-center shadow-inner">
            <span className="text-xs font-bold text-foreground">{username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate">{username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Active</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({
  icon,
  label,
  active = false,
  href,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  href: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-[13px] group relative overflow-hidden ${
        active 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
      )}
      <span className={active ? "text-primary-foreground" : "text-sidebar-foreground/75 group-hover:text-foreground transition-colors duration-200"}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

