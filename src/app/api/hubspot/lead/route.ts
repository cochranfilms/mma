import { NextRequest, NextResponse } from 'next/server';
import { findContactByEmail, getDealsForContact, getNotesForContact } from '@/lib/hubspot';
import { calculateLeadScore, LeadScore } from '@/lib/lead-scoring';
import { ProgressiveProfile } from '@/lib/progressive-profiling';
import { UserBehaviorProfile } from '@/lib/behavioral-tracking';

// Map HubSpot contact properties to our dashboard shapes with sensible defaults
function mapToLeadData(contact: { id: string; properties: Record<string, any> }, extras?: { deals?: any[]; notes?: any[] }): {
  score: LeadScore;
  profile: ProgressiveProfile;
  behavior: UserBehaviorProfile;
} {
  const props = contact.properties || {};
  const email = props.email || '';
  const name = [props.firstname, props.lastname].filter(Boolean).join(' ') || props.firstname || 'Contact';
  const company = props.company || props.companyname || 'Unknown Company';

  const baseScore: Partial<LeadScore> = {
    company,
    role: props.jobtitle || 'Unknown',
    needs: [],
    timeline: 'Just exploring options',
    budget: 'To be discussed',
    geography: 'Not sure',
    name,
    email,
    consent: true,
    pageViews: [],
    timeOnSite: 0,
    returnVisits: 0,
    contentDownloads: [],
    chatEngagements: 0,
  };

  const score = calculateLeadScore(baseScore);

  const profile: ProgressiveProfile = {
    email,
    company,
    name,
    role: props.jobtitle || undefined,
    current_stage: 'initial',
    last_updated: new Date(),
    stage_completion: { initial: 100 },
    profile_completeness: 65,
  } as unknown as ProgressiveProfile;

  const behavior: UserBehaviorProfile = {
    email,
    firstVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastVisit: new Date(),
    totalVisits: 1,
    totalSessions: 1,
    totalTimeOnSite: 120,
    averageSessionDuration: 120,
    mostVisitedPages: [],
    downloadedContent: [],
    viewedCaseStudies: [],
    engagedWithServices: [],
    formStarts: 0,
    formCompletions: 0,
    formAbandons: 0,
    conversionRate: 0,
    preferredTimes: [],
    preferredDays: [],
    engagementScore: 10,
    conversionProbability: 10,
    nextBestAction: 'Nurture with newsletter',
  } as UserBehaviorProfile;

  return { score, profile, behavior, ...(extras || {}) } as any;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || '';
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // If env is missing, signal not configured
    if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      return NextResponse.json({ configured: false, message: 'HubSpot token not configured' }, { status: 200 });
    }

    const contact = await findContactByEmail(email);
    if (!contact) {
      return NextResponse.json({ configured: true, found: false }, { status: 200 });
    }

    const [deals, notes] = await Promise.all([
      getDealsForContact(contact.id).catch(() => []),
      getNotesForContact(contact.id).catch(() => []),
    ]);
    const data = mapToLeadData(contact, { deals, notes });
    return NextResponse.json({ configured: true, found: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

// Simple Server-Sent Events stream for live updates
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET_STREAM(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';
  if (!email) {
    return new NextResponse('Missing email', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      async function pushOnce() {
        if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ configured: false })}\n\n`));
          return;
        }
        const contact = await findContactByEmail(email).catch(() => null);
        if (!contact) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ configured: true, found: false })}\n\n`));
          return;
        }
        const [deals, notes] = await Promise.all([
          getDealsForContact(contact.id).catch(() => []),
          getNotesForContact(contact.id).catch(() => []),
        ]);
        const data = mapToLeadData(contact, { deals, notes });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ configured: true, found: true, data })}\n\n`));
      }

      // initial
      await pushOnce();
      // poll every 15s
      const interval = setInterval(pushOnce, 15000);
      // keepalive comments
      const ka = setInterval(() => controller.enqueue(encoder.encode(`:\n\n`)), 10000);
      // close handler
      (controller as any)._cleanup = () => { clearInterval(interval); clearInterval(ka); };
    },
    cancel() {
      const cleanup = (this as any)._cleanup;
      if (cleanup) cleanup();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}


