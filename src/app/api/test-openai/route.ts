import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Check if OpenAI API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY not found in environment variables',
        hasKey: false
      });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('Testing OpenAI connection...');

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use cheaper model for testing
      messages: [
        {
          role: "user",
          content: "Say 'OpenAI connection successful' in JSON format: {\"status\": \"success\", \"message\": \"OpenAI connection successful\"}"
        }
      ],
      max_tokens: 50,
      temperature: 0
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      hasKey: true,
      keyPreview: apiKey.substring(0, 10) + '...',
      openaiResponse: response,
      model: completion.model,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('OpenAI test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      errorType: error.type || 'unknown',
      errorCode: error.code || 'unknown',
      hasKey: !!process.env.OPENAI_API_KEY
    });
  }
}
