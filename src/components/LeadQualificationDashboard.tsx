'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  ClockIcon,
  FireIcon,
  SunIcon,
  CloudIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { LeadScore } from '@/lib/lead-scoring';
import { ProgressiveProfile } from '@/lib/progressive-profiling';
import { UserBehaviorProfile } from '@/lib/behavioral-tracking';
import { FollowUpSequence } from '@/lib/follow-up-sequences';

interface LeadQualificationDashboardProps {
  leadData: {
    score: LeadScore;
    profile: ProgressiveProfile;
    behavior: UserBehaviorProfile;
    followUp?: FollowUpSequence;
  };
}

export default function LeadQualificationDashboard({ leadData }: LeadQualificationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  const { score, profile, behavior, followUp } = leadData;

  const getQualificationColor = (qualification: string) => {
    switch (qualification) {
      case 'HOT':
        return 'text-red-600 bg-red-100';
      case 'WARM':
        return 'text-orange-600 bg-orange-100';
      case 'COLD':
        return 'text-blue-600 bg-blue-100';
      case 'UNQUALIFIED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualificationIcon = (qualification: string) => {
    switch (qualification) {
      case 'HOT':
        return <FireIcon className="w-5 h-5" />;
      case 'WARM':
        return <SunIcon className="w-5 h-5" />;
      case 'COLD':
        return <CloudIcon className="w-5 h-5" />;
      case 'UNQUALIFIED':
        return <ArchiveBoxIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'scoring', name: 'Lead Scoring', icon: UserGroupIcon },
    { id: 'profiling', name: 'Progressive Profiling', icon: EnvelopeIcon },
    { id: 'behavior', name: 'Behavior Analysis', icon: ClockIcon },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Qualification Dashboard</h2>
          <p className="text-gray-600">Comprehensive analysis for {score.company}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualificationColor(score.qualification)}`}>
            <div className="flex items-center space-x-1">
              {getQualificationIcon(score.qualification)}
              <span>{score.qualification}</span>
            </div>
          </span>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(score.priority)}`}>
            {score.priority} Priority
          </span>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Lead Score</p>
              <p className="text-3xl font-bold">{score.totalScore}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Profile Complete</p>
              <p className="text-3xl font-bold">{profile.profile_completeness}%</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Engagement</p>
              <p className="text-3xl font-bold">{behavior.engagementScore}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Conversion</p>
              <p className="text-3xl font-bold">{behavior.conversionProbability}%</p>
            </div>
            <EnvelopeIcon className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-accent-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-accent-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Immediate Action Required</p>
                    <p className="text-sm text-gray-600">Schedule follow-up call within 2 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Next Steps</p>
                    <p className="text-sm text-gray-600">Send personalized proposal within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{score.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{score.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{score.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{score.budget}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Needs</h3>
                <div className="space-y-2">
                  {score.needs.map((need, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{need}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'scoring' && (
          <motion.div
            key="scoring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role Seniority</span>
                  <span className="font-medium">{score.role} - High Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget Range</span>
                  <span className="font-medium">{score.budget} - Medium Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Timeline</span>
                  <span className="font-medium">{score.timeline} - High Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Geography</span>
                  <span className="font-medium">{score.geography} - Medium Impact</span>
                </div>
              </div>
            </div>

            {/* Qualification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualification Level</h3>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold text-white mb-3 ${
                    score.qualification === 'HOT' ? 'bg-red-500' :
                    score.qualification === 'WARM' ? 'bg-orange-500' :
                    score.qualification === 'COLD' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {score.qualification}
                  </div>
                  <p className="text-sm text-gray-600">
                    {score.qualification === 'HOT' && 'Immediate follow-up required'}
                    {score.qualification === 'WARM' && 'Nurture sequence recommended'}
                    {score.qualification === 'COLD' && 'Educational content focus'}
                    {score.qualification === 'UNQUALIFIED' && 'Archive and monitor'}
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Deal Value</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {score.qualification === 'HOT' ? '$25K - $100K+' :
                     score.qualification === 'WARM' ? '$10K - $50K' :
                     score.qualification === 'COLD' ? '$5K - $25K' : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">Based on qualification level and budget range</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profiling' && (
          <motion.div
            key="profiling"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Profile Progress */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Stage</span>
                  <span className="font-medium capitalize">{profile.current_stage}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profile.profile_completeness}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{profile.profile_completeness}% complete</p>
              </div>
            </div>

            {/* Stage Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stage Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="font-medium capitalize">{profile.current_stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{profile.last_updated.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Can Advance:</span>
                    <span className="font-medium">
                      {profile.current_stage === 'initial' ? 'Yes' : 'Review Required'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Stage</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Stage:</span>
                    <span className="font-medium capitalize">
                      {profile.current_stage === 'initial' ? 'engagement' :
                       profile.current_stage === 'engagement' ? 'qualification' :
                       profile.current_stage === 'qualification' ? 'proposal' :
                       profile.current_stage === 'proposal' ? 'negotiation' : 'Complete'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requirements:</span>
                    <span className="font-medium">Complete current stage</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'behavior' && (
          <motion.div
            key="behavior"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Engagement Metrics */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{behavior.totalVisits}</p>
                  <p className="text-sm text-gray-600">Total Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{behavior.totalSessions}</p>
                  <p className="text-sm text-gray-600">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{Math.round(behavior.averageSessionDuration / 60)}m</p>
                  <p className="text-sm text-gray-600">Avg Session</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{behavior.conversionRate}%</p>
                  <p className="text-sm text-gray-600">Conversion</p>
                </div>
              </div>
            </div>

            {/* Behavior Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Engagement</h3>
                <div className="space-y-3">
                  {behavior.downloadedContent.length > 0 ? (
                    behavior.downloadedContent.map((content, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{content}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No content downloaded yet</p>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Behavior</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Form Starts:</span>
                    <span className="font-medium">{behavior.formStarts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completions:</span>
                    <span className="font-medium">{behavior.formCompletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Abandons:</span>
                    <span className="font-medium">{behavior.formAbandons}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Actions Section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-medium"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Detailed Actions</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions (Next 2 hours)</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                    <span>Schedule phone call with {score.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                    <span>Prepare personalized proposal for {score.company}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Sequence (Next 24 hours)</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <span>Send welcome email with next steps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <span>Share relevant case studies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <span>Schedule consultation call</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
