'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

interface EnhancedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function EnhancedLogo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: EnhancedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div 
      className={`relative flex flex-col items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${sizeClasses[size]} group`}>

        {/* Corporate Elegant Style */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent-400/30 to-accent-600/30 rounded-full blur-xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full border-2 border-accent-500/70 shadow-2xl overflow-hidden"
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotateY: isHovered ? 8 : 0,
          }}
          transition={{ duration: 0.4 }}
          whileHover={{ 
            boxShadow: "0 0 40px rgba(224,171,16,0.8)",
          }}
        >
          <div className="absolute inset-0 opacity-30">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(224,171,16,0.4)_1px,transparent_0)] bg-[length:12px_12px]"
              animate={{
                x: [0, 6, 0],
                y: [0, 6, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="relative w-14 h-18 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full border border-gray-400"
              animate={{
                y: [0, -2, 0],
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.4 }
              }}
            >
              <div className="absolute -top-2 -left-1.5 w-6 h-6 bg-gray-100 rounded-full border border-gray-300" />
              <div className="absolute -top-2 -right-1.5 w-6 h-6 bg-gray-100 rounded-full border border-gray-300" />
              <div className="absolute top-4 left-2.5 w-3 h-3 bg-gray-600 rounded-full" />
              <div className="absolute top-4 right-2.5 w-3 h-3 bg-gray-600 rounded-full" />
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-500 rounded-full" />
              <motion.div
                className="absolute bottom-2 -right-2 w-7 h-1.5 bg-gray-200 rounded-full origin-left"
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            <motion.div
              className="absolute top-3 right-3 text-accent-400"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <SparklesIcon className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>

      </div>

      {showText && (
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            className={`font-bold text-accent-400 tracking-wider ${textSizes[size]} mb-1`}
            animate={{
              textShadow: isHovered 
                ? "0 0 20px rgba(224,171,16,0.8), 0 0 40px rgba(224,171,16,0.4)" 
                : "0 0 0px rgba(224,171,16,0)"
            }}
            transition={{ duration: 0.3 }}
          >
            MOUSETRAP
          </motion.h1>
          
          <motion.p
            className={`text-accent-400/80 font-medium tracking-wide ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}
            animate={{
              opacity: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            MARKETING AGENCY
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
