export const caseStudies = [
  {
    id: 'acme-industrial',
    featured: true,
    title: 'Doubling Qualified Pipeline in 90 Days',
    subtitle: 'From legacy web presence to a modern demand engine',
    client: 'ACME Industrial',
    industry: 'Industrial Manufacturing',
    challenge:
      'Low-quality inbound, dated messaging, and unclear buyer journey stalled growth.',
    strategy:
      'Repositioned offers, rebuilt website experience, and launched content + PR program.',
    results: {
      metrics: [
        '+118% qualified demo requests',
        '3.1x increase in organic conversions',
        '41% faster sales cycles',
        'Top-tier trade publication coverage',
      ],
    },
    services: ['Web Presence', 'Media Relations', 'Content Ops'],
    tags: ['B2B', 'Industrial', 'Demand Gen'],
    image: null,
    testimonial: {
      author: 'Jordan Patel',
      title: 'VP Marketing',
      company: 'ACME Industrial',
      quote:
        'Marketing Mousetrap transformed how buyers perceive us. We finally have a system that compounds.',
    },
  },
  {
    id: 'northstar-saas',
    featured: false,
    title: 'Reducing CAC with Content-Led Acquisition',
    subtitle: 'Operationalizing distribution across owned and earned channels',
    client: 'Northstar SaaS',
    industry: 'Software',
    challenge: 'Paid spend plateaued; organic and referrals underperforming.',
    strategy:
      'Introduced editorial calendar, expert interviews, and repurposing pipeline feeding social + PR.',
    results: {
      metrics: ['-27% blended CAC', '2.4x website engagement', 'Steady earned media mentions'],
    },
    services: ['Content Ops', 'PR', 'Web'],
    tags: ['SaaS', 'Content', 'PR'],
    image: null,
    testimonial: {
      author: 'Ari Chen',
      title: 'CEO',
      company: 'Northstar',
      quote: 'They brought the operating cadence we were missing—consistent results, less guesswork.',
    },
  },
];

export type CaseStudies = typeof caseStudies;

