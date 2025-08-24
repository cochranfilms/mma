import { z } from 'zod';

// Lead scoring criteria and weights
export const LEAD_SCORING_CRITERIA = {
  // Company information
  COMPANY_SIZE: {
    'Under 10 employees': 10,
    '10-50 employees': 25,
    '51-200 employees': 50,
    '201-1000 employees': 75,
    '1000+ employees': 100,
  },
  
  // Role seniority
  ROLE_SENIORITY: {
    'CEO/Founder': 100,
    'CMO': 90,
    'VP Marketing': 85,
    'Marketing Director': 75,
    'Marketing Manager': 60,
    'Marketing Coordinator': 40,
    'Other': 30,
  },
  
  // Budget ranges
  BUDGET_WEIGHTS: {
    'Under $5,000': 20,
    '$5,000 - $15,000': 40,
    '$15,000 - $50,000': 70,
    '$50,000 - $100,000': 85,
    '$100,000+': 100,
    'To be discussed': 50,
  },
  
  // Timeline urgency
  TIMELINE_WEIGHTS: {
    'ASAP (within 30 days)': 100,
    '1-3 months': 80,
    '3-6 months': 60,
    '6+ months': 40,
    'Just exploring options': 30,
  },
  
  // Service needs complexity
  SERVICE_COMPLEXITY: {
    'Media Relations & B2B Connections': 80,
    'Web Presence & Website Upgrades': 60,
    'Photo & On-Site Printing & Activations': 70,
    'Content & Campaigns': 75,
    'Strategic Partnership Development': 90,
    'Brand Strategy & Positioning': 85,
    'Not sure—advise me': 40,
  },
  
  // Geography scope
  GEOGRAPHY_WEIGHTS: {
    'Local/Regional': 40,
    'National': 70,
    'International': 85,
    'Global': 100,
    'Not sure': 50,
  },
  
  // Behavioral factors
  BEHAVIORAL_FACTORS: {
    'visited_services_page': 10,
    'viewed_case_studies': 15,
    'downloaded_content': 20,
    'returned_visitor': 25,
    'engaged_with_chat': 30,
    'scheduled_call': 50,
  }
};

// Lead score thresholds
export const LEAD_SCORE_THRESHOLDS = {
  HOT: 80,      // Immediate follow-up
  WARM: 60,     // Nurture sequence
  COLD: 40,     // Educational content
  UNQUALIFIED: 20, // Archive
};

