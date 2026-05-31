import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wedded Wonderland | Destination Content Engine',
  description:
    'AI-powered destination content engine. Enter a wedding destination keyword, get a publish-ready SEO article for Wedded Wonderland.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
