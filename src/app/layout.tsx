import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['monospace'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'TechPolitics',
  description:
    'Exploring the intersection of technology and politics, covering AI governance, tech regulation, and global innovation trends.',
  openGraph: {
    title: 'TechPolitics',
    description: 'Exploring the intersection of technology and politics.',
    url: 'https://yourwebsite.com', // Replace with actual URL
    siteName: 'TechPolitics',
    images: [
      {
        url: '/og-image.jpg', // Add an Open Graph image
        width: 1200,
        height: 630,
        alt: 'TechPolitics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechPolitics',
    description: 'Exploring the intersection of technology and politics.',
    images: ['/og-image.jpg'], // Add Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-neutral-950 text-gray-800 dark:text-gray-100 min-h-screen`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
