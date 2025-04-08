import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Optional parameters
    const model = body.model || 'gpt-3.5-turbo';
    const temperature = body.temperature || 0.7;
    const chatbotId = body.chatbotId;
    
    // Add system message if provided
    const messages = body.messages;
    
    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    // Extract the response
    const responseMessage = completion.choices[0].message;

    // Store the conversation in your database (implement this later)
    // await storeConversation(chatbotId, messages, responseMessage);

    // Return the response
    return NextResponse.json({
      message: responseMessage
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Handle rate limiting errors
    if (error.statusCode === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Handle authentication errors
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: 'OpenAI API key is invalid.' },
        { status: 401 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
} 