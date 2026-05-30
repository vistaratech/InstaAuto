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

    if (errorParam) {
      setError(`Instagram login error: ${errorParam}`)
      return
    }

    if (code) {
      setProcessing(true)
      router.replace("/dashboard?code=" + code)
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
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
