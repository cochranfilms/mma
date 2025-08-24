import { z } from 'zod';

// Progressive profiling stages
export const PROFILING_STAGES = {
  INITIAL: 'initial',
  ENGAGEMENT: 'engagement',
  QUALIFICATION: 'qualification',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
} as const;

export type ProfilingStage = typeof PROFILING_STAGES[keyof typeof PROFILING_STAGES];

// Additional information to collect at each stage
export const STAGE_QUESTIONS = {
  [PROFILING_STAGES.INITIAL]: [
    'company',
    'role',
    'needs',
    'timeline',
    'budget',
    'geography',
    'name',
    'email',
    'consent'
  ],
  
  [PROFILING_STAGES.ENGAGEMENT]: [
    'industry',
    'company_size',
    'annual_revenue',
    'marketing_team_size',
    'current_marketing_budget',
    'pain_points',
    'goals_objectives'
  ],
  
  [PROFILING_STAGES.QUALIFICATION]: [
    'decision_making_process',
    'key_decision_makers',
    'competitors',
    'previous_agencies',
    'success_metrics',
    'implementation_timeline'
  ],
  
  [PROFILING_STAGES.PROPOSAL]: [
    'specific_requirements',
    'success_criteria',
    'budget_approval_process',
    'contract_preferences',
    'start_date_preference'
  ],
  
  [PROFILING_STAGES.NEGOTIATION]: [
    'final_budget',
    'payment_terms',
    'contract_length',
    'performance_guarantees',
    'exit_clauses'
  ]
};

// Progressive profiling schema
export const progressiveProfileSchema = z.object({
  // Basic info (always collected)
  email: z.string().email(),
  company: z.string(),
  name: z.string(),
  
  // Stage 1: Initial contact
  role: z.string().optional(),
  needs: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  geography: z.string().optional(),
  consent: z.boolean().optional(),
  
  // Stage 2: Engagement
  industry: z.string().optional(),
  company_size: z.string().optional(),
  annual_revenue: z.string().optional(),
  marketing_team_size: z.string().optional(),
  current_marketing_budget: z.string().optional(),
  pain_points: z.array(z.string()).optional(),
  goals_objectives: z.array(z.string()).optional(),
  
  // Stage 3: Qualification
  decision_making_process: z.string().optional(),
  key_decision_makers: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  previous_agencies: z.array(z.string()).optional(),
  success_metrics: z.array(z.string()).optional(),
  implementation_timeline: z.string().optional(),
  
  // Stage 4: Proposal
  specific_requirements: z.array(z.string()).optional(),
  success_criteria: z.array(z.string()).optional(),
  budget_approval_process: z.string().optional(),
  contract_preferences: z.string().optional(),
  start_date_preference: z.string().optional(),
  
  // Stage 5: Negotiation
  final_budget: z.string().optional(),
  payment_terms: z.string().optional(),
  contract_length: z.string().optional(),
  performance_guarantees: z.array(z.string()).optional(),
  exit_clauses: z.array(z.string()).optional(),
  
  // Metadata
  current_stage: z.enum(Object.values(PROFILING_STAGES) as [string, ...string[]]).default(PROFILING_STAGES.INITIAL),
  stage_completion: z.record(z.string(), z.number()).default({}),
  last_updated: z.date().default(() => new Date()),
  profile_completeness: z.number().default(0),
});

export type ProgressiveProfile = z.infer<typeof progressiveProfileSchema>;

// Calculate profile completeness percentage
export function calculateProfileCompleteness(profile: ProgressiveProfile): number {
  const totalFields = Object.keys(STAGE_QUESTIONS).reduce((total, stage) => {
    return total + STAGE_QUESTIONS[stage as keyof typeof STAGE_QUESTIONS].length;
  }, 0);
  
  const completedFields = Object.keys(profile).filter(key => {
    const value = profile[key as keyof ProgressiveProfile];
    return value !== undefined && value !== null && value !== '';
  }).length;
  
  return Math.round((completedFields / totalFields) * 100);
}

// Get next questions to ask based on current stage
export function getNextQuestions(profile: ProgressiveProfile): string[] {
  const currentStage = profile.current_stage;
  // currentStage is already constrained by schema; no need to index in values list
  
  // Get questions for current stage
  const currentStageQuestions = STAGE_QUESTIONS[currentStage as keyof typeof STAGE_QUESTIONS];
  
  // Filter out already answered questions
  const unansweredQuestions = currentStageQuestions.filter(question => {
    const value = profile[question as keyof ProgressiveProfile];
    return value === undefined || value === null || value === '';
  });
  
  return unansweredQuestions;
}

