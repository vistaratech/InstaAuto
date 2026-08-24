import Link from "next/link"
import { ArrowLeft, Trash2, Mail, Info } from "lucide-react"

export default function DataDeletionInstructions() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 relative">
      {/* Fixed Ambient Glows (never interferes with scrolling) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 pb-36 space-y-10 relative z-10 animate-in fade-in duration-500">
        
        {/* Back Navigation */}
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all hover:translate-x-[-4px] duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] uppercase font-bold tracking-wider">
            <Trash2 className="w-3 h-3" /> Meta Compliant
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Data Deletion Instructions
          </h1>
          <p className="text-slate-400 text-xs font-medium">Last updated: June 2026 • Version 2.0</p>
        </div>

        {/* Introduction */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
          DMSpark values your privacy and is fully compliant with Meta Platform Terms. We provide a simple, transparent, and direct way for you to delete all your connected Instagram account data from our databases at any time.
        </p>

        {/* Main Content Sections */}
        <div className="space-y-6">
          
          {/* Card 1: How to Delete */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <Trash2 className="w-4 h-4 text-rose-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">How to Disconnect and Delete Your Data:</h2>
            </div>
            
            <div className="space-y-4 text-xs text-slate-400">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 mt-0.5">1</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold">Disconnect via Dashboard:</h4>
                  <p>Log in to your DMSpark dashboard, navigate to **Settings**, and click the red **&quot;Disconnect Account&quot;** button next to your Instagram profile. This will instantly invalidate your tokens and stop all active automations.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 mt-0.5">2</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold">Remove DMSpark App from Instagram:</h4>
                  <p>To fully deauthorize the app, go to your Instagram mobile app settings, select **&quot;Apps and Websites&quot;**, find **&quot;DMSpark&quot;**, and click **&quot;Remove&quot;**.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 mt-0.5">3</div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold">Request Manual Purge:</h4>
                  <p>If you would like all your historical analytics, automation logs, and profile records permanently and immediately purged from our active databases and backup storage systems, send an email to <span className="text-white font-semibold underline">virtualrevolution02@gmail.com</span> with your username.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: What is deleted */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Info className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">What Data Will Be Deleted?</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon requesting deletion or disconnecting your account, the following information is permanently erased from our database:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 pl-2">
              <li><span className="text-slate-200 font-semibold">Credentials:</span> Your Instagram Business/Creator Account Access Tokens.</li>
              <li><span className="text-slate-200 font-semibold">Profile Logs:</span> Your Instagram user ID, username, and cache.</li>
              <li><span className="text-slate-200 font-semibold">Activity Records:</span> Webhook-received messages, comments, and story logs.</li>
              <li><span className="text-slate-200 font-semibold">Rules:</span> All custom trigger rules and dynamic response settings you constructed.</li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className="p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Need help with your data deletion?</h3>
              <p className="text-xs text-slate-400">Send us a direct request and we will purge your data within 24 hours.</p>
            </div>
            <a 
              href="mailto:virtualrevolution02@gmail.com" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 hover:scale-105 transition-all duration-200 shrink-0"
            >
              <Mail className="w-4 h-4" /> Request Purge via Email
            </a>
          </div>

        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DMSpark. All rights reserved.
        </footer>

      </main>
    </div>
  )
}
