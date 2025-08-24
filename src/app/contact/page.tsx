import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import BookingForm from '@/components/BookingForm';
import Image from 'next/image';

export const metadata: Metadata = generatePageMetadata('contact');

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-accent-50 to-background relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/media-assets/images/media-connections-section-1.jpg"
            alt="Professional business networking and connections"
            fill
            className="object-cover opacity-10"
          />
        </div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="heading-1 mb-6">
            Let's Transform Your B2B Marketing
          </h1>
          <p className="text-body max-w-3xl mx-auto">
            Ready to upgrade your media presence, web presence, and B2B connections? 
            Book a free consultation and discover how our strategic approach can compound your brand's reach.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <BookingForm />
        </div>
      </section>

      {/* Additional Contact Information */}
      <section className="section-padding bg-accent-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direct Contact */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">Call Us</h3>
              <p className="text-body mb-2">Speak directly with our team</p>
              <a
                href="tel:+1-555-123-4567"
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                +1 (555) 123-4567
              </a>
            </div>

            {/* Email Contact */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">Email Us</h3>
              <p className="text-body mb-2">Send us a detailed message</p>
              <a
                href="mailto:hello@marketingmousetrap.com"
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                hello@marketingmousetrap.com
              </a>
            </div>

            {/* Office Location */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">Visit Us</h3>
              <p className="text-body mb-2">Schedule an in-person meeting</p>
              <p className="text-accent-600 font-medium">
                San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Frequently Asked Questions</h2>
            <p className="text-body max-w-3xl mx-auto">
              Get quick answers to common questions about working with MMA.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">How quickly can we get started?</h3>
              <p className="text-body">
                We can typically begin working with new clients within 1-2 weeks of our initial consultation. 
                The exact timeline depends on your specific needs and our current capacity.
              </p>
            </div>

            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">What's included in the free consultation?</h3>
              <p className="text-body">
                Our free consultation includes a 30-minute call where we discuss your current challenges, 
                goals, and how our services can help. We'll provide specific recommendations and next steps.
              </p>
            </div>

            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">Do you work with companies outside the US?</h3>
              <p className="text-body">
                Yes! While we're based in the United States, we work with B2B companies globally. 
                Many of our services can be delivered remotely, and we can coordinate with local partners when needed.
              </p>
            </div>

            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">How do you measure success?</h3>
              <p className="text-body">
                We establish clear KPIs at the start of each engagement, including metrics like media mentions, 
                website traffic, lead generation, and business outcomes. We provide regular reporting and can tie 
                our work directly to your business goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
