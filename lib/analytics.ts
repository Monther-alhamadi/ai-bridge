"use client";

/**
 * Advanced Event Tracking for AI Bridge
 * Tracks high-intent actions to optimize ROI.
 */

type EventName = "affiliate_click" | "lead_capture" | "outcome_view" | "star_rating";

interface EventParams {
  item_id?: string;
  item_name?: string;
  profession?: string;
  context?: string;
  value?: number;
  [key: string]: any;
}

export const trackEvent = (name: EventName, params: EventParams) => {
  // 1. Log to Console (for debugging/local)
  console.log(`[Analytics] Event: ${name}`, params);

  // 2. Google Analytics 4 (Check if gtag exists)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }

  // 3. Potential custom analytics backend
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ name, params }) });
};
