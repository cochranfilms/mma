'use client';

import { useState } from 'react';
import { BarChart3, CheckCircle, XCircle, TrendingUp, Target, Users, DollarSign } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  type: 'agency' | 'freelancer' | 'in-house' | 'mma';
  pricing: 'low' | 'medium' | 'high';
  quality: 'low' | 'medium' | 'high';
  speed: 'slow' | 'medium' | 'fast';
  expertise: 'general' | 'specialized' | 'expert';
  support: 'limited' | 'standard' | 'premium';
}

interface AnalysisResult {
  mmaScore: number;
  competitorScores: Record<string, number>;
  recommendations: string[];
  advantages: string[];
}

const competitors: Competitor[] = [
  {
    id: 'mma',
    name: 'MMA (Your Choice)',
    type: 'mma',
    pricing: 'medium',
    quality: 'high',
    speed: 'fast',
    expertise: 'expert',
    support: 'premium'
  },
  {
    id: 'big-agency',
    name: 'Big Marketing Agency',
    type: 'agency',
    pricing: 'high',
    quality: 'high',
    speed: 'slow',
    expertise: 'general',
    support: 'standard'
  },
  {
    id: 'freelancer',
    name: 'Freelance Professional',
    type: 'freelancer',
    pricing: 'low',
    quality: 'medium',
    speed: 'medium',
    expertise: 'specialized',
    support: 'limited'
  },
  {
    id: 'in-house',
    name: 'In-House Team',
    type: 'in-house',
    pricing: 'high',
    quality: 'medium',
    speed: 'slow',
    expertise: 'general',
    support: 'standard'
  },
  {
    id: 'boutique-agency',
    name: 'Boutique Agency',
    type: 'agency',
    pricing: 'medium',
    quality: 'high',
    speed: 'medium',
    expertise: 'specialized',
    support: 'premium'
  }
];

const scoringWeights = {
  pricing: { low: 3, medium: 2, high: 1 },
  quality: { low: 1, medium: 2, high: 3 },
  speed: { slow: 1, medium: 2, fast: 3 },
  expertise: { general: 1, specialized: 2, expert: 3 },
  support: { limited: 1, standard: 2, premium: 3 }
};

type PriorityKey = keyof typeof scoringWeights;

function getAttributeWeight(priority: PriorityKey, competitor: Competitor): number {
  switch (priority) {
    case 'pricing':
      return scoringWeights.pricing[competitor.pricing];
    case 'quality':
      return scoringWeights.quality[competitor.quality];
    case 'speed':
      return scoringWeights.speed[competitor.speed];
    case 'expertise':
      return scoringWeights.expertise[competitor.expertise];
    case 'support':
      return scoringWeights.support[competitor.support];
    default:
      return 0;
  }
}

const serviceContexts = {
  'media-relations': {
    name: 'Media Relations & B2B Connections',
    priorities: ['expertise', 'quality', 'support'],
    mmaAdvantages: [
      'Specialized media industry knowledge',
      'Proven track record with B2B clients',
      'Personal relationship building approach',
      'Industry-specific media contacts'
    ]
  },
  'web-presence': {
    name: 'Web Presence Upgrades',
    priorities: ['quality', 'speed', 'expertise'],
    mmaAdvantages: [
      'Modern design expertise',
      'Conversion-focused approach',
      'Technical SEO knowledge',
      'Ongoing optimization support'
    ]
  },
  'photo-printing': {
    name: 'Photo & On-Site Printing & Activations',
    priorities: ['quality', 'speed', 'support'],
    mmaAdvantages: [
      'Creative activation concepts',
      'High-quality printing standards',
      'Event experience expertise',
      'Post-event follow-up support'
    ]
  },
  'content-campaigns': {
    name: 'Content & Campaigns',
    priorities: ['expertise', 'quality', 'speed'],
    mmaAdvantages: [
      'Strategic content planning',
      'Industry-specific messaging',
      'Multi-channel distribution',
      'Performance tracking expertise'
    ]
  },
  'partnership-development': {
    name: 'Strategic Partnership Development',
    priorities: ['expertise', 'support', 'quality'],
    mmaAdvantages: [
      'Partnership identification expertise',
      'Relationship building skills',
      'Long-term partnership support',
      'Industry network access'
    ]
  },
  'brand-strategy': {
    name: 'Brand Strategy & Positioning',
    priorities: ['expertise', 'quality', 'support'],
    mmaAdvantages: [
      'Strategic brand thinking',
      'Market differentiation expertise',
      'Implementation guidance',
      'Ongoing brand support'
    ]
  }
};

