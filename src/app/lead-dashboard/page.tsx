'use client';

import { useState, useEffect } from 'react';
import LeadQualificationDashboard from '@/components/LeadQualificationDashboard';
import { LeadScore } from '@/lib/lead-scoring';
import { ProgressiveProfile } from '@/lib/progressive-profiling';
import { UserBehaviorProfile } from '@/lib/behavioral-tracking';

export default function LeadDashboardPage() {
  const [leadData, setLeadData] = useState<{
    score: LeadScore;
    profile: ProgressiveProfile;
    behavior: UserBehaviorProfile;
    deals?: any[];
    notes?: any[];
  } | null>(null);

  useEffect(() => {
    const buildSample = (): {
      score: LeadScore;
      profile: ProgressiveProfile;
      behavior: UserBehaviorProfile;
      deals?: any[];
      notes?: any[];
    } => ({
      score: {
        company: 'TechCorp Solutions',
        role: 'CMO',
        needs: ['Media Relations & B2B Connections', 'Brand Strategy & Positioning', 'Content & Campaigns'],
        timeline: 'ASAP (within 30 days)',
        budget: '$50,000 - $100,000',
        geography: 'National',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        consent: true,
        totalScore: 87,
        qualification: 'HOT',
        priority: 'HIGH',
        pageViews: ['/services', '/work', '/about'],
        timeOnSite: 1800,
        returnVisits: 2,
        contentDownloads: ['B2B Marketing Guide', 'Case Study: TechCorp'],
        chatEngagements: 1,
      },
      profile: {
        email: 'sarah.johnson@techcorp.com',
        company: 'TechCorp Solutions',
        name: 'Sarah Johnson',
        role: 'CMO',
        needs: ['Media Relations & B2B Connections', 'Brand Strategy & Positioning', 'Content & Campaigns'],
        timeline: 'ASAP (within 30 days)',
        budget: '$50,000 - $100,000',
        geography: 'National',
        consent: true,
        current_stage: 'engagement',
        profile_completeness: 65,
        last_updated: new Date(),
        stage_completion: {
          initial: 100,
          engagement: 65,
        },
      },
      behavior: {
        email: 'sarah.johnson@techcorp.com',
        firstVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastVisit: new Date(),
        totalVisits: 5,
        totalSessions: 5,
        totalTimeOnSite: 4200, // 70 minutes total
        averageSessionDuration: 840, // 14 minutes average
        mostVisitedPages: [
          { page: '/services', visits: 3, timeSpent: 1200 },
          { page: '/work', visits: 2, timeSpent: 900 },
          { page: '/about', visits: 2, timeSpent: 600 },
        ],
        downloadedContent: ['B2B Marketing Guide', 'Case Study: TechCorp', 'ROI Calculator'],
        viewedCaseStudies: ['TechCorp Success Story', 'Manufacturing Company Growth'],
        engagedWithServices: ['Media Relations & B2B Connections', 'Brand Strategy & Positioning'],
        formStarts: 2,
        formCompletions: 1,
        formAbandons: 1,
        conversionRate: 50,
        preferredTimes: ['09:00', '14:00', '16:00'],
        preferredDays: ['Monday', 'Wednesday', 'Friday'],
        engagementScore: 82,
        conversionProbability: 78,
        nextBestAction: 'Schedule consultation call',
      },
    });

    let es: EventSource | null = null;

    async function load() {
      try {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if (!email) {
          setLeadData(buildSample());
          return;
        }

        const resp = await fetch(`/api/hubspot/lead?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Request failed');
        const json = await resp.json();
        if (json?.configured && json?.found && json?.data) {
          setLeadData(json.data);
        } else {
          // Not configured or not found -> fallback to sample
          setLeadData(buildSample());
        }

        // Start live updates via SSE
        es = new EventSource(`/api/hubspot/lead/stream?email=${encodeURIComponent(email)}`);
        es.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            if (payload?.configured && payload?.found && payload?.data) {
              setLeadData(payload.data);
            }
          } catch {}
        };
        es.onerror = () => {
          if (es) es.close();
        };
      } catch (e) {
        setLeadData(buildSample());
      }
    }

    load();
    return () => { if (es) es.close(); };
  }, []);

  if (!leadData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lead Qualification Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive lead analysis and qualification system for Marketing Mousetrap Agency
          </p>
        </div>

        {/* Dashboard */}
        <LeadQualificationDashboard leadData={leadData} />

        {/* System Overview */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Scoring</h3>
              <p className="text-gray-600 text-sm">
                Automated scoring based on company size, role, budget, timeline, and behavioral factors
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 100 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progressive Profiling</h3>
              <p className="text-gray-600 text-sm">
                Collect additional information over time through multiple touchpoints and interactions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Behavioral Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor user engagement, content consumption, and conversion patterns in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Smart Lead Scoring</h4>
                  <p className="text-sm text-gray-600">Automated qualification based on multiple weighted factors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Progressive Profiling</h4>
                  <p className="text-sm text-gray-600">Collect information gradually without overwhelming prospects</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Behavioral Analytics</h4>
                  <p className="text-sm text-gray-600">Track user engagement and conversion probability</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Automated Follow-ups</h4>
                  <p className="text-sm text-gray-600">Personalized email sequences based on lead qualification</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Action Recommendations</h4>
                  <p className="text-sm text-gray-600">AI-powered suggestions for next best actions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Real-time Dashboard</h4>
                  <p className="text-sm text-gray-600">Live insights and metrics for sales team optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-12 bg-accent-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Integration</h2>
          <p className="text-gray-700 mb-6">
            This Lead Qualification System is designed to integrate seamlessly with your existing marketing stack:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">CRM Integration</h4>
              <p className="text-sm text-gray-600">Connect with HubSpot, Salesforce, or custom CRM systems</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Email Marketing</h4>
              <p className="text-sm text-gray-600">Integrate with Mailchimp, ConvertKit, or other email platforms</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Analytics Tools</h4>
              <p className="text-sm text-gray-600">Connect with Google Analytics, Mixpanel, or custom tracking</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Calendar Systems</h4>
              <p className="text-sm text-gray-600">Integrate with Calendly, Acuity, or custom booking systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
