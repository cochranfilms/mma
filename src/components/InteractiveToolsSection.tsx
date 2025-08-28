'use client';

import { useState } from 'react';
import { HelpCircle, Calculator, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import ServiceMatchingQuiz from './ServiceMatchingQuiz';
import ROICalculator from './ROICalculator';
import CalendarBooking from './CalendarBooking';
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
    id: 'booking',
    name: 'Calendar Booking',
    description: 'Schedule consultations and meetings with our team',
    icon: Calendar,
    component: CalendarBooking
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
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Decorative background overlays removed to eliminate visible header line */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-400/30 bg-orange-500/10 text-orange-200 text-sm font-semibold tracking-wide mb-6">
            ELITE WARFARE ARSENAL
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Interactive Service Assessment Tools
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Discover which MMA services are right for your business and see the potential impact on your growth
          </p>
        </div>

        {/* Top navigation buttons removed per request */}

        {/* Tool Descriptions */}
        <div className="mb-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <div
                  key={tool.id}
                  className={`group text-center p-6 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur border ${
                    isActive
                      ? 'bg-white/10 border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-white/10'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${isActive ? 'text-white' : 'text-slate-100'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-blue-200' : 'text-slate-300'}`}>
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Tool Display */}
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-fuchsia-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {tools.find(tool => tool.id === activeTool)?.name}
                </h3>
                <p className="text-blue-100">
                  {tools.find(tool => tool.id === activeTool)?.description}
                </p>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-3xl font-extrabold">{tools.length}</div>
                <div className="text-blue-100 text-sm">Interactive Tools</div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-slate-950/30">
            <ActiveComponent />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Take Action?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Use these tools to explore your options, then schedule a consultation to discuss your specific needs and get started with MMA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-rose-600 text-white py-3 px-8 rounded-xl font-medium hover:from-orange-400 hover:to-rose-500 transition-all flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.35)]">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="border-2 border-white/20 text-slate-100 py-3 px-8 rounded-xl font-medium hover:bg-white/10 transition-colors">
                View All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
