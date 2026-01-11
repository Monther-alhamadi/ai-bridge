import { NextResponse } from "next/server";

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, profession } = body;

    // 1. Simple Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!profession) {
      return NextResponse.json(
        { error: "Profession context is required" },
        { status: 400 }
      );
    }

    // 2. Mocking the Beehiiv API Call (Until Keys are provided)
    // In production, we would use fetch to:
    // https://api.beehiiv.com/v2/publications/{pub_id}/subscriptions
    console.log(`[Beehiiv Mock] Subscribing ${email} to tag: ${profession}`);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Success Response
    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
