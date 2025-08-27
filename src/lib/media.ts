// Centralized image selection for services and site sections

type ImageSize = 'card' | 'hero' | 'section' | 'thumbnail';

// Map each service to curated image filenames that exist in public/media-assets/images
const serviceImageMap: Record<string, Partial<Record<ImageSize, string[]>>> = {
  'video-production': {
    card: [
      '/Andre.jpg',
      'campaign-execution-card-2.jpg',
      'content-amplification-card-2.jpg',
    ],
  },
  'web-development': {
    card: [
      'web-presence-card-1.jpg',
      'web-presence-card-2.jpg',
      'b2b-marketing-card-2.jpg',
    ],
  },
  photography: {
    card: [
      'media-connections-card-1.jpg',
      'b2b-marketing-card-3.jpg',
      'consulting-card-1.jpg',
    ],
  },
  'brand-development': {
    card: [
      'consulting-card-2.jpg',
      'b2b-marketing-card-2.jpg',
      'b2b-marketing-card-3.jpg',
    ],
  },
  'live-production': {
    card: [
      '/live.jpg',
      'media-connections-card-1.jpg',
      'campaign-execution-card-1.jpg',
    ],
  },
  'on-site-prints': {
    card: [
      'b2b-marketing-card-3.jpg',
      'content-amplification-card-1.jpg',
      'web-presence-card-2.jpg',
    ],
  },
  'white-label': {
    card: [
      'consulting-card-1.jpg',
      'consulting-card-2.jpg',
      'b2b-marketing-card-1.jpg',
    ],
  },
};

export function getServiceImage(
  serviceId: string,
  index: number,
  size: ImageSize = 'card'
): string {
  const images = serviceImageMap[serviceId]?.[size];
  if (images && images.length > 0) {
    const safeIndex = Math.abs(index) % images.length;
    return `/media-assets/images/${images[safeIndex]}`;
  }
  // Sensible fallback if mapping missing
  const fallbackCategory = 'b2b-marketing';
  const fallbackNumber = (Math.abs(index) % 3) + 1;
  return `/media-assets/images/${fallbackCategory}-${size}-${fallbackNumber}.jpg`;
}


