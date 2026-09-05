import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dmspark.in"),
  title: {
    default: "DMSpark — #1 Instagram Automation Tool | Auto Reply DMs & Comments | dmspark.in",
    template: "%s | DMSpark - Instagram Automation",
  },
  description:
    "DMSpark (dmspark.in) is India's #1 Instagram automation tool. Auto-reply to comments & DMs with smart keyword triggers. DM Spark helps you grow Instagram followers 24/7 on autopilot. Free Instagram auto reply bot. Try DMSpark insta automation today!",
  keywords: [
    // Brand keywords — exact match variations
    "DMSpark",
    "dmspark",
    "dmspark.in",
    "dm spark",
    "DM Spark",
    "DMspark",
    "DMSPARK",
    "dmspark in",
    "dmSpark",
    // Brand + product keywords
    "dmspark insta automation",
    "dmspark instagram automation",
    "dmspark auto reply",
    "dmspark auto dm",
    "dmspark bot",
    "dm spark insta automation",
    "dm spark instagram",
    "dm spark auto reply",
    "dm spark tool",
    "dmspark app",
    "dmspark free",
    "dmspark login",
    "dmspark connect instagram",
    // Generic product keywords
    "Instagram automation",
    "Instagram auto reply",
    "Instagram DM automation",
    "auto reply Instagram comments",
    "Instagram bot",
    "Instagram growth tool",
    "Instagram marketing automation",
    "Instagram keyword trigger",
    "auto DM Instagram",
    "Instagram business automation",
    "social media automation",
    "insta automation",
    "insta auto reply",
    "insta bot",
    "insta dm automation",
    "instagram comment auto reply",
    "instagram auto comment reply",
    "instagram auto message",
    "instagram automation tool free",
    "instagram automation India",
    "best instagram automation tool",
    "instagram auto reply bot",
    "instagram dm bot",
    "instagram auto dm sender",
    "instagram follower growth tool",
    "instagram autopilot",
  ],
  authors: [{ name: "DMSpark", url: "https://www.dmspark.in" }],
  creator: "DMSpark",
  publisher: "DMSpark",
  alternates: {
    canonical: "https://www.dmspark.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.dmspark.in",
    siteName: "DMSpark",
    title: "DMSpark — #1 Instagram Automation Tool | Auto Reply & Auto Grow | dmspark.in",
    description:
      "DMSpark (DM Spark) — Auto-reply to Instagram comments & DMs with smart keyword triggers. India's best Instagram automation tool. Grow your followers 24/7 on autopilot. Official Meta API powered. Free to start!",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "DMSpark - #1 Instagram Automation Tool - dmspark.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMSpark — #1 Instagram Automation Tool | dmspark.in",
    description:
      "DMSpark (DM Spark) auto-replies to Instagram comments & DMs. Grow followers 24/7 on autopilot. Free insta automation tool.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE_HERE",
    "application-name": "DMSpark",
    "msapplication-TileColor": "#1a73e8",
    "theme-color": "#1a73e8",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_geist.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

