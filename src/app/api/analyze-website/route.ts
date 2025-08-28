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
    const { url, email, name }: AnalysisRequest = await request.json();

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
        jobtitle: 'Website Domination Analyzer Lead',
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
  }
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

  function toRec(serviceId: string, impact: string) {
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
  }

  // Map analysis to real services
  const linkCount = scraped?.linkCount ?? 0;
  const hasContact = !!scraped?.hasContactForm;
  const hasAnalytics = !!scraped?.hasAnalytics;
  const hasSSL = !!scraped?.hasSSL;
  const hasViewport = !!scraped?.mobileViewport;
  const hasMeta = !!scraped?.metaDescription;

  if (analysis.seoAnalysis.score < 60 || !hasMeta || linkCount < 10) {
    toRec('web-development', `Technical SEO + performance overhaul to address low SEO score and weak metadata. Projected ${Math.floor(Math.random() * 120 + 120)}% organic lift`);
  }
  if (analysis.designAnalysis.score < 60 || !hasViewport) {
    toRec('web-development', 'Responsive UX rebuild to fix mobile viewport and usability issues; improve task completion and engagement');
  }
  if (analysis.conversionAnalysis.score < 60 || !hasContact || !hasAnalytics) {
    toRec('web-development', 'Implement lead capture, analytics events, and CRO patterns to stop drop‑offs and measure funnel performance');
  }
  if ((analysis.overallScore ?? 0) < 70 || !hasSSL) {
    toRec('brand-development', 'Positioning + messaging tune‑up to raise clarity and pricing power; tighten brand signals across site');
  }

  // Ensure unique by id and return up to 3
  const unique = new Map<string, typeof recommendations[number]>();
  recommendations.forEach(r => { if (!unique.has(r.id)) unique.set(r.id, r); });
  let list = Array.from(unique.values());
  if (list.length === 0) {
    // Default set if none matched
    toRec('web-development', 'Comprehensive site overhaul for performance, SEO, and CRO');
    toRec('brand-development', 'Positioning and identity to improve message-market fit');
    toRec('video-production', 'High-converting creative assets to drive campaigns');
    list = Array.from(new Map(recommendations.map(r => [r.id, r])).values());
  }

  // Pad to 3 unique items by priority order
  const priority = ['web-development', 'brand-development', 'video-production', 'photography', 'live-production', 'white-label'];
  for (const pid of priority) {
    if (list.length >= 3) break;
    if (!list.find(r => r.id === pid)) {
      toRec(pid, 'High-ROI initiative aligned with current gaps');
      // refresh list with unique map
      const map = new Map<string, typeof recommendations[number]>();
      recommendations.forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });
      list = Array.from(map.values());
    }
  }

  return list.slice(0, 3);
}

function getDefaultRecommendations() {
  return [
    {
      id: 'website-redesign',
      title: 'Website Domination Package',
      description: 'Complete website transformation with conversion focus',
      impact: 'Expected 200-300% increase in conversions',
      price: 15000
    },
    {
      id: 'seo-audit',
      title: 'SEO Warfare Implementation',
      description: 'Technical SEO overhaul and authority building',
      impact: 'Projected 150-250% increase in organic traffic',
      price: 5000
    },
    {
      id: 'marketing-automation',
      title: 'AI Marketing Automation',
      description: 'Automated email sequences and lead nurturing system',
      impact: 'Projected 200% increase in qualified leads',
      price: 10000
    }
  ];
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
