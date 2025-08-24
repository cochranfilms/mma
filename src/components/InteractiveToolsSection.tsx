'use client';

import { useState } from 'react';
import { HelpCircle, Calculator, BarChart3, FileText, ArrowRight, MessageCircle, Calendar, Video, DollarSign } from 'lucide-react';
import ServiceMatchingQuiz from './ServiceMatchingQuiz';
import ROICalculator from './ROICalculator';
import CompetitiveAnalysisTool from './CompetitiveAnalysisTool';
import CustomProposalGenerator from './CustomProposalGenerator';
import LiveChat from './LiveChat';
import CalendarBooking from './CalendarBooking';
import VideoConsultation from './VideoConsultation';
import InstantQuoteCalculator from './InstantQuoteCalculator';

const tools = [
  {
    id: 'quiz',
    name: 'Service Matching Quiz',
    description: 'Find the perfect MMA service for your business needs',
    icon: HelpCircle,
    component: ServiceMatchingQuiz
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'See the potential business impact of our services',
    icon: Calculator,
    component: ROICalculator
  },
  {
    id: 'analysis',
    name: 'Competitive Analysis',
    description: 'Compare MMA services against alternatives',
    icon: BarChart3,
    component: CompetitiveAnalysisTool
  },
  {
    id: 'proposal',
    name: 'Custom Proposal Generator',
    description: 'Get a personalized service proposal',
    icon: FileText,
    component: CustomProposalGenerator
  },
  {
    id: 'chat',
    name: 'Live Chat Support',
    description: 'Get instant help and answers to your questions',
    icon: MessageCircle,
    component: LiveChat
  },
  {
    id: 'booking',
    name: 'Calendar Booking',
    description: 'Schedule consultations and meetings with our team',
    icon: Calendar,
    component: CalendarBooking
  },
  {
    id: 'video',
    name: 'Video Consultation',
    description: 'Join video meetings on Zoom, Teams, or Google Meet',
    icon: Video,
    component: VideoConsultation
  },
  {
    id: 'quote',
    name: 'Instant Quote Calculator',
    description: 'Get real-time pricing for our services',
    icon: DollarSign,
    component: InstantQuoteCalculator
  }
];

export default function InteractiveToolsSection() {
  const [activeTool, setActiveTool] = useState('quiz');

  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component || ServiceMatchingQuiz;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive Service Assessment Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover which MMA services are right for your business and see the potential impact on your growth
          </p>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-2 ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Descriptions */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <div
                  key={tool.id}
                  className={`text-center p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white transform scale-105 shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md'
                  }`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      isActive ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    isActive ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${
                    isActive ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Tool Display */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {tools.find(tool => tool.id === activeTool)?.name}
                </h3>
                <p className="text-blue-100">
                  {tools.find(tool => tool.id === activeTool)?.description}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold">8</div>
                  <div className="text-blue-100 text-sm">Interactive Tools</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ActiveComponent />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take Action?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Use these tools to explore your options, then schedule a consultation to discuss your specific needs and get started with MMA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 py-3 px-8 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
