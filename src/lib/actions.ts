'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { leadSchema, LeadData } from './email';
import { sendLeadNotification, sendLeadConfirmation } from './email';
import { trackLead } from './sheets';
import { calculateLeadScore, getRecommendedActions, getEstimatedDealValue } from './lead-scoring';
import { calculateProfileCompleteness, advanceStage, progressiveProfileSchema } from './progressive-profiling';
import { calculateEngagementScore, calculateConversionProbability, getNextBestAction } from './behavioral-tracking';
import { determineFollowUpSequence } from './follow-up-sequences';

export async function submitLead(formData: FormData) {
  try {
    // Parse and validate form data
    const rawData = {
      company: formData.get('company') as string,
      role: formData.get('role') as string,
      needs: formData.getAll('needs') as string[],
      timeline: formData.get('timeline') as string,
      budget: formData.get('budget') as string,
      geography: formData.get('geography') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      currentSite: formData.get('currentSite') as string || undefined,
      consent: formData.get('consent') === 'on',
    };

    // Validate with Zod schema
    const validatedData = leadSchema.parse(rawData);

    // Calculate lead score
    const leadScore = calculateLeadScore(validatedData);
    
    // Create progressive profile
    const provisionalProfile = progressiveProfileSchema.parse({
      email: validatedData.email,
      company: validatedData.company,
      name: validatedData.name,
      role: validatedData.role,
      needs: validatedData.needs,
      timeline: validatedData.timeline,
      budget: validatedData.budget,
      geography: validatedData.geography,
      consent: validatedData.consent,
      current_stage: 'initial',
    });
    const progressiveProfile = {
      ...provisionalProfile,
      profile_completeness: calculateProfileCompleteness(provisionalProfile),
      last_updated: new Date(),
    };

    // Create behavior profile (initial)
    const behaviorProfile = {
      email: validatedData.email,
      firstVisit: new Date(),
      lastVisit: new Date(),
      totalVisits: 1,
      totalSessions: 1,
      totalTimeOnSite: 0,
      averageSessionDuration: 0,
      mostVisitedPages: [],
      downloadedContent: [],
      viewedCaseStudies: [],
      engagedWithServices: validatedData.needs,
      formStarts: 1,
      formCompletions: 1,
      formAbandons: 0,
      conversionRate: 100,
      preferredTimes: [],
      preferredDays: [],
      engagementScore: calculateEngagementScore([]),
      conversionProbability: calculateConversionProbability({
        email: validatedData.email,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        totalSessions: 1,
        totalTimeOnSite: 0,
        averageSessionDuration: 0,
        mostVisitedPages: [],
        downloadedContent: [],
        viewedCaseStudies: [],
        engagedWithServices: validatedData.needs,
        formStarts: 1,
        formCompletions: 1,
        formAbandons: 0,
        conversionRate: 100,
        preferredTimes: [],
        preferredDays: [],
        engagementScore: 0,
        conversionProbability: 0,
        nextBestAction: '',
      }),
      nextBestAction: getNextBestAction({
        email: validatedData.email,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        totalSessions: 1,
        totalTimeOnSite: 0,
        averageSessionDuration: 0,
        mostVisitedPages: [],
        downloadedContent: [],
        viewedCaseStudies: [],
        engagedWithServices: validatedData.needs,
        formStarts: 1,
        formCompletions: 1,
        formAbandons: 0,
        conversionRate: 100,
        preferredTimes: [],
        preferredDays: [],
        engagementScore: 0,
        conversionProbability: 0,
        nextBestAction: '',
      }),
    };

    // Determine follow-up sequence
    const followUpSequenceType = determineFollowUpSequence(leadScore, progressiveProfile, behaviorProfile);

    // Send notification to sales team with enhanced lead data
    const enhancedLeadData = {
      ...validatedData,
      leadScore,
      progressiveProfile,
      behaviorProfile,
      followUpSequenceType,
      recommendedActions: getRecommendedActions(leadScore),
      estimatedDealValue: getEstimatedDealValue(leadScore),
    };
    
    const notificationSent = await sendLeadNotification(enhancedLeadData);
    
    // Send confirmation to lead
    const confirmationSent = await sendLeadConfirmation(validatedData);
    
    // Track lead in Google Sheets or localStorage with enhanced data
    const trackingSuccess = await trackLead(validatedData);

    // Log the submission with enhanced analytics
    console.log('Enhanced Lead Submitted Successfully:', {
      company: validatedData.company,
      name: validatedData.name,
      email: validatedData.email,
      needs: validatedData.needs,
      leadScore: leadScore.totalScore,
      qualification: leadScore.qualification,
      priority: leadScore.priority,
      profileCompleteness: progressiveProfile.profile_completeness,
      engagementScore: behaviorProfile.engagementScore,
      conversionProbability: behaviorProfile.conversionProbability,
      followUpSequence: followUpSequenceType,
      recommendedActions: getRecommendedActions(leadScore),
      estimatedDealValue: getEstimatedDealValue(leadScore),
      notificationSent,
      confirmationSent,
      trackingSuccess,
    });

    // Revalidate the page to show updated state
    revalidatePath('/contact');
    
    // Redirect to thank you page with lead data for dashboard
    redirect(`/thank-you?leadId=${encodeURIComponent(validatedData.email)}&score=${leadScore.totalScore}&qualification=${leadScore.qualification}`);
    
  } catch (error) {
    console.error('Error submitting lead:', error);
    
    // Return error details for client-side handling
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Quick start action for direct Calendly booking
export async function quickStartBooking(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    
    if (!email || !company) {
      return {
        success: false,
        error: 'Email and company are required for quick start.',
      };
    }

    // Create a minimal lead record with scoring
    const quickLeadData = {
      company,
      email,
      role: 'Quick Start',
      needs: ['Not sure—advise me'],
      timeline: 'ASAP',
      budget: 'To be discussed',
      geography: 'To be discussed',
      name: email.split('@')[0], // Use email prefix as name
      consent: true,
    };

    // Calculate lead score for quick start
    const leadScore = calculateLeadScore(quickLeadData);
    
    // Create progressive profile
    const quickProvisionalProfile = progressiveProfileSchema.parse({
      email,
      company,
      name: quickLeadData.name,
      role: quickLeadData.role,
      needs: quickLeadData.needs,
      timeline: quickLeadData.timeline,
      budget: quickLeadData.budget,
      geography: quickLeadData.geography,
      consent: quickLeadData.consent,
      current_stage: 'initial',
    });
    const progressiveProfile = {
      ...quickProvisionalProfile,
      profile_completeness: calculateProfileCompleteness(quickProvisionalProfile),
      last_updated: new Date(),
    };

    // Create behavior profile
    const behaviorProfile = {
      email,
      firstVisit: new Date(),
      lastVisit: new Date(),
      totalVisits: 1,
      totalSessions: 1,
      totalTimeOnSite: 0,
      averageSessionDuration: 0,
      mostVisitedPages: [],
      downloadedContent: [],
      viewedCaseStudies: [],
      engagedWithServices: quickLeadData.needs,
      formStarts: 1,
      formCompletions: 1,
      formAbandons: 0,
      conversionRate: 100,
      preferredTimes: [],
      preferredDays: [],
      engagementScore: calculateEngagementScore([]),
      conversionProbability: calculateConversionProbability({
        email,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        totalSessions: 1,
        totalTimeOnSite: 0,
        averageSessionDuration: 0,
        mostVisitedPages: [],
        downloadedContent: [],
        viewedCaseStudies: [],
        engagedWithServices: quickLeadData.needs,
        formStarts: 1,
        formCompletions: 1,
        formAbandons: 0,
        conversionRate: 100,
        preferredTimes: [],
        preferredDays: [],
        engagementScore: 0,
        conversionProbability: 0,
        nextBestAction: '',
      }),
      nextBestAction: getNextBestAction({
        email,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        totalSessions: 1,
        totalTimeOnSite: 0,
        averageSessionDuration: 0,
        mostVisitedPages: [],
        downloadedContent: [],
        viewedCaseStudies: [],
        engagedWithServices: quickLeadData.needs,
        formStarts: 1,
        formCompletions: 1,
        formAbandons: 0,
        conversionRate: 100,
        preferredTimes: [],
        preferredDays: [],
        engagementScore: 0,
        conversionProbability: 0,
        nextBestAction: '',
      }),
    };

    // Track the quick start lead with enhanced data
    await trackLead(quickLeadData);

    // Log quick start with analytics
    console.log('Quick Start Lead Created:', {
      company,
      email,
      leadScore: leadScore.totalScore,
      qualification: leadScore.qualification,
      priority: leadScore.priority,
      profileCompleteness: progressiveProfile.profile_completeness,
      engagementScore: behaviorProfile.engagementScore,
      conversionProbability: behaviorProfile.conversionProbability,
    });

    // Return success with Calendly URL and enhanced lead data
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#';
    const utmParams = new URLSearchParams({
      utm_source: 'mma-website',
      utm_medium: 'quick-start',
      utm_campaign: 'website-conversion',
      utm_content: company,
    });

    return {
      success: true,
      calendlyUrl: `${calendlyUrl}?${utmParams.toString()}`,
      leadData: {
        score: leadScore,
        profile: progressiveProfile,
        behavior: behaviorProfile,
      },
    };
    
  } catch (error) {
    console.error('Error in quick start booking:', error);
    return {
      success: false,
      error: 'An error occurred. Please try again.',
    };
  }
}

// New action to get lead qualification data
export async function getLeadQualificationData(leadId: string) {
  try {
    // In a real implementation, this would fetch from your database
    // For now, we'll return mock data structure
    const mockLeadData = {
      score: {
        company: 'Example Corp',
        role: 'CMO',
        needs: ['Media Relations & B2B Connections', 'Brand Strategy & Positioning'],
        timeline: 'ASAP (within 30 days)',
        budget: '$50,000 - $100,000',
        geography: 'National',
        name: 'John Doe',
        email: leadId,
        consent: true,
        totalScore: 85,
        qualification: 'HOT',
        priority: 'HIGH',
        pageViews: [],
        timeOnSite: 0,
        returnVisits: 0,
        contentDownloads: [],
        chatEngagements: 0,
      },
      profile: {
        email: leadId,
        company: 'Example Corp',
        name: 'John Doe',
        role: 'CMO',
        needs: ['Media Relations & B2B Connections', 'Brand Strategy & Positioning'],
        timeline: 'ASAP (within 30 days)',
        budget: '$50,000 - $100,000',
        geography: 'National',
        consent: true,
        current_stage: 'initial',
        profile_completeness: 45,
        last_updated: new Date(),
        stage_completion: {},
      },
      behavior: {
        email: leadId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 3,
        totalSessions: 3,
        totalTimeOnSite: 1800,
        averageSessionDuration: 600,
        mostVisitedPages: [
          { page: '/services', visits: 2, timeSpent: 300 },
          { page: '/work', visits: 1, timeSpent: 200 },
        ],
        downloadedContent: ['B2B Marketing Guide'],
        viewedCaseStudies: ['Tech Company Success Story'],
        engagedWithServices: ['Media Relations & B2B Connections'],
        formStarts: 1,
        formCompletions: 1,
        formAbandons: 0,
        conversionRate: 100,
        preferredTimes: ['10:00', '14:00'],
        preferredDays: ['Monday', 'Wednesday'],
        engagementScore: 75,
        conversionProbability: 85,
        nextBestAction: 'Schedule consultation call',
      },
    };

    return {
      success: true,
      leadData: mockLeadData,
    };
    
  } catch (error) {
    console.error('Error fetching lead qualification data:', error);
    return {
      success: false,
      error: 'Failed to fetch lead data',
    };
  }
}
