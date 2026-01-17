# Email Templates Usage Guide

## Welcome Email Template

The welcome email template is designed to deliver the "50 Magic Prompts Guide" lead magnet to newsletter subscribers.

### Features

- ✅ Fully bilingual (English & Arabic)
- ✅ RTL support for Arabic
- ✅ Responsive design for all devices
- ✅ Premium glassmorphism-inspired design
- ✅ Clear CTA button
- ✅ Engaging storytelling (Sarah's transformation teaser)
- ✅ Plain text fallback version

### Import & Usage

```typescript
import { getWelcomeEmailTemplate, getWelcomeEmailPlainText } from '@/lib/email-templates';

// Generate HTML version
const htmlEmail = getWelcomeEmailTemplate({
  locale: 'ar',
  subscriberName: 'أحمد', // Optional
  downloadLink: 'https://aibridge.com/downloads/50-prompts-guide.pdf'
});

// Generate plain text version (for email clients that don't support HTML)
const plainTextEmail = getWelcomeEmailPlainText({
  locale: 'ar',
  subscriberName: 'أحمد',
  downloadLink: 'https://aibridge.com/downloads/50-prompts-guide.pdf'
});
```

### Integration with Resend

```typescript
// In app/api/newsletter-form/route.ts
import { Resend } from 'resend';
import { getWelcomeEmailTemplate, getWelcomeEmailPlainText } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'AI Bridge <hello@aibridge.com>',
  to: sanitizedEmail,
  subject: locale === 'ar' 
    ? 'هدية مغناطيس الذكاء الاصطناعي: دليل الـ 50 برومبت بين يديك! 🎁'
    : '🎁 Your AI Magic Gift: 50 Prompts Guide Inside!',
  html: getWelcomeEmailTemplate({ 
    locale, 
    downloadLink: 'https://aibridge.com/downloads/50-prompts-guide.pdf' 
  }),
  text: getWelcomeEmailPlainText({ 
    locale, 
    downloadLink: 'https://aibridge.com/downloads/50-prompts-guide.pdf' 
  }),
});
```

### Email Preview

#### English Version
- **Subject**: 🎁 Your AI Magic Gift: 50 Prompts Guide Inside!
- **Hero**: Blue-to-purple gradient header with AI Bridge logo
- **Main CTA**: "Download Your Free Guide 📚"
- **Teaser**: Sarah's transformation story (6 hours → 10 minutes)

#### Arabic Version (RTL)
- **Subject**: هدية مغناطيس الذكاء الاصطناعي: دليل الـ 50 برومبت بين يديك! 🎁
- **Hero**: نفس التدرج الأزرق-البنفسجي
- **Main CTA**: "حمّل دليلك المجاني الآن 📚"
- **Teaser**: قصة تحول سارة (6 ساعات → 10 دقائق)

### Required Assets

Before sending emails, create:

1. **PDF Guide**: `/public/downloads/50-prompts-guide.pdf`
   - 50 curated prompts for teachers
   - Professional design with AI Bridge branding
   - Both Arabic and English versions (or bilingual)

2. **Hosting**: Ensure the download link is publicly accessible

### Environment Variables

Add to `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=hello@aibridge.com
```

### Testing Emails Locally

```bash
# Install Resend
npm install resend

# Create test route
# app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getWelcomeEmailTemplate } from '@/lib/email-templates';

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const { data, error } = await resend.emails.send({
    from: 'AI Bridge <onboarding@resend.dev>', // Use Resend's test domain
    to: 'your-email@example.com',
    subject: 'Test Welcome Email',
    html: getWelcomeEmailTemplate({
      locale: 'en',
      downloadLink: 'https://example.com/test.pdf'
    }),
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
```

Visit: `http://localhost:3000/api/test-email`

### Email Metrics to Track

- **Open Rate**: % of recipients who open the email
- **Click Rate**: % who click the download button
- **Bounce Rate**: Invalid email addresses
- **Unsubscribe Rate**: Opt-outs

Target benchmarks:
- Open Rate: 40-50% (welcome emails typically perform well)
- Click Rate: 25-35%
- Bounce Rate: <2%

### Customization

You can customize the template by editing `lib/email-templates.ts`:

- **Colors**: Change gradient colors in the inline CSS
- **Logo**: Replace the emoji with an image logo
- **Content**: Adjust the copy in the `content` object
- **Layout**: Modify the HTML structure

### Unsubscribe Link

Replace `{{unsubscribe_url}}` with actual unsubscribe URL:

```typescript
const unsubscribeUrl = `https://aibridge.com/unsubscribe?email=${encodeURIComponent(email)}`;
const html = emailTemplate.replace('{{unsubscribe_url}}', unsubscribeUrl);
```

### Legal Compliance

- ✅ Include unsubscribe link (required by CAN-SPAM Act)
- ✅ Include physical address (add to footer if needed)
- ✅ Don't use misleading subject lines
- ✅ Honor unsubscribe requests within 10 days
