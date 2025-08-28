import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
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

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('🧪 Testing GitHub upload functionality...');
    
    // Test 1: Check if we're in a Git repository
    console.log('📁 Checking Git repository status...');
    const { stdout: gitStatus } = await execAsync('git status');
    console.log('Git status:', gitStatus);
    
    // Test 2: Check leads.json file
    const leadsFilePath = path.join(process.cwd(), 'src/data/leads.json');
    const fileExists = fs.existsSync(leadsFilePath);
    console.log('📄 leads.json exists:', fileExists);
    
    if (fileExists) {
      const fileContent = fs.readFileSync(leadsFilePath, 'utf8');
      console.log('📋 leads.json content:', fileContent);
    }
    
    // Test 3: Add a test entry to leads.json
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
    
    // Write back to file
    fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
    console.log('✅ Test entry added to leads.json');
    
    // Test 4: Check Git status for changes
    const { stdout: statusOutput } = await execAsync('git status --porcelain src/data/leads.json');
    console.log('📋 Git changes detected:', statusOutput);
    
    // Test 5: Attempt Git operations
    if (statusOutput.trim()) {
      console.log('📤 Attempting Git commit and push...');
      
      await execAsync('git add src/data/leads.json');
      console.log('✅ Git add successful');
      
      const commitMessage = `Test commit: GitHub upload test - ${new Date().toISOString()}`;
      await execAsync(`git commit -m "${commitMessage}"`);
      console.log('✅ Git commit successful');
      
      await execAsync('git push origin main');
      console.log('✅ Git push successful');
    }
    
    return NextResponse.json({
      success: true,
      message: 'GitHub upload test completed successfully',
      details: {
        gitRepository: true,
        leadsFileExists: fileExists,
        testEntryAdded: true,
        gitOperationsSuccessful: true
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
