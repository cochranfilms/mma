import { z } from 'zod';

// User behavior events
export const BEHAVIOR_EVENTS = {
  // Page interactions
  PAGE_VIEW: 'page_view',
  PAGE_LEAVE: 'page_leave',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  
  // Content interactions
  CLICK: 'click',
  FORM_START: 'form_start',
  FORM_PROGRESS: 'form_progress',
  FORM_COMPLETE: 'form_complete',
  FORM_ABANDON: 'form_abandon',
  
  // Engagement actions
  DOWNLOAD_CONTENT: 'download_content',
  SHARE_CONTENT: 'share_content',
  BOOKMARK: 'bookmark',
  PRINT: 'print',
  
  // Navigation
  MENU_CLICK: 'menu_click',
  BREADCRUMB_NAV: 'breadcrumb_nav',
  SEARCH: 'search',
  
  // External interactions
  EXTERNAL_LINK: 'external_link',
  PHONE_CLICK: 'phone_click',
  EMAIL_CLICK: 'email_click',
  
  // Chat and support
  CHAT_START: 'chat_start',
  CHAT_MESSAGE: 'chat_message',
  CHAT_END: 'chat_end',
  
  // Social proof
  TESTIMONIAL_VIEW: 'testimonial_view',
  CASE_STUDY_VIEW: 'case_study_view',
  CLIENT_LOGO_CLICK: 'client_logo_click',
  
  // Conversion attempts
  CALENDAR_BOOK: 'calendar_book',
  QUOTE_REQUEST: 'quote_request',
  CONTACT_ATTEMPT: 'contact_attempt',
} as const;

// Behavior tracking schema
export const behaviorEventSchema = z.object({
  eventType: z.enum(Object.values(BEHAVIOR_EVENTS) as [string, ...string[]]),
  userId: z.string().optional(),
  email: z.string().optional(),
  sessionId: z.string(),
  timestamp: z.date(),
  pageUrl: z.string(),
  pageTitle: z.string(),
  
  // Event-specific data
  eventData: z.record(z.string(), z.any()).optional(),
  
  // User context
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  
  // Session context
  sessionStartTime: z.date().optional(),
  sessionDuration: z.number().optional(),
  pageLoadTime: z.number().optional(),
  
  // Device and location
  deviceType: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  screenResolution: z.string().optional(),
  timezone: z.string().optional(),
});

export type BehaviorEvent = z.infer<typeof behaviorEventSchema>;

// User session tracking
export const userSessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string().optional(),
  email: z.string().optional(),
  startTime: z.date(),
  lastActivity: z.date(),
  totalDuration: z.number(),
  pageViews: z.array(z.string()),
  events: z.array(behaviorEventSchema),
  conversionGoals: z.array(z.string()),
  isActive: z.boolean(),
});

export type UserSession = z.infer<typeof userSessionSchema>;

// User behavior profile
export const userBehaviorProfileSchema = z.object({
  email: z.string(),
  userId: z.string().optional(),
  firstVisit: z.date(),
  lastVisit: z.date(),
  totalVisits: z.number(),
  totalSessions: z.number(),
  totalTimeOnSite: z.number(),
  averageSessionDuration: z.number(),
  
  // Page preferences
  mostVisitedPages: z.array(z.object({
    page: z.string(),
    visits: z.number(),
    timeSpent: z.number(),
  })),
  
  // Content preferences
  downloadedContent: z.array(z.string()),
  viewedCaseStudies: z.array(z.string()),
  engagedWithServices: z.array(z.string()),
  
  // Conversion behavior
  formStarts: z.number(),
  formCompletions: z.number(),
  formAbandons: z.number(),
  conversionRate: z.number(),
  
  // Engagement patterns
  preferredTimes: z.array(z.string()),
  preferredDays: z.array(z.string()),
  devicePreference: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  
  // Lead qualification indicators
  engagementScore: z.number(),
  conversionProbability: z.number(),
  nextBestAction: z.string(),
});

export type UserBehaviorProfile = z.infer<typeof userBehaviorProfileSchema>;

// Track user behavior event
export function trackBehaviorEvent(event: Omit<BehaviorEvent, 'timestamp' | 'sessionId'>): BehaviorEvent {
  const sessionId = getCurrentSessionId();
  
  return {
    ...event,
    timestamp: new Date(),
    sessionId,
  };
}

// Get or create session ID
export function getCurrentSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = sessionStorage.getItem('mma_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('mma_session_id', sessionId);
  }
  
  return sessionId;
}

// Track page view
export function trackPageView(pageUrl: string, pageTitle: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.PAGE_VIEW,
    pageUrl,
    pageTitle,
  });
}

