'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  RocketLaunchIcon,
  BoltIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AnalysisResult {
  url: string;
  overallScore: number;
  criticalIssues: string[];
  opportunities: string[];
  seoAnalysis: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  designAnalysis: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  conversionAnalysis: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  recommendedServices: {
    id: string;
    title: string;
    description: string;
    impact: string;
    price: number;
  }[];
}

export default function WebsiteDominationAnalyzer() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [emailjsInitialized, setEmailjsInitialized] = useState(false);

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    const initEmailJS = () => {
      try {
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'p4pF3OWvh-DXtae4c';
        emailjs.init(publicKey);
        setEmailjsInitialized(true);
        console.log('EmailJS initialized successfully with key:', publicKey.substring(0, 8) + '...');
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
      }
    };

    initEmailJS();
  }, []);

  const analysisSteps = [
    { title: 'SCANNING WEBSITE', description: 'Infiltrating target website architecture' },
    { title: 'SEO AUDIT', description: 'Analyzing search engine vulnerabilities' },
    { title: 'DESIGN ASSESSMENT', description: 'Evaluating user experience weaknesses' },
    { title: 'CONVERSION ANALYSIS', description: 'Identifying revenue leaks' },
    { title: 'STRATEGY FORMULATION', description: 'Calculating domination blueprint' },
    { title: 'BATTLE PLAN READY', description: 'Analysis complete - preparing recommendations' }
  ];

  const handleAnalysis = async () => {
    if (!url || !email) return;

    setIsAnalyzing(true);
    setCurrentStep(0);

    // Simulate analysis steps
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email }),
      });

      const result = await response.json();
      setAnalysisResult(result);
      
      // Send emails via EmailJS
      await sendAnalysisEmails(result, email, url);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // For demo purposes, show mock results
      const mockResult = getMockAnalysis(url);
      setAnalysisResult(mockResult);
      await sendAnalysisEmails(mockResult, email, url);
    }

    setIsAnalyzing(false);
  };

  const getMockAnalysis = (url: string): AnalysisResult => ({
    url,
    overallScore: 34,
    criticalIssues: [
      'No conversion tracking system detected',
      'Missing automated email sequences',
      'Poor mobile optimization (67% speed loss)',
      'Zero social proof integration',
      'Weak call-to-action placement'
    ],
    opportunities: [
      'Implement AI-powered chatbot for 24/7 lead capture',
      'Add conversion-optimized landing pages',
      'Install advanced analytics and heat mapping',
      'Create automated email nurture sequences',
      'Optimize for voice search and local SEO'
    ],
    seoAnalysis: {
      score: 28,
      issues: ['Missing meta descriptions', 'No schema markup', 'Slow page load times'],
      recommendations: ['Implement technical SEO audit', 'Add structured data', 'Optimize Core Web Vitals']
    },
    designAnalysis: {
      score: 45,
      issues: ['Poor mobile responsiveness', 'Outdated design elements', 'Confusing navigation'],
      recommendations: ['Modern responsive redesign', 'User experience optimization', 'Conversion-focused layout']
    },
    conversionAnalysis: {
      score: 22,
      issues: ['No lead magnets', 'Weak CTAs', 'Missing trust signals'],
      recommendations: ['Implement lead capture system', 'Add social proof', 'Create conversion funnels']
    },
    recommendedServices: [
      {
        id: 'website-redesign',
        title: 'Complete Website Domination Package',
        description: 'Full website transformation with conversion optimization',
        impact: 'Expected 300-500% increase in conversions',
        price: 15000
      },
      {
        id: 'seo-audit',
        title: 'SEO Warfare Implementation',
        description: 'Advanced SEO strategy to dominate search rankings',
        impact: 'Projected 200% increase in organic traffic',
        price: 5000
      },
      {
        id: 'automation-setup',
        title: 'AI Marketing Automation System',
        description: 'Automated email sequences and lead nurturing',
        impact: 'Estimated 400% improvement in lead conversion',
        price: 8000
      }
    ]
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-600/20 border-green-400/30';
    if (score >= 60) return 'from-yellow-500/20 to-amber-600/20 border-yellow-400/30';
    if (score >= 40) return 'from-orange-500/20 to-red-600/20 border-orange-400/30';
    return 'from-red-500/20 to-red-600/20 border-red-400/30';
  };

  const sendAnalysisEmails = async (analysis: AnalysisResult, userEmail: string, websiteUrl: string) => {
    try {
      // Check if EmailJS is initialized
      if (!emailjsInitialized) {
        console.error('EmailJS not initialized. Please check your environment variables.');
        return;
      }

      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      // Prepare template parameters
      const templateParams = {
        // User Info
        USER_EMAIL: userEmail,
        WEBSITE_URL: websiteUrl,
        ANALYSIS_DATE: currentDate,
        ANALYSIS_TIME: currentTime,
        
        // Overall Score
        OVERALL_SCORE: analysis.overallScore,
        SCORE_STATUS: analysis.overallScore < 50 ? 'CRITICALLY VULNERABLE' : 
                     analysis.overallScore < 80 ? 'MODERATELY WEAK' : 'BATTLE-READY',
        
        // Critical Issues
        CRITICAL_ISSUE_1: analysis.criticalIssues[0] || 'No critical issues found',
        CRITICAL_ISSUE_2: analysis.criticalIssues[1] || '',
        CRITICAL_ISSUE_3: analysis.criticalIssues[2] || '',
        CRITICAL_ISSUE_4: analysis.criticalIssues[3] || '',
        CRITICAL_ISSUE_5: analysis.criticalIssues[4] || '',
        
        // Opportunities
        OPPORTUNITY_1: analysis.opportunities[0] || 'No opportunities identified',
        OPPORTUNITY_2: analysis.opportunities[1] || '',
        OPPORTUNITY_3: analysis.opportunities[2] || '',
        OPPORTUNITY_4: analysis.opportunities[3] || '',
        OPPORTUNITY_5: analysis.opportunities[4] || '',
        
        // Detailed Scores
        SEO_SCORE: analysis.seoAnalysis.score,
        DESIGN_SCORE: analysis.designAnalysis.score,
        CONVERSION_SCORE: analysis.conversionAnalysis.score,
        
        // SEO Issues & Recommendations
        SEO_ISSUE_1: analysis.seoAnalysis.issues[0] || 'No SEO issues found',
        SEO_ISSUE_2: analysis.seoAnalysis.issues[1] || '',
        SEO_ISSUE_3: analysis.seoAnalysis.issues[2] || '',
        SEO_REC_1: analysis.seoAnalysis.recommendations[0] || '',
        SEO_REC_2: analysis.seoAnalysis.recommendations[1] || '',
        
        // Design Issues & Recommendations
        DESIGN_ISSUE_1: analysis.designAnalysis.issues[0] || 'No design issues found',
        DESIGN_ISSUE_2: analysis.designAnalysis.issues[1] || '',
        DESIGN_ISSUE_3: analysis.designAnalysis.issues[2] || '',
        DESIGN_REC_1: analysis.designAnalysis.recommendations[0] || '',
        DESIGN_REC_2: analysis.designAnalysis.recommendations[1] || '',
        
        // Conversion Issues & Recommendations
        CONV_ISSUE_1: analysis.conversionAnalysis.issues[0] || 'No conversion issues found',
        CONV_ISSUE_2: analysis.conversionAnalysis.issues[1] || '',
        CONV_ISSUE_3: analysis.conversionAnalysis.issues[2] || '',
        CONV_REC_1: analysis.conversionAnalysis.recommendations[0] || '',
        CONV_REC_2: analysis.conversionAnalysis.recommendations[1] || '',
        
        // Service Recommendations
        SERVICE_1_TITLE: analysis.recommendedServices[0]?.title || '',
        SERVICE_1_DESC: analysis.recommendedServices[0]?.description || '',
        SERVICE_1_IMPACT: analysis.recommendedServices[0]?.impact || '',
        SERVICE_1_PRICE: analysis.recommendedServices[0]?.price || 0,
        
        SERVICE_2_TITLE: analysis.recommendedServices[1]?.title || '',
        SERVICE_2_DESC: analysis.recommendedServices[1]?.description || '',
        SERVICE_2_IMPACT: analysis.recommendedServices[1]?.impact || '',
        SERVICE_2_PRICE: analysis.recommendedServices[1]?.price || 0,
        
        SERVICE_3_TITLE: analysis.recommendedServices[2]?.title || '',
        SERVICE_3_DESC: analysis.recommendedServices[2]?.description || '',
        SERVICE_3_IMPACT: analysis.recommendedServices[2]?.impact || '',
        SERVICE_3_PRICE: analysis.recommendedServices[2]?.price || 0,
      };

      // Send client email
      console.log('Sending client email...');
      const clientResponse = await emailjs.send(
        'service_hers22k', // Your service ID
        'template_4hroedw', // Client template ID
        templateParams
      );
      console.log('Client email sent successfully:', clientResponse);

      // Send admin email
      console.log('Sending admin email...');
      const adminResponse = await emailjs.send(
        'service_hers22k', // Your service ID
        'template_rlhix8p', // Admin template ID
        {
          ...templateParams,
          ADMIN_EMAIL: 'admin@marketingmousetrap.com', // Your admin email
        }
      );
      console.log('Admin email sent successfully:', adminResponse);

      console.log('All analysis emails sent successfully');
    } catch (error: any) {
      console.error('Error sending emails:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        status: error?.status || 'No status',
        text: error?.text || 'No text'
      });
      
      // Show user-friendly error message
      alert('There was an issue sending the analysis emails. Please check your email configuration or try again later.');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,69,0,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.3)_0%,transparent_50%)]"></div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,69,0,0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-red-500/20 rounded-full border border-red-400/30 mb-8"
          >
            <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-red-300" />
            <span className="text-red-200 font-bold text-lg">WEBSITE DOMINATION ANALYZER</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-orange-200 bg-clip-text text-transparent"
          >
            EXPOSE YOUR WEBSITE'S
            <br />
            <span className="text-4xl md:text-5xl text-red-400">FATAL WEAKNESSES</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-red-100 max-w-4xl mx-auto leading-relaxed"
          >
            Our AI-powered analyzer will ruthlessly audit your website and reveal exactly why you're losing customers, 
            missing leads, and bleeding revenue. Get your battle plan for total market domination.
          </motion.p>
        </div>

        {!analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-3xl p-10 border border-red-400/20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                INITIATE WEBSITE ANALYSIS
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-red-200 font-semibold mb-3">
                    TARGET WEBSITE URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-competitors-website.com"
                    className="w-full px-6 py-4 bg-black/50 border border-red-400/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-red-200 font-semibold mb-3">
                    EMAIL FOR BATTLE PLAN DELIVERY
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@company.com"
                    className="w-full px-6 py-4 bg-black/50 border border-red-400/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none text-lg"
                  />
                </div>
                
                <button
                  onClick={handleAnalysis}
                  disabled={!url || !email}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-6 px-8 rounded-xl hover:from-red-400 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RocketLaunchIcon className="w-7 h-7 mr-3" />
                  LAUNCH ANALYSIS ATTACK
                  <BoltIcon className="w-7 h-7 ml-3" />
                </button>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl border border-orange-400/20">
                <h4 className="text-lg font-bold text-white mb-3">🎯 WHAT YOU'LL GET:</h4>
                <ul className="space-y-2 text-orange-100">
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400" />
                    Complete SEO vulnerability assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400" />
                    Conversion optimization opportunities
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400" />
                    Custom domination strategy blueprint
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400" />
                    Personalized service recommendations
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-3xl p-10 border border-red-400/20">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  ANALYZING TARGET WEBSITE
                </h3>
                <p className="text-red-200">
                  Our AI is dissecting every aspect of your website...
                </p>
              </div>

              <div className="space-y-6">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: index <= currentStep ? 1 : 0.3,
                      scale: index === currentStep ? 1.05 : 1
                    }}
                    className={`flex items-center p-4 rounded-xl border ${
                      index <= currentStep 
                        ? 'bg-gradient-to-r from-red-500/20 to-orange-600/20 border-red-400/30' 
                        : 'bg-black/20 border-gray-600/20'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      index < currentStep 
                        ? 'bg-green-500' 
                        : index === currentStep 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-gray-600'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      ) : (
                        <CogIcon className={`w-6 h-6 text-white ${index === currentStep ? 'animate-spin' : ''}`} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{step.title}</h4>
                      <p className="text-red-200 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Overall Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBg(analysisResult.overallScore)} border-4 mb-6`}>
                <span className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                  {analysisResult.overallScore}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                WEBSITE DOMINATION SCORE
              </h3>
              <p className="text-xl text-red-200">
                Your website is {analysisResult.overallScore < 50 ? 'CRITICALLY VULNERABLE' : 
                analysisResult.overallScore < 80 ? 'MODERATELY WEAK' : 'BATTLE-READY'}
              </p>
            </div>

            {/* Critical Issues */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-3xl p-8 border border-red-400/30">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                <ExclamationTriangleIcon className="w-8 h-8 mr-3 text-red-400" />
                CRITICAL VULNERABILITIES
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analysisResult.criticalIssues.map((issue, index) => (
                  <div key={index} className="flex items-start p-4 bg-red-500/10 rounded-xl border border-red-400/20">
                    <ExclamationTriangleIcon className="w-5 h-5 mr-3 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-red-100">{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-3xl p-8 border border-green-400/30">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                <RocketLaunchIcon className="w-8 h-8 mr-3 text-green-400" />
                DOMINATION OPPORTUNITIES
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analysisResult.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start p-4 bg-green-500/10 rounded-xl border border-green-400/20">
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-green-100">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* SEO Analysis */}
              <div className={`bg-gradient-to-br ${getScoreBg(analysisResult.seoAnalysis.score)} rounded-2xl p-6 border`}>
                <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-2" />
                  SEO WARFARE
                </h5>
                <div className={`text-3xl font-bold mb-4 ${getScoreColor(analysisResult.seoAnalysis.score)}`}>
                  {analysisResult.seoAnalysis.score}/100
                </div>
                <div className="space-y-2">
                  {analysisResult.seoAnalysis.issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="text-sm text-red-200">• {issue}</div>
                  ))}
                </div>
              </div>

              {/* Design Analysis */}
              <div className={`bg-gradient-to-br ${getScoreBg(analysisResult.designAnalysis.score)} rounded-2xl p-6 border`}>
                <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CogIcon className="w-6 h-6 mr-2" />
                  DESIGN IMPACT
                </h5>
                <div className={`text-3xl font-bold mb-4 ${getScoreColor(analysisResult.designAnalysis.score)}`}>
                  {analysisResult.designAnalysis.score}/100
                </div>
                <div className="space-y-2">
                  {analysisResult.designAnalysis.issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="text-sm text-red-200">• {issue}</div>
                  ))}
                </div>
              </div>

              {/* Conversion Analysis */}
              <div className={`bg-gradient-to-br ${getScoreBg(analysisResult.conversionAnalysis.score)} rounded-2xl p-6 border`}>
                <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BoltIcon className="w-6 h-6 mr-2" />
                  CONVERSION POWER
                </h5>
                <div className={`text-3xl font-bold mb-4 ${getScoreColor(analysisResult.conversionAnalysis.score)}`}>
                  {analysisResult.conversionAnalysis.score}/100
                </div>
                <div className="space-y-2">
                  {analysisResult.conversionAnalysis.issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="text-sm text-red-200">• {issue}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Services */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-3xl p-8 border border-yellow-400/30">
              <h4 className="text-3xl font-bold text-white mb-8 text-center">
                🎯 RECOMMENDED BATTLE PLAN
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {analysisResult.recommendedServices.map((service, index) => (
                  <div key={service.id} className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 rounded-2xl p-6 border border-yellow-400/20 hover:scale-105 transition-all duration-300">
                    <h5 className="text-xl font-bold text-white mb-3">{service.title}</h5>
                    <p className="text-yellow-100 mb-4 text-sm">{service.description}</p>
                    <div className="mb-4">
                      <div className="text-green-400 font-semibold text-sm mb-2">EXPECTED IMPACT:</div>
                      <div className="text-green-300 text-sm">{service.impact}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">
                        ${service.price.toLocaleString()}
                      </div>
                      <Link
                        href={`/services/${service.id}`}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-2 px-4 rounded-lg text-sm hover:from-yellow-400 hover:to-orange-500 transition-all duration-200"
                      >
                        DEPLOY
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-3xl p-12 border border-red-400/30">
                <h4 className="text-4xl font-bold text-white mb-6">
                  READY TO DOMINATE YOUR MARKET?
                </h4>
                <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                  Your competitors won't wait. Every day you delay is market share lost forever. 
                  Let's transform your website into a conversion machine.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-4 px-10 rounded-xl hover:from-red-400 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-lg"
                  >
                    <PhoneIcon className="w-6 h-6 mr-3" />
                    SCHEDULE DOMINATION CALL
                  </Link>
                  <Link
                    href="/services"
                    className="bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-bold py-4 px-10 rounded-xl transition-all duration-200 inline-flex items-center text-lg"
                  >
                    <FireIcon className="w-6 h-6 mr-3" />
                    VIEW FULL ARSENAL
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
