import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// Removed local file and GitHub persistence in favor of HubSpot CRM
import { upsertContact, createNoteForContact, ensureStaticList, addEmailToList } from '@/lib/hubspot';
import { services as catalogServices } from '@/content/services';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  url: string;
  email: string;
  name?: string;
  phone?: string;
  jobtitle?: string;
}

interface Lead {
  id: string;
  email: string;
  website: string;
  analysisScore: number;
  analysisData: any;
  createdAt: string;
  source: string;
}


export async function POST(request: NextRequest) {
  try {
    const { url, email, name, phone, jobtitle }: AnalysisRequest = await request.json();

    console.log('🔍 Starting analysis for:', { url, email, name });

    if (!url || !email) {
      return NextResponse.json(
        { error: 'URL and email are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('✅ OpenAI API key found');

    // Step 1: Scrape website content
    console.log('📡 Scraping website content...');
    const websiteContent = await scrapeWebsite(url);
    console.log('✅ Website content scraped:', websiteContent.substring(0, 200) + '...');
    
    // Step 2: Analyze with OpenAI
    console.log('🤖 Analyzing with OpenAI...');
    const analysis = await analyzeWithAI(url, websiteContent);
    console.log('✅ OpenAI analysis complete:', { 
      overallScore: analysis.overallScore,
      criticalIssuesCount: analysis.criticalIssues?.length || 0,
      hasRecommendations: !!analysis.opportunities
    });
    
    // Step 3: Generate service recommendations
    console.log('🎯 Generating service recommendations...');
    const scraped = JSON.parse(websiteContent || '{}');
    const recommendations = generateServiceRecommendations(analysis, scraped);
    console.log('✅ Service recommendations generated:', recommendations.length, 'services');
    
    // Construct lead once and reuse for storage and GitHub upload
    const newLead: Lead = {
      id: Date.now().toString(),
      email,
      website: url,
      analysisScore: analysis.overallScore,
      analysisData: analysis,
      createdAt: new Date().toISOString(),
      source: 'website-analyzer'
    };

    // Step 4: Send to HubSpot CRM
    console.log('📥 Sending analysis lead to HubSpot...');
    let hubspotContactId: string | null = null;
    try {
      hubspotContactId = await upsertContact({
        email,
        firstname: name?.split(' ')?.[0],
        lastname: name?.split(' ')?.slice(1).join(' '),
        company: scraped?.url ? new URL(scraped.url).hostname : undefined,
        website: url,
        phone: phone,
        jobtitle: jobtitle || 'Website Domination Analyzer Lead',
      });
      const noteBody = `Website Analyzer Result\nURL: ${url}\nOverall Score: ${analysis.overallScore}\nCritical Issues: ${analysis.criticalIssues?.join(' | ')}`;
      await createNoteForContact({
        contactId: hubspotContactId,
        title: 'Website Domination Analyzer Result',
        body: noteBody,
      });
      // Ensure and add to list for analyzer leads
      const listId = await ensureStaticList('Website Domination Analyzer Leads');
      await addEmailToList(listId, email);
    } catch (hsErr) {
      console.error('HubSpot error:', hsErr);
    }
    
    console.log('🎉 Analysis complete! Returning results...');

    return NextResponse.json({
      url,
      overallScore: analysis.overallScore,
      criticalIssues: analysis.criticalIssues,
      opportunities: analysis.opportunities,
      seoAnalysis: analysis.seoAnalysis,
      designAnalysis: analysis.designAnalysis,
      conversionAnalysis: analysis.conversionAnalysis,
      recommendedServices: ensurePriced(recommendations.length > 0 ? recommendations : getDefaultRecommendations()),
      hubspotContactId
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Use a web scraping service or library like Puppeteer
    // For now, we'll use a simple fetch to get basic content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MMA-Analyzer/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract key information from HTML
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    const metaDescription = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i)?.[1] || '';
    const headings = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi) || [];
    const links = html.match(/<a[^>]*href=["\']([^"']+)["\'][^>]*>/gi) || [];
    
    // Additional business heuristics
    const textLower = html.toLowerCase();
    const platform =
      textLower.includes('wp-content') ? 'wordpress' :
      textLower.includes('cdn.shopify.com') || textLower.includes('shopify') ? 'shopify' :
      textLower.includes('static1.squarespace.com') || textLower.includes('squarespace') ? 'squarespace' :
      textLower.includes('wixstatic.com') || textLower.includes('wix.com') ? 'wix' :
      textLower.includes('webflow') ? 'webflow' :
      'unknown';
    const isAgency = /(agency|our\s+work|case\s+stud(y|ies)|clients)/i.test(html) && /(services|capabilities)/i.test(html);
    const hasEventKeywords = /(event|conference|wedding|festival|live\s*stream|hybrid\s*event)/i.test(html);
    const hasPhotoBoothKeywords = /(photo\s*booth|on[-\s]?site\s*print|step\s*&\s*repeat|instant\s*prints)/i.test(textLower);
    const hasEcommerceSignals = /(add\s*to\s*cart|checkout|cart|product\s+price)/i.test(textLower);
    const usesBooking = /(book\s*now|appointments?|calendly|acuityscheduling|setmore|squareup|book\s*online)/i.test(textLower);
    
    return JSON.stringify({
      url,
      title,
      metaDescription,
      headings: headings.slice(0, 10), // Limit to first 10 headings
      linkCount: links.length,
      contentLength: html.length,
      hasContactForm: html.includes('contact') || html.includes('form'),
      hasPhoneNumber: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(html),
      hasEmailAddress: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(html),
      hasSocialMedia: html.includes('facebook') || html.includes('twitter') || html.includes('linkedin'),
      hasAnalytics: html.includes('google-analytics') || html.includes('gtag') || html.includes('ga('),
      hasSSL: url.startsWith('https://'),
      mobileViewport: html.includes('viewport'),
      // business heuristics
      platform,
      isAgency,
      hasEventKeywords,
      hasPhotoBoothKeywords,
      hasEcommerceSignals,
      usesBooking,
    });
  } catch (error) {
    console.error('Website scraping error:', error);
    return JSON.stringify({ url, error: 'Could not access website' });
  }
}

async function analyzeWithAI(url: string, websiteContent: string) {
  const prompt = `
You are an expert website analyst for Marketing Mousetrap Agency, a premium B2B marketing agency. 
Analyze this website data and provide a comprehensive assessment:

Website: ${url}
Data: ${websiteContent}

Provide analysis in this exact JSON format:
{
  "overallScore": [number 0-100],
  "criticalIssues": [array of 3-5 critical problems],
  "opportunities": [array of 3-5 improvement opportunities],
  "seoAnalysis": {
    "score": [number 0-100],
    "issues": [array of SEO problems],
    "recommendations": [array of SEO improvements]
  },
  "designAnalysis": {
    "score": [number 0-100], 
    "issues": [array of design/UX problems],
    "recommendations": [array of design improvements]
  },
  "conversionAnalysis": {
    "score": [number 0-100],
    "issues": [array of conversion problems],
    "recommendations": [array of conversion improvements]
  },
  "businessContext": {
    "likelyIndustry": [string],
    "isAgency": [boolean],
    "hasEcommerce": [boolean],
    "runsEvents": [boolean],
    "usesOnlineBooking": [boolean],
    "locationHint": [string],
    "notableSignals": [array of short strings]
  },
  "serviceNeeds": [array of strings describing concrete service needs in plain language]
}

Focus on:
- SEO optimization gaps
- Conversion rate optimization issues  
- User experience problems
- Missing marketing automation
- Lead generation weaknesses
- Mobile optimization issues
- Page speed problems
- Missing trust signals
- Poor call-to-action placement
- Lack of social proof

Also reason about business context (e.g., events, ecommerce, agency, local service provider) to identify non-SEO/UI needs such as on-site photo booths/printing, white-label production support, live production for events, product photography, and brand clarity.

Be brutally honest but professional. Identify real problems that Marketing Mousetrap Agency can solve.
`;

  try {
    console.log('🤖 Making OpenAI API call...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use more reliable and cheaper model
      messages: [
        {
          role: "system",
          content: "You are a website analysis expert. Provide detailed, actionable insights in valid JSON format only. Always return valid JSON."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    console.log('✅ OpenAI API call successful');

    const analysisText = completion.choices[0].message.content;
    if (!analysisText) {
      throw new Error('No analysis received from OpenAI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText);
    return analysis;

  } catch (error: any) {
    console.error('❌ OpenAI analysis error:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type
    });
    
    // Fallback analysis if OpenAI fails
    console.log('⚠️ Using fallback analysis due to OpenAI error');
    return {
      overallScore: 45,
      criticalIssues: [
        'OpenAI analysis failed - using fallback data',
        'Check API key and OpenAI service status',
        'Contact support if this persists'
      ],
      opportunities: [
        'Professional website audit available',
        'Custom optimization strategy needed',
        'Expert consultation recommended'
      ],
      seoAnalysis: {
        score: 40,
        issues: ['Requires manual SEO audit'],
        recommendations: ['Professional SEO assessment needed']
      },
      designAnalysis: {
        score: 45,
        issues: ['Design review required'],
        recommendations: ['UX audit recommended']
      },
      conversionAnalysis: {
        score: 35,
        issues: ['Conversion audit needed'],
        recommendations: ['CRO assessment required']
      }
    };
  }
}

function generateServiceRecommendations(analysis: any, scraped: any) {
  const recommendations: Array<{ id: string; title: string; description: string; impact: string; price: number }> = [];
  const usedServices = new Set<string>();

  function toRec(serviceId: string, impact: string) {
    // Don't add the same service twice
    if (usedServices.has(serviceId)) return;
    
    const svc = catalogServices.find(s => s.id === serviceId);
    if (!svc) return;
    
    const startingPrice = (svc as any).startingPrice || (svc.pricing?.packages?.[0]?.price ?? 0);
    recommendations.push({
      id: svc.id,
      title: svc.title,
      description: svc.description,
      impact,
      price: startingPrice,
    });
    
    usedServices.add(serviceId);
  }

  // Get analysis scores
  const seoScore = analysis.seoAnalysis?.score ?? 0;
  const designScore = analysis.designAnalysis?.score ?? 0;
  const conversionScore = analysis.conversionAnalysis?.score ?? 0;
  const overallScore = analysis.overallScore ?? 0;

  // Get website characteristics
  const linkCount = scraped?.linkCount ?? 0;
  const hasContact = !!scraped?.hasContactForm;
  const hasAnalytics = !!scraped?.hasAnalytics;
  const hasSSL = !!scraped?.hasSSL;
  const hasViewport = !!scraped?.mobileViewport;
  const hasMeta = !!scraped?.metaDescription;
  const isAgency = !!scraped?.isAgency;
  const hasEventKeywords = !!scraped?.hasEventKeywords;
  const hasPhotoBoothKeywords = !!scraped?.hasPhotoBoothKeywords;
  const hasEcommerceSignals = !!scraped?.hasEcommerceSignals;
  const usesBooking = !!scraped?.usesBooking;

  // Priority 1: Critical technical issues (always recommend if present)
  if (seoScore < 60 || !hasMeta || linkCount < 10) {
    const seoImpacts = [
      `Technical SEO + performance overhaul to address low SEO score (${seoScore}/100) and weak metadata. Projected ${Math.floor(Math.random() * 120 + 120)}% organic lift`,
      `Comprehensive SEO audit and optimization to fix critical ranking issues. Current score: ${seoScore}/100. Expected improvement: ${Math.floor(Math.random() * 150 + 100)}%`,
      `Search engine optimization overhaul to address technical issues and improve visibility. Projected ${Math.floor(Math.random() * 200 + 100)}% traffic increase`
    ];
    toRec('web-development', seoImpacts[Math.floor(Math.random() * seoImpacts.length)]);
  }
  
  if (designScore < 60 || !hasViewport) {
    const designImpacts = [
      `Responsive UX rebuild to fix mobile viewport and usability issues. Current design score: ${designScore}/100`,
      `Mobile-first design overhaul to improve user experience across all devices. Expected engagement increase: ${Math.floor(Math.random() * 80 + 40)}%`,
      `User experience optimization to reduce bounce rates and improve conversion. Current design score: ${designScore}/100`
    ];
    toRec('web-development', designImpacts[Math.floor(Math.random() * designImpacts.length)]);
  }
  
  if (conversionScore < 60 || !hasContact || !hasAnalytics) {
    const conversionImpacts = [
      `Implement lead capture, analytics events, and CRO patterns. Current conversion score: ${conversionScore}/100`,
      `Conversion rate optimization to capture more leads and increase revenue. Expected improvement: ${Math.floor(Math.random() * 100 + 50)}%`,
      `Lead generation system implementation to stop visitor drop-offs. Current conversion score: ${conversionScore}/100`
    ];
    toRec('web-development', conversionImpacts[Math.floor(Math.random() * conversionImpacts.length)]);
  }

  // Priority 2: Business-specific services (only if relevant)
  if (hasEventKeywords || usesBooking) {
    const eventImpacts = [
      'On‑site live streaming and event coverage to protect show quality and reach bigger audiences',
      'Professional event production services to capture and broadcast your events worldwide',
      'Live streaming and event coverage to expand your audience reach and engagement'
    ];
    toRec('live-production', eventImpacts[Math.floor(Math.random() * eventImpacts.length)]);
  }
  
  if (hasPhotoBoothKeywords) {
    const photoBoothImpacts = [
      'On‑site printing and photo booth to create memorable guest experiences and brand reach',
      'Interactive photo experiences to increase event engagement and social sharing',
      'Photo booth and printing services to enhance guest experience and brand visibility'
    ];
    toRec('on-site-prints', photoBoothImpacts[Math.floor(Math.random() * photoBoothImpacts.length)]);
  }
  
  if (hasEcommerceSignals) {
    const photoImpacts = [
      'Clean product and lifestyle photos to boost conversion and reduce returns',
      'Professional product photography to increase sales and customer confidence',
      'High-quality product images to improve conversion rates and reduce returns'
    ];
    toRec('photography', photoImpacts[Math.floor(Math.random() * photoImpacts.length)]);
    
    const videoImpacts = [
      'Product/demo videos to raise engagement and conversion on PDPs and ads',
      'Video content creation to boost product engagement and sales conversion',
      'Product demonstration videos to increase customer understanding and conversion'
    ];
    toRec('video-production', videoImpacts[Math.floor(Math.random() * videoImpacts.length)]);
  }
  
  if (isAgency) {
    const agencyImpacts = [
      'Add senior capacity under NDA so you can say yes to more work without hiring',
      'White-label production support to expand your service offerings',
      'Professional capacity expansion to handle more client projects'
    ];
    toRec('white-label', agencyImpacts[Math.floor(Math.random() * agencyImpacts.length)]);
  }

  // Priority 2.5: Platform-specific recommendations
  const platform = scraped?.platform;
  if (platform === 'wordpress' && seoScore < 70) {
    toRec('web-development', `WordPress optimization and SEO improvements. Current SEO score: ${seoScore}/100`);
  }
  
  if (platform === 'shopify' && conversionScore < 70) {
    toRec('web-development', `Shopify store optimization and conversion improvements. Current conversion score: ${conversionScore}/100`);
  }
  
  if (platform === 'squarespace' && designScore < 70) {
    toRec('web-development', `Squarespace design optimization and user experience improvements. Current design score: ${designScore}/100`);
  }

  // Priority 2.6: Industry-specific recommendations
  const hasRestaurantKeywords = /(restaurant|cafe|dining|food|menu|reservation)/i.test(scraped?.title || '') || /(restaurant|cafe|dining|food|menu|reservation)/i.test(scraped?.metaDescription || '');
  const hasHealthcareKeywords = /(healthcare|medical|doctor|clinic|hospital|patient|treatment)/i.test(scraped?.title || '') || /(healthcare|medical|doctor|clinic|hospital|patient|treatment)/i.test(scraped?.metaDescription || '');
  const hasLegalKeywords = /(law|legal|attorney|lawyer|firm|case|consultation)/i.test(scraped?.title || '') || /(law|legal|attorney|lawyer|firm|case|consultation)/i.test(scraped?.metaDescription || '');
  
  if (hasRestaurantKeywords && !usedServices.has('photography')) {
    toRec('photography', 'Professional food photography to showcase your menu and attract more customers');
  }
  
  if (hasHealthcareKeywords && !usedServices.has('brand-development')) {
    toRec('brand-development', 'Healthcare brand positioning and trust-building messaging to connect with patients');
  }
  
  if (hasLegalKeywords && !usedServices.has('brand-development')) {
    toRec('brand-development', 'Legal practice positioning and professional credibility building');
  }

  // Priority 3: Strategic improvements (if we have room and scores are moderate)
  if (overallScore < 70 && !usedServices.has('brand-development')) {
    toRec('brand-development', 'Positioning + messaging tune‑up to raise clarity and pricing power; tighten brand signals across site');
  }
  
  if (seoScore < 80 && !usedServices.has('web-development')) {
    toRec('web-development', 'Advanced SEO optimization and content strategy to improve search rankings and organic traffic');
  }
  
  if (conversionScore < 75 && !usedServices.has('web-development')) {
    toRec('web-development', 'Conversion rate optimization and user experience improvements to maximize lead generation');
  }

  // Priority 4: Creative services (if we still have room)
  if (!usedServices.has('video-production')) {
    toRec('video-production', 'High-converting video content to boost engagement and conversion rates across all channels');
  }
  
  if (!usedServices.has('photography')) {
    toRec('photography', 'Professional photography to enhance brand credibility and improve visual appeal');
  }

  // If we still don't have 3 recommendations, add strategic defaults
  const priorityDefaults = ['web-development', 'brand-development', 'video-production', 'photography', 'live-production', 'on-site-prints', 'white-label'];
  
  for (const serviceId of priorityDefaults) {
    if (recommendations.length >= 3) break;
    if (!usedServices.has(serviceId)) {
      toRec(serviceId, 'Strategic initiative to address current business gaps and drive growth');
    }
  }

  // Ensure we return exactly 3 unique recommendations
  const uniqueRecommendations = Array.from(new Map(recommendations.map(r => [r.id, r])).values());
  
  // If we still don't have 3, use the fallback
  if (uniqueRecommendations.length < 3) {
    const fallback = getDefaultRecommendations();
    for (const fallbackService of fallback) {
      if (uniqueRecommendations.length >= 3) break;
      if (!usedServices.has(fallbackService.id)) {
        uniqueRecommendations.push(fallbackService);
        usedServices.add(fallbackService.id);
      }
    }
  }

  return uniqueRecommendations.slice(0, 3);
}

function getDefaultRecommendations() {
  // Create multiple fallback sets for variety
  const fallbackSets = [
    {
      id: 'web-development',
      title: 'Website Design & Development',
      description: 'Fast, clear site that turns visitors into leads',
      impact: 'Lift conversions and make updates easy for your team',
      price: 0
    },
    {
      id: 'brand-development',
      title: 'Brand Strategy & Identity',
      description: 'Clear message, logo, and guidelines your team can use',
      impact: 'Improve clarity, trust, and pricing power',
      price: 0
    },
    {
      id: 'video-production',
      title: 'Video Production',
      description: 'Plan, film, and edit videos that help you sell',
      impact: 'Raise engagement across site, ads, and social',
      price: 0
    },
    {
      id: 'photography',
      title: 'Professional Photography',
      description: 'High-quality images that build trust and convert visitors',
      impact: 'Enhance visual appeal and professional credibility',
      price: 0
    },
    {
      id: 'live-production',
      title: 'Live Production Services',
      description: 'Professional event coverage and live streaming solutions',
      impact: 'Capture and broadcast your events to wider audiences',
      price: 0
    },
    {
      id: 'on-site-prints',
      title: 'On-Site Printing & Photo Booths',
      description: 'Interactive experiences that create memorable moments',
      impact: 'Increase engagement and brand recall at events',
      price: 0
    }
  ];

  // Return a random selection to add variety
  const shuffled = [...fallbackSets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function ensurePriced(list: Array<{ id: string; title: string; description: string; impact: string; price: number }>) {
  // Replace any $0 or missing price with the service's real starting price
  return list.map(item => {
    if (item.price && item.price > 0) return item;
    const svc = catalogServices.find(s => s.id === item.id);
    const startingPrice = (svc as any)?.startingPrice || (svc?.pricing?.packages?.[0]?.price ?? 1000);
    return { ...item, price: startingPrice };
  });
}

// Legacy local/GitHub persistence removed in favor of HubSpot
