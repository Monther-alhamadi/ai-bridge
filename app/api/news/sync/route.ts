import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// High-Interest Mock Data (Simulating Scaled Scraping)
const MOCK_SOURCES = [
  {
    title_en: "OpenAI launches Strawberry (o1-preview)",
    title_ar: "أوبن إي آي تطلق نموذج Strawberry المتطور",
    summary_en: "A new reasoning model designed for complex STEM tasks and coding.",
    summary_ar: "نموذج تفكير برمج عالي القدرة، مصمم لحل المسائل العلمية المعقدة والبرمجة المتقدمة.",
    source: "OpenAI Blog",
    link: "https://openai.com",
    tag: "AI Model",
    tool_affiliate: "https://openai.com"
  },
  {
    title_en: "Cursor AI editor hits $50M ARR",
    title_ar: "آداة Cursor AI لتخطي 50 مليون دولار مبيعات سنوية",
    summary_en: "The AI-first code editor is revolutionizing how developers write code.",
    summary_ar: "محرر الأكواد الأول المعتمد على الذكاء الاصطناعي يغير قواعد اللعبة للمبرمجين.",
    source: "TechCrunch",
    link: "https://techcrunch.com",
    tag: "Coding",
    tool_affiliate: "https://cursor.com"
  },
  {
    title_en: "Flux.1: The new king of AI image generation?",
    title_ar: "Flux.1: الملك الجديد لتوليد الصور بالذكاء الاصطناعي؟",
    summary_en: "Black Forest Labs releases a high-fidelity image gen model that rivals Midjourney.",
    summary_ar: "إطلاق نموذج Flux.1 الذي يقدم دقة خيالية في الصور، منافساً قوياً لـ Midjourney.",
    source: "The Verge",
    link: "https://theverge.com",
    tag: "Design",
    tool_affiliate: "https://fal.ai"
  }
];

export async function GET() {
  try {
    // 1. Scraper Simulation (In production, use rss-parser or similar)
    console.log("Syncing news started...");
    
    // 2. AI Summarization Simulation
    // In production: const response = await openai.chat.completions.create({...})
    const processedNews = MOCK_SOURCES.map(item => ({
      ...item,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      score: 4.5 + Math.random() * 0.5, // Automated popularity scoring
    }));

    // 3. Trigger ISR Revalidation for the News Page
    revalidatePath("/[locale]/news", "page");
    revalidatePath("/[locale]", "page");

    return NextResponse.json({
      success: true,
      count: processedNews.length,
      data: processedNews
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
