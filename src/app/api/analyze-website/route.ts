import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { services as catalogServices } from '@/content/services';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  url: string;
  email: string;
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

interface LeadsData {
  leads: Lead[];
  lastUpdated: string | null;
  totalAnalyses: number;
}

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const LEADS_FILE_PATH_IN_REPO = 'src/data/leads.json';

function getGitHubHeaders() {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    throw new Error('Missing GitHub configuration. Set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN env vars.');
  }
  return {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  } as Record<string, string>;
}

async function getGitHubFile() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(LEADS_FILE_PATH_IN_REPO)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const res = await fetch(url, { headers: getGitHubHeaders() });
  if (res.status === 404) {
    return { exists: false as const };
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  return {
    exists: true as const,
    sha: data.sha as string,
    contentBase64: data.content as string
  };
}

async function putGitHubFile(params: { content: string; message: string; sha?: string }) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(LEADS_FILE_PATH_IN_REPO)}`;
  const body = {
    message: params.message,
    content: Buffer.from(params.content, 'utf8').toString('base64'),
    branch: GITHUB_BRANCH,
    sha: params.sha,
    committer: {
      name: 'MMA Bot',
      email: 'bot@marketingmousetrapagency.com'
    }
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: getGitHubHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

async function getBranchHeadSha(branch: string) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: getGitHubHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub refs GET failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  return data.object?.sha as string;
}

async function createBranch(newBranch: string, fromSha: string) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getGitHubHeaders(),
    body: JSON.stringify({ ref: `refs/heads/${newBranch}`, sha: fromSha })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub create branch failed: ${res.status} ${res.statusText} - ${text}`);
  }
}

async function createPullRequest(branch: string, title: string, body: string) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getGitHubHeaders(),
    body: JSON.stringify({ title, head: branch, base: GITHUB_BRANCH, body })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PR create failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  return data.html_url as string;
}

export async function POST(request: NextRequest) {
  try {
    const { url, email }: AnalysisRequest = await request.json();

    console.log('🔍 Starting analysis for:', { url, email });

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

    // Step 4: Fire repository_dispatch so GitHub Actions updates leads.json on main
    console.log('📤 Dispatching repository event for leads update...');
    const githubResult = await dispatchLeadToGitHub(newLead);
    
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
      githubUpload: githubResult
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

async function storeLeadLocally(newLead: Lead) {
  try {
    const leadsFilePath = path.join(process.cwd(), 'src/data/leads.json');
    
    // Read existing data
    let leadsData: LeadsData = { leads: [], lastUpdated: null, totalAnalyses: 0 };
    if (fs.existsSync(leadsFilePath)) {
      const fileContent = fs.readFileSync(leadsFilePath, 'utf8');
      leadsData = JSON.parse(fileContent) as LeadsData;
    }
    
    // Add new lead
    leadsData.leads.push(newLead);
    leadsData.lastUpdated = new Date().toISOString();
    leadsData.totalAnalyses = leadsData.leads.length;
    
    // Write back to file
    fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
    
    console.log('Lead stored locally:', { email: newLead.email, url: newLead.website, score: newLead.analysisScore });
  } catch (error) {
    console.error('Error storing lead locally:', error);
  }
}

async function uploadLeadToGitHub(newLead: Lead) {
  try {
    const repoConfigured = Boolean(GITHUB_OWNER && GITHUB_REPO && GITHUB_TOKEN);
    if (!repoConfigured) {
      console.log('⚠️ Missing GitHub env vars; skipping upload');
      return { success: false, reason: 'missing_env' };
    }

    // Fetch existing file content (if any)
    let leadsData: LeadsData = { leads: [], lastUpdated: null, totalAnalyses: 0 };
    let existingSha: string | undefined = undefined;
    try {
      const existing = await getGitHubFile();
      if (existing.exists) {
        existingSha = existing.sha;
        const decoded = Buffer.from(existing.contentBase64, 'base64').toString('utf8');
        leadsData = JSON.parse(decoded) as LeadsData;
      }
    } catch (e) {
      console.warn('Could not retrieve existing GitHub file; will create new.', e);
    }

    // Merge new lead
    leadsData.leads.push(newLead);
    leadsData.lastUpdated = new Date().toISOString();
    leadsData.totalAnalyses = leadsData.leads.length;

    const updatedContent = JSON.stringify(leadsData, null, 2);
    const message = `Auto-update: New website analysis lead - ${new Date().toISOString()}`;
    try {
      const result = await putGitHubFile({ content: updatedContent, message, sha: existingSha });
      console.log('✅ Successfully uploaded leads data to GitHub via API (remote append)');
      return { success: true, mode: 'direct', commitSha: result?.commit?.sha || null };
    } catch (putErr: any) {
      const errMsg = String(putErr?.message || 'unknown');
      // Fallback: branch protection or permissions → create PR
      console.warn('Direct push failed, attempting PR fallback:', errMsg);
      try {
        const baseSha = await getBranchHeadSha(GITHUB_BRANCH);
        const branchName = `leads-update-${Date.now()}`;
        await createBranch(branchName, baseSha);
        await putGitHubFile({ content: updatedContent, message, sha: existingSha });
        const prUrl = await createPullRequest(
          branchName,
          'Auto-update leads.json from Website Analyzer',
          'This PR was created automatically when direct push to protected branch failed.'
        );
        return { success: true, mode: 'pr', prUrl };
      } catch (prErr: any) {
        console.error('PR fallback failed:', prErr);
        return { success: false, error: prErr?.message || 'fallback_failed', originalError: errMsg };
      }
    }
  } catch (error: any) {
    console.error('❌ Error uploading to GitHub via API:', error);
    console.log('⚠️ Analysis will continue despite GitHub upload failure');
    return { success: false, error: error?.message || 'unknown' };
  }
}

async function dispatchLeadToGitHub(newLead: Lead) {
  try {
    if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
      return { success: false, reason: 'missing_env' };
    }
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'update_leads',
        client_payload: { lead: newLead }
      })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`repository_dispatch failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return { success: true, mode: 'dispatch' };
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return { success: false, error: error?.message || 'unknown' };
  }
}
