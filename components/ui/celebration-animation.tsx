"use client"

import React, { useEffect, useRef, useState } from "react"
import { Check, Sparkles, Zap, MessageCircle, X, ArrowRight } from "lucide-react"

interface CelebrationProps {
  isOpen: boolean
  onClose: () => void
  postTitle?: string
  thumbnail?: string
  keywords?: string
  message?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: "rect" | "circle" | "star"
}

export function CelebrationAnimation({
  isOpen,
  onClose,
  postTitle,
  thumbnail,
  keywords,
  message,
}: CelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setShowModal(false)
      return
    }

    setShowModal(true)
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

    // Google palette colors + celebration golds & purples
    const colors = [
      "#4285F4", // Google Blue
      "#EA4335", // Google Red
      "#FBBC05", // Google Yellow
      "#34A853", // Google Green
      "#FF6D00", // Vibrant Orange
      "#A142F4", // Neon Purple
      "#00E5FF", // Cyan Sparkle
      "#FFD700", // Gold
    ]

    const particles: Particle[] = []

    // 1. Center burst
    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90
      const speed = Math.random() * 9 + 4
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
      })
    }

    // 2. Left bottom cannon
    for (let i = 0; i < 55; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 14 + 8
      particles.push({
        x: 0,
        y: canvas.height * 0.8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      })
    }

    // 3. Right bottom cannon
    for (let i = 0; i < 55; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 14 + 8
      particles.push({
        x: canvas.width,
        y: canvas.height * 0.8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      })
    }

    let animId: number
    const gravity = 0.22
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
        p.opacity -= 0.0038

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
          // rect
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
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-300">
      {/* Confetti Physics Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Celebratory Success Modal */}
      {showModal && (
        <div className="relative z-20 w-full max-w-md bg-background/98 backdrop-blur-xl border border-border/90 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5 animate-in zoom-in-95 fade-in duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Glowing Animated Sparkle Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-18 h-18 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/15 animate-bounce">
              <Sparkles className="w-9 h-9 text-emerald-500 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          {/* Title & Celebration Subtitle */}
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Automation Activated! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Your Instagram auto-reply is now live 24/7 on autopilot.
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-secondary/40 border border-border/80 rounded-2xl p-4 text-left space-y-3">
            {postTitle && (
              <div className="flex items-center gap-3">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-border/60"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[#1a73e8]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{postTitle}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Listening for comments
                  </p>
                </div>
              </div>
            )}

            {keywords && (
              <div className="space-y-1 pt-1 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Keywords Trigger
                </span>
                <div className="flex flex-wrap gap-1">
                  {keywords.split(",").map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#1a73e8]/10 text-[#1a73e8] text-xs font-bold"
                    >
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {message && (
              <div className="space-y-1 pt-1 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Auto-Reply DM
                </span>
                <p className="text-xs text-foreground/90 bg-background/80 p-2 rounded-xl border border-border/60 line-clamp-2 italic">
                  "{message}"
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Awesome, Got It!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
