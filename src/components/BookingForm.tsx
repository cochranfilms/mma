'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadData } from '@/lib/email';
import { submitLead, quickStartBooking } from '@/lib/actions';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { 
  trackFormStart, 
  trackFormProgress, 
  trackFormComplete, 
  trackFormAbandon,
  initializeBehavioralTracking 
} from '@/lib/behavioral-tracking';

type FormData = {
  company: string;
  role: string;
  needs: string[];
  timeline: string;
  budget: string;
  geography: string;
  name: string;
  email: string;
  phone?: string;
  currentSite?: string;
  consent: boolean;
};

const serviceNeeds = [
  'Media Relations & B2B Connections',
  'Web Presence & Website Upgrades',
  'Photo & On-Site Printing & Activations',
  'Content & Campaigns',
  'Strategic Partnership Development',
  'Brand Strategy & Positioning',
  'Not sure—advise me'
];

const timelines = [
  'ASAP (within 30 days)',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring options'
];

const budgets = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
  'To be discussed'
];

const geographies = [
  'Local/Regional',
  'National',
  'International',
  'Global',
  'Not sure'
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [formStartTime, setFormStartTime] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(leadSchema),
    mode: 'onChange'
  });

  const watchedNeeds = watch('needs') || [];
  const watchedConsent = watch('consent');

  // Initialize behavioral tracking when component mounts
  useEffect(() => {
    initializeBehavioralTracking();
  }, []);

  // Track form start when component mounts
  useEffect(() => {
    if (!formStartTime) {
      setFormStartTime(new Date());
      trackFormStart('consultation-booking');
    }
  }, [formStartTime]);

  const handleNeedToggle = (need: string) => {
    const currentNeeds = watchedNeeds;
    if (currentNeeds.includes(need)) {
      setValue('needs', currentNeeds.filter(n => n !== need));
    } else {
      setValue('needs', [...currentNeeds, need]);
    }
    trigger('needs');
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      // Track form progress
      trackFormProgress('consultation-booking', currentStep + 1, 5);
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1: return ['company', 'role'];
      case 2: return ['needs'];
      case 3: return ['timeline', 'budget', 'geography'];
      case 4: return ['name', 'email', 'consent'];
      default: return [];
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Calculate form completion time
      const completionTime = formStartTime ? 
        Math.round((new Date().getTime() - formStartTime.getTime()) / 1000) : 0;
      
      // Track form completion
      trackFormComplete('consultation-booking', completionTime);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? 'on' : '');
        } else if (value) {
          formData.append(key, value);
        }
      });
      
      await submitLead(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

  const onQuickStart = async (data: { company: string; email: string }) => {
    setIsSubmitting(true);
    
    try {
      // Track quick start form completion
      const completionTime = formStartTime ? 
        Math.round((new Date().getTime() - formStartTime.getTime()) / 1000) : 0;
      trackFormComplete('quick-start-booking', completionTime);
      
      const formData = new FormData();
      formData.append('company', data.company);
      formData.append('email', data.email);
      
      const result = await quickStartBooking(formData);
      if (result.success && result.calendlyUrl) {
        window.open(result.calendlyUrl, '_blank');
      }
    } catch (error) {
      console.error('Quick start error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track form abandonment when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (formStartTime && currentStep < 5) {
        trackFormAbandon('consultation-booking', currentStep, 'page_unload');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formStartTime, currentStep]);

  if (showQuickStart) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
        <h3 className="heading-3 mb-6 text-center">Quick Start</h3>
        <p className="text-body mb-6 text-center">
          Skip the form and go straight to booking a consultation call.
        </p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onQuickStart({
            company: formData.get('company') as string,
            email: formData.get('email') as string,
          });
        }} className="space-y-4">
          <div>
            <label htmlFor="quick-company" className="block text-sm font-medium text-foreground mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="quick-company"
              name="company"
              required
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>
          
          <div>
            <label htmlFor="quick-email" className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              id="quick-email"
              name="email"
              required
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? 'Redirecting...' : 'Book Consultation Call'}
          </button>
        </form>
        
        <button
          onClick={() => setShowQuickStart(false)}
          className="w-full mt-4 text-accent-600 hover:text-accent-700 font-medium"
        >
          ← Back to full form
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="heading-2 mb-4">Book Your Free Consultation</h2>
        <p className="text-body mb-6">
          Tell us about your needs and we'll schedule a consultation to discuss how we can help transform your B2B marketing.
        </p>
        
        <button
          onClick={() => setShowQuickStart(true)}
          className="text-accent-600 hover:text-accent-700 font-medium underline"
        >
          Or skip to booking a call directly →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep
                  ? 'bg-accent-600 border-accent-600 text-white'
                  : 'border-accent-200 text-accent-400'
              }`}
            >
              {step < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                step
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Company & Role</span>
          <span>Service Needs</span>
          <span>Project Details</span>
          <span>Contact Info</span>
          <span>Review</span>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Company & Role */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="text-red-600 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                  Your Role *
                </label>
                <input
                  {...register('role')}
                  type="text"
                  id="role"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="CEO, CMO, Marketing Director, etc."
                />
                {errors.role && (
                  <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Service Needs */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="block text-sm font-medium text-foreground mb-4">
                What services do you need? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceNeeds.map((need) => (
                  <label key={need} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedNeeds.includes(need)}
                      onChange={() => handleNeedToggle(need)}
                      className="w-4 h-4 text-accent-600 border-accent-300 rounded focus:ring-accent-500"
                    />
                    <span className="text-sm text-foreground">{need}</span>
                  </label>
                ))}
              </div>
              {errors.needs && (
                <p className="text-red-600 text-sm mt-2">{errors.needs.message}</p>
              )}
            </motion.div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
                  Timeline *
                </label>
                <select
                  {...register('timeline')}
                  id="timeline"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="text-red-600 text-sm mt-1">{errors.timeline.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                  Budget Range *
                </label>
                <select
                  {...register('budget')}
                  id="budget"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Select budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="geography" className="block text-sm font-medium text-foreground mb-2">
                  Geography *
                </label>
                <select
                  {...register('geography')}
                  id="geography"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="">Select geography</option>
                  {geographies.map((geo) => (
                    <option key={geo} value={geo}>{geo}</option>
                  ))}
                </select>
                {errors.geography && (
                  <p className="text-red-600 text-sm mt-1">{errors.geography.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="currentSite" className="block text-sm font-medium text-foreground mb-2">
                  Current Website (Optional)
                </label>
                <input
                  {...register('currentSite')}
                  type="url"
                  id="currentSite"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    className="w-4 h-4 text-accent-600 border-accent-300 rounded focus:ring-accent-500 mt-1"
                  />
                  <span className="text-sm text-foreground">
                    I consent to MMA contacting me about my inquiry and agree to the{' '}
                    <a href="/privacy" className="text-accent-600 hover:text-accent-700 underline">
                      Privacy Policy
                    </a>
                    . *
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-600 text-sm mt-1">{errors.consent.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-accent-50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Review Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Company:</strong> {watch('company')}</p>
                  <p><strong>Role:</strong> {watch('role')}</p>
                  <p><strong>Name:</strong> {watch('name')}</p>
                  <p><strong>Email:</strong> {watch('email')}</p>
                </div>
                <div>
                  <p><strong>Services:</strong> {watch('needs')?.join(', ')}</p>
                  <p><strong>Timeline:</strong> {watch('timeline')}</p>
                  <p><strong>Budget:</strong> {watch('budget')}</p>
                  <p><strong>Geography:</strong> {watch('geography')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-accent-300 text-accent-700 rounded-lg hover:bg-accent-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isValid}
              className="flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex items-center px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Book Consultation'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
