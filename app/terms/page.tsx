import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, HelpCircle, UserCheck, ShieldAlert, Mail } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-16 pb-32 relative overflow-y-auto w-full">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-in fade-in duration-700">
        
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] uppercase font-bold tracking-wider">
            <FileText className="w-3 h-3" /> Meta Compliant
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-xs font-medium">Last updated: June 2026 • Version 2.0</p>
        </div>

        {/* Introduction */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
          Welcome to DMSpark. By registering, accessing, or using our automation services, you explicitly agree to be bound by the terms and conditions outlined below.
        </p>

        {/* Main Content Sections */}
        <div className="space-y-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <UserCheck className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">1. Acceptance of Terms & Eligibility</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              By using our service, you affirm that you are at least 18 years of age and possess the legal authority to bind your business or creator page to these terms. If you do not accept these terms in their entirety, you must immediately cease all usage of DMSpark.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <CheckCircle className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">2. Scope of Service & Meta Compliance</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              DMSpark provides highly optimized messaging and commenting automation platforms via official Meta API integrations.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 pl-2">
              <li><span className="text-slate-200 font-semibold">Official API:</span> We comply strictly with Meta's developer protocols. We do not engage in browser automation, data scraping, or unofficial hacks.</li>
              <li><span className="text-slate-200 font-semibold">Platform Terms:</span> You agree to abide by the <a href="https://developers.facebook.com/terms/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Meta Platform Terms</a> and <a href="https://help.instagram.com/478798032474962" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Instagram Community Guidelines</a>. Any violation of Meta's terms on your account may lead to suspension of our service.</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">3. User Responsibilities & Prohibited Acts</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              As a user of our platform, you hold exclusive responsibility for all automation configurations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 pl-2">
              <li><span className="text-slate-200 font-semibold">Content Ownership:</span> You are entirely responsible for the text, links, and replies sent by your bot.</li>
              <li><span className="text-slate-200 font-semibold">Anti-Spam Policy:</span> You must not configure automations designed to harass, spam, send unsolicited promotional messages, or distribute malicious software.</li>
              <li><span className="text-slate-200 font-semibold">Account Maintenance:</span> You are responsible for keeping your Instagram account status active and healthy.</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">4. Limitations of Liability</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              DMSpark is provided "as is" and "as available" without any warranty of any kind. Meta's platform features, policies, and API availability can change at any time.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from Meta API outages, account suspensions, or automated messaging choices made under your account credentials.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">5. Term Modifications</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We reserve the right to modify or replace these terms at any time. We will publish notifications of terms updates directly on this portal. Continued utilization of the service following updates denotes formal acceptance of modified terms.
            </p>
          </div>

          {/* Contact Card */}
          <div className="p-6 rounded-2xl border border-slate-850 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Have terms-related questions?</h3>
              <p className="text-xs text-slate-400">Our customer support and legal team is here to help.</p>
            </div>
            <a 
              href="mailto:virtualrevolution02@gmail.com" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 hover:scale-105 transition-all duration-200"
            >
              <Mail className="w-4 h-4" /> Contact Support
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
