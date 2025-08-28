import { NextRequest, NextResponse } from 'next/server';
import { findContactByEmail, getDealsForContact, getNotesForContact } from '@/lib/hubspot';
import { calculateLeadScore, LeadScore } from '@/lib/lead-scoring';
import { ProgressiveProfile } from '@/lib/progressive-profiling';
import { UserBehaviorProfile } from '@/lib/behavioral-tracking';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';
  if (!email) {
    return new NextResponse('Missing email', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function mapToLeadData(contact: { id: string; properties: Record<string, any> }, extras?: { deals?: any[]; notes?: any[] }): {
        score: LeadScore;
        profile: ProgressiveProfile;
        behavior: UserBehaviorProfile;
      } {
        const props = contact.properties || {};
        const cEmail = props.email || '';
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
          email: cEmail,
          consent: true,
          pageViews: [],
          timeOnSite: 0,
          returnVisits: 0,
          contentDownloads: [],
          chatEngagements: 0,
        };

        const score = calculateLeadScore(baseScore);

        const profile: ProgressiveProfile = {
          email: cEmail,
          company,
          name,
          role: props.jobtitle || undefined,
          current_stage: 'initial',
          last_updated: new Date(),
          stage_completion: { initial: 100 },
          profile_completeness: 65,
        } as unknown as ProgressiveProfile;

        const behavior: UserBehaviorProfile = {
          email: cEmail,
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

      async function pushOnce() {
        try {
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
          const payload = { configured: true, found: true, data };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\n` + `data: ${JSON.stringify({ message: 'stream error' })}\n\n`));
        }
      }

      await pushOnce();
      const interval = setInterval(pushOnce, 15000);
      const ka = setInterval(() => controller.enqueue(encoder.encode(`:\n\n`)), 10000);
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


