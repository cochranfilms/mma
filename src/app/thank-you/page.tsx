import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDaysIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Thank You | Consultation Booked',
  description: 'Thank you for contacting Marketing Mousetrap Agency. We\'ll be in touch soon to schedule your consultation.',
};

export default function ThankYouPage() {
  return (
    <section className="section-padding bg-gradient-to-br from-accent-50 to-background">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircleIcon className="w-12 h-12" />
          </div>

          {/* Thank You Message */}
          <h1 className="heading-1 mb-6 text-green-800">
            Thank You!
          </h1>
          
          <p className="text-xl text-foreground mb-8 leading-relaxed">
            We've received your inquiry and are excited to learn more about how we can help 
            transform your B2B marketing and media presence.
          </p>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-left">
            <h2 className="heading-3 mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Review & Research</h3>
                  <p className="text-muted-foreground">
                    Our team will review your needs and conduct initial research on your company, 
                    industry, and current media presence within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Consultation Call</h3>
                  <p className="text-muted-foreground">
                    We'll schedule a 30-minute consultation call to discuss your goals, 
                    challenges, and how our services can help achieve your objectives.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Custom Proposal</h3>
                  <p className="text-muted-foreground">
                    Based on our discussion, we'll create a customized proposal tailored to your 
                    specific needs, timeline, and budget.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-accent-100 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">Schedule Your Call Now</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Don't want to wait? Book your consultation call directly through our calendar.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact'}
                className="btn-primary w-full inline-flex items-center justify-center"
              >
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                Book Consultation Call
              </a>
            </div>

            <div className="bg-accent-100 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">Explore Our Work</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See real results from companies we've helped transform.
              </p>
              <Link
                href="/work"
                className="btn-secondary w-full inline-flex items-center justify-center"
              >
                View Case Studies
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="heading-3 mb-6">While You Wait</h2>
            <p className="text-body mb-6">
              Here are some resources to help you prepare for our consultation and learn more about our approach:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/services"
                className="block p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center"
              >
                <h4 className="font-medium text-foreground mb-2">Our Services</h4>
                <p className="text-sm text-muted-foreground">
                  Learn about our comprehensive B2B marketing solutions
                </p>
              </Link>
              
              <Link
                href="/about"
                className="block p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center"
              >
                <h4 className="font-medium text-foreground mb-2">About MMA</h4>
                <p className="text-sm text-muted-foreground">
                  Discover our mission and approach to B2B marketing
                </p>
              </Link>
              
              <Link
                href="/work"
                className="block p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center"
              >
                <h4 className="font-medium text-foreground mb-2">Case Studies</h4>
                <p className="text-sm text-muted-foreground">
                  See real results from our client partnerships
                </p>
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Have questions? Don't hesitate to reach out:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+1-555-123-4567"
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                +1 (555) 123-4567
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="mailto:hello@marketingmousetrap.com"
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                hello@marketingmousetrap.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
