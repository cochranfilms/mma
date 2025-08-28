'use client';

import { useState } from 'react';
import { FileText, Download, Mail, Calendar, CheckCircle, Star, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProposalForm {
  companyName: string;
  industry: string;
  businessSize: string;
  primaryGoal: string;
  budget: string;
  timeline: string;
  currentChallenges: string[];
  selectedServices: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
  };
}

interface GeneratedProposal {
  summary: string;
  recommendedServices: Array<{
    id: string;
    title: string;
    description: string;
    deliverables: string[];
    investment: string;
    timeline: string;
    expectedOutcomes: string[];
  }>;
  totalInvestment: string;
  timeline: string;
  expectedOutcomes: string[];
  implementationPlan: string[];
  nextSteps: string[];
}

const serviceOptions = [
  {
    id: 'media-relations',
    title: 'Media Relations & B2B Connections',
    description: 'Strategic media partnerships that amplify your brand',
    baseInvestment: '$5,000 - $15,000',
    timeline: '6-12 months'
  },
  {
    id: 'web-presence',
    title: 'Web Presence Upgrades',
    description: 'Modern websites that convert visitors into customers',
    baseInvestment: '$7,500 - $35,000',
    timeline: '3-6 months'
  },
  {
    id: 'photo-printing',
    title: 'Photo & On-Site Printing & Activations',
    description: 'Memorable brand experiences that create lasting impressions',
    baseInvestment: '$8,000 - $25,000',
    timeline: '1-3 months'
  },
  {
    id: 'content-campaigns',
    title: 'Content & Campaigns',
    description: 'Strategic content that builds authority and drives action',
    baseInvestment: '$6,000 - $20,000',
    timeline: '4-8 months'
  },
  {
    id: 'partnership-development',
    title: 'Strategic Partnership Development',
    description: 'High-value collaborations that expand your reach',
    baseInvestment: '$10,000 - $30,000',
    timeline: '8-15 months'
  },
  {
    id: 'brand-strategy',
    title: 'Brand Strategy & Positioning',
    description: 'Clear positioning that differentiates and resonates',
    baseInvestment: '$12,000 - $35,000',
    timeline: '6-12 months'
  }
];

const challengeOptions = [
  'Lack of brand visibility',
  'Low website conversion rates',
  'Difficulty generating qualified leads',
  'Inconsistent brand messaging',
  'Limited industry relationships',
  'Outdated marketing materials',
  'Poor search engine rankings',
  'Lack of content strategy',
  'Difficulty standing out from competitors',
  'Limited marketing budget'
];

const goalOptions = [
  'Increase brand awareness',
  'Generate more qualified leads',
  'Improve website performance',
  'Build industry relationships',
  'Launch new products/services',
  'Enter new markets',
  'Improve customer engagement',
  'Increase sales conversions',
  'Build thought leadership',
  'Create memorable brand experiences'
];

