import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility | Marketing Mousetrap',
  description: 'Plain-language summary and detailed accessibility statement for Marketing Mousetrap.',
};

export default function AccessibilityPage() {
  return (
    <section className="container-custom py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>

        <div className="mb-10 rounded-lg border border-accent-200 bg-accent-50 p-6">
          <h2 className="text-xl font-semibold mb-3">In plain language</h2>
          <p className="text-accent-700">
            We want everyone to be able to use our website. We design and build with
            accessibility in mind and are continually improving. If you have trouble using
            the site, email us at hello@marketingmousetrap.com and we will help.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2>Our commitment</h2>
          <p>
            We aim to meet or exceed WCAG 2.2 AA guidelines. We use semantic HTML,
            sufficient color contrast, keyboard navigability, focus states, ARIA where
            appropriate, and accessible component patterns.
          </p>

          <h2>Measures we take</h2>
          <ul>
            <li>Design system with accessible color contrast and typography</li>
            <li>Keyboard and screen reader support for interactive elements</li>
            <li>Clear labels, alt text, and descriptive link text</li>
            <li>Regular audits and continuous improvements</li>
          </ul>

          <h2>Known limitations</h2>
          <p>
            Some third‑party embeds or legacy content may not fully meet our standards.
            We work with vendors and continuously improve these areas.
          </p>

          <h2>Feedback</h2>
          <p>
            Your feedback helps us get better. Contact us at
            {' '}<a className="underline" href="mailto:hello@marketingmousetrap.com">hello@marketingmousetrap.com</a>
            {' '}with a description of the issue and the page URL.
          </p>

          <p className="mt-8 text-sm text-accent-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}


