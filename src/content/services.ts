export const services = [
  {
    id: 'video-production',
    icon: 'camera',
    title: 'Video Production',
    subtitle: 'Professional videos that tell your story',
    description:
      'We plan, film, and edit videos that help you sell and communicate clearly — from brand films and product spots to social videos and events.',
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
    id: 'live-production',
    icon: 'camera',
    title: 'Live Production',
    subtitle: 'Reliable live streaming and event coverage',
    description:
      'We handle your live show from start to finish — cameras, audio, graphics, and streaming — so your event runs smoothly without surprises.',
    deliverables: [
      'Multi-cam switching and capture',
      'Audio mixing + IFB/comm systems',
      'Live graphics + lower thirds',
      'Streaming setup and monitoring',
      'Recording and post-event exports',
    ],
    startingPrice: 3500,
    category: 'video',
    outcomes: [
      'Broadcast-quality live experience',
      'Reliable delivery across platforms',
    ],
    featured: true,
    pricing: {
      packages: [
        { id: 'single-cam', name: 'Single‑Cam Stream', description: 'Compact live kit', price: 3500, includes: ['1 camera', 'Audio mix', 'Graphics + RTMP'] },
        { id: 'multicam', name: 'Multi‑Cam Stream', description: '2–3 cameras + crew', price: 6500, includes: ['3 cameras', 'Switcher/TD', 'Audio/Comms'] },
        { id: 'hybrid-event', name: 'Hybrid Event', description: 'On‑site AV + stream', price: 9000, includes: ['Stage AV', 'Multi-cam', 'Platform support'] }
      ],
      addOns: [
        { id: 'remote-guests', name: 'Remote Guests', description: 'Remote caller integration', price: 600 },
        { id: 'record-isos', name: 'ISO Records', description: 'Isolated camera records', price: 400 },
        { id: 'graphics-pack', name: 'Graphics Pack', description: 'Custom motion graphics', price: 800 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Run‑of‑show, cues, and technical plan',
        'Switching, audio, graphics, and redundancy',
        'Platform testing and monitoring',
        'Post-event recording delivery'
      ],
      howWeDeliver: [
        { title: 'Pre‑Pro', description: 'Site check, network test, tech rundown.' },
        { title: 'Live', description: 'Crewed show with comms and cueing.' },
        { title: 'Post', description: 'Upload, captions, and cutdowns if needed.' }
      ],
      tech: ['ATEM/Tricaster', 'Shure/Rode', 'NDI/SDI', 'vMix', 'YouTube/RTMP']
    }
  },
  {
    id: 'on-site-prints',
    icon: 'target',
    title: 'On‑Site Printing & Photo Booths',
    subtitle: 'Instant prints and shareable photo moments',
    description:
      'Bring a branded photo booth to your event. Guests get instant prints and a digital gallery. We supply the gear and staff the station.',
    deliverables: [
      'Pro camera + lighting setup',
      'Live gallery + QR sharing',
      'Branded print templates',
      'Unlimited sessions during booking window',
      'On‑site attendant(s)'
    ],
    startingPrice: 1200,
    category: 'events',
    outcomes: [
      'Memorable branded guest experience',
      'Shareable content that amplifies reach',
    ],
    featured: false,
    pricing: {
      packages: [
        { id: 'classic-booth', name: 'Classic Booth (2 hrs)', description: 'Prints + digital gallery', price: 1200, includes: ['2 hours', 'Unlimited sessions', '1 attendant'] },
        { id: 'premium-booth', name: 'Premium Booth (4 hrs)', description: 'Backdrop + props + prints', price: 1800, includes: ['4 hours', 'Backdrop/props', '2 attendants'] },
        { id: 'step-and-repeat', name: 'Step & Repeat', description: 'Red‑carpet style entrance', price: 2200, includes: ['Custom template', 'Lighting', 'Gallery + prints'] }
      ],
      addOns: [
        { id: 'custom-wrap', name: 'Custom Booth Wrap', description: 'Full brand wrap', price: 500 },
        { id: 'gif-boomerang', name: 'GIF/Boomerang', description: 'Animated captures', price: 250 },
        { id: 'extra-hour', name: 'Additional Hour', description: 'Extend coverage per hour', price: 200 }
      ],
      fullyCustomizable: true
    },
    learnMore: {
      whatYouGet: [
        'Camera, lighting, printer, and media',
        'Branded 2x6 or 4x6 templates',
        'Instant gallery with QR + AirDrop',
        'Professional attendant(s) to run the station'
      ],
      howWeDeliver: [
        { title: 'Prep', description: 'Template design and logistics.' },
        { title: 'Event', description: 'Setup, operation, and guest support.' },
        { title: 'Wrap', description: 'Gallery delivery and asset handoff.' }
      ],
      tech: ['Canon/Sony', 'DNP printers', 'Tether tools', 'Studio lighting']
    }
  },
  {
    id: 'web-development',
    icon: 'globe',
    title: 'Website Design & Development',
    subtitle: 'Fast, clear, and easy-to-manage websites',
    description:
      'We design and build websites that load fast, rank well, and turn visitors into leads. Your team can update content without hassle.',
    deliverables: [
      'Information architecture',
      'Design system + components',
      'Headless CMS setup',
      'Analytics + event tracking',
      'Performance optimization',
    ],
    startingPrice: 7500,
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
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'Vercel', 'AWS', 'Docker', 'Stripe', 'Auth0', 'Clerk', 'Sanity', 'Contentful', 'Shopify', 'WooCommerce', 'Framer Motion', 'Three.js', 'GraphQL', 'tRPC', 'Zustand', 'Redux', 'React Query', 'SWR', 'Zod', 'React Hook Form', 'Storybook', 'Jest', 'Playwright', 'Cypress'],
      roi: {
        items: [
          { label: 'Conversion rate lift (sitewide)', estValue: 8000 },
          { label: 'Organic traffic growth via SEO', estValue: 5000 },
          { label: 'Reduced engineering time (DX)', estValue: 3000 }
        ],
        example: { investment: 9000, estimatedReturn: 17500 }
      }
    },
    pricing: {
      packages: [
        { id: 'landing-page', name: 'Landing Page', description: 'Single high-converting page', price: 7500, includes: ['UX research', 'Responsive design', 'CMS integration', 'Analytics setup'] },
        { id: 'marketing-site', name: 'Marketing Site', description: '5-10 pages with CMS', price: 13000, includes: ['Full site architecture', 'Design system', 'CMS workflows', 'SEO optimization'] },
        { id: 'web-app', name: 'Web Application', description: 'Custom web app with auth', price: 18000, includes: ['User authentication', 'Database design', 'API integration', 'Admin dashboard'] },
        { id: 'ecommerce', name: 'E-commerce Site', description: 'Full online store', price: 28000, includes: ['Product catalog', 'Payment processing', 'Inventory management', 'Order fulfillment'] }
      ],
      addOns: [
        { id: 'extra-page', name: 'Additional Page', description: 'Custom page with CMS', price: 1000 },
        { id: 'third-party', name: 'Third-party Integration', description: 'API or service integration', price: 1500 },
        { id: 'multilingual', name: 'Multi-language Support', description: 'i18n implementation', price: 2500 },
        { id: 'advanced-seo', name: 'Advanced SEO Package', description: 'Schema, sitemap, optimization', price: 2000 },
        { id: 'performance', name: 'Performance Optimization', description: 'Speed and Core Web Vitals', price: 1300 },
        { id: 'accessibility', name: 'Accessibility Audit', description: 'WCAG compliance review', price: 1700 },
        { id: 'maintenance', name: 'Monthly Maintenance', description: 'Updates and monitoring', price: 700 },
        { id: 'training', name: 'Team Training Session', description: 'CMS and workflow training', price: 800 }
      ],
      fullyCustomizable: true
    }
  },
  {
    id: 'photography',
    icon: 'camera',
    title: 'Photography',
    subtitle: 'Clean, consistent photos for web and print',
    description:
      'Brand, product, and event photos that look good everywhere. We plan the shots, capture on site or in studio, and deliver ready-to-use files.',
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
    title: 'Brand Strategy & Identity',
    subtitle: 'Clear message and a brand that fits your market',
    description:
      'We help you explain what you do, why it matters, and how you look. Name, logo, colors, voice, and guidelines your whole team can use.',
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
    featured: true,
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
    title: 'White‑Label for Agencies',
    subtitle: 'We do the work under your brand',
    description:
      'Need extra hands? We plug into your team and deliver video, web, and creative work under NDA. Senior talent, on time, and client-ready.',
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

