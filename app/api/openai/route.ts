import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Keep this secure
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({ 
      response: response.choices[0].message.content 
    });
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "OpenAI API error", details: error }, 
      { status: 500 }
    );
  }
}