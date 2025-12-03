'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: December 3, 2024</p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
            <p>
              Arc Raiders Companion (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our
              web application at arc-companion.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Account Information</h3>
            <p className="mb-3">
              When you sign in with Google, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your email address</li>
              <li>Your display name</li>
              <li>Your profile picture URL</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">User-Generated Data</h3>
            <p className="mb-3">
              We store data you create within the app:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Inventory items and quantities</li>
              <li>Workshop upgrade progress</li>
              <li>Custom loadout configurations</li>
              <li>App preferences and settings</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Automatically Collected Information</h3>
            <p className="mb-3">
              We may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Device type and browser information</li>
              <li>Usage patterns and feature interactions</li>
              <li>Error logs for debugging purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <p className="mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide and maintain the application</li>
              <li>Sync your data across devices</li>
              <li>Improve our services and user experience</li>
              <li>Send important updates about the service</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Storage</h2>
            <p>
              Your data is stored securely using Google Firebase services. Data is encrypted in transit
              and at rest. We retain your data for as long as your account is active or as needed to
              provide you services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Google Firebase</strong> - Authentication and data storage</li>
              <li><strong>Google Analytics</strong> - Usage analytics (anonymized)</li>
              <li><strong>Google AdSense</strong> - Displaying advertisements</li>
              <li><strong>Vercel</strong> - Application hosting</li>
            </ul>
            <p className="mt-3">
              These services may collect information as described in their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Advertising</h2>
            <p>
              We display advertisements through Google AdSense. Google may use cookies and similar
              technologies to serve ads based on your prior visits to our website or other websites.
              You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 underline"
              >
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <p>
              We use cookies and local storage to maintain your session, remember your preferences,
              and provide a better user experience. Essential cookies are required for the application
              to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to children under 13. We do not knowingly collect
              personal information from children under 13. If you believe we have collected
              information from a child under 13, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the
              &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a
                href="mailto:privacy@arc-companion.com"
                className="text-amber-500 hover:text-amber-400 underline"
              >
                privacy@arc-companion.com
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
