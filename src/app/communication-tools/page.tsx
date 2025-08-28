import { Metadata } from 'next';
import LiveChat from '@/components/LiveChat';
import CalendarBooking from '@/components/CalendarBooking';
import VideoConsultation from '@/components/VideoConsultation';
import InstantQuoteCalculator from '@/components/InstantQuoteCalculator';
import WebsiteDominationAnalyzer from '@/components/WebsiteDominationAnalyzer';
import EmailJSDebugger from '@/components/EmailJSDebugger';
import OpenAIDebugger from '@/components/OpenAIDebugger';
import { MessageCircle, Calendar, Video, DollarSign, ArrowRight, Users, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real-Time Communication & Booking Tools | MMA',
  description: 'Connect with MMA instantly through live chat, schedule consultations, join video meetings, and get instant quotes for our services.',
  keywords: 'live chat, booking, video consultation, instant quote, MMA services, communication tools',
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
  },
  {
    icon: DollarSign,
    title: 'Instant Quote Calculator',
    description: 'Get real-time pricing based on your specific needs and requirements',
    benefits: ['Real-time pricing', 'Customizable packages', 'Add-on services', 'Payment options']
  }
];

export default function CommunicationToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Real-Time Communication & Booking
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
            Connect with MMA instantly through our comprehensive suite of communication and booking tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              Start Chatting Now
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View All Tools
            </button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated communication tools provide seamless ways to engage with MMA and get the support you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Chat Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant help and answers to your questions with our AI-powered live chat system
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Connect with MMA Instantly
                </h3>
                <p className="text-gray-600 mb-6">
                  Our live chat system provides immediate support for all your MMA service questions. 
                  Whether you need pricing information, want to discuss your project, or have technical questions, 
                  we're here to help 24/7.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Instant responses within seconds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Smart routing to the right specialist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Available on all devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Chat history and follow-up</span>
                  </div>
                </div>

                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Start Chatting
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Live Chat Support</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-800">Hi! How can I help you with MMA services today?</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-3 ml-8">
                    <p className="text-sm">I'm interested in your B2B marketing services</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-800">Great! Let me tell you about our B2B marketing packages...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Booking Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calendar Booking System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schedule consultations and meetings with our team in real-time with our integrated booking system
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <CalendarBooking />
          </div>
        </div>
      </section>

      {/* Video Consultation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Consultation Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join video meetings on your preferred platform - Zoom, Teams, or Google Meet
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <VideoConsultation />
          </div>
        </div>
      </section>

      {/* Instant Quote Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Instant Quote Calculator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get real-time pricing for our services based on your specific needs and requirements
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <InstantQuoteCalculator />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Use our communication tools to connect with MMA and start your journey toward business growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              Start Live Chat
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              Schedule Consultation
              <Calendar className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              Get Instant Quote
              <DollarSign className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Website Domination Analyzer */}
      <WebsiteDominationAnalyzer />
      
      {/* Temporary Debug Components */}
      <EmailJSDebugger />
      <OpenAIDebugger />
    </div>
  );
}