// Lead scoring schema
export const leadScoreSchema = z.object({
  company: z.string(),
  role: z.string(),
  needs: z.array(z.string()),
  timeline: z.string(),
  budget: z.string(),
  geography: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  currentSite: z.string().optional(),
  consent: z.boolean(),
  // Behavioral tracking
  pageViews: z.array(z.string()).default([]),
  timeOnSite: z.number().default(0),
  returnVisits: z.number().default(0),
  contentDownloads: z.array(z.string()).default([]),
  chatEngagements: z.number().default(0),
  // Calculated scores
  totalScore: z.number().default(0),
  qualification: z.enum(['HOT', 'WARM', 'COLD', 'UNQUALIFIED']).default('COLD'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('LOW'),
});

export type LeadScore = z.infer<typeof leadScoreSchema>;

// Calculate lead score based on form data and behavior
export function calculateLeadScore(leadData: Partial<LeadScore>): LeadScore {
  let totalScore = 0;
  
  // Company size scoring (estimate based on role and other factors)
  if (leadData.role && LEAD_SCORING_CRITERIA.ROLE_SENIORITY[leadData.role as keyof typeof LEAD_SCORING_CRITERIA.ROLE_SENIORITY]) {
    totalScore += LEAD_SCORING_CRITERIA.ROLE_SENIORITY[leadData.role as keyof typeof LEAD_SCORING_CRITERIA.ROLE_SENIORITY];
  }
  
  // Budget scoring
  if (leadData.budget && LEAD_SCORING_CRITERIA.BUDGET_WEIGHTS[leadData.budget as keyof typeof LEAD_SCORING_CRITERIA.BUDGET_WEIGHTS]) {
    totalScore += LEAD_SCORING_CRITERIA.BUDGET_WEIGHTS[leadData.budget as keyof typeof LEAD_SCORING_CRITERIA.BUDGET_WEIGHTS];
  }
  
  // Timeline scoring
  if (leadData.timeline && LEAD_SCORING_CRITERIA.TIMELINE_WEIGHTS[leadData.timeline as keyof typeof LEAD_SCORING_CRITERIA.TIMELINE_WEIGHTS]) {
    totalScore += LEAD_SCORING_CRITERIA.TIMELINE_WEIGHTS[leadData.timeline as keyof typeof LEAD_SCORING_CRITERIA.TIMELINE_WEIGHTS];
  }
  
  // Service needs scoring (average of selected services)
  if (leadData.needs && leadData.needs.length > 0) {
    const serviceScores = leadData.needs.map(need => 
      LEAD_SCORING_CRITERIA.SERVICE_COMPLEXITY[need as keyof typeof LEAD_SCORING_CRITERIA.SERVICE_COMPLEXITY] || 0
    );
    const avgServiceScore = serviceScores.reduce((a, b) => a + b, 0) / serviceScores.length;
    totalScore += avgServiceScore;
  }
  
  // Geography scoring
  if (leadData.geography && LEAD_SCORING_CRITERIA.GEOGRAPHY_WEIGHTS[leadData.geography as keyof typeof LEAD_SCORING_CRITERIA.GEOGRAPHY_WEIGHTS]) {
    totalScore += LEAD_SCORING_CRITERIA.GEOGRAPHY_WEIGHTS[leadData.geography as keyof typeof LEAD_SCORING_CRITERIA.GEOGRAPHY_WEIGHTS];
  }
  
  // Behavioral scoring
  if (leadData.pageViews && leadData.pageViews.length > 0) {
    totalScore += LEAD_SCORING_CRITERIA.BEHAVIORAL_FACTORS.visited_services_page;
  }
  
  if (leadData.returnVisits && leadData.returnVisits > 0) {
    totalScore += LEAD_SCORING_CRITERIA.BEHAVIORAL_FACTORS.returned_visitor;
  }
  
  if (leadData.contentDownloads && leadData.contentDownloads.length > 0) {
    totalScore += LEAD_SCORING_CRITERIA.BEHAVIORAL_FACTORS.downloaded_content;
  }
  
  if (leadData.chatEngagements && leadData.chatEngagements > 0) {
    totalScore += LEAD_SCORING_CRITERIA.BEHAVIORAL_FACTORS.engaged_with_chat;
  }
  
  // Determine qualification level
  let qualification: 'HOT' | 'WARM' | 'COLD' | 'UNQUALIFIED' = 'COLD';
  if (totalScore >= LEAD_SCORE_THRESHOLDS.HOT) {
    qualification = 'HOT';
  } else if (totalScore >= LEAD_SCORE_THRESHOLDS.WARM) {
    qualification = 'WARM';
  } else if (totalScore >= LEAD_SCORE_THRESHOLDS.COLD) {
    qualification = 'COLD';
  } else {
    qualification = 'UNQUALIFIED';
  }
  
  // Determine priority
  let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (qualification === 'HOT') {
    priority = 'HIGH';
  } else if (qualification === 'WARM') {
    priority = 'MEDIUM';
  } else {
    priority = 'LOW';
  }
  
  return {
    ...leadData,
    totalScore: Math.round(totalScore),
    qualification,
    priority,
    pageViews: leadData.pageViews || [],
    timeOnSite: leadData.timeOnSite || 0,
    returnVisits: leadData.returnVisits || 0,
    contentDownloads: leadData.contentDownloads || [],
    chatEngagements: leadData.chatEngagements || 0,
  } as LeadScore;
}

// Get recommended next actions based on lead score
export function getRecommendedActions(leadScore: LeadScore): string[] {
  const actions: string[] = [];
  
  switch (leadScore.qualification) {
    case 'HOT':
      actions.push(
        'Immediate phone call within 2 hours',
        'Send personalized proposal within 24 hours',
        'Schedule discovery call within 48 hours',
        'Assign to senior sales rep'
      );
      break;
      
    case 'WARM':
      actions.push(
        'Send personalized email within 4 hours',
        'Schedule follow-up call within 1 week',
        'Send relevant case studies',
        'Invite to webinar or event'
      );
      break;
      
    case 'COLD':
      actions.push(
        'Send educational content series',
        'Invite to newsletter',
        'Share industry insights',
        'Nurture with value-based content'
      );
      break;
      
    case 'UNQUALIFIED':
      actions.push(
        'Archive lead',
        'Send generic newsletter',
        'Monitor for future engagement',
        'Re-engage in 3 months'
      );
      break;
  }
  
  return actions;
}

// Get estimated deal value based on lead score
export function getEstimatedDealValue(leadScore: LeadScore): string {
  if (leadScore.qualification === 'HOT') {
    return '$25,000 - $100,000+';
  } else if (leadScore.qualification === 'WARM') {
    return '$10,000 - $50,000';
  } else if (leadScore.qualification === 'COLD') {
    return '$5,000 - $25,000';
  } else {
    return 'Unknown';
  }
}
