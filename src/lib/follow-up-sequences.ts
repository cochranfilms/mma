import { z } from 'zod';
import { LeadScore } from './lead-scoring';
import { ProgressiveProfile, PROFILING_STAGES } from './progressive-profiling';
import { UserBehaviorProfile } from './behavioral-tracking';

// Follow-up sequence types
export const FOLLOW_UP_TYPES = {
  WELCOME: 'welcome',
  NURTURE: 'nurture',
  QUALIFICATION: 'qualification',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  RE_ENGAGEMENT: 're_engagement',
} as const;

// Email sequence templates
export const EMAIL_SEQUENCES = {
  [FOLLOW_UP_TYPES.WELCOME]: [
    {
      delay: 0, // Immediate
      subject: 'Welcome to MMA - Let\'s Transform Your B2B Marketing',
      template: 'welcome-1',
      priority: 'high',
    },
    {
      delay: 24, // 24 hours
      subject: 'Your Next Steps with MMA',
      template: 'welcome-2',
      priority: 'high',
    },
    {
      delay: 72, // 3 days
      subject: 'Ready to Schedule Your Consultation?',
      template: 'welcome-3',
      priority: 'medium',
    },
  ],
  
  [FOLLOW_UP_TYPES.NURTURE]: [
    {
      delay: 0,
      subject: 'Personalized Insights for {company}',
      template: 'nurture-1',
      priority: 'medium',
    },
    {
      delay: 48, // 2 days
      subject: 'Case Study: How We Helped {industry} Companies',
      template: 'nurture-2',
      priority: 'medium',
    },
    {
      delay: 168, // 1 week
      subject: 'Industry Trends That Matter for {company}',
      template: 'nurture-3',
      priority: 'low',
    },
  ],
  
  [FOLLOW_UP_TYPES.QUALIFICATION]: [
    {
      delay: 0,
      subject: 'Qualification Call: Let\'s Discuss Your {service} Needs',
      template: 'qualification-1',
      priority: 'high',
    },
    {
      delay: 24,
      subject: 'Your Customized Proposal is Ready',
      template: 'qualification-2',
      priority: 'high',
    },
    {
      delay: 72,
      subject: 'Follow-up: Proposal Review Call',
      template: 'qualification-3',
      priority: 'medium',
    },
  ],
  
  [FOLLOW_UP_TYPES.PROPOSAL]: [
    {
      delay: 0,
      subject: 'Your Custom Proposal: {service} for {company}',
      template: 'proposal-1',
      priority: 'high',
    },
    {
      delay: 48,
      subject: 'Proposal Review Call - Let\'s Discuss Details',
      template: 'proposal-2',
      priority: 'high',
    },
    {
      delay: 120, // 5 days
      subject: 'Final Reminder: Proposal Review',
      template: 'proposal-3',
      priority: 'medium',
    },
  ],
  
  [FOLLOW_UP_TYPES.NEGOTIATION]: [
    {
      delay: 0,
      subject: 'Contract Terms & Next Steps',
      template: 'negotiation-1',
      priority: 'high',
    },
    {
      delay: 24,
      subject: 'Contract Review Call Scheduled',
      template: 'negotiation-2',
      priority: 'high',
    },
    {
      delay: 72,
      subject: 'Final Contract & Project Kickoff',
      template: 'negotiation-3',
      priority: 'high',
    },
  ],
  
  [FOLLOW_UP_TYPES.RE_ENGAGEMENT]: [
    {
      delay: 0,
      subject: 'We Miss You at MMA - Special Offer Inside',
      template: 're-engagement-1',
      priority: 'low',
    },
    {
      delay: 168, // 1 week
      subject: 'Industry Update: What\'s New in B2B Marketing',
      template: 're-engagement-2',
      priority: 'low',
    },
    {
      delay: 720, // 1 month
      subject: 'Reconnect: How Can We Help {company} Today?',
      template: 're-engagement-3',
      priority: 'low',
    },
  ],
};

