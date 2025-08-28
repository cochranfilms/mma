import { Metadata } from 'next';
import LiveChat from '@/components/LiveChat';
import CalendarBooking from '@/components/CalendarBooking';
import VideoConsultation from '@/components/VideoConsultation';
import WebsiteDominationAnalyzer from '@/components/WebsiteDominationAnalyzer';
// Debug components removed
import { MessageCircle, Calendar, Video, ArrowRight, Users, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tools | MMA',
  description: 'Explore MMA’s suite of powerful tools: live chat, booking, and video consultations.',
  keywords: 'tools, live chat, booking, video consultation, MMA services',
};

const features = [
  {
    icon: MessageCircle,
    title: 'Live Chat Support',
    description: 'Get instant answers to your questions with our AI-powered live chat system',
    benefits: ['24/7 availability', 'Instant responses', 'Smart routing', 'Chat history']
  },
  {
    icon: Calendar,
    title: 'Calendar Booking',
    description: 'Schedule consultations and meetings with our team in real-time',
    benefits: ['Real-time availability', 'Multiple service types', 'Automated confirmations', 'Calendar integration']
  },
  {
    icon: Video,
    title: 'Video Consultation',
    description: 'Join video meetings on your preferred platform - Zoom, Teams, or Google Meet',
    benefits: ['Multi-platform support', 'Screen sharing', 'Recording options', 'Mobile access']
  }
];

export default function CommunicationToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      {/* Website Domination Analyzer - moved to top */}
      <WebsiteDominationAnalyzer />
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent">
            Tools
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-4xl mx-auto">
            Connect with MMA instantly through our comprehensive suite of communication and booking tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-400 hover:to-orange-500 transition-colors flex items-center justify-center gap-2">
              Start Chatting Now
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="border-2 border-orange-400 text-orange-400 px-8 py-3 rounded-xl font-semibold hover:bg-orange-400 hover:text-black transition-colors">
              View All Tools
            </button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent">
              Everything You Need to Connect
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Our integrated communication tools provide seamless ways to engage with MMA and get the support you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-orange-100/90 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-sm text-orange-100/80 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Chat Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent">
              Live Chat Support
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Get instant help and answers to your questions with our AI-powered live chat system
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-400/20 rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connect with MMA Instantly
                </h3>
                <p className="text-orange-100 mb-6">
                  Our live chat system provides immediate support for all your MMA service questions. 
                  Whether you need pricing information, want to discuss your project, or have technical questions, 
                  we're here to help 24/7.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-orange-100">Instant responses within seconds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-orange-100">Smart routing to the right specialist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-orange-100">Available on all devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-orange-100">Chat history and follow-up</span>
                  </div>
                </div>

                <button className="mt-6 bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-red-400 hover:to-orange-500 transition-colors flex items-center gap-2">
                  Start Chatting
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-black/40 rounded-xl p-6 shadow-lg border border-red-400/20">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Live Chat Support</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-white">Hi! How can I help you with MMA services today?</p>
                  </div>
                  <div className="bg-red-600 text-white rounded-lg p-3 ml-8">
                    <p className="text-sm">I'm interested in your B2B marketing services</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-white">Great! Let me tell you about our B2B marketing packages...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Booking Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent">
              Calendar Booking System
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Schedule consultations and meetings with our team in real-time with our integrated booking system
            </p>
          </div>

          <div className="rounded-2xl p-8 md:p-12 shadow-lg bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-400/20">
            <CalendarBooking />
          </div>
        </div>
      </section>

      {/* Video Consultation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent">
              Video Consultation Platform
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Join video meetings on your preferred platform - Zoom, Teams, or Google Meet
            </p>
          </div>

          <div className="rounded-2xl p-8 md:p-12 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-400/20">
            <VideoConsultation />
          </div>
        </div>
      </section>

      {/* Instant Quote Calculator removed - available on Services page */}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-orange-200 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Use our communication tools to connect with MMA and start your journey toward business growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-400 hover:to-orange-500 transition-colors flex items-center justify-center gap-2">
              Start Live Chat
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="border-2 border-orange-400 text-orange-400 px-8 py-3 rounded-xl font-semibold hover:bg-orange-400 hover:text-black transition-colors flex items-center justify-center gap-2">
              Schedule Consultation
              <Calendar className="w-5 h-5" />
            </button>
            {/* Instant Quote CTA removed to avoid duplication */}
          </div>
        </div>
      </section>

    </div>
  );
}
