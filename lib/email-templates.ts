/**
 * Welcome Email Template for Newsletter Subscribers
 * Delivers the "50 Magic Prompts Guide" lead magnet
 * 
 * Usage: Import this in your email service (Resend/Nodemailer)
 * const html = getWelcomeEmailTemplate(locale, subscriberName);
 */

interface WelcomeEmailOptions {
  locale: "en" | "ar";
  subscriberName?: string;
  downloadLink: string; // Link to the PDF guide
}

export function getWelcomeEmailTemplate({ 
  locale, 
  subscriberName = "", 
  downloadLink 
}: WelcomeEmailOptions): string {
  
  const content = {
    en: {
      subject: "🎁 Your AI Magic Gift: 50 Prompts Guide Inside!",
      greeting: subscriberName ? `Hi ${subscriberName}!` : "Hi there, Creative Educator!",
      intro: "Welcome to the <strong>AI Bridge Elite Teachers Network</strong>.",
      message: "You've taken the first step to become the <strong>'Elite Teacher'</strong> in your school. Here's your free guide as promised:",
      ctaButton: "Download Your Free Guide 📚",
      guideTitle: "50 Magic Prompts for Modern Teachers",
      guideDescription: "Inside this guide, you'll discover ready-to-use prompts for lesson planning, exam creation, and handling challenging students with ChatGPT.",
      nextSteps: "What's Next?",
      nextStep1: "📖 Read through the guide and bookmark your favorite prompts",
      nextStep2: "🚀 Try them with ChatGPT or our AI Bridge Teacher OS",
      nextStep3: "💬 Reply to this email with your results (we read every message!)",
      teaser: "<strong>A little secret coming next week:</strong> I'll share how Sarah (an Arabic teacher) transformed her weekly prep from 6 hours to just 10 minutes using our platform. Stay tuned!",
      footer: "Questions? Just reply to this email—we're here to help!",
      signature: "With passion,<br/>The AI Bridge Team",
      unsubscribe: "Don't want these emails? <a href='{{unsubscribe_url}}' style='color: #64748b; text-decoration: underline;'>Unsubscribe here</a>",
    },
    ar: {
      subject: "هدية مغناطيس الذكاء الاصطناعي: دليل الـ 50 برومبت بين يديك! 🎁",
      greeting: subscriberName ? `أهلاً ${subscriberName}!` : "أهلاً بك زميلي المبدع!",
      intro: "مرحباً بك في <strong>مجتمع معلمي النخبة من AI Bridge</strong>.",
      message: "لقد اتخذت الخطوة الأولى لتكون <strong>'المعلم النخبة'</strong> في مدرستك. إليك رابط تحميل الدليل المجاني كما وعدناك:",
      ctaButton: "حمّل دليلك المجاني الآن 📚",
      guideTitle: "دليل الـ 50 برومبت السحري للمعلم العصري",
      guideDescription: "في هذا الدليل، ستجد أوامر جاهزة للاستخدام لتحضير الدروس، كتابة الاختبارات، والتعامل مع الطلاب المشاغبين باستخدام ChatGPT.",
      nextSteps: "ما الخطوات القادمة؟",
      nextStep1: "📖 اقرأ الدليل وضع علامة على البرومبتات المفضلة لديك",
      nextStep2: "🚀 جربها مع ChatGPT أو منصة Teacher OS من AI Bridge",
      nextStep3: "💬 رد على هذا البريد بنتائجك (نقرأ كل رسالة!)",
      teaser: "<strong>سر صغير في الأسبوع القادم:</strong> سأشارك معك كيف حولت 'سارة' (معلمة لغة عربية) تحضيرها الأسبوعي من 6 ساعات إلى 10 دقائق فقط باستخدام منصتنا. ابقَ قريباً!",
      footer: "لديك أسئلة؟ فقط رد على هذا البريد—نحن هنا للمساعدة!",
      signature: "بكل شغف،<br/>فريق AI Bridge",
      unsubscribe: "لا تريد هذه الرسائل؟ <a href='{{unsubscribe_url}}' style='color: #64748b; text-decoration: underline;'>إلغاء الاشتراك هنا</a>",
    },
  };

  const t = content[locale];
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const align = isRTL ? "right" : "left";
  const fontFamily = isRTL ? "'Cairo', 'Segoe UI', sans-serif" : "'Inter', 'Helvetica Neue', sans-serif";

  return `
<!DOCTYPE html>
<html lang="${locale}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${fontFamily};
      background-color: #f8fafc;
      color: #1e293b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 40px 30px;
      text-align: ${align};
      direction: ${direction};
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 20px;
    }
    .intro {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 20px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 18px;
      margin: 30px 0;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .guide-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #fbbf24;
      border-radius: 16px;
      padding: 24px;
      margin: 30px 0;
      text-align: ${align};
    }
    .guide-title {
      font-size: 20px;
      font-weight: 900;
      color: #92400e;
      margin-bottom: 12px;
    }
    .guide-description {
      font-size: 14px;
      color: #78350f;
      line-height: 1.5;
    }
    .steps {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
    }
    .steps h3 {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .steps ol {
      padding-${isRTL ? 'right' : 'left'}: 24px;
      margin: 0;
    }
    .steps li {
      font-size: 15px;
      color: #475569;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .teaser {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border-left: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      font-size: 15px;
      color: #1e40af;
      line-height: 1.6;
    }
    .footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .signature {
      font-size: 16px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 20px;
    }
    .unsubscribe {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 20px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .cta-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <a href="https://aibridge.com/${locale}" class="logo">
        🌉 AI Bridge
      </a>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="greeting">${t.greeting}</div>
      
      <div class="intro">
        ${t.intro}
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #475569;">
        ${t.message}
      </p>

      <!-- CTA Button -->
      <center>
        <a href="${downloadLink}" class="cta-button">
          ${t.ctaButton}
        </a>
      </center>

      <!-- Guide Info Box -->
      <div class="guide-box">
        <div class="guide-title">📚 ${t.guideTitle}</div>
        <div class="guide-description">${t.guideDescription}</div>
      </div>

      <!-- Next Steps -->
      <div class="steps">
        <h3>${t.nextSteps}</h3>
        <ol>
          <li>${t.nextStep1}</li>
          <li>${t.nextStep2}</li>
          <li>${t.nextStep3}</li>
        </ol>
      </div>

      <!-- Teaser -->
      <div class="teaser">
        ${t.teaser}
      </div>

      <p style="margin-top: 30px; font-size: 16px; color: #64748b;">
        ${t.footer}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="signature">${t.signature}</div>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">
          AI Bridge | ${isRTL ? 'جسر الذكاء الاصطناعي' : 'Your AI Teaching Companion'}
        </p>
        <p class="unsubscribe">${t.unsubscribe}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Plain Text Version (Fallback)
 */
export function getWelcomeEmailPlainText({ 
  locale, 
  subscriberName = "", 
  downloadLink 
}: WelcomeEmailOptions): string {
  
  const content = {
    en: `
Hi ${subscriberName || "Creative Educator"}!

Welcome to the AI Bridge Elite Teachers Network.

You've taken the first step to become the 'Elite Teacher' in your school. 

Here's your free guide as promised:

📚 Download: ${downloadLink}

INSIDE THE GUIDE:
50 Magic Prompts for Modern Teachers - Ready-to-use prompts for lesson planning, exam creation, and handling challenging students with ChatGPT.

WHAT'S NEXT?
1. Read through the guide and bookmark your favorite prompts
2. Try them with ChatGPT or our AI Bridge Teacher OS
3. Reply to this email with your results (we read every message!)

A LITTLE SECRET COMING NEXT WEEK:
I'll share how Sarah (an Arabic teacher) transformed her weekly prep from 6 hours to just 10 minutes using our platform. Stay tuned!

Questions? Just reply to this email—we're here to help!

With passion,
The AI Bridge Team

---
AI Bridge | Your AI Teaching Companion
Unsubscribe: {{unsubscribe_url}}
    `,
    ar: `
أهلاً ${subscriberName || "بك زميلي المبدع"}!

مرحباً بك في مجتمع معلمي النخبة من AI Bridge.

لقد اتخذت الخطوة الأولى لتكون 'المعلم النخبة' في مدرستك.

إليك رابط تحميل الدليل المجاني كما وعدناك:

📚 رابط التحميل: ${downloadLink}

محتوى الدليل:
دليل الـ 50 برومبت السحري للمعلم العصري - أوامر جاهزة لتحضير الدروس، كتابة الاختبارات، والتعامل مع الطلاب المشاغبين باستخدام ChatGPT.

ما الخطوات القادمة؟
1. اقرأ الدليل وضع علامة على البرومبتات المفضلة
2. جربها مع ChatGPT أو منصة Teacher OS
3. رد على هذا البريد بنتائجك (نقرأ كل رسالة!)

سر صغير في الأسبوع القادم:
سأشارك معك كيف حولت 'سارة' (معلمة لغة عربية) تحضيرها الأسبوعي من 6 ساعات إلى 10 دقائق فقط. ابقَ قريباً!

لديك أسئلة؟ رد على هذا البريد—نحن هنا للمساعدة!

بكل شغف،
فريق AI Bridge

---
AI Bridge | جسر الذكاء الاصطناعي
إلغاء الاشتراك: {{unsubscribe_url}}
    `,
  };

  return content[locale].trim();
}
