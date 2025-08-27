export const services = [
  {
    id: 'video-production',
    icon: 'camera',
    title: 'Video Production',
    subtitle: 'Cinematic storytelling for premium brands',
    description:
      'High-end production from concept through delivery: brand films, product spots, social, and event coverage built to convert.',
    deliverables: [
      'Concept + creative direction',
      'On-site production crew',
      '4K capture and color grade',
      'Motion graphics + titles',
      'Short + long-form deliverables',
    ],
    startingPrice: 4500,
    category: 'video',
    outcomes: [
      'Premium assets that elevate perception',
      'Consistent content pipeline for distribution',
    ],
    featured: true,
    pricing: {
      packages: [
        { id: 'social-day', name: 'Social Content Day', description: '1 day capture + edits', price: 4500, includes: ['1 day shoot', '3–5 edits', 'Captions + exports'] },
        { id: 'brand-film', name: 'Brand Film', description: '2–3 minute brand story', price: 12000, includes: ['Creative', '2 shoot days', 'Post + color'] },
        { id: 'product-launch', name: 'Product Launch', description: 'Launch film + cutdowns', price: 18000, includes: ['2 shoot days', 'Graphics', 'Variations'] },
        { id: 'campaign-bundle', name: 'Campaign Bundle', description: '3 videos + deliverables', price: 28000, includes: ['3x core videos', 'Cutdowns', 'Thumbnails/metadata'] }
      ],
      addOns: [
        { id: 'extra-shoot', name: 'Additional Filming Day', description: 'Extra production day', price: 2000 },
        { id: 'teleprompter', name: 'Teleprompter', description: 'On‑set teleprompter', price: 300 },
        { id: 'drone', name: 'Drone Operator', description: 'Licensed drone pilot', price: 500 },
        { id: 'motion-gfx', name: 'Motion Graphics Pack', description: 'Animated titles/graphics', price: 1500 },
        { id: 'voiceover', name: 'Voiceover', description: 'Professional VO talent', price: 500 },
        { id: 'studio', name: 'Studio Rental', description: 'Studio space rental', price: 800 },
        { id: 'music', name: 'Licensed Music', description: 'Premium track license', price: 250 },
        { id: 'captions', name: 'Captioning', description: 'SRT and burned‑in captions', price: 200 },
        { id: 'verticals', name: 'Vertical Cutdowns', description: 'Per additional vertical cut', price: 250, unit: 'each' },
        { id: 'talent', name: 'On‑Camera Talent', description: 'Casting + day rate', price: 1000 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Creative development: script, storyboard, shot plan',
        'Director + DP + sound on-set with pro lighting',
        '4K capture, color grade, audio mix, captions',
        'Hero edit + cutdowns for social + paid',
        'Usage-ready exports (web, broadcast, vertical)'
      ],
      howWeDeliver: [
        { title: 'Discovery', description: 'Goals, audience, distribution plan, and success metrics.' },
        { title: 'Creative', description: 'Treatment, script, visual language, logistics, casting if needed.' },
        { title: 'Production', description: 'Single or multi-day shoot with senior crew and pro gear.' },
        { title: 'Post', description: 'Edit, sound design, color, graphics, revisions, and finishing.' },
        { title: 'Distribution', description: 'Cutdowns, thumbnails, metadata, and platform-ready deliverables.' }
      ],
      tech: ['Blackmagic/Canon 4K', 'DaVinci Resolve', 'After Effects', 'Premiere Pro', 'Frame.io'],
      roi: {
        items: [
          { label: 'Brand film usage across site + sales', estValue: 6000 },
          { label: '5x social cutdowns for paid/organic', estValue: 3500 },
          { label: 'Event or product B-roll library', estValue: 2000 }
        ],
        example: { investment: 4500, estimatedReturn: 11500 }
      }
    }
  },
  {
    id: 'web-development',
    icon: 'globe',
    title: 'Web Development',
    subtitle: 'Modern, conversion-focused websites',
    description:
      'Custom Next.js sites with fast performance, SEO best practices, and CMS workflows that empower teams.',
    deliverables: [
      'Information architecture',
      'Design system + components',
      'Headless CMS setup',
      'Analytics + event tracking',
      'Performance optimization',
    ],
    startingPrice: 10000,
    category: 'web',
    outcomes: [
      'Higher conversion with clear UX',
      'Maintainable, scalable codebase',
    ],
    featured: true,
    learnMore: {
      whatYouGet: [
        'UX research + IA + wireframes',
        'Design system and responsive components',
        'Next.js app with SSR/ISR and SEO best practices',
        'Headless CMS authoring workflows',
        'Analytics + event tracking + performance budget'
      ],
      howWeDeliver: [
        { title: 'Audit & Goals', description: 'Analyze current site, traffic, and conversion levers.' },
        { title: 'Architecture', description: 'Define sitemap, content model, and performance targets.' },
        { title: 'Design', description: 'Component library, states, accessibility, and brand polish.' },
        { title: 'Build', description: 'Clean, typed implementation with testing and observability.' },
        { title: 'Launch', description: 'SEO, redirects, monitoring, and training for your team.' }
      ],
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel', 'Headless CMS'],
      roi: {
        items: [
          { label: 'Conversion rate lift (sitewide)', estValue: 8000 },
          { label: 'Organic traffic growth via SEO', estValue: 5000 },
          { label: 'Reduced engineering time (DX)', estValue: 3000 }
        ],
        example: { investment: 12000, estimatedReturn: 20000 }
      }
    }
  },
  {
    id: 'photography',
    icon: 'camera',
    title: 'Photography',
    subtitle: 'Editorial-quality imagery for campaigns',
    description:
      'Brand, product, and event photography with consistent creative direction and professional post-processing.',
    deliverables: [
      'Creative brief + shot list',
      'On-location or studio shoot',
      'Professional retouching',
      'Optimized web + print exports',
      'Usage rights for campaigns',
    ],
    startingPrice: 1800,
    category: 'creative',
    outcomes: [
      'Cohesive brand visuals across channels',
      'Assets tailored for web and print',
    ],
    featured: true,
    pricing: {
      packages: [
        { id: 'half-day', name: 'Half‑Day Shoot', description: 'Up to 4 hours, on‑site or studio', price: 1800, includes: ['Up to 4 hours', 'Senior photographer', 'Basic retouching'] },
        { id: 'full-day', name: 'Full‑Day Shoot', description: 'Up to 8 hours, crew + lighting', price: 2800, includes: ['Up to 8 hours', 'Assistant + lighting', 'Retouching'] },
        { id: 'ecom-30', name: 'E‑commerce (30 SKUs)', description: 'Consistent product catalog', price: 2400, includes: ['30 SKUs', 'Consistent backgrounds', 'Export presets'] },
        { id: 'exec-portraits', name: 'Executive Portraits', description: 'Team headshots on‑site', price: 1200, includes: ['Setup on‑site', 'Light retouch', 'Delivery gallery'] }
      ],
      addOns: [
        { id: 'retouch-extra', name: 'Extra Retouched Image', description: 'Per additional retouched image', price: 30, unit: 'each' },
        { id: 'studio-rental', name: 'Studio Rental', description: 'Half‑day studio rental', price: 600 },
        { id: 'lighting-kit', name: 'On‑site Lighting Kit', description: 'Additional lighting package', price: 250 },
        { id: 'rush', name: 'Rush Delivery', description: '48‑hour delivery', price: 400 },
        { id: 'hmua', name: 'Hair/MUA', description: 'Styling on set', price: 500 },
        { id: 'backgrounds', name: 'Specialty Backgrounds', description: 'Seamless colors / textures', price: 200 },
        { id: 'licensing', name: 'Extended Licensing', description: 'Expanded usage rights', price: 500 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Creative brief, mood board, and shot list',
        'Half or full-day production with lighting',
        'Professional retouching + color treatment',
        'Web + print exports and delivery via gallery',
        'Commercial usage rights for campaigns'
      ],
      howWeDeliver: [
        { title: 'Pre-Production', description: 'Look/feel, wardrobe, props, and schedule.' },
        { title: 'Production', description: 'Studio or location shoot with direction and capture.' },
        { title: 'Post-Production', description: 'Culling, retouch, exports, and approvals.' }
      ],
      tech: ['Canon RF / Sigma Art', 'Profoto Lighting', 'Lightroom', 'Photoshop', 'Pixieset'],
      roi: {
        items: [
          { label: 'New brand library for site + ads', estValue: 2200 },
          { label: 'Product set with 20+ SKUs', estValue: 1800 },
          { label: 'Event image pack for PR + social', estValue: 1200 }
        ],
        example: { investment: 1800, estimatedReturn: 3500 }
      }
    }
  },
  {
    id: 'brand-development',
    icon: 'pen-tool',
    title: 'Brand Development',
    subtitle: 'Strategy, identity, and standards',
    description:
      'Positioning, naming, and identity systems that clarify value and accelerate go-to-market.',
    deliverables: [
      'Positioning + messaging',
      'Logo + visual identity',
      'Typography + color system',
      'Brand guidelines document',
      'Launch assets toolkit',
    ],
    startingPrice: 7500,
    category: 'strategy',
    outcomes: [
      'Clear, differentiated market position',
      'Systemized brand assets for scale',
    ],
    featured: false,
    pricing: {
      packages: [
        { id: 'startup-identity', name: 'Startup Identity', description: 'Foundational identity + kit', price: 7500, includes: ['Positioning', 'Logo suite', 'Basic guidelines'] },
        { id: 'rebrand-core', name: 'Rebrand Core', description: 'Identity refresh with system', price: 12000, includes: ['Identity refresh', 'System + components', 'Guidelines'] },
        { id: 'full-system', name: 'Full Brand System', description: 'Comprehensive brand platform', price: 20000, includes: ['Research', 'Identity system', 'Toolkit + standards'] },
        { id: 'brand-site', name: 'Brand + Site Combo', description: 'Brand system + launch site', price: 25000, includes: ['Identity', 'Design system', 'Marketing site'] }
      ],
      addOns: [
        { id: 'naming', name: 'Naming Sprint', description: 'Shortlist + trademark pre‑checks', price: 4000 },
        { id: 'guidelines', name: 'Guidelines Book', description: 'Detailed standards doc', price: 3000 },
        { id: 'motion', name: 'Motion Identity', description: 'Logo motion + Lottie', price: 2500 },
        { id: 'collateral', name: 'Collateral Kit', description: 'Cards, letterhead, email sigs', price: 1500 },
        { id: 'templates', name: 'Template Suite', description: 'Deck + social templates', price: 2000 },
        { id: 'voice', name: 'Brand Voice Doc', description: 'Tone, style, messaging', price: 1800 },
        { id: 'research', name: 'Customer Interviews', description: '5x interviews + synthesis', price: 2500 },
        { id: 'a11y', name: 'Accessibility Review', description: 'Color contrast + docs', price: 2000 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Positioning + messaging hierarchy',
        'Logo suite and visual identity system',
        'Typography, color, and components',
        'Brand guidelines + templates',
        'Launch kit for web and social'
      ],
      howWeDeliver: [
        { title: 'Strategy', description: 'Audience, category, competitors, and POV.' },
        { title: 'Identity', description: 'Logo exploration, type, color, and motif.' },
        { title: 'System', description: 'Components, spacing, and accessibility.' },
        { title: 'Standards', description: 'Usage guardrails and handoff.' }
      ],
      tech: ['Figma', 'Adobe Illustrator', 'Notion', 'GSAP (brand motion)'],
      roi: {
        items: [
          { label: 'Close rate lift from clarity', estValue: 5000 },
          { label: 'Time saved via reusable assets', estValue: 2500 },
          { label: 'Premium pricing power', estValue: 3000 }
        ],
        example: { investment: 7500, estimatedReturn: 10500 }
      }
    }
  },
  {
    id: 'white-label',
    icon: 'handshake',
    title: 'White-Label Services',
    subtitle: 'Confidential production for agencies',
    description:
      'Reliable, senior execution across video, web, and creative payloads under your brand.',
    deliverables: [
      'SLA-driven delivery',
      'NDA + private repositories',
      'Flexible resourcing model',
      'Client-ready documentation',
      'Priority support windows',
    ],
    startingPrice: 6000,
    category: 'partner',
    outcomes: [
      'Expand capacity without hiring',
      'Win larger retainers with senior support',
    ],
    featured: true,
    pricing: {
      packages: [
        { id: 'pod-l', name: 'Monthly Pod L (40 hrs)', description: 'Senior execution under NDA', price: 6000, includes: ['40 senior hours', 'Priority windows', 'Private repos'] },
        { id: 'pod-xl', name: 'Monthly Pod XL (80 hrs)', description: 'Expanded capacity for agencies', price: 11200, includes: ['80 senior hours', 'SLA coverage', 'Agency tooling'] },
        { id: 'sprint-week', name: 'Dedicated Sprint Week', description: 'One‑week focused delivery', price: 8000, includes: ['Dedicated team', 'Daily demos', 'QA + handoff'] },
        { id: 'on-call', name: 'On‑Call Retainer', description: 'Standby for rapid needs', price: 3000, includes: ['Standby support', 'Rapid response', 'Confidential delivery'] }
      ],
      addOns: [
        { id: 'nda-legal', name: 'NDA / Legal Review', description: 'Custom legal review', price: 500 },
        { id: 'private-repos', name: 'Private Repo Setup', description: 'Isolated VCS + CI', price: 300 },
        { id: 'sla-24h', name: '24‑Hour SLA', description: 'Expedited response time', price: 1500 },
        { id: 'deck', name: 'Co‑Branded Deck', description: 'Sales deck for resale', price: 600 },
        { id: 'senior-day', name: 'Extra Senior Engineer Day', description: 'Deep technical work', price: 1200 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Dedicated senior producer/engineer',
        'Signed NDA and private repos',
        'SLA and comms in your channels',
        'Client-ready docs and artifacts',
        'Priority scheduling windows'
      ],
      howWeDeliver: [
        { title: 'Intake', description: 'Scope, SOW, and brand/tooling alignment.' },
        { title: 'Execution', description: 'Sprint-based delivery with demos and QA.' },
        { title: 'Handoff', description: 'Docs, capture, and support runway.' }
      ],
      tech: ['Next.js', 'AWS', 'Vercel', 'Frame.io', 'Slack/Linear'],
      roi: {
        items: [
          { label: 'Margin from resale at agency rates', estValue: 5000 },
          { label: 'Zero hiring overhead/time saved', estValue: 2500 },
          { label: 'Win rate lift from senior portfolio', estValue: 2000 }
        ],
        example: { investment: 6000, estimatedReturn: 9500 }
      }
    }
  },
];

export type Services = typeof services;

