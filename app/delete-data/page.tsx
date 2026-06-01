export default function DataDeletionInstructions() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold tracking-tight">Data Deletion Instructions</h1>
        <p className="text-neutral-400 text-sm">Last updated: May 2026</p>

        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p className="text-neutral-400">
            DMSpark values your privacy and is fully compliant with Meta Platform Terms. We provide a simple and direct way for you to delete all your connected Instagram account data from our database at any time.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">How to Disconnect and Delete Your Data:</h2>
            <ol className="list-decimal list-inside space-y-3 text-neutral-400">
              <li>
                <span className="text-white font-medium">Disconnect via Dashboard:</span> Log in to your DMSpark dashboard, navigate to Settings, and click <span className="text-red-500">"Disconnect Account"</span> next to your Instagram profile. This will instantly delete your access tokens and pause all active automations.
              </li>
              <li>
                <span className="text-white font-medium">Remove DMSpark App from Instagram:</span>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-neutral-400">
                  <li>Go to your Instagram profile settings.</li>
                  <li>Select <span className="text-white">"Apps and Websites"</span>.</li>
                  <li>Find <span className="text-white">"DMSpark"</span> and click <span className="text-white">"Remove"</span>.</li>
                </ul>
              </li>
              <li>
                <span className="text-white font-medium">Request Manual Deletion:</span> If you would like all your historical analytics, automation logs, and profile records permanently purged from our database immediately, please send an email to <span className="text-white underline">virtualrevolution02@gmail.com</span> with your Instagram username.
              </li>
            </ol>
          </section>

          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold text-white">What Data Will Be Deleted?</h2>
            <p>Upon requesting deletion or disconnecting your account, the following information is permanently erased from our database:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Your Instagram Business/Creator Account Access Tokens</li>
              <li>Your Instagram User ID and Username</li>
              <li>All webhook-received messages and message logs</li>
              <li>All custom automation rules and trigger conditions</li>
            </ul>
          </section>

          <p className="text-sm text-neutral-500 mt-8">
            If you have any questions regarding these instructions or need assistance with your data deletion, please contact our support team at <span className="text-white">virtualrevolution02@gmail.com</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
