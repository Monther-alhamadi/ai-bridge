import { NewsletterForm } from "@/components/NewsletterForm";

export default function NewsletterTestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-8">
      <div className="container mx-auto max-w-5xl space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black">
            📧 Newsletter Form Test Page
          </h1>
          <p className="text-lg text-muted-foreground">
            Testing the new NewsletterForm component in both English and Arabic
          </p>
        </div>

        {/* English Version */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">
            🇬🇧 English Version
          </h2>
          <NewsletterForm locale="en" />
        </section>

        {/* Arabic Version */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">
            🇸🇦 النسخة العربية
          </h2>
          <NewsletterForm locale="ar" />
        </section>

        {/* Instructions */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h3 className="text-xl font-bold">🧪 Testing Instructions:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Try submitting with an invalid email (e.g., "test")</li>
            <li>Try submitting with a valid email</li>
            <li>Check browser console for API logs</li>
            <li>Verify loading states and success animation</li>
            <li>Test on different screen sizes (mobile, tablet, desktop)</li>
            <li>Verify RTL layout for Arabic version</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
