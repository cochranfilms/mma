import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { caseStudies } from '@/content/case-studies';
import { ArrowRight, TrendingUp, Users, Target, Award } from 'lucide-react';
import CevenSkinFeatured from '@/components/sections/CevenSkinFeatured';
import DomonoFeatured from '@/components/sections/DomonoFeatured';
import Image from 'next/image';

export const metadata: Metadata = generatePageMetadata('work');

export default function WorkPage() {
  const featuredCaseStudies = caseStudies.filter(study => study.featured);
  const allCaseStudies = caseStudies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Work
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Real results from real clients. See how we've transformed businesses across industries.
          </p>
        </div>
      </section>

      {/* MMA Featured Showcases */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <CevenSkinFeatured />
          <DomonoFeatured />
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-20 bg-white">
        {/* Case Study Showcase Images */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => {
              const imageCategories = ['b2b-marketing', 'media-connections', 'web-presence'];
              const imageCategory = imageCategories[index - 1];
              
              return (
                <div
                  key={index}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={`/media-assets/images/${imageCategory}-card-${index}.jpg`}
                      alt={`Case study ${index} - Professional B2B marketing`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold mb-2">Case Study {index}</h3>
                      <p className="text-sm opacity-90">B2B Marketing Success Story</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most impactful work that demonstrates the transformative power of strategic marketing
            </p>
          </div>
          
          <div className="space-y-12">
            {featuredCaseStudies.map((study) => (
              <div key={study.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{study.client}</h3>
                      <p className="text-sm text-gray-600">{study.industry}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.title}</h3>
                    <p className="text-lg text-gray-600 mb-4">{study.subtitle}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                        <p className="text-gray-600 text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Strategy</h4>
                        <p className="text-gray-600 text-sm">{study.strategy}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Results</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {study.results.metrics.slice(0, 4).map((metric, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-600">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {study.services.slice(0, 2).map((service, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                      <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
                        Read Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Case Studies Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all our case studies and see the diverse range of industries and challenges we've tackled
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCaseStudies.map((study) => (
              <div key={study.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{study.title}</h3>
                      <p className="text-sm text-gray-600">{study.client}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{study.subtitle}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Results</h4>
                    <div className="space-y-1">
                      {study.results.metrics.slice(0, 2).map((metric, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {study.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center">
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from the businesses we've helped transform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCaseStudies.map((study) => (
              <div key={study.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{study.testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{study.testimonial.title}, {study.testimonial.company}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic mb-4">
                  "{study.testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">{study.industry} Success Story</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Let's create your own case study of success. Schedule a consultation to discuss how we can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-900 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Your Project
            </button>
            <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-indigo-900 transition-colors">
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
