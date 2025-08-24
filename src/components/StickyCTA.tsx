'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-accent-600 text-white rounded-2xl shadow-2xl p-4 max-w-sm">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-white text-accent-600 rounded-full p-1 hover:bg-accent-100 transition-colors"
            aria-label="Close consultation CTA"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Ready to upgrade your media presence?</h3>
            </div>
            
            <p className="text-xs text-accent-100 leading-relaxed">
              Book a free consultation and discover how we can transform your B2B marketing.
            </p>

            <div className="space-y-2">
              <Link
                href="/contact"
                className="block w-full bg-white text-accent-600 text-center py-2 px-4 rounded-lg font-medium text-sm hover:bg-accent-50 transition-colors"
              >
                Book Free Consultation
              </Link>
              
              <Link
                href={process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact'}
                className="block w-full bg-transparent border border-white text-white text-center py-2 px-4 rounded-lg font-medium text-sm hover:bg-white hover:text-accent-600 transition-colors"
              >
                Schedule Call
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
