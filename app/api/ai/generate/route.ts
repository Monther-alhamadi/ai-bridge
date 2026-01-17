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
  try {
    // 1. Parse FormData
    const formData = await req.formData();
    const tool = formData.get("tool") as string;
    const profession = formData.get("profession") as string;
    const paramsJson = formData.get("params") as string;
    const file = formData.get("file") as File | null;

    if (!groq) {
      return NextResponse.json(
        { error: "AI Service Unavailable (Missing API Key)" },
        { status: 503 }
      );
    }

    // 2. Parse Parameters
    let params: ToolPromptParams = JSON.parse(paramsJson);

    // 3. Handle File Extraction (Server-Side)
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      try {
        const data = await pdf(buffer);
        // Truncate to avoid context window limits (approx 15k chars)
        const extractedText = data.text.substring(0, 15000);
        params.context = `[EXTRACTED CONTENT FROM FILE]:\n${extractedText}\n[END OF FILE CONTENT]`;
      } catch (e) {
        console.error("PDF Parse Error:", e);
        return NextResponse.json({ error: "Failed to read PDF file" }, { status: 400 });
      }
    }

    // 4. Build the Engineered Prompt
    let systemPrompt = "";

    // A. Try New Centralized Engine (Teacher OS)
    // @ts-ignore
    if (AI_ENGINES[tool]) {
        // Cast params to new EngineContext
        systemPrompt = getPrompt(tool, params as unknown as EngineContext);
    } 
    // B. Fallback to Historic Factory (Legacy Tools)
    else {
        // @ts-ignore
        const promptBuilder = PROMPT_FACTORY[profession]?.[tool];
        if (!promptBuilder) {
             return NextResponse.json({ error: "Invalid tool or profession" }, { status: 400 });
        }
        systemPrompt = promptBuilder(params);
    }

    // 5. Call AI Model (Llama-3-8b-8192 for speed/cost, or larger for complex tasks)
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a specialized AI assistant. You MUST reply with valid JSON only. Do not include markdown formatting like ```json ... ```. Just the raw JSON object." },
        { role: "user", content: systemPrompt },
      ],
      model: "llama3-70b-8192", // Using 70b for higher intelligence on complex tasks
      temperature: 0.3, // Low temperature for consistent, strict output
      response_format: { type: "json_object" }, // Enforce JSON mode
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      throw new Error("Empty response from AI");
    }

    return NextResponse.json(JSON.parse(result));

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
