'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Target, BarChart3 } from 'lucide-react';

interface ROICalculation {
  service: string;
  investment: number;
  projectedReturn: number;
  roi: number;
  timeframe: string;
  metrics: {
    leads: number;
    conversions: number;
    revenue: number;
    brandValue: number;
  };
}

const serviceROIData = {
  'media-relations': {
    name: 'Media Relations & B2B Connections',
    baseInvestment: 5000,
    avgROI: 3.2,
    timeframe: '6-12 months',
    metrics: {
      leads: 0.15,
      conversions: 0.08,
      revenue: 0.25,
      brandValue: 0.12
    }
  },
  'web-presence': {
    name: 'Web Presence Upgrades',
    baseInvestment: 7500,
    avgROI: 4.1,
    timeframe: '3-6 months',
    metrics: {
      leads: 0.35,
      conversions: 0.22,
      revenue: 0.45,
      brandValue: 0.18
    }
  },
  'photo-printing': {
    name: 'Photo & On-Site Printing & Activations',
    baseInvestment: 8000,
    avgROI: 2.8,
    timeframe: '1-3 months',
    metrics: {
      leads: 0.08,
      conversions: 0.05,
      revenue: 0.15,
      brandValue: 0.25
    }
  },
  'content-campaigns': {
    name: 'Content & Campaigns',
    baseInvestment: 6000,
    avgROI: 3.5,
    timeframe: '4-8 months',
    metrics: {
      leads: 0.25,
      conversions: 0.15,
      revenue: 0.30,
      brandValue: 0.20
    }
  },
  'partnership-development': {
    name: 'Strategic Partnership Development',
    baseInvestment: 10000,
    avgROI: 3.8,
    timeframe: '8-15 months',
    metrics: {
      leads: 0.20,
      conversions: 0.12,
      revenue: 0.35,
      brandValue: 0.15
    }
  },
  'brand-strategy': {
    name: 'Brand Strategy & Positioning',
    baseInvestment: 12000,
    avgROI: 3.0,
    timeframe: '6-12 months',
    metrics: {
      leads: 0.10,
      conversions: 0.08,
      revenue: 0.20,
      brandValue: 0.30
    }
  }
};

export default function ROICalculator() {
  const [selectedService, setSelectedService] = useState('media-relations');
  const [customInvestment, setCustomInvestment] = useState<number | ''>('');
  const [businessSize, setBusinessSize] = useState('medium');
  const [industry, setIndustry] = useState('b2b');
  const [showResults, setShowResults] = useState(false);

  const businessSizeMultipliers = {
    small: 0.7,
    medium: 1.0,
    large: 1.4
  };

  const industryMultipliers = {
    b2b: 1.0,
    ecommerce: 1.2,
    events: 0.9,
    technology: 1.3
  };

  const calculateROI = (): ROICalculation => {
    const serviceData = serviceROIData[selectedService as keyof typeof serviceROIData];
    const investment = customInvestment || serviceData.baseInvestment;
    const sizeMultiplier = businessSizeMultipliers[businessSize as keyof typeof businessSizeMultipliers];
    const industryMultiplier = industryMultipliers[industry as keyof typeof industryMultipliers];
    
    // Calculate projected return with multipliers
    const baseReturn = investment * serviceData.avgROI;
    const adjustedReturn = baseReturn * sizeMultiplier * industryMultiplier;
    
    const roi = ((adjustedReturn - investment) / investment) * 100;
    
    // Calculate metrics
    const metrics = {
      leads: Math.round(investment * serviceData.metrics.leads * sizeMultiplier * industryMultiplier),
      conversions: Math.round(investment * serviceData.metrics.conversions * sizeMultiplier * industryMultiplier),
      revenue: Math.round(investment * serviceData.metrics.revenue * sizeMultiplier * industryMultiplier),
      brandValue: Math.round(investment * serviceData.metrics.brandValue * sizeMultiplier * industryMultiplier)
    };

    return {
      service: serviceData.name,
      investment,
      projectedReturn: Math.round(adjustedReturn),
      roi: Math.round(roi * 100) / 100,
      timeframe: serviceData.timeframe,
      metrics
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const resetCalculator = () => {
    setSelectedService('media-relations');
    setCustomInvestment('');
    setBusinessSize('medium');
    setIndustry('b2b');
    setShowResults(false);
  };

  const currentService = serviceROIData[selectedService as keyof typeof serviceROIData];

  if (showResults) {
    const calculation = calculateROI();
    
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">ROI Projection Results</h3>
          <p className="text-gray-600">Based on your business profile and selected service</p>
        </div>

        {/* Main ROI Display */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{calculation.roi}%</div>
            <div className="text-blue-100 text-lg">Projected ROI</div>
          </div>
        </div>

        {/* Investment vs Return */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <DollarSign className="w-5 h-5 text-red-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Investment</h4>
            </div>
            <div className="text-2xl font-bold text-red-600">${calculation.investment.toLocaleString()}</div>
            <div className="text-sm text-gray-500">One-time cost</div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Projected Return</h4>
            </div>
            <div className="text-2xl font-bold text-green-600">${calculation.projectedReturn.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Over {calculation.timeframe}</div>
          </div>
        </div>

        {/* Expected Metrics */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Expected Business Impact</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">{calculation.metrics.leads}</div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">{calculation.metrics.conversions}</div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-600">${calculation.metrics.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Revenue Impact</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-600">${calculation.metrics.brandValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Brand Value</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These projections are estimates based on industry averages and typical results. 
            Actual results may vary based on market conditions, implementation quality, and other factors.
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetCalculator}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors mr-4"
          >
            Calculate Again
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
          <Calculator className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">ROI Calculator</h3>
        <p className="text-gray-600">See the potential business impact of our services</p>
      </div>

      <div className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select a Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(serviceROIData).map(([key, service]) => (
              <option key={key} value={key}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Investment Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              value={customInvestment}
              onChange={(e) => setCustomInvestment(e.target.value ? Number(e.target.value) : '')}
              placeholder={currentService.baseInvestment.toString()}
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Recommended: ${currentService.baseInvestment.toLocaleString()}
          </p>
        </div>

        {/* Business Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Size
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
                  businessSize === size.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="businessSize"
                  value={size.value}
                  checked={businessSize === size.value}
                  onChange={(e) => setBusinessSize(e.target.value)}
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

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Primary Industry
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'b2b', label: 'B2B/Professional Services' },
              { value: 'ecommerce', label: 'E-commerce/Retail' },
              { value: 'events', label: 'Events/Experiential' },
              { value: 'technology', label: 'Technology/SaaS' }
            ].map((ind) => (
              <label
                key={ind.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  industry === ind.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="industry"
                  value={ind.value}
                  checked={industry === ind.value}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium text-gray-900">{ind.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Service Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Selected Service: {currentService.name}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Base Investment:</span>
              <div className="font-medium">${currentService.baseInvestment.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-500">Typical ROI:</span>
              <div className="font-medium">{currentService.avgROI}x</div>
            </div>
            <div>
              <span className="text-gray-500">Timeframe:</span>
              <div className="font-medium">{currentService.timeframe}</div>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>
              <div className="font-medium capitalize">{selectedService.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleCalculate}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Calculate ROI Projection
        </button>
      </div>
    </div>
  );
}
