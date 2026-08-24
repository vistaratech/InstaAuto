"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LandingPage } from "@/components/layout/landing-page"
import { Loader2, AlertCircle } from "lucide-react"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get("code")
    const errorParam = searchParams.get("error")
    const savedId = localStorage.getItem("ig_user_id")
    const savedWaId = localStorage.getItem("wa_user_id")
    const loginType = localStorage.getItem("login_type")

    if (errorParam) {
      setError(`Instagram login error: ${errorParam}`)
      return
    }

    if (code) {
      setProcessing(true)
      localStorage.setItem("login_type", "instagram")
      router.replace("/dashboard?code=" + code)
    } else if (loginType === "whatsapp" && savedWaId) {
      router.replace("/whatsapp-dashboard")
    } else if (savedId) {
      router.replace("/dashboard")
    }
  }, [searchParams, router])

  if (processing) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-black text-white gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-sm text-neutral-400">Connecting your Instagram account...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-black text-white gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm text-red-400">{error}</p>
        <button 
          onClick={() => { setError(null); router.replace("/") }}
          className="text-xs text-neutral-400 underline hover:text-white"
        >
          Try again
        </button>
      </div>
    )
  }

  return <LandingPage />
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DMSpark",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android",
    url: "https://www.dmspark.in",
    description:
      "DMSpark is the #1 Instagram automation tool. Auto-reply to comments, DMs, and stories with smart keyword triggers. Grow your Instagram followers 24/7 on autopilot.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free to start",
    },
    creator: {
      "@type": "Organization",
      name: "DMSpark",
      url: "https://www.dmspark.in",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }>
        <HomeContent />
      </Suspense>
    </>
  )
}
