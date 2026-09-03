"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GoogleSearchHome } from "@/components/layout/google-home"
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
      <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a73e8]" />
        <p className="text-sm text-muted-foreground">Connecting your Instagram account...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground gap-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <button 
          onClick={() => { setError(null); router.replace("/") }}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Try again
        </button>
      </div>
    )
  }

  return <GoogleSearchHome />
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.dmspark.in/#website",
        url: "https://www.dmspark.in",
        name: "DMSpark",
        alternateName: ["dmspark", "dmspark.in", "DM Spark", "DMSPARK"],
        description: "Official DMSpark Instagram Automation & Growth Tool",
        publisher: {
          "@type": "Organization",
          name: "DMSpark",
          url: "https://www.dmspark.in",
          logo: "https://www.dmspark.in/logo.png",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "DMSpark",
        alternateName: "dmspark",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android",
        url: "https://www.dmspark.in",
        description:
          "DMSpark is the official Instagram automation platform. Auto-reply to comments, DMs, and stories with smart keyword triggers. Grow your Instagram followers 24/7 on autopilot.",
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
      },
    ],
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
