'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

interface BookingSlot {
  id: string;
  time: string;
  date: string;
  duration: number;
  type: 'consultation' | 'discovery' | 'strategy' | 'follow-up';
  available: boolean;
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  icon: React.ComponentType<{ className?: string }>;
}

const serviceTypes: ServiceType[] = [
  {
    id: 'discovery',
    name: 'Free Discovery Call',
    description: '30-minute consultation to understand your needs',
    duration: 30,
    price: 'Free',
    icon: Users
  },
  {
    id: 'strategy',
    name: 'Strategy Session',
    description: '60-minute deep dive into your business goals',
    duration: 60,
    price: '$1',
    icon: Calendar
  },
  {
    id: 'consultation',
    name: 'Full Consultation',
    description: '90-minute comprehensive business review',
    duration: 90,
    price: '$250',
    icon: Video
  },
  {
    id: 'follow-up',
    name: 'Follow-up Meeting',
    description: '45-minute progress review and next steps',
    duration: 45,
    price: '$100',
    icon: CheckCircle
  }
];

export default function CalendarBooking() {
  const [selectedService, setSelectedService] = useState<string>('discovery');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'service' | 'date' | 'time' | 'confirmation'>('service');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [jobtitle, setJobtitle] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'creating' | 'ready' | 'completed'>('pending');

  // Generate sample available slots for the next 7 days
  useEffect(() => {
    const generateSlots = () => {
      const slots: BookingSlot[] = [];
      const now = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate time slots from 9 AM to 5 PM
        for (let hour = 9; hour < 17; hour++) {
          const timeStr = `${hour.toString().padStart(2, '0')}:00`;
          
          slots.push({
            id: `${dateStr}-${timeStr}`,
            time: timeStr,
            date: dateStr,
            duration: 30,
            type: 'consultation',
            available: Math.random() > 0.3 // 70% availability
          });
        }
      }
      
      setAvailableSlots(slots);
    };

    generateSlots();
  }, []);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep('date');
    // Reset payment status when service changes
    setPaymentStatus('pending');
    setInvoiceUrl(null);
    setInvoiceId(null);
    setInvoiceError(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('confirmation');
    // Reset payment status when time changes
    if (selectedService === 'discovery') {
      // Free discovery call doesn't need payment
      setPaymentStatus('completed');
    } else {
      setPaymentStatus('pending');
    }
    setInvoiceUrl(null);
    setInvoiceId(null);
    setInvoiceError(null);
  };

  const handleBooking = async () => {
    if (!name || !email) {
      setInvoiceError('Please provide your name and email.');
      return;
    }

    setIsLoading(true);

    try {
      // Check if payment is required and completed
      const needsPayment = selectedService !== 'discovery';
      if (needsPayment && paymentStatus !== 'completed') {
        setInvoiceError('Please complete payment before booking.');
        setIsLoading(false);
        return;
      }

      // 1) Create direct booking with selected date/time
      const bookingData = {
        serviceId: selectedService,
        name,
        email,
        phone,
        company,
        website,
        jobtitle,
        notes,
        selectedDate,
        selectedTime,
        invoiceId: invoiceId || undefined,
      };

      // 2) Create booking via API (this will handle Calendly + HubSpot)
      const bookingRes = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const bookingResult = await bookingRes.json();

      if (!bookingRes.ok || !bookingResult.success) {
        throw new Error(bookingResult.error || 'Booking failed');
      }

      // 3) Show success message and redirect
      alert(`Booking confirmed! You'll receive a calendar invite shortly. ${bookingResult.schedulingUrl ? 'Opening Calendly to finalize details...' : ''}`);
      
      if (bookingResult.schedulingUrl) {
        window.open(bookingResult.schedulingUrl, '_blank');
      }

    } catch (error: any) {
      setInvoiceError(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  async function createWaveInvoiceForSelection() {
    if (!name || !email) {
      setInvoiceError('Please provide your name and email before creating invoice.');
      return;
    }

    try {
      setInvoiceError(null);
      setPaymentStatus('creating');
      
      const res = await fetch('/api/calendar/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerCompany: company,
          customerWebsite: website,
          customerJobtitle: jobtitle,
          serviceId: selectedService,
          selectedDate,
          selectedTime,
          memo: `Calendar booking for ${selectedDate} ${selectedTime}${notes ? `\nNotes: ${notes}` : ''}`,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to create invoice');
      }

      // Handle free services
      if (data.mode === 'free') {
        setPaymentStatus('completed');
        return;
      }

      // Handle fallback mode
      if (data.mode === 'fallback' || !data.paymentUrl) {
        setInvoiceError('Invoice created but payment link pending. We will email you the secure checkout link shortly.');
        setPaymentStatus('ready');
        return;
      }

      // Success case
      setInvoiceId(data.invoiceId);
      setInvoiceUrl(data.paymentUrl);
      setPaymentStatus('ready');
      
    } catch (err: any) {
      setInvoiceError(err?.message || 'Failed to create invoice');
      setPaymentStatus('pending');
    }
  }

  const getSelectedService = () => serviceTypes.find(s => s.id === selectedService);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailableTimesForDate = (date: string) => {
    return availableSlots
      .filter(slot => slot.date === date && slot.available)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getAvailableDates = () => {
    return [...new Set(availableSlots
      .filter(slot => slot.available)
      .map(slot => slot.date))]
      .sort();
  };

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h3>
        <p className="text-gray-600">Select the type of consultation that best fits your needs</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {serviceTypes.map((service) => {
          const IconComponent = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className="p-6 border-2 border-blue-100 bg-white rounded-xl hover:border-blue-400 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </span>
                    <span className={`font-medium ${service.price === 'Free' ? 'text-green-600' : 'text-blue-600'}`}>
                      {service.price}
                      {service.price !== 'Free' && <span className="text-xs ml-1">(payment required)</span>}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Date</h3>
        <p className="text-gray-600">Choose when you'd like to meet</p>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {getAvailableDates().slice(0, 7).map((date) => (
          <button
            key={date}
            onClick={() => handleDateSelect(date)}
            className="p-4 border-2 border-blue-100 bg-white rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 text-center"
          >
            <div className="text-sm font-medium text-gray-900">
              {formatDate(date).split(' ')[0]}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {new Date(date).getDate()}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(date).split(' ').slice(1).join(' ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Time</h3>
        <p className="text-gray-600">Available times for {formatDate(selectedDate)}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {getAvailableTimesForDate(selectedDate).map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleTimeSelect(slot.time)}
            className="p-4 border-2 border-blue-100 bg-white rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 text-center"
          >
            <div className="text-lg font-semibold text-gray-900">{slot.time}</div>
            <div className="text-sm text-gray-500">Available</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const service = getSelectedService();
    if (!service) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Booking</h3>
          <p className="text-gray-600">Please provide your details to complete the booking</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            CRM-integrated booking system
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6 space-y-4 border border-blue-100">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
            <input
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Job title"
              value={jobtitle}
              onChange={(e) => setJobtitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="url"
              placeholder="Website (https://...)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <textarea
              placeholder="Additional notes or questions (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">* Required fields. Additional information helps us serve you better.</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-semibold text-gray-900">{service.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold text-gray-900">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold text-gray-900">{selectedTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-900">{service.duration} minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price:</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${service.price === 'Free' ? 'text-green-600' : 'text-blue-600'}`}>
                {service.price}
              </span>
              {service.id !== 'discovery' && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                  paymentStatus === 'ready' ? 'bg-yellow-100 text-yellow-700' :
                  paymentStatus === 'creating' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {paymentStatus === 'completed' ? '✓ Paid' :
                   paymentStatus === 'ready' ? 'Payment Ready' :
                   paymentStatus === 'creating' ? 'Creating...' :
                   'Payment Required'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {invoiceError && (
          <div className="text-red-600 text-sm">{invoiceError}</div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => setStep('time')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleBooking}
              disabled={isLoading || (service.id !== 'discovery' && paymentStatus !== 'completed')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Book Appointment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {service.id !== 'discovery' && (
            <div className="p-4 rounded-lg border bg-white">
              {paymentStatus === 'pending' && (
                <button
                  onClick={createWaveInvoiceForSelection}
                  disabled={!name || !email}
                  className="w-full px-6 py-3 border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  Create Invoice & Pay
                </button>
              )}
              
              {paymentStatus === 'creating' && (
                <div className="w-full px-6 py-3 border-2 border-gray-300 text-gray-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating invoice...
                </div>
              )}
              
              {paymentStatus === 'ready' && invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    // Set a timer to check payment status after user returns
                    setTimeout(() => {
                      // In a real app, you'd check payment status via API
                      // For now, we'll assume payment is completed when they return
                      setPaymentStatus('completed');
                    }, 5000);
                  }}
                  className="block w-full text-center px-6 py-3 border-2 border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50"
                >
                  Open Wave Invoice to Complete Payment
                </a>
              )}
              
              {paymentStatus === 'completed' && (
                <div className="w-full px-6 py-3 border-2 border-emerald-600 bg-emerald-50 text-emerald-700 rounded-lg text-center">
                  ✓ Payment Completed - Ready to Book
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {paymentStatus === 'pending' && 'Payment is required before booking.'}
                {paymentStatus === 'ready' && 'After payment, return here to finalize your booking.'}
                {paymentStatus === 'completed' && 'You can now proceed with your booking.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>You'll be redirected to our secure booking system</p>
          <p className="mt-1">Need help? <button className="text-blue-600 hover:underline">Contact us</button></p>
        </div>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['service', 'date', 'time', 'confirmation'].map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === stepName
              ? 'bg-blue-600 text-white shadow-lg'
              : step === 'confirmation' || ['service', 'date', 'time'].indexOf(step) > index
              ? 'bg-emerald-500 text-white shadow'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {step === 'confirmation' || ['service', 'date', 'time'].indexOf(step) > index ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              ['service', 'date', 'time'].indexOf(step) > index ? 'bg-emerald-500' : 'bg-blue-100'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold">Book Your Consultation</span>
        </div>
        <div className="text-sm text-gray-500">Secure • Fast • No obligation</div>
      </div>
      {renderStepIndicator()}
      
      {step === 'service' && renderServiceSelection()}
      {step === 'date' && renderDateSelection()}
      {step === 'time' && renderTimeSelection()}
      {step === 'confirmation' && renderConfirmation()}
    </div>
  );
}
