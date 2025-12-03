import { Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-stone-800">Privacy Policy</h1>
            <p className="text-stone-500">Digital Eye Relief Chrome Extension</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 space-y-8">
          <p className="text-stone-600">
            <strong>Last updated:</strong> December 2025
          </p>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Overview</h2>
            <p className="text-stone-600 leading-relaxed">
              Digital Eye Relief is a Chrome extension that helps reduce digital eye strain by reminding you to take regular screen breaks using the 20-20-20 rule. We are committed to protecting your privacy and being transparent about our data practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Data Collection</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              <strong>We do not collect any personal data.</strong> Digital Eye Relief is designed with privacy as a core principle.
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2">
              <li>No personal information is collected</li>
              <li>No browsing history is accessed or stored</li>
              <li>No analytics or tracking is implemented</li>
              <li>No data is transmitted to external servers</li>
              <li>No account or registration is required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Local Storage</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The extension stores your preferences locally on your device using Chrome's built-in storage API. This includes:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2">
              <li>Timer duration settings (focus interval and break duration)</li>
              <li>Notification style preference (modal or badge)</li>
              <li>Sound notification preference (on/off)</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              This data is stored locally on your device and synced across your Chrome browsers if you are signed into Chrome. It is never transmitted to us or any third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Permissions</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The extension requires the following permissions, used solely for its core functionality:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2">
              <li><strong>Storage:</strong> To save your timer preferences locally</li>
              <li><strong>Alarms:</strong> To run the break reminder timer in the background</li>
              <li><strong>Notifications:</strong> To display break reminder notifications</li>
              <li><strong>Offscreen:</strong> To play audio notifications when you're on other tabs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Third-Party Services</h2>
            <p className="text-stone-600 leading-relaxed">
              Digital Eye Relief does not use any third-party services, analytics platforms, or advertising networks. The extension operates entirely offline and does not make any network requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Data Sharing</h2>
            <p className="text-stone-600 leading-relaxed">
              We do not sell, trade, or transfer any user data to third parties. Since we don't collect any data, there is nothing to share.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Changes to This Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Contact</h2>
            <p className="text-stone-600 leading-relaxed">
              If you have any questions about this privacy policy or the extension, please visit our website or reach out through the Chrome Web Store listing.
            </p>
          </section>

          <section className="pt-4 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              This privacy policy applies to the Digital Eye Relief Chrome extension available on the Chrome Web Store.
            </p>
          </section>
        </div>

        <footer className="mt-8 text-center text-stone-500 text-sm">
          <p>© 2025 Digital Eye Relief. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
