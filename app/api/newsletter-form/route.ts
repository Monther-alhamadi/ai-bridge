import { NextRequest, NextResponse } from "next/server";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, locale } = body;

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Sanitize and normalize email
    const sanitizedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate locale
    if (locale && !["en", "ar"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale" },
        { status: 400 }
      );
    }

    // Log submission to console (temporary - will be replaced with database storage)
    console.log("📧 Newsletter Subscription:", {
      email: sanitizedEmail,
      locale: locale || "en",
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });

    // TODO: Future integration points
    // - Store in Supabase database
    // - Send welcome email via Resend
    // - Attach PDF guide (50 Magic Prompts)
    // - Add to email marketing list
    // - Track conversion in analytics

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: locale === "ar" 
          ? "تم الاشتراك بنجاح! تحقق من بريدك الإلكتروني."
          : "Successfully subscribed! Check your email.",
        data: {
          email: sanitizedEmail,
          locale: locale || "en",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Newsletter API Error:", error);
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process newsletter subscription",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
