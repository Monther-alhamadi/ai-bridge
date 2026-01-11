"use client";

import { Twitter, Linkedin, MessageCircle, Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  locale: "en" | "ar";
}

export function ShareButtons({ url, title, locale }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25D366]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077B5]",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#1DA1F2]",
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">
        {locale === "en" ? "Share tool:" : "شارك الأداة:"}
      </span>
      <div className="flex gap-2">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-all hover:text-white hover:scale-110 ${platform.color}`}
            title={platform.name}
          >
            <platform.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
