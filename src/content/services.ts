export const services = [
  {
    id: 'media-relations',
    icon: 'megaphone',
    title: 'Media Relations & PR',
    subtitle: 'Earned placements that build authority',
    description:
      'We craft compelling narratives and build relationships that get your brand featured in the right places.',
    deliverables: [
      'Messaging strategy',
      'Press outreach',
      'Thought leadership',
      'Media monitoring',
      'Report & insights',
    ],
    category: 'strategy',
    outcomes: [
      'Strengthen brand authority with targeted media wins',
      'Build C-suite credibility with industry publications',
    ],
    featured: true,
  },
  {
    id: 'web-presence',
    icon: 'globe',
    title: 'Web Presence Upgrade',
    subtitle: 'Modern, conversion-focused experiences',
    description:
      'Design and UX that communicate value with clarity and drive qualified conversions across your funnel.',
    deliverables: [
      'Information architecture',
      'UX/UI design system',
      'CMS setup',
      'Performance optimization',
      'Analytics instrumentation',
    ],
    category: 'web',
    outcomes: [
      'Improve conversion rates with frictionless UX',
      'Reduce bounce with clear messaging and IA',
    ],
    featured: true,
  },
  {
    id: 'content-amplification',
    icon: 'camera',
    title: 'Content & Distribution',
    subtitle: 'Turn expertise into scalable demand',
    description:
      'Capture, package, and distribute authority-building content across owned and earned channels.',
    deliverables: [
      'Editorial calendar',
      'Video + design assets',
      'Repurposing workflows',
      'Channel playbooks',
      'Attribution reporting',
    ],
    category: 'content',
    outcomes: [
      'Expand reach with repeatable content ops',
      'Accelerate pipeline with consistent publishing',
    ],
    featured: false,
  },
  {
    id: 'consulting',
    icon: 'handshake',
    title: 'GTM Consulting',
    subtitle: 'Senior guidance without the overhead',
    description:
      'Hands-on advisory to align positioning, offers, and channels to revenue outcomes.',
    deliverables: [
      'Positioning workshops',
      'ICP + messaging',
      'Channel strategy',
      'Measurement framework',
    ],
    category: 'advisory',
    outcomes: [
      'Tighter ICP focus and offer-market fit',
      'Clear GTM operating cadence',
    ],
    featured: false,
  },
  {
    id: 'b2b-marketing',
    icon: 'target',
    title: 'Demand Programs',
    subtitle: 'Full-funnel activation & measurement',
    description:
      'Operate integrated programs across channels with rigorous attribution and feedback loops.',
    deliverables: [
      'Campaign orchestration',
      'Creative + landing pages',
      'Lead routing & scoring',
      'RevOps collaboration',
    ],
    category: 'campaigns',
    outcomes: [
      'Pipeline lift from qualified opportunities',
      'Shorter sales cycles with better enablement',
    ],
    featured: true,
  },
];

export type Services = typeof services;

