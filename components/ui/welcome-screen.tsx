"use client"

import React, { useEffect, useRef, useState } from "react"
import { Instagram, Shield, Check, Sparkles, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
  username: string
  userId: string
  onComplete: () => void
}

/**
 * Premium "Welcome to DMSpark" screen shown after Instagram login.
 * Shows the user's profile picture, username, and a celebratory welcome.
 * Stays for ~4 seconds with confetti particles, then transitions to dashboard.
 */
export function WelcomeScreen({ username, userId, onComplete }: WelcomeScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [phase, setPhase] = useState<"loading" | "welcome" | "done">("loading")
  const [progressWidth, setProgressWidth] = useState(0)

  // Fetch profile picture
  useEffect(() => {
    const fetchPic = async () => {
      try {
        const res = await fetch(`/api/instagram/profile-picture?userId=${userId}`)
        const data = await res.json()
        if (data.success && data.profilePictureUrl) {
          setProfilePic(data.profilePictureUrl)
        }
      } catch (err) {
        console.error("Failed to fetch profile pic:", err)
      }
      // Move to welcome phase after a brief moment
      setTimeout(() => setPhase("welcome"), 600)
    }
    fetchPic()
  }, [userId])

  // Auto-progress and auto-dismiss
  useEffect(() => {
    if (phase !== "welcome") return

    // Animate progress bar
    const progressTimer = setTimeout(() => setProgressWidth(100), 100)

    // Auto-complete after 4 seconds
    const completeTimer = setTimeout(() => {
      setPhase("done")
      setTimeout(onComplete, 500)
    }, 4000)

    return () => {
      clearTimeout(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [phase, onComplete])

  // Celebration particles
  useEffect(() => {
    if (phase !== "welcome") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const colors = [
      "#4285F4", "#EA4335", "#FBBC05", "#34A853",
      "#E1306C", "#833AB4", "#F77737", "#FFD700",
      "#00E5FF", "#A142F4",
    ]

    interface ConfettiParticle {
      x: number; y: number; vx: number; vy: number
      size: number; color: string; rotation: number
      rotationSpeed: number; opacity: number
      shape: "rect" | "circle" | "star"
    }

    const particles: ConfettiParticle[] = []

    // Center burst
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80
      const speed = Math.random() * 8 + 3
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
      })
    }

    // Left cannon
    for (let i = 0; i < 40; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 12 + 6
      particles.push({
        x: 0, y: canvas.height * 0.85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      })
    }

    // Right cannon
    for (let i = 0; i < 40; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 12 + 6
      particles.push({
        x: canvas.width, y: canvas.height * 0.85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      })
    }

    let animId: number
    const gravity = 0.2
    const friction = 0.985

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += gravity
        p.vx *= friction
        p.vy *= friction
        p.rotation += p.rotationSpeed
        p.opacity -= 0.004

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === "star") {
          ctx.beginPath()
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
            )
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2)
            )
          }
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        }
        ctx.restore()
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(render)
      }
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [phase])

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-background select-none overflow-hidden transition-opacity duration-500 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Confetti Canvas */}
      {phase === "welcome" && (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
      )}

      {/* Subtle gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a73e8]/5 via-transparent to-[#34A853]/5" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(26,115,232,0.15) 0%, rgba(52,168,83,0.1) 50%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-6 text-center max-w-md">

        {/* Loading state */}
        {phase === "loading" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-secondary/50 animate-pulse" />
            <div className="w-32 h-4 rounded-full bg-secondary/50 animate-pulse" />
          </div>
        )}

        {/* Welcome state */}
        {phase === "welcome" && (
          <>
            {/* Profile Picture with animated ring */}
            <div className="relative animate-in zoom-in-75 fade-in duration-700">
              {/* Outer glowing ring */}
              <div
                className="absolute -inset-2 rounded-full opacity-60"
                style={{
                  background: "linear-gradient(135deg, #1a73e8 0%, #34A853 50%, #FBBC05 100%)",
                  animation: "spin 4s linear infinite",
                }}
              />
              {/* White gap ring */}
              <div className="absolute -inset-[5px] rounded-full bg-background" />
              {/* Profile picture */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border/50 shadow-2xl">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center">
                    <Instagram className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center border-[3px] border-background shadow-lg animate-in zoom-in-50 duration-500 delay-300">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <p className="text-xs font-semibold text-emerald-500 flex items-center justify-center gap-1.5 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Account Connected Successfully
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Welcome to DMSpark! 🎉
              </h1>
              <p className="text-base font-semibold text-foreground/80">
                @{username}
              </p>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                Your Instagram is now connected. Let&apos;s automate your comments &amp; DMs!
              </p>
            </div>

            {/* Features pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {["Auto Reply", "DM Funnels", "24/7 Autopilot"].map((feature, i) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60 text-xs font-medium text-muted-foreground"
                  style={{ animationDelay: `${600 + i * 100}ms` }}
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                  {feature}
                </span>
              ))}
            </div>

            {/* Auto-progress bar */}
            <div className="w-full max-w-xs space-y-2 animate-in fade-in duration-700 delay-700">
              <div className="h-1 bg-secondary/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1a73e8] via-[#34A853] to-[#FBBC05]"
                  style={{
                    width: `${progressWidth}%`,
                    transition: "width 3.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground/50 font-medium">
                Setting up your dashboard...
              </p>
            </div>

            {/* Skip button */}
            <button
              onClick={() => {
                setPhase("done")
                setTimeout(onComplete, 300)
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer animate-in fade-in duration-700 delay-1000"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Powered by badge */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-medium">
              <Shield className="w-3 h-3" />
              <span>Secured by Official Meta Instagram API</span>
            </div>
          </>
        )}
      </div>

      {/* CSS for spinning gradient ring */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
