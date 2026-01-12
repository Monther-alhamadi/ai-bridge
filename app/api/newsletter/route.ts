import { NextResponse } from "next/server";
import { LEAD_MAGNETS } from "@/config/lead-magnets";

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, profession } = body;

    // 1. Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!profession) {
      return NextResponse.json({ error: "Profession required" }, { status: 400 });
    }

    // 2. Get Tag and Asset Info
    const magnet = LEAD_MAGNETS[profession] || LEAD_MAGNETS["default"];
    const tag = magnet.tagName;

    // 3. Real Beehiiv API Call
    if (BEEHIIV_API_KEY && BEEHIIV_PUB_ID) {
      const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true, // Crucial: Sends the welcome email defined in Beehiiv
          utm_source: "ai-bridge-website",
          utm_medium: "lead_magnet",
          tags: [tag]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Beehiiv API Error:", errorData);
        // Continue to return success to user, but log internal error
      }
    } else {
      console.warn("Beehiiv keys missing. Simulating subscription.");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 4. Return Asset Info for UI Feedback
    return NextResponse.json({ 
      message: "Subscribed successfully",
      asset: magnet.name
    }, { status: 200 });

  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
