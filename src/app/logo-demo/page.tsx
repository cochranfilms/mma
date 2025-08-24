'use client';

import { motion } from 'framer-motion';
import EnhancedLogo from '@/components/EnhancedLogo';

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Enhanced Logo Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcasing the new Mousetrap Marketing Agency logo with professional animations, 
            interactive effects, and responsive sizing options.
          </p>
        </motion.div>

        {/* Logo Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Small Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Small</h3>
            <div className="flex justify-center">
              <EnhancedLogo size="sm" showText={true} />
            </div>
          </motion.div>

          {/* Medium Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Medium</h3>
            <div className="flex justify-center">
              <EnhancedLogo size="md" showText={true} />
            </div>
          </motion.div>

          {/* Large Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Large</h3>
            <div className="flex justify-center">
              <EnhancedLogo size="lg" showText={true} />
            </div>
          </motion.div>

          {/* Extra Large Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Extra Large</h3>
            <div className="flex justify-center">
              <EnhancedLogo size="xl" showText={true} />
            </div>
          </motion.div>
        </div>

        {/* Logo Without Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-20"
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-8">Logo Without Text</h3>
          <div className="flex justify-center">
            <EnhancedLogo size="xl" showText={false} />
          </div>
        </motion.div>

        {/* Interactive Features Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Interactive Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Hover Effects</h4>
              <p className="text-gray-600 text-sm">
                Hover over any logo to see interactive animations and particle effects
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Smooth Animations</h4>
              <p className="text-gray-600 text-sm">
                Continuous floating animation and rotating sparkles for visual appeal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Brand Colors</h4>
              <p className="text-gray-600 text-sm">
                Uses your brand colors (#e0ab10 gold) with glowing effects and shadows
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors duration-200"
          >
            ← Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
