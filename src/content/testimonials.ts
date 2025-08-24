export const testimonials = [
  {
    id: 't1',
    featured: true,
    author: 'Jordan Patel',
    title: 'VP Marketing',
    company: 'ACME Industrial',
    quote:
      'They moved us from marketing activities to marketing outcomes. Our pipeline tells the story.',
  },
  {
    id: 't2',
    featured: true,
    author: 'Ari Chen',
    title: 'CEO',
    company: 'Northstar',
    quote:
      'Clear strategy, consistent execution, and measurable impact. Best external partner we have.',
  },
  {
    id: 't3',
    featured: false,
    author: 'Morgan Lee',
    title: 'Head of Growth',
    company: 'Helix Robotics',
    quote: 'The web overhaul alone paid for itself in 60 days.',
  },
];

export type Testimonials = typeof testimonials;

