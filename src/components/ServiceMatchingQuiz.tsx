'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Clock, Users, Target, TrendingUp } from 'lucide-react';
import { services } from '@/content/services';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    services: string[];
  }[];
}

interface QuizResult {
  serviceId: string;
  title: string;
  subtitle: string;
  description: string;
  matchScore: number;
  icon: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'business-goal',
    question: 'What is your primary business goal right now?',
    options: [
      {
        value: 'brand-awareness',
        label: 'Increase brand awareness and visibility',
        services: ['media-relations', 'content-campaigns', 'brand-strategy']
      },
      {
        value: 'lead-generation',
        label: 'Generate more qualified leads',
        services: ['web-presence', 'content-campaigns', 'media-relations']
      },
      {
        value: 'partnerships',
        label: 'Build strategic partnerships',
        services: ['partnership-development', 'media-relations', 'brand-strategy']
      },
      {
        value: 'digital-presence',
        label: 'Improve digital presence and conversion',
        services: ['web-presence', 'content-campaigns', 'brand-strategy']
      }
    ]
  },
  {
    id: 'industry',
    question: 'What industry are you primarily in?',
    options: [
      {
        value: 'b2b',
        label: 'B2B/Professional Services',
        services: ['media-relations', 'partnership-development', 'content-campaigns']
      },
      {
        value: 'ecommerce',
        label: 'E-commerce/Retail',
        services: ['web-presence', 'content-campaigns', 'brand-strategy']
      },
      {
        value: 'events',
        label: 'Events/Experiential',
        services: ['photo-printing', 'brand-strategy', 'content-campaigns']
      },
      {
        value: 'technology',
        label: 'Technology/SaaS',
        services: ['web-presence', 'media-relations', 'content-campaigns']
      }
    ]
  },
  {
    id: 'budget-timeline',
    question: 'What is your budget and timeline?',
    options: [
      {
        value: 'quick-wins',
        label: 'Quick wins with limited budget',
        services: ['content-campaigns', 'brand-strategy', 'media-relations']
      },
      {
        value: 'strategic-investment',
        label: 'Strategic long-term investment',
        services: ['web-presence', 'partnership-development', 'brand-strategy']
      },
      {
        value: 'event-focused',
        label: 'Event-specific budget',
        services: ['photo-printing', 'content-campaigns', 'brand-strategy']
      },
      {
        value: 'growth-focused',
        label: 'Growth-focused with flexible budget',
        services: ['media-relations', 'web-presence', 'partnership-development']
      }
    ]
  },
  {
    id: 'current-challenge',
    question: 'What is your biggest current challenge?',
    options: [
      {
        value: 'visibility',
        label: 'Lack of visibility in your industry',
        services: ['media-relations', 'content-campaigns', 'brand-strategy']
      },
      {
        value: 'conversion',
        label: 'Website not converting visitors',
        services: ['web-presence', 'content-campaigns', 'brand-strategy']
      },
      {
        value: 'relationships',
        label: 'Difficulty building industry relationships',
        services: ['partnership-development', 'media-relations', 'brand-strategy']
      },
      {
        value: 'brand-consistency',
        label: 'Inconsistent brand messaging',
        services: ['brand-strategy', 'content-campaigns', 'web-presence']
      }
    ]
  }
];

// Map legacy quiz keys to actual service IDs from services.ts
const legacyToActualServiceId: Record<string, string> = {
  'web-presence': 'web-development',
  'photo-printing': 'photography',
  'brand-strategy': 'brand-development',
  'content-campaigns': 'video-production',
  'media-relations': 'brand-development',
  'partnership-development': 'white-label'
};

// Build service data from our actual services catalog
const serviceData: Record<string, { title: string; subtitle: string; description: string; icon: string }> =
  Object.fromEntries(
    services.map((s: any) => [
      s.id,
      {
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        icon: s.icon
      }
    ])
  );

export default function ServiceMatchingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = async () => {
    const serviceScores: Record<string, number> = {};
    
    // Initialize scores for all actual services
    Object.keys(serviceData).forEach(serviceId => {
      serviceScores[serviceId] = 0;
    });

    // Calculate scores based on answers
    Object.values(answers).forEach(answer => {
      const question = quizQuestions.find(q => 
        q.options.some(opt => opt.value === answer)
      );
      if (question) {
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) {
          selectedOption.services.forEach(legacyId => {
            const actualId = legacyToActualServiceId[legacyId] || legacyId;
            if (actualId in serviceScores) {
              serviceScores[actualId] += 1;
            }
          });
        }
      }
    });

    // Convert to results array and sort by score
    const resultsArray: QuizResult[] = Object.entries(serviceScores)
      .map(([serviceId, score]) => ({
        serviceId,
        ...serviceData[serviceId as keyof typeof serviceData],
        matchScore: score
      }))
      .filter(result => result.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(resultsArray);
    setShowResults(true);

    // Send to HubSpot capture endpoint
    try {
      const topMatches = resultsArray.slice(0, 3);
      const qaLines = Object.entries(answers)
        .map(([qId, val]) => {
          const q = quizQuestions.find(qq => qq.id === qId);
          const label = q?.options.find(o => o.value === val)?.label || val;
          return `- ${q?.question}: ${label}`;
        })
        .join('\n');

      const noteTitle = 'Service Matching Quiz - Results';
      const noteBody = `Service Matching Quiz Completed\n\nAnswers:\n${qaLines}\n\nTop Matches:\n${topMatches
        .map((m, idx) => `${idx + 1}. ${m.title} (${m.serviceId}) - score ${m.matchScore}`)
        .join('\n')}`;

      await fetch('/api/hubspot/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          listName: 'Service Matching Quiz Leads',
          event: 'service_quiz_completed',
          properties: { answers, topMatches: topMatches.map(r => ({ id: r.serviceId, score: r.matchScore })) },
          noteTitle,
          noteBody
        })
      });
    } catch (_) {}
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults([]);
  };

  const nextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await calculateResults();
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Service Matches</h3>
          <p className="text-gray-600">Based on your answers, here are the services that best fit your needs:</p>
        </div>

        <div className="space-y-6 mb-8">
          {results.slice(0, 3).map((result, index) => (
            <div key={result.serviceId} className={`p-6 rounded-xl border-2 ${
              index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {index === 0 && (
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      Best Match
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{result.title}</h4>
                    <p className="text-blue-600 font-medium">{result.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{result.matchScore}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{result.description}</p>
              <a href={`/services/${result.serviceId}`} className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Learn More
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={resetQuiz}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors mr-4"
          >
            Take Quiz Again
          </button>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const hasAnswer = answers[currentQ.id];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Matching Quiz</h3>
        <p className="text-gray-600">Answer a few questions to find the perfect MMA service for your business</p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h4>
        
        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                answers[currentQ.id] === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={currentQ.id}
                value={option.value}
                checked={answers[currentQ.id] === option.value}
                onChange={() => handleAnswer(currentQ.id, option.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
              </div>
              {answers[currentQ.id] === option.value && (
                <CheckCircle className="w-5 h-5 text-blue-500 ml-3" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={nextQuestion}
          disabled={!hasAnswer}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
            !hasAnswer
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
