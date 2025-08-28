import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { services } from '@/content/services';
import { caseStudies } from '@/content/case-studies';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }

    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages[] required' }, { status: 400 });
    }

    // Curate structured context from site content
    const toolCatalog = [
      { id: 'roi-calculator', name: 'ROI Calculator', path: '/tools', description: 'Estimate potential ROI for services.' },
      { id: 'proposal-generator', name: 'Custom Proposal Generator', path: '/tools', description: 'Generate a tailored proposal.' },
      { id: 'service-quiz', name: 'Service Matching Quiz', path: '/tools', description: 'Find the right service for your goals.' },
      { id: 'calendar-booking', name: 'Calendar Booking', path: '/tools', description: 'Schedule a consultation.' },
      { id: 'instant-quote', name: 'Instant Quote Calculator', path: '/tools', description: 'Get real-time pricing estimates.' },
    ];

    const servicesSummary = services.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      startingPrice: s.startingPrice,
      packages: s.pricing?.packages?.slice(0, 4).map(p => ({ id: p.id, name: p.name, price: p.price })) ?? undefined,
      featured: s.featured,
      category: s.category,
    }));

    const portfolioSummary = caseStudies.map((c) => ({
      id: c.id,
      title: c.title,
      client: c.client,
      industry: c.industry,
      results: c.results?.metrics?.slice(0, 3) ?? [],
      tags: c.tags,
      featured: c.featured,
    }));

    const systemPrompt = `You are Marketing Mousetrap Agency's AI assistant inside the website live chat.
Be concise, helpful, and specific. Use the structured context below to answer about services, pricing, tools, and work.

When users ask about:
- Services: list relevant services with short descriptions and real package price ranges if available.
- Pricing: quote starting prices and example package prices; invite to the Instant Quote or booking if needed.
- Work/portfolio: mention relevant case studies with 1-2 outcome metrics.
- Tools: suggest relevant tools with links.
- Scheduling: offer the booking link.

Always include page paths when relevant (e.g., /services, /work, /tools, /services/[id]). Keep replies under 120 words unless details are requested.

Context:
SERVICES: ${JSON.stringify(servicesSummary)}
PORTFOLIO: ${JSON.stringify(portfolioSummary)}
TOOLS: ${JSON.stringify(toolCatalog)}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply: content });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}


