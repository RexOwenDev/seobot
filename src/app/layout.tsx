import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEOBot — AI Content & SEO Pipeline',
  description:
    'Keyword-driven SEO article generation with WordPress and Shopify publishing. Portfolio showcase.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
