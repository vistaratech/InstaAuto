<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Meta_Graph_API-v24.0-0081FB?style=for-the-badge&logo=meta" alt="Meta Graph API" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">⚡ DMSpark</h1>

<p align="center">
  <strong>The Google-Simple, Open-Source Instagram & WhatsApp Automation Engine.</strong>
</p>

<p align="center">
  Zero-clutter DM funnels, comment-to-DM lead magnets, follower growth gates, AI auto-replies, and unified inbox — built for creators, growth marketers, and modern brands.
</p>

<p align="center">
  <a href="https://dmspark.in"><strong>🌐 Live Web App (dmspark.in)</strong></a> ·
  <a href="#-key-features"><strong>Features</strong></a> ·
  <a href="#-quick-start-self-host"><strong>Self Host</strong></a> ·
  <a href="#-environment-variables"><strong>Env Setup</strong></a> ·
  <a href="#-meta-app-review-compliance"><strong>Meta Compliance</strong></a> ·
  <a href="#-deploy-to-vercel"><strong>Deploy to Vercel</strong></a>
</p>

---

## 💡 What is DMSpark?

**DMSpark** is a high-performance, open-source social media automation platform. While legacy tools like ManyChat present complex, cluttered node trees and charge steep recurring SaaS subscriptions, DMSpark gives you:

1. **Google-Inspired Simplicity:** An ultra-clean, search-first interface. Just search any Reel, Post, or Keyword and activate automated DM funnels in seconds.
2. **True Data Ownership:** Powered by Supabase (PostgreSQL). Your customer messages, trigger data, and automation funnels stay under your direct control.
3. **Multi-Channel Autopilot:** Built for Instagram (Official Meta Graph API v24.0) with an integrated WhatsApp Business API pipeline.
4. **Meta Review Ready:** Complete with official Privacy Policy, Terms of Service, and Data Deletion Callback handlers.

---

## ✨ Key Features

### 🔍 Google Search–Style Dashboard
- **Optically Centered Design:** Natural eye-level layout with zero visual clutter.
- **Instagram Reels Search:** Instant post and reel lookup by caption, Post ID, or keyword.
- **Official Gradient Reels Icon:** One-click access to your recent content library.
- **Mobile First:** Responsive 3-column action pills (`⚡ Automate`, `💬 Inbox`, `📈 Analytics`) engineered to look stunning on every smartphone screen.
- **Full-Page Celebration Confetti Engine:** Multi-stage physics confetti and fireworks celebration whenever an automation goes live.

### 💬 Instagram DM & Comment Automation
- **Instant Comment-to-DM Funnels:** Automatically send private DMs and public comment replies when users comment on your Reels or Posts (e.g., `"link"`, `"price"`, `"guide"`).
- **Follower Growth Gate:** Verify follower status and incentivize account follows before unlocking lead magnets.
- **Keyword Triggers:** Support for exact match, multi-keyword phrases, and comma-separated trigger rules.
- **Story Mentions & Replies:** Auto-respond to story tags and interactive emojis.
- **Ice Breakers:** Configure up to 4 native Messenger Ice Breaker quick prompts with automated follow-ups.

### 🤖 Smart AI Auto-Replies
- **AI Fallback:** Intelligently handles unmatched user inquiries using custom brand context and personality.
- **Human-Like Rhythm:** Realistic typing indicators, random natural delays, and contextual conversation memory.
- **Multi-Lingual:** Seamlessly understands and responds in English, Hindi, Hinglish, and local dialects.

### 📥 Real-Time Unified Inbox
- **Live Conversation Feed:** Monitor all incoming and outgoing DMs across your channels.
- **Manual Takeover:** Human agents can jump in and reply manually directly from the web dashboard.
- **Customer Metadata:** View recipient handles, timestamps, and interaction histories.

### 📲 WhatsApp Business API Integration
- **Beta Waitlist & Sandbox:** Built-in sandbox testing demo for WhatsApp notification funnels.
- **Multi-Account Architecture:** Designed to scale across multiple brand channels.

---

## 🧱 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Vanilla Tailwind CSS, Lucide Icons, Glassmorphism |
| **Animation** | HTML5 Canvas Confetti Physics Engine |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | Instagram OAuth 2.0 (Official Instagram Business Login) |
| **APIs** | Meta Graph API v24.0, Instagram Webhooks |
| **Deployment** | Vercel (Edge Functions & Serverless API Routes) |

---

## 🏗️ Architecture & Webhook Flow

