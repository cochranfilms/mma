'use client';

import { useState } from 'react';
import { Metadata } from 'next';

const benefits = [
  {
    title: "Industry Insights",
    description: "Get the latest marketing trends and industry news delivered to your inbox."
  },
  {
    title: "Exclusive Tips",
    description: "Access expert marketing strategies and tactics not available anywhere else."
  },
  {
    title: "Case Studies",
    description: "Learn from real-world examples of successful marketing campaigns."
  },
  {
    title: "Early Access",
    description: "Be the first to know about new services, tools, and resources."
  }
];

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call - replace with actual newsletter signup logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl p-12 border border-accent-500/20">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome to the Team!</h1>
              <p className="text-gray-300 mb-6">
                Thank you for subscribing to our newsletter. You'll receive your first email soon with exclusive marketing insights and tips.
              </p>
              <a href="/" className="btn-primary">
                Return Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Newsletter
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay ahead of the competition with exclusive marketing insights, industry trends, and expert strategies delivered to your inbox.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold mb-8">What You'll Get</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-accent-400">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signup Form */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-center">Subscribe Now</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-white"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl p-8 border border-accent-500/20">
              <h2 className="text-2xl font-bold mb-4">Join 1,000+ Marketing Professionals</h2>
              <p className="text-gray-300">
                Our newsletter is trusted by marketing professionals, business owners, and entrepreneurs who want to stay ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
