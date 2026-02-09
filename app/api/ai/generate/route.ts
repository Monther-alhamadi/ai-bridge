// Version: 1.0.1 - Force build with require fix
import { NextRequest, NextResponse } from "next/server";
import { PROMPT_FACTORY, ToolPromptParams } from "@/config/prompts";
import { getPrompt, AI_ENGINES, EngineContext } from "@/config/ai-engines";
import Groq from "groq-sdk";
// @ts-ignore - pdf-parse lacks a proper default export for some ESM environments
const pdf = require("pdf-parse");

// Initialize Groq Client
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Force Dynamic for File Uploads
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log(">>> AI API: POST Request Started");
  try {
    const formData = await req.formData();
    const tool = formData.get("tool") as string;
    const profession = formData.get("profession") as string;
    const paramsJson = formData.get("params") as string;
    const file = formData.get("file") as File | null;

    if (!groq) {
      console.error(">>> AI API: Groq key missing");
      return NextResponse.json({ error: "AI Service Unavailable" }, { status: 503 });
    }

    let params: ToolPromptParams = JSON.parse(paramsJson);

    if (file) {
      console.log(">>> AI API: Processing file...");
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        const data = await pdf(buffer);
        params.context = `[EXTRACTED CONTENT FROM FILE]:\n${data.text.substring(0, 15000)}\n[END]`;
      } catch (e) {
        console.error(">>> AI API: PDF Parse Error:", e);
      }
    }

    let systemPrompt = "";
    if (params.customPrompt) {
        systemPrompt = params.customPrompt;
    // @ts-ignore
    } else if (AI_ENGINES[tool]) {
        systemPrompt = getPrompt(tool, params as unknown as EngineContext);
    } else {
        // @ts-ignore
        const promptBuilder = PROMPT_FACTORY[profession]?.[tool];
        if (!promptBuilder) return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
        systemPrompt = promptBuilder(params);
    }

    console.log(`>>> AI API: Calling Groq (Model: llama-3.3-70b-versatile, Lang: ${params.language || params.locale || 'en'})`);
    
    let completion;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: `You are a specialized AI assistant. YOU MUST REPLY IN ${params.language === 'ar' || params.locale === 'ar' ? 'ARABIC' : 'ENGLISH'}. You MUST reply with valid JSON only. All values inside the JSON must be in the specified language.` 
            },
            { role: "user", content: systemPrompt },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.1,
          response_format: { type: "json_object" },
        });
        break; // Success!
      } catch (err: any) {
        retries++;
        console.error(`>>> AI API: Attempt ${retries} failed:`, err.message);
        if (retries > maxRetries) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff-ish
      }
    }

    const result = completion?.choices[0]?.message?.content;
    console.log(">>> AI API: Response received successfully");

    if (!result) throw new Error("Empty response from AI");
    return NextResponse.json(JSON.parse(result));

  } catch (error: any) {
    console.error(">>> AI API ERROR DETAIL:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      status: error.status,
      type: error.type
    });
    
    // Check for common network errors
    const isNetworkError = error.message?.toLowerCase().includes('connect') || 
                          error.message?.toLowerCase().includes('timeout') ||
                          error.message?.toLowerCase().includes('fetch');

    return NextResponse.json(
      { 
        error: isNetworkError ? "AI Service Connection Timeout/Error" : "AI Generation Failed",
        details: error.message 
      },
      { status: isNetworkError ? 504 : 500 }
    );
  }
}