```
Instagram / WhatsApp User
           │
           ▼ (Comments / DMs / Story Mentions)
   Meta Platform Servers
           │
           ▼ (HTTPS POST Webhook)
┌────────────────────────────────────────────────────────┐
│             DMSpark Serverless Engine                  │
│                                                        │
│  app/api/instagram/webhook/route.ts                    │
│    ├── Signature Verification (X-Hub-Signature-256)    │
│    ├── Trigger Matcher (Exact & Keyword Matching)      │
│    ├── Follower Gate Verifier                          │
│    └── Fallback AI Assistant (Groq / OpenAI Context)   │
└───────────────────────────────────┬────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
Supabase Database (PostgreSQL)                          Instagram Graph API
 (Logs event, updates inbox,                              (Sends instant DM &
  increments analytics metrics)                            posts public comment reply)
```

---

## ⚡ Quick Start: Self-Hosting

### 1. Clone the Repository

```bash
git clone https://github.com/vistaratech/InstaAuto.git
cd InstaAuto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Run the SQL schema files located in `db/` or `migrations/` to initialize tables:
   - `users`
   - `automations`
   - `messages`
   - `conversations`
   - `analytics`

### 4. Configure Meta Developer Console

1. Create a Meta App at [developers.facebook.com](https://developers.facebook.com).
2. Add the **Instagram** product (Instagram Login for Business).
3. Set your OAuth Redirect URI:
   - Local: `http://localhost:3000/api/instagram/callback`
   - Production: `https://your-domain.com/api/instagram/callback`
4. Configure Webhooks:
   - Callback URL: `https://your-domain.com/api/instagram/webhook`
   - Verify Token: A secure token you choose (e.g. `DMSPARK_SECURE_TOKEN_2026`)
   - Subscriptions: `messages`, `messaging_postbacks`, `comments`, `story_insights`

### 5. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Meta / Instagram OAuth & Webhooks
NEXT_PUBLIC_INSTAGRAM_APP_ID=your-meta-app-id
INSTAGRAM_APP_ID=your-meta-app-id
INSTAGRAM_APP_SECRET=your-meta-app-secret
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your-custom-verify-token

# AI Auto-Reply (Optional)
GATEWAY_SECRET=your-internal-secret
GROQ_API_KEY=your-groq-api-key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role secret (Server-only) |
| `NEXT_PUBLIC_INSTAGRAM_APP_ID` | ✅ | Meta Developer Application Client ID |
| `INSTAGRAM_APP_ID` | ✅ | Meta App ID for server-side token validation |
| `INSTAGRAM_APP_SECRET` | ✅ | Meta App Secret for secure token exchange |
| `NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI` | ✅ | OAuth callback endpoint |
| `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` | ✅ | Custom secret string for webhook handshakes |
| `GROQ_API_KEY` | Optional | API key for AI-powered contextual auto-replies |

> [!CAUTION]
> Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` or `INSTAGRAM_APP_SECRET` on client-facing components.

---

## 🛡️ Meta App Review & Compliance

DMSpark includes production-ready, fully styled legal and data compliance endpoints required to pass Meta App Review:

- **Privacy Policy:** [`/privacy`](https://dmspark.in/privacy) — Complete data handling and cookie terms.
- **Terms of Service:** [`/terms`](https://dmspark.in/terms) — Usage guidelines, acceptable use, and platform compliance.
- **Data Deletion Instructions & Callback:** [`/data-deletion`](https://dmspark.in/data-deletion) — Self-service data deletion request and automated Meta callback handler at `/api/data-deletion`.

---

## ▲ Deploy to Vercel

1. Push your code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Import the project into [Vercel](https://vercel.com).
3. Populate the **Environment Variables** in the Vercel project settings.
4. Update the **OAuth Redirect URI** and **Webhook URL** in the Meta Developer Console with your live domain:
   ```txt
   OAuth: https://dmspark.in/api/instagram/callback
   Webhook: https://dmspark.in/api/instagram/webhook
   ```
5. Hit **Deploy** and your production automation suite is live!

---

## 🧪 Testing Checklist

Before launching to audience traffic:

- [x] Connect your Instagram Business / Creator account.
- [x] Create a test trigger on a specific Reel (e.g. `Trigger: "price"` -> `Reply: "Check your DMs!"`).
- [x] Comment `"price"` on that Reel from a separate account.
- [x] Verify the celebratory confetti animation fires upon creation.
- [x] Confirm the public comment reply and direct message deliver instantly.
- [x] Check that the message appears inside the **Live Inbox** (`/dashboard/inbox`).

---

## 🤝 Contributing & License

Contributions, feature requests, and bug reports are welcome! Feel free to open issues or submit PRs to [github.com/vistaratech/InstaAuto](https://github.com/vistaratech/InstaAuto).

Distributed under the **MIT License**. Free to use, self-host, and customize.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/vistaratech"><strong>Vistara Tech</strong></a>
</p>
