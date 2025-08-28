'use client';

import { useEffect, useRef } from 'react';

type HubSpotFormProps = {
  portalId?: string;
  formId: string;
  region?: string; // default: na1
  targetId?: string; // element id to mount
  onReady?: () => void;
};

export default function HubSpotForm({
  portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
  formId,
  region = 'na1',
  targetId,
  onReady,
}: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!portalId || !formId) return;

    function loadForm() {
      // @ts-ignore - HubSpot embeds define window.hbspt
      if (window.hbspt && window.hbspt.forms && window.hbspt.forms.create) {
        // @ts-ignore
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: `#${targetId || 'hubspot-form-container'}`,
          onFormReady: onReady,
        });
        return true;
      }
      return false;
    }

    // Try immediate
    if (loadForm()) return;

    // Fallback: wait for script load
    const interval = setInterval(() => {
      if (loadForm()) {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [portalId, formId, region, targetId, onReady]);

  return <div id={targetId || 'hubspot-form-container'} ref={containerRef} />;
}


