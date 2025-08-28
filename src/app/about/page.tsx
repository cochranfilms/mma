import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { CheckCircle, Users, Target, Award, TrendingUp, Heart, Zap, Shield } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = generatePageMetadata('about');

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'We measure success by the tangible impact we create for our clients, not just the work we deliver.'
    },
    {
      icon: Heart,
      title: 'Client-First',
      description: 'Your success is our success. We build long-term partnerships based on trust, transparency, and mutual growth.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We stay ahead of industry trends and leverage cutting-edge strategies to give you a competitive advantage.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Honest communication, ethical practices, and delivering on our promises - always.'
    }
  ];

  const stats = [
    { number: '150+', label: 'Projects Completed' },
    { number: '95%', label: 'Client Satisfaction' },
    { number: '3x', label: 'Average ROI Increase' },
    { number: '5+', label: 'Years of Experience' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former marketing executive with 15+ years experience transforming brands across industries.',
      expertise: ['Brand Strategy', 'Media Relations', 'Business Development']
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      bio: 'Award-winning designer and strategist who believes great design drives business results.',
      expertise: ['Visual Identity', 'User Experience', 'Creative Strategy']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Digital Marketing Lead',
      bio: 'Data-driven marketer specializing in conversion optimization and growth strategies.',
      expertise: ['Digital Strategy', 'Analytics', 'Conversion Optimization']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About MMA
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            We're a strategic marketing agency that transforms businesses through innovative solutions and measurable results.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 2019, MMA was born from a simple belief: marketing should drive real business results, not just create pretty campaigns.
                </p>
                <p>
                  We started with a small team of industry veterans who were frustrated by agencies that prioritized creativity over conversion, style over strategy.
                </p>
                <p>
                  Today, we've grown into a full-service agency that has helped over 150 businesses across industries achieve remarkable growth through strategic marketing that actually works.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700">
                  To empower businesses with strategic marketing solutions that drive measurable growth, build lasting brand value, and create meaningful connections with their audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every relationship we build
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              The results speak for themselves - here's what we've accomplished together
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals behind every successful campaign and transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-green-600 font-medium">{member.role}</p>
                </div>
                
                <p className="text-gray-600 text-center mb-6">{member.bio}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Expertise:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MMA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another marketing agency. Here's what makes us different.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Results-Focused Approach</h3>
                  <p className="text-gray-600">Every strategy, every campaign, every piece of content is designed with one goal: driving measurable business results.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Industry Expertise</h3>
                  <p className="text-gray-600">Our team brings deep experience across multiple industries, giving us unique insights into what works for your business.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transparent Communication</h3>
                  <p className="text-gray-600">You'll always know what we're doing, why we're doing it, and how it's performing. No surprises, no hidden agendas.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Solutions</h3>
                  <p className="text-gray-600">We don't believe in one-size-fits-all. Every strategy is tailored to your unique business, goals, and market position.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Long-term Partnership</h3>
                  <p className="text-gray-600">We're not here for quick wins. We build lasting relationships that grow with your business.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Proven Track Record</h3>
                  <p className="text-gray-600">Our case studies and client testimonials demonstrate our ability to deliver consistent, measurable results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Let's discuss how our team can help transform your business and achieve your marketing goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-900 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Schedule a Consultation
            </button>
            <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-green-900 transition-colors">
              View Our Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
