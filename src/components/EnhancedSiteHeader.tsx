'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import EnhancedLogo from './EnhancedLogo';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Communication Tools', href: '/communication-tools' },
  { name: 'Contact', href: '/contact' },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateBodyPadding = () => {
      if (typeof document === 'undefined') return;
      const headerEl = headerRef.current;
      if (headerEl) {
        document.body.style.paddingTop = `${headerEl.offsetHeight}px`;
      }
    };

    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);
    return () => {
      window.removeEventListener('resize', updateBodyPadding);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-[1000] bg-black border-b border-gray-800 w-full">
      {/* Enhanced Banner with Logo */}
      <div className="bg-black py-6 border-b border-gray-800">
        <div className="container-custom flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center space-x-6"
          >
            <EnhancedLogo size="lg" showText={true} />
          </motion.div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container-custom flex items-center justify-center py-6" aria-label="Main navigation">
        {/* Centered Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-all duration-300 hover:text-accent-400 relative ${
                pathname === item.href ? 'text-accent-400' : 'text-gray-300'
              }`}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn-primary text-sm"
          >
            Book Consultation
          </Link>
        </div>

        {/* Enhanced Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-300 hover:bg-gray-800 hover:text-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-200 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md"
          >
            <div className="container-custom py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-base font-medium transition-all duration-300 hover:text-accent-400 hover:translate-x-2 ${
                    pathname === item.href ? 'text-accent-400' : 'text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn-primary block text-center w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>,
    document.body
  );
}
