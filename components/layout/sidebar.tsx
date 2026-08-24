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
  Moon,
  Compass
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string
  profilePictureUrl?: string
  className?: string
  onLogout?: () => void
  onNavigate?: () => void
  isCollapsed?: boolean
}

export function Sidebar({ className, username = "Demo User", profilePictureUrl, onLogout, onNavigate, isCollapsed = false, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => path === "/dashboard" ? pathname === path : pathname.startsWith(path)

  return (
    <aside className={cn("flex flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground h-full transition-all duration-300", className)} {...props}>
      <div className={cn("flex shrink-0 select-none", isCollapsed ? "p-4 justify-center items-center" : "p-6 items-center gap-3")}>
        {isCollapsed ? (
          <img src="/logo.png" alt="DMSpark" className="w-10 h-10 object-contain shrink-0 bg-white rounded-xl p-1 shadow-sm hover:scale-105 transition-transform duration-300" />
        ) : (
          <>
            <img src="/logo.png" alt="DMSpark" className="w-12 h-12 object-contain shrink-0 bg-white rounded-xl p-1 shadow-sm hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-[#1a73e8] leading-none">
                  DMSpark
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] border border-[#1a73e8]/20 select-none animate-pulse shrink-0">
                  v1.5.1
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/50 font-bold tracking-wider uppercase mt-1">
                DM Automation
              </span>
            </div>
          </>
        )}
      </div>

      {/* Subtle Horizontal Divider */}
      <div className="h-px bg-sidebar-border mx-6" />

      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto hover-scrollbar">
        {!isCollapsed ? (
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Main</div>
        ) : (
          <div className="h-px bg-sidebar-border my-2" />
        )}
        <NavItem
          href="/dashboard"
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Dashboard"
          active={isActive("/dashboard")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/dashboard/automations"
          icon={<Zap className="w-4 h-4" />}
          label="Automations"
          active={isActive("/dashboard/automations")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/dashboard/flow-builder"
          icon={<Compass className="w-4 h-4" />}
          label="Flow Builder"
          active={isActive("/dashboard/flow-builder")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/dashboard/inbox"
          icon={<MessageSquare className="w-4 h-4" />}
          label="Inbox"
          active={isActive("/dashboard/inbox")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />
        {/* Publisher & Ice Breakers hidden during App Review — restore after approval */}
        <NavItem
          href="/dashboard/analytics"
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analytics"
          active={isActive("/dashboard/analytics")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/dashboard/help"
          icon={<Compass className="w-4 h-4 text-primary animate-pulse" />}
          label="How to Use"
          active={isActive("/dashboard/help")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />

        {!isCollapsed ? (
          <div className="px-2 mb-2 mt-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            System
          </div>
        ) : (
          <div className="h-px bg-sidebar-border my-4" />
        )}
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          active={isActive("/dashboard/settings")}
          onClick={onNavigate}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Light/Dark Switcher */}
        <div className="pt-4 border-t border-sidebar-border mt-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center rounded-lg text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent/60 transition-all duration-300 font-medium text-[13px] group cursor-pointer",
              isCollapsed ? "justify-center p-2.5 w-full" : "w-full justify-between px-4 py-2.5"
            )}
            title={isCollapsed ? "Toggle Theme" : undefined}
          >
            <div className="flex items-center gap-3">
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500 transition-transform duration-500 rotate-0 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
              )}
              {!isCollapsed && <span>Theme Mode</span>}
            </div>
            {!isCollapsed && (
              <div className="w-8 h-4 rounded-full bg-sidebar-border relative p-0.5 transition-colors group-hover:bg-sidebar-accent border border-sidebar-border/50">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full bg-foreground shadow-sm transition-all",
                  mounted && theme === "dark" ? "translate-x-3.5" : "translate-x-0"
                )} />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
        <div className={cn(
          "flex items-center rounded-xl bg-sidebar-accent/30 border border-sidebar-border backdrop-blur-sm group",
          isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-3"
        )}>
          <div className="w-9 h-9 rounded-full bg-secondary border border-sidebar-border flex items-center justify-center shadow-inner shrink-0 overflow-hidden ring-2 ring-offset-1 ring-offset-sidebar ring-primary/30 group-hover:ring-primary/60 transition-all duration-300">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-foreground">{username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {!isCollapsed && (
            <>
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
            </>
          )}
        </div>
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer mt-2 mx-auto block"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
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
  isCollapsed = false,
  badge,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  href: string
  onClick?: () => void
  isCollapsed?: boolean
  badge?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-[13px] group relative overflow-hidden hover:translate-x-1",
        active 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 hover:shadow-md hover:shadow-primary/10",
        isCollapsed ? "justify-center px-2 hover:translate-x-0" : ""
      )}
      title={isCollapsed ? label : undefined}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
      )}
      <span className={active ? "text-primary-foreground" : "text-sidebar-foreground/75 group-hover:text-foreground transition-colors duration-200"}>{icon}</span>
      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span>{label}</span>
          {badge && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-sidebar-border/80 border border-sidebar-border/20 text-muted-foreground font-black uppercase tracking-wider scale-90 origin-right transition-colors duration-200">
              {badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

