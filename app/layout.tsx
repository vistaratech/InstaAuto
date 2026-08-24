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
    default: "DMSpark — #1 Instagram Automation Tool | Auto Reply to Comments & DMs",
    template: "%s | DMSpark",
  },
  description:
    "DMSpark is the #1 Instagram automation tool. Auto-reply to comments, DMs, and stories with smart keyword triggers. Grow your Instagram followers 24/7 on autopilot. Free to start!",
  keywords: [
    "Instagram automation",
    "Instagram auto reply",
    "Instagram DM automation",
    "auto reply Instagram comments",
    "Instagram bot",
    "Instagram growth tool",
    "DMSpark",
    "Instagram marketing automation",
    "Instagram keyword trigger",
    "auto DM Instagram",
    "Instagram business automation",
    "social media automation",
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
    title: "DMSpark — #1 Instagram Automation Tool | Auto Reply & Auto Grow",
    description:
      "Auto-reply to Instagram comments & DMs with smart keyword triggers. Grow your followers 24/7 without lifting a finger. Official Meta API powered.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "DMSpark - Instagram Automation Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMSpark — #1 Instagram Automation Tool",
    description:
      "Auto-reply to Instagram comments & DMs. Grow followers 24/7 on autopilot.",
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
  icons: {
    icon: "/favicon.ico",
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

