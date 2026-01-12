import { NextResponse } from "next/server";

const AFFILIATE_MAP: Record<string, string> = {
  // Tools
  "chatgpt": "https://openai.com/chatgpt",
  "claude": "https://anthropic.com/claude",
  "midjourney-v6": "https://midjourney.com",
  "dall-e-3": "https://openai.com/dall-e-3",
  "github-copilot": "https://github.com/features/copilot",
  "cursor-ai": "https://cursor.sh",
  "perplexity-ai": "https://perplexity.ai",
  "google-gemini": "https://gemini.google.com",
  
  // Future: Load from database or config file
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const destination = AFFILIATE_MAP[slug];

  if (destination) {
    // 307 Temporary Redirect (preserves method, good for analytics tracking before redirect)
    // or 301 Permanent if the link unlikely to change (but 307 safer for rotate)
    return NextResponse.redirect(destination, 307);
  }

  // Fallback to home if slug not found
  return NextResponse.redirect(new URL("/", request.url));
}
