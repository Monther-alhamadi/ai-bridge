"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RewardModal } from "./RewardModal";
import { trackEvent } from "@/lib/analytics";

interface StarRatingProps {
  toolName: string;
  locale: "en" | "ar";
}

export function StarRating({ toolName, locale }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
    setSubmitted(true);
    
    // Track the rating event
    trackEvent("star_rating", {
      item_name: toolName,
      value: value,
      context: "review_component"
    });

    // Trigger Reward Modal after a short delay
    setTimeout(() => {
      setShowReward(true);
    }, 800);
  };

  return (
    <>
      <div className="rounded-3xl border bg-card/50 p-6 shadow-sm flex flex-col items-center gap-4">
        <h4 className="font-bold text-center">
          {locale === "en" ? `How would you rate ${toolName}?` : `ما هو تقييمك لأداة ${toolName}؟`}
        </h4>
        
        {submitted ? (
          <p className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-bottom-2">
            {locale === "en" ? "Thanks for your feedback!" : "شكراً لمشاركتك رأيك!"}
          </p>
        ) : (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRating(star)}
                className="transition-transform hover:scale-125 active:scale-90"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hover || rating) >= star 
                      ? "fill-amber-400 text-amber-400" 
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          {locale === "en" ? "User Verified Feedback" : "آراء المستخدمين الموثقة"}
        </p>
      </div>

      <RewardModal 
        isOpen={showReward} 
        onClose={() => setShowReward(false)} 
        locale={locale} 
      />
    </>
  );
}
