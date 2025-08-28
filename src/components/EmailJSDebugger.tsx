'use client';

import { useEffect, useState } from 'react';

export default function EmailJSDebugger() {
  const [debugInfo, setDebugInfo] = useState({
    publicKey: '',
    hasPublicKey: false,
    nodeEnv: '',
    source: '',
  });

  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const fallbackKey = 'p4pF3OWvh-DXtae4c';
    const publicKey = envKey || fallbackKey;
    
    setDebugInfo({
      publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : 'NOT SET',
      hasPublicKey: !!publicKey,
      nodeEnv: process.env.NODE_ENV || 'unknown',
      source: envKey ? 'Environment Variable' : 'Hardcoded Fallback',
    });
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">EmailJS Debug Info</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">Public Key: </span>
          <span className={debugInfo.hasPublicKey ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.publicKey}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Environment: </span>
          <span className="text-blue-400">{debugInfo.nodeEnv}</span>
        </div>
        <div>
          <span className="text-gray-300">Source: </span>
          <span className={debugInfo.source === 'Environment Variable' ? 'text-green-400' : 'text-yellow-400'}>
            {debugInfo.source}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Status: </span>
          <span className={debugInfo.hasPublicKey ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.hasPublicKey ? 'READY' : 'MISSING KEY'}
          </span>
        </div>
      </div>
    </div>
  );
}
