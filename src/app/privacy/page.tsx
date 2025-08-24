import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Marketing Mousetrap',
  description: 'Plain-language summary and formal privacy policy for Marketing Mousetrap.',
};

export default function PrivacyPage() {
  return (
    <section className="container-custom py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="mb-10 rounded-lg border border-accent-200 bg-accent-50 p-6">
          <h2 className="text-xl font-semibold mb-3">In plain language</h2>
          <p className="text-accent-700">
            We respect your privacy. We only collect the information we need to operate our
            services, improve your experience, and communicate with you when you ask us to.
            We never sell your data. You can ask us to delete your data at any time.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2>1. Information we collect</h2>
          <p>
            We may collect your name, email address, company details, and any messages you
            send via forms, email, or chat. We also collect limited analytics data (such as
            page views and device/browser information) to understand how our site is used.
          </p>

          <h2>2. How we use information</h2>
          <ul>
            <li>Provide, maintain, and improve our website and services</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Send service-related updates you request or opt into</li>
            <li>Analyze site usage to improve performance and content</li>
          </ul>

          <h2>3. Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with trusted
            service providers (e.g., hosting, analytics, email) who process it on our
            behalf under confidentiality agreements. We may disclose information if
            required by law or to protect our rights and safety.
          </p>

          <h2>4. Data retention</h2>
          <p>
            We keep personal information only as long as necessary for the purposes
            described here, unless a longer retention period is required by law.
          </p>

          <h2>5. Your rights</h2>
          <ul>
            <li>Access, correct, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Ask questions about this policy: hello@marketingmousetrap.com</li>
          </ul>

          <h2>6. Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to
            protect personal information. However, no method of transmission or storage is
            100% secure.
          </p>

          <h2>7. International users</h2>
          <p>
            If you access our site from outside your home jurisdiction, you understand
            that your information may be processed in countries with different data
            protection laws.
          </p>

          <h2>8. Changes</h2>
          <p>
            We may update this policy from time to time. We will update the “Last updated”
            date below and, if appropriate, notify you via our website.
          </p>

          <p className="mt-8 text-sm text-accent-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}


