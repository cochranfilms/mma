'use client';

import { useState } from 'react';

export default function OpenAIDebugger() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [githubResult, setGithubResult] = useState<any>(null);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const testOpenAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-openai');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: 'Failed to test OpenAI' });
    }
    setIsLoading(false);
  };

  const testGitHub = async () => {
    setIsGithubLoading(true);
    try {
      const response = await fetch('/api/test-github');
      const result = await response.json();
      setGithubResult(result);
    } catch (error) {
      setGithubResult({ success: false, error: 'Failed to test GitHub' });
    }
    setIsGithubLoading(false);
  };

  return (
    <div className="fixed top-20 right-4 bg-black/90 text-white p-4 rounded-lg text-sm z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug Tests</h3>
      
      <div className="space-y-2 mb-3">
        <button 
          onClick={testOpenAI}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50 w-full"
        >
          {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
        </button>
        
        <button 
          onClick={testGitHub}
          disabled={isGithubLoading}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50 w-full"
        >
          {isGithubLoading ? 'Testing...' : 'Test GitHub Upload'}
        </button>
      </div>

      {testResult && (
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-gray-300">Status: </span>
            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
              {testResult.success ? 'SUCCESS' : 'FAILED'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-300">Has API Key: </span>
            <span className={testResult.hasKey ? 'text-green-400' : 'text-red-400'}>
              {testResult.hasKey ? 'YES' : 'NO'}
            </span>
          </div>

          {testResult.keyPreview && (
            <div>
              <span className="text-gray-300">Key Preview: </span>
              <span className="text-blue-400">{testResult.keyPreview}</span>
            </div>
          )}

          {testResult.error && (
            <div>
              <span className="text-gray-300">Error: </span>
              <span className="text-red-400">{testResult.error}</span>
            </div>
          )}

          {testResult.openaiResponse && (
            <div>
              <span className="text-gray-300">OpenAI Response: </span>
              <span className="text-green-400">✓ Connected</span>
            </div>
          )}
        </div>
      )}

      {githubResult && (
        <div className="space-y-2 text-xs mt-4 border-t border-gray-600 pt-3">
          <div className="font-bold text-green-400">GitHub Test Results:</div>
          <div>
            <span className="text-gray-300">Status: </span>
            <span className={githubResult.success ? 'text-green-400' : 'text-red-400'}>
              {githubResult.success ? 'SUCCESS' : 'FAILED'}
            </span>
          </div>

          {githubResult.error && (
            <div>
              <span className="text-gray-300">Error: </span>
              <span className="text-red-400">{githubResult.error}</span>
            </div>
          )}

          {githubResult.details && (
            <div className="text-xs text-gray-400">
              <div>Git Repo: {githubResult.details.gitRepository ? '✓' : '✗'}</div>
              <div>Leads File: {githubResult.details.leadsFileExists ? '✓' : '✗'}</div>
              <div>Git Ops: {githubResult.details.gitOperationsSuccessful ? '✓' : '✗'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
