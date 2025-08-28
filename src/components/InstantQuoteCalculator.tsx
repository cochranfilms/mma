'use client';

import { useState, useEffect } from 'react';
import { services } from '@/content/services';
import { Calculator, DollarSign, TrendingUp, Clock, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';

interface AddOn { id: string; name: string; description?: string; price: number; }

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  addOns: AddOn[];
}

interface BusinessSize {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuoteBreakdown {
  basePrice: number;
  addOns: { addOn: AddOn; quantity: number; total: number }[];
  businessSizeMultiplier: number;
  urgencyMultiplier: number;
  totalPrice: number;
  monthlyPrice: number;
  savings: number;
}

const serviceOptions: ServiceOption[] = services
  .filter((s: any) => s.pricing)
  .map((s: any) => ({
    id: s.id,
    name: s.title,
    description: s.subtitle,
    basePrice: s.startingPrice,
    icon: Target,
    features: Array.isArray(s.deliverables) ? s.deliverables : [],
    addOns: (s.pricing?.addOns || []).map((a: any) => ({ id: a.id, name: a.name, description: a.description, price: a.price })),
  }));

const businessSizes: BusinessSize[] = [
  {
    id: 'startup',
    name: 'Startup (1-10 employees)',
    description: 'Early-stage companies with limited resources',
    multiplier: 0.8,
    icon: Target
  },
  {
    id: 'small',
    name: 'Small Business (11-50 employees)',
    description: 'Growing businesses with established processes',
    multiplier: 1.0,
    icon: Users
  },
  {
    id: 'medium',
    name: 'Medium Business (51-200 employees)',
    description: 'Established businesses with complex needs',
    multiplier: 1.3,
    icon: TrendingUp
  },
  {
    id: 'enterprise',
    name: 'Enterprise (200+ employees)',
    description: 'Large organizations with enterprise requirements',
    multiplier: 1.8,
    icon: CheckCircle
  }
];

export default function InstantQuoteCalculator() {
  const [selectedService, setSelectedService] = useState<string>(serviceOptions[0]?.id || 'web-development');
  const [selectedBusinessSize, setSelectedBusinessSize] = useState<string>('small');
  const [selectedAddOns, setSelectedAddOns] = useState<{ [key: string]: number }>({});
  const [urgency, setUrgency] = useState<'standard' | 'rush' | 'emergency'>('standard');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const urgencyMultipliers = {
    standard: 1.0,
    rush: 1.25,
    emergency: 1.5
  };

  useEffect(() => {
    calculateQuote();
  }, [selectedService, selectedBusinessSize, selectedAddOns, urgency]);

  const calculateQuote = () => {
    const service = serviceOptions.find(s => s.id === selectedService);
    const businessSize = businessSizes.find(b => b.id === selectedBusinessSize);
    
    if (!service || !businessSize) return;

    const basePrice = service.basePrice;
    const addOnsTotal = Object.entries(selectedAddOns).reduce((total, [addOnId, quantity]) => {
      const addOn = service.addOns.find((a: AddOn) => a.id === addOnId);
      return total + (addOn ? addOn.price * quantity : 0);
    }, 0);

    const businessSizeMultiplier = businessSize.multiplier;
    const urgencyMultiplier = urgencyMultipliers[urgency];
    
    const totalPrice = (basePrice + addOnsTotal) * businessSizeMultiplier * urgencyMultiplier;
    const monthlyPrice = totalPrice / 3; // Assuming 3-month engagement
    const savings = totalPrice * 0.15; // 15% savings for package deals

    setQuote({
      basePrice,
      addOns: Object.entries(selectedAddOns).map(([addOnId, quantity]) => {
        const addOn = service.addOns.find((a: AddOn) => a.id === addOnId);
        return {
          addOn: addOn!,
          quantity,
          total: addOn ? addOn.price * quantity : 0
        };
      }).filter(item => item.quantity > 0),
      businessSizeMultiplier,
      urgencyMultiplier,
      totalPrice,
      monthlyPrice,
      savings
    });
  };

  const handleAddOnChange = (addOnId: string, quantity: number) => {
    if (quantity === 0) {
      const newAddOns = { ...selectedAddOns };
      delete newAddOns[addOnId];
      setSelectedAddOns(newAddOns);
    } else {
      setSelectedAddOns(prev => ({ ...prev, [addOnId]: quantity }));
    }
  };

  const getSelectedService = () => serviceOptions.find(s => s.id === selectedService);
  const getSelectedBusinessSize = () => businessSizes.find(b => b.id === selectedBusinessSize);

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Service</h3>
        <p className="text-slate-300">Select the MMA service that best fits your needs</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400"
        />
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {serviceOptions.map((service) => {
          const IconComponent = service.icon;
          const isSelected = selectedService === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-6 rounded-xl transition-all duration-300 text-left border backdrop-blur ${
                isSelected
                  ? 'border-blue-500 bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <IconComponent className="w-6 h-6 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">{service.name}</h4>
                  <p className="text-sm text-slate-300 mb-3">{service.description}</p>
                  <div className="text-lg font-bold text-blue-300">Starting at ${service.basePrice?.toLocaleString()}</div>
                  <ul className="mt-2 space-y-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderBusinessSizeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Business Size</h3>
        <p className="text-slate-300">Select your company size for accurate pricing</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {businessSizes.map((size) => {
          const IconComponent = size.icon;
          const isSelected = selectedBusinessSize === size.id;
          
          return (
            <button
              key={size.id}
              onClick={() => setSelectedBusinessSize(size.id)}
              className={`p-6 rounded-xl transition-all duration-300 text-left border backdrop-blur ${
                isSelected
                  ? 'border-blue-500 bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <IconComponent className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{size.name}</h4>
                  <p className="text-sm text-slate-300 mb-2">{size.description}</p>
                  <div className="text-sm text-slate-300">
                    {size.multiplier === 1.0 ? 'Standard pricing' : 
                     size.multiplier < 1.0 ? `${Math.round((1 - size.multiplier) * 100)}% discount` :
                     `${Math.round((size.multiplier - 1) * 100)}% premium`}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderAddOnsSelection = () => {
    const service = getSelectedService();
    if (!service) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Add-On Services</h3>
          <p className="text-slate-300">Enhance your package with additional services</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {service.addOns.map((addOn) => {
            const quantity = selectedAddOns[addOn.id] || 0;
            
            return (
              <div key={addOn.id} className="border border-white/10 bg-white/5 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{addOn.name}</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{addOn.description}</p>
                    <div className="text-lg font-semibold text-blue-300">${addOn.price.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAddOnChange(addOn.id, Math.max(0, quantity - 1))}
                    className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => handleAddOnChange(addOn.id, quantity + 1)}
                    className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  >
                    +
                  </button>
                  {quantity > 0 && (
                    <span className="text-sm text-slate-300 ml-2">
                      Total: ${(addOn.price * quantity).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUrgencySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Project Timeline</h3>
        <p className="text-slate-300">Select your preferred timeline</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { id: 'standard', name: 'Standard', description: '4-6 weeks', multiplier: 1.0, color: 'bg-green-100 text-green-800' },
          { id: 'rush', name: 'Rush', description: '2-3 weeks', multiplier: 1.25, color: 'bg-yellow-100 text-yellow-800' },
          { id: 'emergency', name: 'Emergency', description: '1 week', multiplier: 1.5, color: 'bg-red-100 text-red-800' }
        ].map((option) => {
          const isSelected = urgency === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setUrgency(option.id as any)}
              className={`p-6 rounded-xl transition-all duration-300 text-center border backdrop-blur ${
                isSelected
                  ? 'border-blue-500 bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <h4 className="font-semibold text-white mb-2">{option.name}</h4>
              <p className="text-sm text-slate-300 mb-3">{option.description}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
                {option.multiplier === 1.0 ? 'No additional cost' : 
                 `${Math.round((option.multiplier - 1) * 100)}% rush fee`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderQuoteSummary = () => {
    if (!quote) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Instant Quote</h3>
          <p className="text-gray-600">Here's your personalized pricing breakdown</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quote Details */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${quote.totalPrice.toLocaleString()}
                </div>
                <p className="text-gray-600">Total Project Cost</p>
                <div className="text-lg font-semibold text-green-600 mt-2">
                  Save ${quote.savings.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Service:</span>
                  <span className="font-medium">${quote.basePrice.toLocaleString()}</span>
                </div>
                {quote.addOns.map((item) => (
                  <div key={item.addOn.id} className="flex justify-between">
                    <span className="text-gray-600">{item.addOn.name} (x{item.quantity}):</span>
                    <span className="font-medium">${item.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Size Multiplier:</span>
                  <span className="font-medium">{quote.businessSizeMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline Multiplier:</span>
                  <span className="font-medium">{quote.urgencyMultiplier}x</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">${quote.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Options */}
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Payment Options</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${quote.monthlyPrice.toLocaleString()}</div>
                    <div className="text-gray-600">per month (3 months)</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">Pay in Full</div>
                    <div className="text-sm text-gray-600">Save 15% on total cost</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/hubspot/capture', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email,
                          name,
                          listName: 'Instant Quote Leads',
                          event: 'instant_quote_generated',
                          properties: {
                            service: selectedService,
                            totalPrice: quote.totalPrice,
                            monthlyPrice: quote.monthlyPrice,
                            addOns: quote.addOns.map(a => ({ id: a.addOn.id, qty: a.quantity })),
                            businessSize: selectedBusinessSize,
                            urgency
                          }
                        })
                      });
                    } catch (_) {}
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
                  Schedule Consultation
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Quote valid for 30 days</p>
                <p className="mt-1">Need customization? <button className="text-blue-600 hover:underline">Contact us</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {renderServiceSelection()}
      {renderBusinessSizeSelection()}
      {renderAddOnsSelection()}
      {renderUrgencySelection()}
      {renderQuoteSummary()}
    </div>
  );
}
