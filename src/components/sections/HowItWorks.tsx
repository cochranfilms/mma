'use client';

import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, LinkIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Assess',
    subtitle: 'Understand Your Position',
    description: 'We analyze your current media presence, identify gaps, and understand your business goals to create a strategic roadmap.',
    details: [
      'Current state audit',
      'Competitive analysis',
      'Goal alignment',
      'Opportunity identification'
    ]
  },
  {
    icon: LinkIcon,
    title: 'Connect',
    subtitle: 'Build Strategic Relationships',
    description: 'We establish and nurture relationships with key media outlets, industry partners, and B2B platforms that matter to your business.',
    details: [
      'Media relationship building',
      'Partnership identification',
      'Industry networking',
      'Strategic alliance formation'
    ]
  },
  {
    icon: ChartBarIcon,
    title: 'Amplify',
    subtitle: 'Maximize Your Reach',
    description: 'We leverage those connections to amplify your message, increase visibility, and drive measurable business results.',
    details: [
      'Content amplification',
      'Campaign execution',
      'Performance optimization',
      'Results measurement'
    ]
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            How MMA Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Our proven 3-step process creates compounding results that accelerate your B2B growth. 
            Each step builds on the previous one to maximize your impact and ROI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              {/* Content Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 h-full hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-6 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-blue-300 font-medium mb-4">{step.subtitle}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{step.description}</p>
                
                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full absolute -top-1 right-0 shadow-lg"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-blue-100 mb-6">
            Ready to see how our process can transform your B2B marketing?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Your Assessment
            <ChartBarIcon className="w-5 h-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
