"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Zap,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { DMSparkGoogleLogo } from "@/components/ui/dmspark-logo"

interface TopNavbarProps {
  username?: string
  profilePictureUrl?: string
  onLogout?: () => void
  isConnected?: boolean
}

const navItems = [
  { href: "/dashboard", icon: <Zap className="w-4 h-4" />, label: "Home", exact: true },
  { href: "/dashboard/automations", icon: <Zap className="w-4 h-4" />, label: "Automations" },
  { href: "/dashboard/inbox", icon: <MessageSquare className="w-4 h-4" />, label: "Inbox" },
  { href: "/dashboard/analytics", icon: <BarChart3 className="w-4 h-4" />, label: "Analytics" },
  { href: "/dashboard/settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
]

export function TopNavbar({ username = "User", profilePictureUrl, onLogout, isConnected = true }: TopNavbarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights#weblink`

  return (
    <>
      <nav className="h-14 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 flex items-center px-4 md:px-6 gap-1 select-none">
        {/* Logo */}
        <Link href={isConnected ? "/dashboard" : "/"} className="flex items-center shrink-0 mr-4 md:mr-8 hover:opacity-90 transition-opacity">
          <DMSparkGoogleLogo size="sm" showIcon={true} />
        </Link>

        {/* Desktop Nav Tabs */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {isConnected ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                    isActive(item)
                      ? "text-[#1a73e8] bg-[#1a73e8]/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard/help"
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                  pathname.startsWith("/dashboard/help")
                    ? "text-[#1a73e8] bg-[#1a73e8]/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                Help
              </Link>
            </>
          ) : null}
        </div>

        {/* Right Side — Theme + Auth / Connect */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-[18px] h-[18px] text-amber-500" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
          </button>

          {/* Connect Button or Profile Avatar */}
          {!isConnected ? (
            <a
              href={instagramAuthUrl}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Connect</span>
            </a>
          ) : (
            <>
              {/* Profile Avatar */}
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0">
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-foreground">{username.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Logout (Desktop only — on mobile it is inside the hamburger drawer) */}
              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </>
          )}

          {/* Mobile Hamburger (if connected) */}
          {isConnected && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex md:hidden items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer ml-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-background/98 backdrop-blur-md border-b border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-2 gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(item)
                    ? "text-[#1a73e8] bg-[#1a73e8]/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard/help"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard/help")
                  ? "text-[#1a73e8] bg-[#1a73e8]/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Compass className="w-4 h-4" />
              Help
            </Link>
            {/* Mobile Drawer Logout */}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onLogout?.()
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout ({username})
            </button>
          </div>
        </div>
      )}
    </>
  )
}
