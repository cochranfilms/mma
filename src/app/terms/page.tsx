import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Marketing Mousetrap',
  description: 'Plain-language summary and formal terms of service for Marketing Mousetrap.',
};

export default function TermsPage() {
  return (
    <section className="container-custom py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="mb-10 rounded-lg border border-accent-200 bg-accent-50 p-6">
          <h2 className="text-xl font-semibold mb-3">In plain language</h2>
          <p className="text-accent-700">
            By using our website and services, you agree to be respectful, follow the
            rules described below, and use our content lawfully. If you purchase services,
            you agree to the scope, timeline, and payment terms we mutually define.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2>1. Acceptance of terms</h2>
          <p>
            By accessing or using this website and our services, you agree to these Terms
            of Service and our Privacy Policy. If you do not agree, please do not use the
            site or our services.
          </p>

          <h2>2. Use of site and content</h2>
          <ul>
            <li>Do not misuse the site or attempt to disrupt its operation</li>
            <li>Do not infringe on intellectual property rights</li>
            <li>Do not submit unlawful, harmful, or misleading content</li>
          </ul>

          <h2>3. Intellectual property</h2>
          <p>
            All trademarks, logos, and content on this site are owned by us or our
            licensors. You may not copy, reproduce, or distribute content without
            permission unless otherwise permitted by law.
          </p>

          <h2>4. Services and proposals</h2>
          <p>
            Any proposals, statements of work, or service agreements we issue will define
            scope, deliverables, timelines, and payment terms. Those documents govern if
            they conflict with these general terms.
          </p>

          <h2>5. Payments and refunds</h2>
          <p>
            Payments are due as stated in the applicable agreement or invoice. Certain
            deliverables may be non-refundable once production has started, except where
            required by law.
          </p>

          <h2>6. Disclaimers</h2>
          <p>
            The site and services are provided “as is” without warranties of any kind to
            the fullest extent permitted by law. We do not guarantee specific outcomes.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            To the extent permitted by law, we are not liable for indirect, incidental,
            or consequential damages arising from the use of our site or services.
          </p>

          <h2>8. Governing law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which we are
            established, without regard to conflict of law principles.
          </p>

          <h2>9. Changes</h2>
          <p>
            We may update these terms occasionally. We will update the “Last updated” date
            below and, if appropriate, post a notice on our website.
          </p>

          <p className="mt-8 text-sm text-accent-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}