// Determine if ready to advance to next stage
export function canAdvanceStage(profile: ProgressiveProfile): boolean {
  const currentStage = profile.current_stage;
  const currentStageQuestions = STAGE_QUESTIONS[currentStage as keyof typeof STAGE_QUESTIONS];
  
  // Check if all questions in current stage are answered
  const allAnswered = currentStageQuestions.every(question => {
    const value = profile[question as keyof ProgressiveProfile];
    return value !== undefined && value !== null && value !== '';
  });
  
  return allAnswered;
}

// Advance to next stage if possible
export function advanceStage(profile: ProgressiveProfile): ProgressiveProfile {
  if (!canAdvanceStage(profile)) {
    return profile;
  }
  
  // Work with the literal values ("initial" | "engagement" | ...) rather than
  // the keys to avoid mismatched keyof/value unions during comparison.
  const stageValues = Object.values(PROFILING_STAGES) as ProfilingStage[];
  const currentStageIndex = stageValues.indexOf(profile.current_stage as ProfilingStage);
  const nextStageIndex = currentStageIndex + 1;
  
  if (nextStageIndex < stageValues.length) {
    const nextStage = stageValues[nextStageIndex];
    return {
      ...profile,
      current_stage: nextStage,
      last_updated: new Date(),
    };
  }
  
  return profile;
}

// Get personalized content recommendations based on profile stage
export function getContentRecommendations(profile: ProgressiveProfile): string[] {
  const stage = profile.current_stage;
  const recommendations: string[] = [];
  
  switch (stage) {
    case PROFILING_STAGES.INITIAL:
      recommendations.push(
        'Welcome email series',
        'Company overview',
        'Service introduction'
      );
      break;
      
    case PROFILING_STAGES.ENGAGEMENT:
      recommendations.push(
        'Industry-specific case studies',
        'Pain point solutions',
        'Educational content'
      );
      break;
      
    case PROFILING_STAGES.QUALIFICATION:
      recommendations.push(
        'Detailed service breakdowns',
        'ROI calculators',
        'Client testimonials'
      );
      break;
      
    case PROFILING_STAGES.PROPOSAL:
      recommendations.push(
        'Custom proposal template',
        'Implementation timeline',
        'Success stories'
      );
      break;
      
    case PROFILING_STAGES.NEGOTIATION:
      recommendations.push(
        'Contract templates',
        'Payment terms',
        'Performance guarantees'
      );
      break;
  }
  
  return recommendations;
}

// Get optimal follow-up timing based on stage
export function getFollowUpTiming(profile: ProgressiveProfile): {
  immediate: string[];
  within24h: string[];
  within1week: string[];
  within1month: string[];
} {
  const stage = profile.current_stage;
  
  switch (stage) {
    case PROFILING_STAGES.INITIAL:
      return {
        immediate: ['Welcome email'],
        within24h: ['Service overview', 'Next steps'],
        within1week: ['Case study', 'Follow-up call'],
        within1month: ['Newsletter', 'Educational content']
      };
      
    case PROFILING_STAGES.ENGAGEMENT:
      return {
        immediate: ['Personalized content'],
        within24h: ['Pain point analysis', 'Solution overview'],
        within1week: ['Industry insights', 'Consultation call'],
        within1month: ['ROI calculator', 'Success stories']
      };
      
    case PROFILING_STAGES.QUALIFICATION:
      return {
        immediate: ['Qualification call'],
        within24h: ['Detailed proposal', 'Implementation plan'],
        within1week: ['Client references', 'Contract discussion'],
        within1month: ['Follow-up meeting', 'Final proposal']
      };
      
    case PROFILING_STAGES.PROPOSAL:
      return {
        immediate: ['Proposal review call'],
        within24h: ['Contract draft', 'Timeline confirmation'],
        within1week: ['Negotiation meeting', 'Terms discussion'],
        within1month: ['Contract signing', 'Project kickoff']
      };
      
    case PROFILING_STAGES.NEGOTIATION:
      return {
        immediate: ['Contract review'],
        within24h: ['Final terms', 'Payment setup'],
        within1week: ['Project planning', 'Team introduction'],
        within1month: ['Project kickoff', 'Success metrics setup']
      };
      
    default:
      return {
        immediate: [],
        within24h: [],
        within1week: [],
        within1month: []
      };
  }
}