export default function CompetitiveAnalysisTool() {
  const [selectedService, setSelectedService] = useState('media-relations');
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const calculateScores = (): AnalysisResult => {
    const serviceContext = serviceContexts[selectedService as keyof typeof serviceContexts];
    const mmaCompetitor = competitors.find(c => c.id === 'mma')!;
    
    const competitorScores: Record<string, number> = {};
    
    competitors.forEach(competitor => {
      let score = 0;
      
      // Base scoring
      score += scoringWeights.pricing[competitor.pricing] * 2;
      score += scoringWeights.quality[competitor.quality] * 3;
      score += scoringWeights.speed[competitor.speed] * 2;
      score += scoringWeights.expertise[competitor.expertise] * 3;
      score += scoringWeights.support[competitor.support] * 2;
      
      // Service-specific priority adjustments
      serviceContext.priorities.forEach((priority, index) => {
        const priorityWeight = 3 - index; // First priority gets highest weight
        score += getAttributeWeight(priority as PriorityKey, competitor) * priorityWeight;
      });
      
      // Type-specific adjustments
      if (competitor.type === 'mma') {
        score += 5; // Bonus for MMA
      } else if (competitor.type === 'freelancer') {
        score -= 2; // Penalty for limited support
      } else if (competitor.id === 'big-agency') {
        score -= 1; // Penalty for slower speed
      }
      
      competitorScores[competitor.id] = Math.max(0, Math.min(100, score));
    });
    
    const mmaScore = competitorScores['mma'];
    
    // Generate recommendations
    const recommendations: string[] = [];
    const advantages: string[] = [];
    
    if (mmaScore > 80) {
      recommendations.push('MMA is the clear choice for your needs');
      recommendations.push('Consider a comprehensive service package');
    } else if (mmaScore > 60) {
      recommendations.push('MMA offers strong value for your requirements');
      recommendations.push('Evaluate specific service customization options');
    } else {
      recommendations.push('Consider MMA for specific aspects of your project');
      recommendations.push('Explore hybrid approaches with other providers');
    }
    
    // Add service-specific advantages
    advantages.push(...serviceContext.mmaAdvantages);
    
    return {
      mmaScore,
      competitorScores,
      recommendations,
      advantages
    };
  };

  const handleAnalyze = () => {
    const results = calculateScores();
    setAnalysisResults(results);
    setShowResults(true);
  };

  const resetAnalysis = () => {
    setSelectedService('media-relations');
    setShowResults(false);
    setAnalysisResults(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (showResults && analysisResults) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Competitive Analysis Results</h3>
          <p className="text-gray-600">How MMA compares to alternatives for {serviceContexts[selectedService as keyof typeof serviceContexts].name}</p>
        </div>

        {/* MMA Score Highlight */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{analysisResults.mmaScore}/100</div>
            <div className="text-blue-100 text-lg">MMA Overall Score</div>
            <div className="text-blue-100 text-sm mt-2">vs. Industry Alternatives</div>
          </div>
        </div>

        {/* Competitor Comparison Chart */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitor Comparison</h4>
          <div className="space-y-4">
            {competitors.map((competitor) => {
              const score = analysisResults.competitorScores[competitor.id];
              const isMMA = competitor.id === 'mma';
              
              return (
                <div key={competitor.id} className={`p-4 rounded-lg border-2 ${
                  isMMA ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isMMA && (
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          MMA
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{competitor.name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {competitor.type.replace('-', ' ')} • {competitor.pricing} pricing
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${getScoreColor(score)}`}>
                      <div className={`text-2xl font-bold ${getScoreBgColor(score)} px-3 py-1 rounded-lg`}>
                        {score}
                      </div>
                      <div className="text-sm text-gray-500">score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MMA Advantages */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose MMA for This Service</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {analysisResults.advantages.map((advantage, index) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
          <div className="space-y-3">
            {analysisResults.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Context */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h4 className="font-medium text-gray-900 mb-2">Analysis Context: {serviceContexts[selectedService as keyof typeof serviceContexts].name}</h4>
          <div className="text-sm text-gray-600">
            <p className="mb-2">This analysis prioritizes: <strong>{serviceContexts[selectedService as keyof typeof serviceContexts].priorities.join(', ')}</strong></p>
            <p>Based on typical requirements for this service type and industry best practices.</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetAnalysis}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors mr-4"
          >
            Analyze Different Service
          </button>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Competitive Analysis Tool</h3>
        <p className="text-gray-600">See how MMA services compare to alternatives in your market</p>
      </div>

      <div className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select a Service to Analyze
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(serviceContexts).map(([key, service]) => (
              <option key={key} value={key}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Context Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Service Analysis Focus</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Service:</span>
              <div className="font-medium">{serviceContexts[selectedService as keyof typeof serviceContexts].name}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Key Priorities:</span>
              <div className="font-medium">
                {serviceContexts[selectedService as keyof typeof serviceContexts].priorities.map((priority, index) => (
                  <span key={priority} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                    {priority.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What We Compare */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">What We Compare</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: DollarSign, label: 'Pricing', desc: 'Cost vs. Value' },
              { icon: Target, label: 'Quality', desc: 'Output Standards' },
              { icon: TrendingUp, label: 'Speed', desc: 'Delivery Timeline' },
              { icon: Users, label: 'Expertise', desc: 'Specialized Knowledge' },
              { icon: CheckCircle, label: 'Support', desc: 'Ongoing Assistance' }
            ].map((item) => (
              <div key={item.label} className="text-center p-3 bg-blue-50 rounded-lg">
                <item.icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Competitor Types Analyzed</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'Big Marketing Agency', pros: 'Resources, Experience', cons: 'High Cost, Slow Speed' },
              { type: 'Freelance Professional', pros: 'Low Cost, Specialized', cons: 'Limited Support, Variable Quality' },
              { type: 'In-House Team', pros: 'Full Control, Dedicated', cons: 'High Cost, Limited Expertise' },
              { type: 'Boutique Agency', pros: 'Quality, Personal Service', cons: 'Medium Cost, Limited Scale' }
            ].map((competitor, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 text-sm mb-2">{competitor.type}</div>
                <div className="text-xs text-gray-600">
                  <div className="text-green-600">✓ {competitor.pros}</div>
                  <div className="text-red-600">✗ {competitor.cons}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Run Competitive Analysis
        </button>
      </div>
    </div>
  );
}
