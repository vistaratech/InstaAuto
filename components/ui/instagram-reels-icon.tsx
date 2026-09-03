"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function InstagramReelsIcon({
  className = "w-5 h-5",
  gradient = false,
}: {
  className?: string
  gradient?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-all duration-300", className)}
    >
      <defs>
        <linearGradient id="igReelsGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>

      {/* Rounded clapperboard body */}
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        stroke={gradient ? "url(#igReelsGradient)" : "currentColor"}
        strokeWidth="1.8"
      />

      {/* Clapperboard horizontal divider line */}
      <line
        x1="2.5"
        y1="8"
        x2="21.5"
        y2="8"
        stroke={gradient ? "url(#igReelsGradient)" : "currentColor"}
        strokeWidth="1.8"
      />

      {/* Diagonal slate slashes */}
      <line
        x1="7.5"
        y1="2.5"
        x2="5.5"
        y2="8"
        stroke={gradient ? "url(#igReelsGradient)" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="13.5"
        y1="2.5"
        x2="11.5"
        y2="8"
        stroke={gradient ? "url(#igReelsGradient)" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="19.5"
        y1="2.5"
        x2="17.5"
        y2="8"
        stroke={gradient ? "url(#igReelsGradient)" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Center Play Triangle */}
      <polygon
        points="10.5,11.5 15.5,14.5 10.5,17.5"
        fill={gradient ? "url(#igReelsGradient)" : "currentColor"}
      />
    </svg>
  )
}
