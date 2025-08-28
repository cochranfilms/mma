import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { filename, pdfData, proposalData } = await request.json();

    if (!filename || !pdfData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // GitHub API configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      console.error('Missing GitHub environment variables');
      return NextResponse.json({ error: 'GitHub configuration missing' }, { status: 500 });
    }

    // Convert base64 PDF data to proper format for GitHub
    const base64Content = pdfData.split(',')[1] || pdfData;
    
    // Create the file path in the proposals directory
    const filePath = `proposals/${filename}`;

    // GitHub API URL for creating/updating files
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    // Check if file already exists to get SHA (required for updates)
    let sha = null;
    try {
      const existingFileResponse = await fetch(githubUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (existingFileResponse.ok) {
        const existingFile = await existingFileResponse.json();
        sha = existingFile.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine for new files
      console.log('File does not exist yet, creating new file');
    }

    // Prepare the commit data
    const commitData = {
      message: `Add proposal: ${filename}`,
      content: base64Content,
      branch: GITHUB_BRANCH,
      ...(sha && { sha }), // Include SHA only if file exists
    };

    // Upload to GitHub
    const uploadResponse = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commitData),
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('GitHub upload failed:', errorData);
      return NextResponse.json({ 
        error: 'Failed to upload to GitHub',
        details: errorData 
      }, { status: 500 });
    }

    const uploadResult = await uploadResponse.json();
    
    // Also create a JSON metadata file with proposal details
    if (proposalData) {
      const metadataFilename = filename.replace('.pdf', '_metadata.json');
      const metadataPath = `proposals/${metadataFilename}`;
      const metadataUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}`;
      
      const metadataContent = {
        filename,
        generatedAt: new Date().toISOString(),
        companyName: proposalData.companyName,
        contactEmail: proposalData.contactInfo?.email,
        totalInvestment: proposalData.totalInvestment,
        services: proposalData.recommendedServices?.map((s: any) => s.title) || [],
      };

      const metadataCommitData = {
        message: `Add proposal metadata: ${metadataFilename}`,
        content: Buffer.from(JSON.stringify(metadataContent, null, 2)).toString('base64'),
        branch: GITHUB_BRANCH,
      };

      try {
        await fetch(metadataUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadataCommitData),
        });
      } catch (metadataError) {
        console.error('Failed to upload metadata:', metadataError);
        // Don't fail the main request if metadata upload fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Proposal uploaded successfully',
      githubUrl: uploadResult.content?.html_url 
    });

  } catch (error) {
    console.error('Upload proposal error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
