'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-400 mb-8">Last updated: December 3, 2024</p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Arc Raiders Companion (&quot;the Service&quot;), you accept and agree
              to be bound by these Terms of Service. If you do not agree to these terms, please
              do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              Arc Raiders Companion is a free web application that helps players track their
              in-game inventory, workshop upgrades, and loadouts for the Arc Raiders video game.
              The Service is provided &quot;as is&quot; and is not affiliated with or endorsed by the
              game&apos;s developers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p className="mb-3">
              To access certain features, you may need to sign in with a Google account. You are
              responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
              <li>Scrape or harvest data from the Service</li>
              <li>Use automated systems to access the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding user-generated content) are owned
              by Arc Raiders Companion and are protected by applicable laws. Arc Raiders, its
              logo, and game content are trademarks and property of Embark Studios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. User Content</h2>
            <p>
              You retain ownership of any data you create within the Service (inventory lists,
              loadouts, etc.). By using the Service, you grant us a license to store and process
              this data to provide the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Content</h2>
            <p>
              The Service may display advertisements from third parties. We are not responsible
              for the content of these advertisements or any products/services they promote.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              GAME DATA MAY NOT ALWAYS BE ACCURATE OR UP-TO-DATE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF
              THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Service Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service at any time
              without notice. We may also update these Terms from time to time. Continued use
              of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior
              notice, for conduct that we believe violates these Terms or is harmful to other
              users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact</h2>
            <p>
              For questions about these Terms, please contact us at:{' '}
              <a
                href="mailto:support@arc-companion.com"
                className="text-amber-500 hover:text-amber-400 underline"
              >
                support@arc-companion.com
              </a>
            </p>
          </section>

          <section className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Arc Raiders Companion is a fan-made tool and is not affiliated with, endorsed,
              sponsored, or specifically approved by Embark Studios or the Arc Raiders game.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
