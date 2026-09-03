"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface DMSparkLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showIcon?: boolean
  layout?: "horizontal" | "vertical" | "text-only"
  className?: string
}

export function DMSparkIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300", className)}
    >
      {/* Speech bubble in Google Blue */}
      <path
        d="M24 6C13.507 6 5 13.835 5 23.5C5 28.324 7.108 32.684 10.536 35.864C9.845 38.718 8.152 41.795 5.979 43.753C5.635 44.064 5.754 44.626 6.207 44.762C10.264 45.987 14.648 44.681 17.791 42.181C19.667 42.691 21.663 42.973 23.734 42.999L24 43C34.493 43 43 35.165 43 25.5C43 15.835 34.493 6 24 6Z"
        stroke="#4285F4"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dynamic Lightning Spark in Google Yellow & Red */}
      <path
        d="M26.5 12L16 26.5H25L22 38L33.5 22.5H24.5L26.5 12Z"
        fill="url(#dmsparkBoltGrad)"
        stroke="#EA4335"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="dmsparkBoltGrad" x1="16" y1="12" x2="33.5" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA4335" />
          <stop offset="45%" stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#34A853" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function DMSparkGoogleLogo({
  size = "lg",
  showIcon = true,
  layout = "horizontal",
  className,
}: DMSparkLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl lg:text-7xl",
  }

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10 md:w-12 md:h-12",
    xl: "w-12 h-12 md:w-16 md:h-16",
  }

  const isVertical = layout === "vertical"
  const isTextOnly = layout === "text-only" || !showIcon

  return (
    <div
      className={cn(
        "flex items-center justify-center select-none font-bold tracking-tight cursor-default transition-all duration-300",
        isVertical ? "flex-col gap-2 md:gap-2.5" : (size === "xl" || size === "lg" ? "gap-2.5 md:gap-3.5" : "gap-1.5"),
        className
      )}
    >
      {!isTextOnly && (
        <DMSparkIcon className={cn(iconSizes[size], "hover:scale-110 hover:rotate-6 transition-transform duration-300")} />
      )}

      {/* Google-colored DMSpark typography */}
      <span
        className={cn(
          "font-bold tracking-[-0.03em] flex items-center leading-none",
          sizeClasses[size]
        )}
        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <span className="text-[#4285F4] hover:opacity-85 transition-opacity">D</span>
        <span className="text-[#EA4335] hover:opacity-85 transition-opacity">M</span>
        <span className="text-[#FBBC05] hover:opacity-85 transition-opacity">S</span>
        <span className="text-[#4285F4] hover:opacity-85 transition-opacity">p</span>
        <span className="text-[#34A853] hover:opacity-85 transition-opacity">a</span>
        <span className="text-[#EA4335] hover:opacity-85 transition-opacity">r</span>
        <span className="text-[#4285F4] hover:opacity-85 transition-opacity">k</span>
      </span>
    </div>
  )
}
