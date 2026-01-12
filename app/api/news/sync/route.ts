import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Parser from "rss-parser";
import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

const parser = new Parser();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SOURCES = [
  "https://techcrunch.com/feed/",
  "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml"
];

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: "Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" 
      }, { status: 500 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: "Groq not configured. Please add GROQ_API_KEY to .env.local" 
      }, { status: 500 });
    }

    console.log("Starting Live News Sync via Groq...");
    
    // 1. Fetch Real RSS Feeds
    const allFeeds = await Promise.all(SOURCES.map(url => parser.parseURL(url)));
    const items = allFeeds.flatMap(feed => feed.items).slice(0, 10); // Limit to top 10 for free tier speed

    const processedNews = [];

    for (const item of items) {
      // 2. Deduplication check in Supabase
      const { data: existing } = await supabase
        .from("news")
        .select("id")
        .eq("source_link", item.link)
        .single();

      if (existing) continue;

      // 3. AI Processing via Groq (Free & Fast)
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert AI news editor. Summarize the following news title and content into a PROFESSIONAL, engaging Arabic summary and a concise English summary. Tone: Strategic and bold. Identify if the news is related to 'education', 'coding', or 'general'."
            },
            {
              role: "user",
              content: `Title: ${item.title}\nContent: ${item.contentSnippet || item.content}`
            }
          ],
          model: "llama-3.1-70b-versatile",
          response_format: { type: "json_object" }
        });

        const aiOutput = JSON.parse(completion.choices[0]?.message?.content || "{}");
        
        // 4. Determine Intent for CTA
        let intent = "general";
        const combinedText = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
        if (combinedText.includes("education") || combinedText.includes("study") || combinedText.includes("teacher") || combinedText.includes("school")) {
          intent = "education";
        } else if (combinedText.includes("code") || combinedText.includes("dev") || combinedText.includes("program") || combinedText.includes("engine")) {
          intent = "coding";
        }

        const newsEntry = {
          title_en: item.title,
          title_ar: aiOutput.title_ar || item.title,
          summary_en: aiOutput.summary_en || item.contentSnippet,
          summary_ar: aiOutput.summary_ar || "",
          source: item.creator || "Tech News",
          source_link: item.link,
          date: new Date().toISOString(),
          tag: aiOutput.tag || "AI Update",
          intent: intent,
          score: 4.5 + Math.random() * 0.5
        };

        // 5. Store in Supabase
        const { error: dbError } = await supabase.from("news").insert([newsEntry]);
        
        if (!dbError) {
          processedNews.push(newsEntry);
        }
      } catch (aiError) {
        console.error("Groq AI Error for item:", item.title, aiError);
        // Fallback or skip
      }
    }

    // 6. Revalidate Cache
    revalidatePath("/[locale]/news", "page");
    revalidatePath("/[locale]", "page");

    return NextResponse.json({
      success: true,
      new_articles: processedNews.length,
      status: "Synced to Supabase"
    });
  } catch (error) {
    console.error("Sync Root Error:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
