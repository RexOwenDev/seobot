import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wedded Wonderland | Destination Content Engine',
  description:
    'AI-powered destination content engine. Enter a wedding destination keyword, get a publish-ready SEO article for Wedded Wonderland.',
  robots: { index: false, follow: false },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💍</text></svg>',
  },
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