// Follow-up sequence schema
export const followUpSequenceSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  email: z.string(),
  company: z.string(),
  sequenceType: z.enum(Object.values(FOLLOW_UP_TYPES) as [string, ...string[]]),
  currentStep: z.number().default(0),
  totalSteps: z.number(),
  isActive: z.boolean().default(true),
  startDate: z.date(),
  lastEmailDate: z.date().optional(),
  nextEmailDate: z.date().optional(),
  emailsSent: z.array(z.object({
    step: z.number(),
    template: z.string(),
    subject: z.string(),
    sentDate: z.date(),
    opened: z.boolean().default(false),
    clicked: z.boolean().default(false),
    replied: z.boolean().default(false),
  })),
  customFields: z.record(z.string(), z.any()).default({}),
  status: z.enum(['active', 'paused', 'completed', 'unsubscribed']).default('active'),
});

export type FollowUpSequence = z.infer<typeof followUpSequenceSchema>;

// Email template schema
export const emailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  htmlBody: z.string(),
  textBody: z.string(),
  variables: z.array(z.string()),
  category: z.enum(Object.values(FOLLOW_UP_TYPES) as [string, ...string[]]),
  isActive: z.boolean().default(true),
});

export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

// Determine optimal follow-up sequence based on lead data
export function determineFollowUpSequence(
  leadScore: LeadScore,
  profile: ProgressiveProfile,
  behavior: UserBehaviorProfile
): string {
  // High-priority leads get immediate qualification sequence
  if (leadScore.qualification === 'HOT') {
    return FOLLOW_UP_TYPES.QUALIFICATION;
  }
  
  // Warm leads get nurture sequence
  if (leadScore.qualification === 'WARM') {
    return FOLLOW_UP_TYPES.NURTURE;
  }
  
  // Based on profiling stage
  switch (profile.current_stage) {
    case PROFILING_STAGES.INITIAL:
      return FOLLOW_UP_TYPES.WELCOME;
    case PROFILING_STAGES.ENGAGEMENT:
      return FOLLOW_UP_TYPES.NURTURE;
    case PROFILING_STAGES.QUALIFICATION:
      return FOLLOW_UP_TYPES.QUALIFICATION;
    case PROFILING_STAGES.PROPOSAL:
      return FOLLOW_UP_TYPES.PROPOSAL;
    case PROFILING_STAGES.NEGOTIATION:
      return FOLLOW_UP_TYPES.NEGOTIATION;
    default:
      return FOLLOW_UP_TYPES.WELCOME;
  }
}

// Create personalized email content
export function personalizeEmailContent(
  template: string,
  leadData: {
    name: string;
    company: string;
    industry?: string;
    service?: string;
    role?: string;
    [key: string]: any;
  }
): string {
  let content = template;
  
  // Replace variables with actual data
  Object.entries(leadData).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    if (content.includes(placeholder)) {
      content = content.replace(new RegExp(placeholder, 'g'), value || '');
    }
  });
  
  return content;
}

// Calculate optimal send time based on lead behavior
export function calculateOptimalSendTime(behavior: UserBehaviorProfile): Date {
  const now = new Date();
  const hour = now.getHours();
  
  // Analyze preferred times from behavior data
  let preferredHour = 10; // Default to 10 AM
  
  if (behavior.preferredTimes.length > 0) {
    // Find most common preferred time
    const timeCounts: Record<string, number> = {};
    behavior.preferredTimes.forEach(time => {
      timeCounts[time] = (timeCounts[time] || 0) + 1;
    });
    
    const mostPreferred = Object.entries(timeCounts).sort(([,a], [,b]) => b - a)[0];
    if (mostPreferred) {
      preferredHour = parseInt(mostPreferred[0]);
    }
  }
  
  // Set send time to preferred hour, but ensure it's in the future
  const sendTime = new Date(now);
  sendTime.setHours(preferredHour, 0, 0, 0);
  
  // If preferred time has passed today, schedule for tomorrow
  if (sendTime <= now) {
    sendTime.setDate(sendTime.getDate() + 1);
  }
  
  return sendTime;
}

