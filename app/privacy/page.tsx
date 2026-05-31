export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-neutral-400 text-sm">Last updated: May 2026</p>

        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p>When you connect your Instagram account to InstaAutobot, we collect:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Your Instagram username and user ID</li>
              <li>Access tokens provided by Instagram for API access</li>
              <li>Messages and comments received through Instagram webhooks</li>
              <li>Automation rules and settings you create</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Process and respond to Instagram messages and comments automatically</li>
              <li>Display your inbox and conversation history</li>
              <li>Execute automation rules you have configured</li>
              <li>Improve and maintain the service</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Data Storage</h2>
            <p>Your data is stored securely in our database. We do not sell, trade, or share your personal information with third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Data Deletion</h2>
            <p>You can request deletion of your data at any time by disconnecting your Instagram account from the app. Upon disconnection, all associated data will be removed from our systems.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Third-Party Services</h2>
            <p>This app uses the Instagram API (Meta) to function. Your use of Instagram is governed by Meta&apos;s own privacy policy and terms of service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Contact</h2>
            <p>For any privacy-related questions, please contact us at: <span className="text-white">virtualrevolution02@gmail.com</span></p>
          </section>
        </div>
      </div>
    </div>
  )
}
