"use client"

import React, { useEffect, useRef, useState } from "react"
import { Instagram, Shield, Zap, Check, Sparkles } from "lucide-react"

/**
 * Premium Instagram connection animation with:
 * - Animated particles/sparkles background
 * - Multi-step progress indicator
 * - Instagram gradient glow effects
 * - Smooth transitions between states
 */
export function InstagramConnectAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [step, setStep] = useState(0)

  const steps = [
    { label: "Connecting to Instagram...", icon: Instagram },
    { label: "Verifying your account...", icon: Shield },
    { label: "Setting up automation engine...", icon: Zap },
    { label: "Almost ready!", icon: Sparkles },
  ]

  // Progress through steps
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 2800),
      setTimeout(() => setStep(3), 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Sparkle particles on canvas
  useEffect(() => {
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

    interface SparkleParticle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      fadeSpeed: number
      color: string
      pulse: number
      pulseSpeed: number
    }

    const particles: SparkleParticle[] = []

    // Instagram gradient colors
    const colors = [
      "#E1306C", // Instagram Pink
      "#F77737", // Instagram Orange
      "#FCAF45", // Instagram Yellow
      "#833AB4", // Instagram Purple
      "#405DE6", // Instagram Blue
      "#1a73e8", // DMSpark Blue
      "#C13584", // Instagram Magenta
      "#FD1D1D", // Instagram Red
    ]

    // Spawn particles continuously
    const spawnParticle = () => {
      if (particles.length < 60) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.2,
          size: Math.random() * 3 + 1,
          opacity: 0,
          fadeSpeed: Math.random() * 0.015 + 0.005,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.01,
        })
      }
    }

    let animId: number
    let frameCount = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      frameCount++
      if (frameCount % 4 === 0) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        // Fade in then out
        if (p.opacity < 0.8) {
          p.opacity += p.fadeSpeed
        }

        // Remove if off screen
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles.splice(i, 1)
          continue
        }

        // Slowly fade after reaching max
        if (p.opacity >= 0.8) {
          p.opacity -= p.fadeSpeed * 0.3
        }
        if (p.opacity <= 0) {
          particles.splice(i, 1)
          continue
        }

        const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.3)

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity * 0.6)

        // Glow effect
        ctx.shadowColor = p.color
        ctx.shadowBlur = pulseSize * 4
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Bright center
        ctx.shadowBlur = 0
        ctx.globalAlpha = Math.max(0, p.opacity * 0.9)
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize * 0.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background select-none overflow-hidden">
      {/* Sparkle Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Subtle radial gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#833AB4]/5 via-transparent to-[#E1306C]/5" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(225,48,108,0.15) 0%, rgba(131,58,180,0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-md">

        {/* Animated Instagram Logo with Glow Ring */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 -m-4 rounded-[2rem] border-2 border-[#E1306C]/30 animate-ping" />
          {/* Second ring */}
          <div
            className="absolute inset-0 -m-2 rounded-[1.75rem] border border-[#833AB4]/20"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />

          {/* Instagram gradient icon container */}
          <div
            className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)",
            }}
          >
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                animation: "shimmer 2s infinite",
              }}
            />
            {step >= 3 ? (
              <Check className="w-9 h-9 text-white drop-shadow-lg animate-in zoom-in-50 duration-500" />
            ) : (
              <Instagram className="w-9 h-9 text-white drop-shadow-lg" />
            )}
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#E1306C", "#833AB4", "#F77737"][i],
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 120}deg) translateX(52px) translateY(-50%)`,
                animation: `spin ${3 + i * 0.5}s linear infinite`,
                opacity: 0.7,
                boxShadow: `0 0 8px ${["#E1306C", "#833AB4", "#F77737"][i]}`,
              }}
            />
          ))}
        </div>

        {/* Step label with transition */}
        <div className="space-y-2.5 min-h-[80px] flex flex-col items-center justify-center">
          <div
            key={step}
            className="flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {React.createElement(steps[step].icon, {
              className: `w-4.5 h-4.5 ${step >= 3 ? "text-emerald-500" : "text-[#E1306C]"}`,
            })}
            <p
              className={`text-sm font-semibold ${
                step >= 3 ? "text-emerald-500" : "text-foreground"
              }`}
            >
              {steps[step].label}
            </p>
          </div>

          <p className="text-xs text-muted-foreground max-w-[260px]">
            {step < 3
              ? "Securely connecting via Official Meta API"
              : "Your Instagram is ready for automation!"}
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="w-full max-w-xs space-y-3">
          {/* Progress bar */}
          <div className="h-1.5 bg-secondary/80 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
                background:
                  step >= 3
                    ? "#34A853"
                    : "linear-gradient(90deg, #833AB4 0%, #E1306C 50%, #F77737 100%)",
              }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-between px-1">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white transition-all duration-500 ${
                    i <= step
                      ? i < step
                        ? "bg-emerald-500 scale-100"
                        : step >= 3
                        ? "bg-emerald-500 scale-110"
                        : "bg-[#E1306C] scale-110 shadow-lg shadow-[#E1306C]/30"
                      : "bg-secondary text-muted-foreground scale-90"
                  }`}
                >
                  {i < step ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    React.createElement(s.icon, { className: "w-3 h-3" })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Powered by badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 font-medium">
          <Shield className="w-3 h-3" />
          <span>Powered by Official Meta Instagram API</span>
        </div>
      </div>

      {/* CSS for orbiting animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg) translateX(52px) translateY(-50%); }
          to { transform: rotate(360deg) translateX(52px) translateY(-50%); }
        }
      `}</style>
    </div>
  )
}
