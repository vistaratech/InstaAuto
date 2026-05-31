export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-neutral-400 text-sm">Last updated: May 2026</p>

        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By using InstaAutobot, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Service Description</h2>
            <p>InstaAutobot is an Instagram automation tool that allows users to set up automatic replies to direct messages, comments, and story interactions on Instagram.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>You must have a valid Instagram Business or Creator account</li>
              <li>You must comply with Instagram&apos;s Platform Terms and Community Guidelines</li>
              <li>You must not use the service for spamming, harassment, or any abusive behavior</li>
              <li>You are responsible for the content of your automated replies</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Account Access</h2>
            <p>By connecting your Instagram account, you authorize InstaAutobot to access your account through the Instagram API to provide automation services. You can revoke this access at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Limitation of Liability</h2>
            <p>InstaAutobot is provided &quot;as is&quot; without warranties. We are not responsible for any consequences arising from the use of automated messaging on your Instagram account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Contact</h2>
            <p>For questions about these terms, contact us at: <span className="text-white">virtualrevolution02@gmail.com</span></p>
          </section>
        </div>
      </div>
    </div>
  )
}
