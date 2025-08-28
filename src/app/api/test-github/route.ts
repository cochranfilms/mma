import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    sha: params.sha
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

export async function GET() {
  try {
    console.log('🧪 Testing GitHub upload functionality (via API)...');
    const repoConfigured = Boolean(GITHUB_OWNER && GITHUB_REPO && GITHUB_TOKEN);

    // Local file path used by the app
    const leadsFilePath = path.join(process.cwd(), 'src/data/leads.json');
    const fileExists = fs.existsSync(leadsFilePath);
    console.log('📄 leads.json exists locally:', fileExists);
    
    if (fileExists) {
      const fileContent = fs.readFileSync(leadsFilePath, 'utf8');
      console.log('📋 leads.json content:', fileContent);
    }
    
    // Step 1: Add a test entry to the local leads.json
    console.log('➕ Adding test entry to leads.json...');
    let leadsData: LeadsData = { leads: [], lastUpdated: null, totalAnalyses: 0 };
    
    if (fileExists) {
      const fileContent = fs.readFileSync(leadsFilePath, 'utf8');
      leadsData = JSON.parse(fileContent) as LeadsData;
    }
    
    // Add test entry
    const testLead: Lead = {
      id: `test-${Date.now()}`,
      email: 'test@example.com',
      website: 'https://test.com',
      analysisScore: 75,
      analysisData: { test: true },
      createdAt: new Date().toISOString(),
      source: 'github-test'
    };
    
    leadsData.leads.push(testLead);
    leadsData.lastUpdated = new Date().toISOString();
    leadsData.totalAnalyses = leadsData.leads.length;
    
    // Write back to file locally
    fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
    console.log('✅ Test entry added to leads.json');
    
    // Step 2: Push the file using GitHub API (no local git required)
    let gitOpsOk = false;
    let commitResponse: any = null;
    try {
      const existing = await getGitHubFile();
      const contentToUpload = fs.readFileSync(leadsFilePath, 'utf8');
      const message = `Test commit: GitHub upload test - ${new Date().toISOString()}`;
      commitResponse = await putGitHubFile({ content: contentToUpload, message, sha: existing.exists ? existing.sha : undefined });
      gitOpsOk = true;
      console.log('✅ GitHub API upload successful');
    } catch (ghErr) {
      console.error('❌ GitHub API upload failed:', ghErr);
    }
    
    return NextResponse.json({
      success: true,
      message: 'GitHub upload test completed successfully',
      details: {
        gitRepository: repoConfigured,
        leadsFileExists: fileExists,
        testEntryAdded: true,
        gitOperationsSuccessful: gitOpsOk,
        commit: commitResponse?.commit?.sha || null
      }
    });
    
  } catch (error: any) {
    console.error('❌ GitHub test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: {
        message: error?.message,
        code: error?.code,
        stderr: error?.stderr,
        stdout: error?.stdout
      }
    });
  }
}
