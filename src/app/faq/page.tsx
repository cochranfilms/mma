import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Mousetrap Media Agency',
  description: 'Frequently asked questions about our marketing and media services.',
};

const faqs = [
  {
    question: "What services does Mousetrap Media Agency offer?",
    answer: "We offer comprehensive marketing and media services including Media Relations, Web Presence development, Photo & Printing services, Content & Campaigns creation, Partnership Development, and Brand Strategy consulting."
  },
  {
    question: "How do I get started with your services?",
    answer: "Simply contact us through our contact form or book a consultation. We'll discuss your needs and create a customized strategy for your business."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary depending on the scope and complexity. During our initial consultation, we'll provide you with a detailed timeline based on your specific requirements."
  },
  {
    question: "Do you work with businesses of all sizes?",
    answer: "Yes, we work with businesses of all sizes, from startups to established enterprises. Our services are scalable and customized to meet your specific needs and budget."
  },
  {
    question: "What makes Mousetrap Media Agency different?",
    answer: "We combine creative excellence with strategic thinking and cutting-edge technology. Our team brings years of experience in marketing, media production, and brand development to deliver results that matter."
  },
  {
    question: "How do you measure success?",
    answer: "We use a combination of metrics including engagement rates, conversion rates, brand awareness, and ROI. We provide regular reports and analytics to track progress toward your goals."
  },
  {
    question: "Can you help with both digital and traditional marketing?",
    answer: "Absolutely! We offer integrated marketing solutions that span both digital and traditional channels, ensuring your message reaches your audience wherever they are."
  },
  {
    question: "What is your pricing structure?",
    answer: "Our pricing is project-based and depends on the scope of work. We offer transparent pricing with detailed proposals outlining all costs upfront. Contact us for a custom quote."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our services and how we can help your business grow.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-accent-400">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl p-8 border border-accent-500/20">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-300 mb-6">
                Can't find what you're looking for? We're here to help.
              </p>
              <a
                href="/contact"
                className="btn-primary inline-block"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
