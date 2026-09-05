"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GoogleSearchHome } from "@/components/layout/google-home"
import { SeoContent } from "@/components/layout/seo-content"
import { InstagramConnectAnimation } from "@/components/ui/instagram-connect-animation"
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
    return <InstagramConnectAnimation />
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
        alternateName: [
          "dmspark",
          "dmspark.in",
          "DM Spark",
          "dm spark",
          "DMSPARK",
          "DMspark",
          "dmSpark",
          "dmspark insta automation",
          "dmspark instagram automation",
          "dm spark insta automation",
          "dm spark instagram",
          "dmspark auto reply",
          "dmspark bot",
        ],
        description:
          "DMSpark is India's #1 Instagram automation tool. Auto-reply to comments, DMs, and stories with smart keyword triggers. Grow your Instagram followers 24/7 on autopilot.",
        publisher: {
          "@type": "Organization",
          name: "DMSpark",
          url: "https://www.dmspark.in",
          logo: {
            "@type": "ImageObject",
            url: "https://www.dmspark.in/logo.png",
            width: 512,
            height: 512,
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.dmspark.in/?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.dmspark.in/#app",
        name: "DMSpark",
        alternateName: [
          "dmspark",
          "DM Spark",
          "dm spark",
          "dmspark insta automation",
          "Instagram Auto Reply by DMSpark",
        ],
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android",
        url: "https://www.dmspark.in",
        description:
          "DMSpark is the official Instagram automation platform. Auto-reply to comments, DMs, and stories with smart keyword triggers. Grow your Instagram followers 24/7 on autopilot. Best insta automation tool in India.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free to start — No credit card required",
        },
        creator: {
          "@type": "Organization",
          name: "DMSpark",
          url: "https://www.dmspark.in",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
          bestRating: "5",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.dmspark.in/#organization",
        name: "DMSpark",
        alternateName: ["DM Spark", "dmspark", "dmspark.in"],
        url: "https://www.dmspark.in",
        logo: {
          "@type": "ImageObject",
          url: "https://www.dmspark.in/logo.png",
          width: 512,
          height: 512,
        },
        description:
          "DMSpark — India's #1 Instagram automation and growth tool. Powering auto-replies for businesses and creators.",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.dmspark.in/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "DMSpark Home",
            item: "https://www.dmspark.in",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.dmspark.in/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is DMSpark?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DMSpark (dmspark.in) is India's #1 Instagram automation tool. It auto-replies to Instagram comments and DMs using smart keyword triggers. DMSpark helps businesses and creators grow their Instagram followers 24/7 on complete autopilot. It's powered by the official Meta/Instagram API.",
            },
          },
          {
            "@type": "Question",
            name: "How does DMSpark Instagram automation work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DMSpark works by connecting your Instagram Business or Creator account via the official Meta API. You set up keyword triggers (like 'price', 'link', 'info') and DMSpark automatically replies to comments and sends DMs whenever someone uses those keywords. It runs 24/7 without you having to be online.",
            },
          },
          {
            "@type": "Question",
            name: "Is DMSpark free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! DMSpark is free to start. You can connect your Instagram account and set up auto-replies at no cost. DMSpark offers a generous free tier that lets you automate your Instagram comments and DMs instantly.",
            },
          },
          {
            "@type": "Question",
            name: "Is DMSpark safe? Does it use the official Instagram API?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely! DMSpark uses the official Meta (Instagram) Graph API. Your account is never at risk. Unlike unofficial bots, DMSpark is fully compliant with Instagram's terms of service and uses secure OAuth authentication.",
            },
          },
          {
            "@type": "Question",
            name: "How is DMSpark different from other Instagram automation tools?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DMSpark (DM Spark) stands out because it uses the official Meta API (not unofficial scraping), offers both comment auto-reply AND DM automation, works 24/7 on autopilot, has a Google-like clean interface, is free to start, and is built specifically for Indian businesses and creators.",
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Server-rendered SEO content for Google crawler */}
      <SeoContent />
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