// Track form interactions
export function trackFormStart(formName: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.FORM_START,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { formName },
  });
}

export function trackFormProgress(formName: string, step: number, totalSteps: number): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.FORM_PROGRESS,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { formName, step, totalSteps, progress: (step / totalSteps) * 100 },
  });
}

export function trackFormComplete(formName: string, completionTime: number): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.FORM_COMPLETE,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { formName, completionTime },
  });
}

export function trackFormAbandon(formName: string, lastStep: number, reason?: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.FORM_ABANDON,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { formName, lastStep, reason },
  });
}

// Track content engagement
export function trackContentDownload(contentName: string, contentType: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.DOWNLOAD_CONTENT,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { contentName, contentType },
  });
}

export function trackCaseStudyView(caseStudyName: string, industry?: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.CASE_STUDY_VIEW,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { caseStudyName, industry },
  });
}

// Track conversion attempts
export function trackCalendarBook(service?: string, timeSlot?: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.CALENDAR_BOOK,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { service, timeSlot },
  });
}

export function trackQuoteRequest(service: string, budget?: string): BehaviorEvent {
  return trackBehaviorEvent({
    eventType: BEHAVIOR_EVENTS.QUOTE_REQUEST,
    pageUrl: window.location.href,
    pageTitle: document.title,
    eventData: { service, budget },
  });
}

// Calculate engagement score based on behavior
export function calculateEngagementScore(events: BehaviorEvent[]): number {
  let score = 0;
  
  events.forEach(event => {
    switch (event.eventType) {
      case BEHAVIOR_EVENTS.PAGE_VIEW:
        score += 1;
        break;
      case BEHAVIOR_EVENTS.FORM_START:
        score += 10;
        break;
      case BEHAVIOR_EVENTS.FORM_PROGRESS:
        score += 5;
        break;
      case BEHAVIOR_EVENTS.FORM_COMPLETE:
        score += 25;
        break;
      case BEHAVIOR_EVENTS.DOWNLOAD_CONTENT:
        score += 15;
        break;
      case BEHAVIOR_EVENTS.CASE_STUDY_VIEW:
        score += 8;
        break;
      case BEHAVIOR_EVENTS.CALENDAR_BOOK:
        score += 30;
        break;
      case BEHAVIOR_EVENTS.QUOTE_REQUEST:
        score += 20;
        break;
      case BEHAVIOR_EVENTS.CHAT_START:
        score += 12;
        break;
    }
  });
  
  return Math.min(score, 100); // Cap at 100
}

// Calculate conversion probability
export function calculateConversionProbability(profile: UserBehaviorProfile): number {
  let probability = 0;
  
  // Base probability from engagement
  probability += profile.engagementScore * 0.3;
  
  // Form completion rate
  if (profile.formStarts > 0) {
    const completionRate = profile.formCompletions / profile.formStarts;
    probability += completionRate * 40;
  }
  
  // Return visitor bonus
  if (profile.totalVisits > 1) {
    probability += Math.min(profile.totalVisits * 5, 20);
  }
  
  // Content engagement bonus
  if (profile.downloadedContent.length > 0) {
    probability += Math.min(profile.downloadedContent.length * 3, 15);
  }
  
  return Math.min(Math.round(probability), 100);
}

// Get next best action recommendation
export function getNextBestAction(profile: UserBehaviorProfile): string {
  if (profile.conversionProbability >= 80) {
    return 'Schedule consultation call';
  } else if (profile.conversionProbability >= 60) {
    return 'Send personalized proposal';
  } else if (profile.conversionProbability >= 40) {
    return 'Share relevant case studies';
  } else if (profile.conversionProbability >= 20) {
    return 'Send educational content';
  } else {
    return 'Nurture with newsletter';
  }
}

// Initialize behavioral tracking
export function initializeBehavioralTracking(): void {
  if (typeof window === 'undefined') return;
  
  // Track page views
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    trackPageView(window.location.href, document.title);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    trackPageView(window.location.href, document.title);
  };
  
  // Track initial page view
  trackPageView(window.location.href, document.title);
  
  // Track page leave
  window.addEventListener('beforeunload', () => {
    trackBehaviorEvent({
      eventType: BEHAVIOR_EVENTS.PAGE_LEAVE,
      pageUrl: window.location.href,
      pageTitle: document.title,
    });
  });
  
  // Track scroll depth
  let maxScrollDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackBehaviorEvent({
          eventType: BEHAVIOR_EVENTS.SCROLL_DEPTH,
          pageUrl: window.location.href,
          pageTitle: document.title,
          eventData: { scrollDepth },
        });
      }
    }
  });
}