// Get email subject with personalization
export function getPersonalizedSubject(
  baseSubject: string,
  leadData: {
    company: string;
    name: string;
    industry?: string;
    service?: string;
  }
): string {
  let subject = baseSubject;
  
  // Replace common placeholders
  if (leadData.company) {
    subject = subject.replace('{company}', leadData.company);
  }
  if (leadData.name) {
    subject = subject.replace('{name}', leadData.name);
  }
  if (leadData.industry) {
    subject = subject.replace('{industry}', leadData.industry);
  }
  if (leadData.service) {
    subject = subject.replace('{service}', leadData.service);
  }
  
  return subject;
}

// Check if email should be sent based on timing and conditions
export function shouldSendEmail(
  sequence: FollowUpSequence,
  leadData: LeadScore & ProgressiveProfile & UserBehaviorProfile
): boolean {
  // Check if lead has unsubscribed
  if (sequence.status === 'unsubscribed') {
    return false;
  }
  
  // Check if sequence is active
  if (!sequence.isActive || sequence.status !== 'active') {
    return false;
  }
  
  // Check if it's time for the next email
  if (sequence.nextEmailDate && new Date() < sequence.nextEmailDate) {
    return false;
  }
  
  // Check engagement level - don't spam highly engaged leads
  if (leadData.engagementScore > 80 && sequence.currentStep > 2) {
    return false;
  }
  
  // Check if lead has recently replied
  const recentReplies = sequence.emailsSent.filter(email => 
    email.replied && 
    (new Date().getTime() - email.sentDate.getTime()) < 24 * 60 * 60 * 1000 // 24 hours
  );
  
  if (recentReplies.length > 0) {
    return false;
  }
  
  return true;
}

// Get next email in sequence
export function getNextEmail(
  sequence: FollowUpSequence,
  sequenceType: string
): {
  step: number;
  template: string;
  subject: string;
  delay: number;
} | null {
  const sequenceSteps = EMAIL_SEQUENCES[sequenceType as keyof typeof EMAIL_SEQUENCES];
  
  if (!sequenceSteps || sequence.currentStep >= sequenceSteps.length) {
    return null;
  }
  
  const nextStep = sequenceSteps[sequence.currentStep];
  return {
    step: sequence.currentStep + 1,
    template: nextStep.template,
    subject: nextStep.subject,
    delay: nextStep.delay,
  };
}

// Update sequence after email sent
export function updateSequenceAfterEmail(
  sequence: FollowUpSequence,
  emailData: {
    step: number;
    template: string;
    subject: string;
    sentDate: Date;
  }
): FollowUpSequence {
  const updatedEmails = [
    ...sequence.emailsSent,
    {
      ...emailData,
      opened: false,
      clicked: false,
      replied: false,
    }
  ];
  
  const nextStep = sequence.currentStep + 1;
  const isCompleted = nextStep >= sequence.totalSteps;
  
  return {
    ...sequence,
    currentStep: nextStep,
    lastEmailDate: emailData.sentDate,
    emailsSent: updatedEmails,
    isActive: !isCompleted,
    status: isCompleted ? 'completed' : sequence.status,
  };
}

// Pause sequence (e.g., when lead replies)
export function pauseSequence(sequence: FollowUpSequence): FollowUpSequence {
  return {
    ...sequence,
    isActive: false,
    status: 'paused',
  };
}

// Resume sequence after engagement
export function resumeSequence(sequence: FollowUpSequence): FollowUpSequence {
  return {
    ...sequence,
    isActive: true,
    status: 'active',
  };
}

// Get sequence performance metrics
export function getSequenceMetrics(sequence: FollowUpSequence): {
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
} {
  const totalEmails = sequence.emailsSent.length;
  if (totalEmails === 0) {
    return { openRate: 0, clickRate: 0, replyRate: 0, conversionRate: 0 };
  }
  
  const openedEmails = sequence.emailsSent.filter(email => email.opened).length;
  const clickedEmails = sequence.emailsSent.filter(email => email.clicked).length;
  const repliedEmails = sequence.emailsSent.filter(email => email.replied).length;
  const converted = sequence.status === 'completed' ? 1 : 0;
  
  return {
    openRate: Math.round((openedEmails / totalEmails) * 100),
    clickRate: Math.round((clickedEmails / totalEmails) * 100),
    replyRate: Math.round((repliedEmails / totalEmails) * 100),
    conversionRate: Math.round((converted / totalEmails) * 100),
  };
}