export default function CustomProposalGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProposalForm>({
    companyName: '',
    industry: '',
    businessSize: '',
    primaryGoal: '',
    budget: '',
    timeline: '',
    currentChallenges: [],
    selectedServices: [],
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'email'
    }
  });
  const [showProposal, setShowProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);

  const totalSteps = 4;

  const updateFormData = (field: keyof ProposalForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field: keyof ProposalForm['contactInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const toggleArrayField = (field: 'currentChallenges' | 'selectedServices', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateProposal = (): GeneratedProposal => {
    // Smart service recommendations based on form data
    const recommendedServices = serviceOptions
      .filter(service => {
        // Filter based on selected services or auto-recommend based on goals/challenges
        if (formData.selectedServices.length > 0) {
          return formData.selectedServices.includes(service.id);
        }
        
        // Auto-recommend based on goals and challenges (more flexible matching)
        const goal = formData.primaryGoal.toLowerCase();
        const challenges = formData.currentChallenges.join(' ').toLowerCase();
        
        // Media Relations recommendations
        if ((goal.includes('brand') || goal.includes('awareness') || goal.includes('visibility') || 
             challenges.includes('visibility') || challenges.includes('awareness')) && 
             service.id === 'media-relations') return true;
             
        // Web Presence recommendations  
        if ((goal.includes('website') || goal.includes('online') || goal.includes('digital') ||
             goal.includes('leads') || challenges.includes('website') || challenges.includes('online')) && 
             service.id === 'web-presence') return true;
             
        // Content & Campaigns recommendations
        if ((goal.includes('leads') || goal.includes('content') || goal.includes('marketing') ||
             challenges.includes('content') || challenges.includes('marketing')) && 
             service.id === 'content-campaigns') return true;
             
        // Partnership Development recommendations
        if ((goal.includes('partnerships') || goal.includes('relationships') || goal.includes('network') ||
             challenges.includes('partnerships') || challenges.includes('relationships')) && 
             service.id === 'partnership-development') return true;
             
        // Brand Strategy recommendations
        if ((goal.includes('brand') || goal.includes('positioning') || goal.includes('identity') ||
             challenges.includes('brand') || challenges.includes('positioning')) && 
             service.id === 'brand-strategy') return true;
             
        // Photo & Printing recommendations
        if ((goal.includes('events') || goal.includes('activation') || goal.includes('experience') ||
             challenges.includes('events') || challenges.includes('activation')) && 
             service.id === 'photo-printing') return true;
        
        return false;
      });

    // If no services were recommended, provide default recommendations based on business size
    if (recommendedServices.length === 0) {
      if (formData.businessSize === 'startup' || formData.businessSize === 'small') {
        recommendedServices.push(serviceOptions.find(s => s.id === 'web-presence')!);
        recommendedServices.push(serviceOptions.find(s => s.id === 'content-campaigns')!);
      } else {
        recommendedServices.push(serviceOptions.find(s => s.id === 'web-presence')!);
        recommendedServices.push(serviceOptions.find(s => s.id === 'media-relations')!);
        recommendedServices.push(serviceOptions.find(s => s.id === 'brand-strategy')!);
      }
    }

    const finalRecommendedServices = recommendedServices
      .map(service => ({
        ...service,
        deliverables: getServiceDeliverables(service.id),
        investment: adjustInvestment(service.baseInvestment, formData.budget),
        timeline: adjustTimeline(service.timeline, formData.timeline),
        expectedOutcomes: getExpectedOutcomes(service.id, formData.primaryGoal)
      }));

    const totalInvestment = calculateTotalInvestment(finalRecommendedServices);
    const implementationPlan = generateImplementationPlan(finalRecommendedServices, formData.timeline);
    const nextSteps = generateNextSteps(formData.contactInfo.preferredContact);

    return {
      summary: generateSummary(formData, finalRecommendedServices),
      recommendedServices: finalRecommendedServices,
      totalInvestment,
      timeline: formData.timeline === 'urgent' ? '1-2 months' : formData.timeline === 'standard' ? '3-6 months' : '6+ months',
      expectedOutcomes: finalRecommendedServices.flatMap(service => service.expectedOutcomes),
      implementationPlan,
      nextSteps
    };
  };

  const getServiceDeliverables = (serviceId: string): string[] => {
    const deliverables: Record<string, string[]> = {
      'media-relations': [
        'Media contact database and relationship mapping',
        'Press release strategy and distribution',
        'Media pitch development and outreach',
        'B2B partnership identification'
      ],
      'web-presence': [
        'User experience research and wireframing',
        'Modern, responsive website design',
        'Conversion optimization implementation',
        'SEO optimization and technical improvements'
      ],
      'photo-printing': [
        'Brand activation concept development',
        'Event space design and setup',
        'High-quality printing and signage',
        'Interactive installation design'
      ],
      'content-campaigns': [
        'Content strategy and editorial calendar',
        'Blog posts, whitepapers, and case studies',
        'Social media content and campaigns',
        'Email marketing sequences'
      ],
      'partnership-development': [
        'Partnership opportunity analysis',
        'Potential partner research and outreach',
        'Partnership proposal development',
        'Collaboration agreement facilitation'
      ],
      'brand-strategy': [
        'Brand positioning and messaging framework',
        'Visual identity guidelines and standards',
        'Brand voice and tone guidelines',
        'Competitive analysis and differentiation strategy'
      ]
    };
    return deliverables[serviceId] || [];
  };

  const adjustInvestment = (baseInvestment: string, budget: string): string => {
    if (budget === 'low') return baseInvestment.split(' - ')[0];
    if (budget === 'high') return baseInvestment.split(' - ')[1];
    return baseInvestment;
  };

  const adjustTimeline = (baseTimeline: string, timeline: string): string => {
    if (timeline === 'urgent') return '1-2 months';
    if (timeline === 'flexible') return baseTimeline;
    return baseTimeline;
  };

  const getExpectedOutcomes = (serviceId: string, goal: string): string[] => {
    const outcomes: Record<string, string[]> = {
      'media-relations': [
        'Increased media coverage and brand visibility',
        'Stronger industry relationships and partnerships',
        'Enhanced thought leadership positioning'
      ],
      'web-presence': [
        'Higher website conversion rates',
        'Improved search engine rankings',
        'Better user engagement and time on site'
      ],
      'photo-printing': [
        'Increased brand awareness and recognition',
        'Higher engagement at events and activations',
        'Professional materials that build trust'
      ],
      'content-campaigns': [
        'Increased website traffic and engagement',
        'Stronger brand authority and thought leadership',
        'Higher email list growth and engagement'
      ],
      'partnership-development': [
        'Expanded market reach and customer base',
        'Shared marketing costs and resources',
        'Enhanced credibility through association'
      ],
      'brand-strategy': [
        'Clearer brand message and positioning',
        'Increased brand recognition and recall',
        'Better customer understanding and trust'
      ]
    };
    return outcomes[serviceId] || [];
  };

  const calculateTotalInvestment = (services: GeneratedProposal['recommendedServices']): string => {
    const total = services.reduce((sum, service) => {
      // Handle investment ranges like "$5,000 - $15,000"
      const investmentStr = service.investment.replace(/[$,]/g, '');
      let amount = 0;
      
      if (investmentStr.includes(' - ')) {
        // Take the average of the range
        const [min, max] = investmentStr.split(' - ').map(num => parseInt(num.trim()));
        amount = (min + max) / 2;
      } else {
        amount = parseInt(investmentStr);
      }
      
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return `$${Math.round(total).toLocaleString()}`;
  };

  const generateImplementationPlan = (services: GeneratedProposal['recommendedServices'], timeline: string): string[] => {
    const plans = [
      'Initial consultation and project scoping',
      'Detailed requirements gathering and analysis',
      'Strategy development and approval',
      'Implementation and execution',
      'Testing and quality assurance',
      'Launch and go-live support',
      'Post-launch monitoring and optimization'
    ];
    
    if (timeline === 'urgent') {
      plans.splice(1, 1); // Remove detailed requirements gathering for urgent projects
    }
    
    return plans;
  };

  const generateNextSteps = (preferredContact: string): string[] => {
    const steps = [
      'Review and approve proposal',
      'Schedule kickoff meeting',
      'Sign service agreement',
      'Begin project implementation'
    ];
    
    if (preferredContact === 'phone') {
      steps.splice(1, 0, 'Phone consultation call');
    } else {
      steps.splice(1, 0, 'Email follow-up with detailed questions');
    }
    
    return steps;
  };

  const generateSummary = (formData: ProposalForm, services: GeneratedProposal['recommendedServices']): string => {
    return `Based on ${formData.companyName}'s goals of ${formData.primaryGoal} and current challenges including ${formData.currentChallenges.slice(0, 3).join(', ')}, we recommend a comprehensive approach combining ${services.length} strategic services. This tailored solution addresses your specific needs while working within your ${formData.budget} budget and ${formData.timeline} timeline requirements.`;
  };

  const handleGenerateProposal = () => {
    const proposal = generateProposal();
    setGeneratedProposal(proposal);
    setShowProposal(true);
  };

  const downloadProposal = async () => {
    if (!generatedProposal) return;

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.4;
        });
        yPosition += 5; // Add some spacing after text
      };

      // Header
      pdf.setFillColor(16, 24, 64); // Dark blue background
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Marketing Proposal', margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 35);

      yPosition = 55;
      pdf.setTextColor(0, 0, 0);

      // Company Information
      addText('COMPANY INFORMATION', 16, true);
      addText(`Company: ${formData.companyName}`);
      addText(`Industry: ${formData.industry}`);
      addText(`Business Size: ${formData.businessSize}`);
      addText(`Primary Goal: ${formData.primaryGoal}`);
      addText(`Current Challenges: ${formData.currentChallenges}`);
      addText(`Budget Range: ${formData.budget}`);
      addText(`Timeline: ${formData.timeline}`);
      yPosition += 10;

      // Recommended Services
      addText('RECOMMENDED SERVICES', 16, true);
      generatedProposal.recommendedServices.forEach((service, index) => {
        addText(`${index + 1}. ${service.title}`, 14, true);
        addText(`${service.description}`);
        addText(`Investment: ${service.investment}`);
        addText(`Timeline: ${service.timeline}`);
        
        if (service.deliverables && service.deliverables.length > 0) {
          addText('Key Deliverables:', 12, true);
          service.deliverables.forEach((deliverable) => {
            addText(`• ${deliverable}`);
          });
        }
        yPosition += 5;
      });

      // Investment Summary
      addText('INVESTMENT SUMMARY', 16, true);
      addText(`Total Estimated Investment: ${generatedProposal.totalInvestment}`, 14, true);
      addText(`Project Timeline: ${generatedProposal.timeline}`);
      yPosition += 10;

      // Expected Outcomes
      if (generatedProposal.expectedOutcomes && generatedProposal.expectedOutcomes.length > 0) {
        addText('EXPECTED OUTCOMES', 16, true);
        generatedProposal.expectedOutcomes.forEach((outcome: string) => {
          addText(`• ${outcome}`);
        });
        yPosition += 10;
      }

      // Contact Information
      addText('CONTACT INFORMATION', 16, true);
      addText(`Name: ${formData.contactInfo.name}`);
      addText(`Email: ${formData.contactInfo.email}`);
      if (formData.contactInfo.phone) {
        addText(`Phone: ${formData.contactInfo.phone}`);
      }
      addText(`Preferred Contact: ${formData.contactInfo.preferredContact}`);
      yPosition += 10;

      // Footer
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Marketing Mousetrap Agency - Strategic Marketing Solutions', margin, footerY);
      pdf.text('Contact us to discuss your project in detail', margin, footerY + 5);

      // Generate filename
      const filename = `${formData.companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_marketing_proposal_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF locally
      pdf.save(filename);

      // Also upload to GitHub
      try {
        const pdfBlob = pdf.output('blob');
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result as string;
            
            console.log('Uploading proposal to GitHub:', filename);
            
            const response = await fetch('/api/upload-proposal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filename,
                pdfData: base64Data,
                proposalData: {
                  companyName: formData.companyName,
                  contactInfo: formData.contactInfo,
                  totalInvestment: generatedProposal.totalInvestment,
                  recommendedServices: generatedProposal.recommendedServices,
                },
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log('Successfully uploaded to GitHub:', result);
            } else {
              const errorText = await response.text();
              console.error('GitHub upload failed:', response.status, errorText);
            }
          } catch (uploadError) {
            console.error('Error in GitHub upload process:', uploadError);
          }
        };
        reader.readAsDataURL(pdfBlob);
      } catch (uploadError) {
        console.error('Error preparing GitHub upload:', uploadError);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const sendProposal = () => {
    // In a real implementation, this would send the proposal via email
    alert('Proposal email functionality would be implemented here');
  };

  if (showProposal && generatedProposal) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Custom Proposal</h3>
          <p className="text-gray-600">Personalized recommendations for {formData.companyName}</p>
        </div>

        {/* Executive Summary */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
          <p className="text-gray-700">{generatedProposal.summary}</p>
        </div>

        {/* Recommended Services */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Services</h4>
          <div className="space-y-6">
            {generatedProposal.recommendedServices.map((service, index) => (
              <div key={service.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h5>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{service.investment}</div>
                    <div className="text-sm text-gray-500">Investment</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-semibold text-gray-900 mb-3">Deliverables</h6>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-gray-900 mb-3">Expected Outcomes</h6>
                    <ul className="space-y-2">
                      {service.expectedOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Timeline: {service.timeline}</span>
                    <span>Priority: {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Total Investment</h4>
            <div className="text-4xl font-bold text-blue-600 mb-2">{generatedProposal.totalInvestment}</div>
            <p className="text-gray-600">Comprehensive solution for your business needs</p>
          </div>
        </div>

        {/* Implementation Plan */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Implementation Plan</h4>
          <div className="space-y-3">
            {generatedProposal.implementationPlan.map((step, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h4>
          <div className="space-y-3">
            {generatedProposal.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <ArrowRight className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadProposal}
            className="flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button
            onClick={sendProposal}
            className="flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send via Email
          </button>
          <button
            onClick={() => setShowProposal(false)}
            className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-2" />
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
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Proposal Generator</h3>
        <p className="text-gray-600">Get a personalized service proposal tailored to your business needs</p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step 1: Company Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => updateFormData('companyName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your industry</option>
              <option value="b2b">B2B/Professional Services</option>
              <option value="ecommerce">E-commerce/Retail</option>
              <option value="events">Events/Experiential</option>
              <option value="technology">Technology/SaaS</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Size *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'small', label: 'Small (1-10)', description: 'Startup/Small Business' },
                { value: 'medium', label: 'Medium (11-100)', description: 'Growing Company' },
                { value: 'large', label: 'Large (100+)', description: 'Enterprise' }
              ].map((size) => (
                <label
                  key={size.value}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.businessSize === size.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="businessSize"
                    value={size.value}
                    checked={formData.businessSize === size.value}
                    onChange={(e) => updateFormData('businessSize', e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{size.label}</div>
                    <div className="text-xs text-gray-500">{size.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Goals and Challenges */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Goals and Challenges</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Business Goal *
            </label>
            <select
              value={formData.primaryGoal}
              onChange={(e) => updateFormData('primaryGoal', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your primary goal</option>
              {goalOptions.map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Challenges (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {challengeOptions.map((challenge) => (
                <label
                  key={challenge}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.currentChallenges.includes(challenge)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.currentChallenges.includes(challenge)}
                    onChange={() => toggleArrayField('currentChallenges', challenge)}
                    className="sr-only"
                  />
                  <div className="text-sm text-gray-900">{challenge}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Services and Budget */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Services and Budget</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services of Interest (Select all that apply)
            </label>
            <div className="space-y-3">
              {serviceOptions.map((service) => (
                <label
                  key={service.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.selectedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => toggleArrayField('selectedServices', service.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{service.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{service.description}</div>
                      <div className="text-xs text-gray-500">
                        Investment: {service.baseInvestment} • Timeline: {service.timeline}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => updateFormData('budget', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select budget range</option>
                <option value="low">$5,000 - $15,000</option>
                <option value="medium">$15,000 - $50,000</option>
                <option value="high">$50,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => updateFormData('timeline', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select timeline</option>
                <option value="urgent">Urgent (1-2 months)</option>
                <option value="standard">Standard (3-6 months)</option>
                <option value="flexible">Flexible (6+ months)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact Information */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.contactInfo.name}
                onChange={(e) => updateContactInfo('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method *
              </label>
              <select
                value={formData.contactInfo.preferredContact}
                onChange={(e) => updateContactInfo('preferredContact', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <strong>Next:</strong> We'll generate a personalized proposal based on your inputs and send it to your preferred contact method.
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>
        
        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleGenerateProposal}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Generate Proposal
          </button>
        )}
      </div>
    </div>
  );
}
