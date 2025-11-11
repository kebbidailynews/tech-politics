// src/app/layout.tsx
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const primaryKeywords = [
  'China AI leadership',
  'US China tech war',
  'China quantum computing',
  'China 6G patents',
  'Africa tech startups',
  'China semiconductor dominance',
  'AI policy Africa',
  'China vs USA AI patents',
  'Africa fintech boom',
  'global tech geopolitics',
];

export const metadata: Metadata = {
  metadataBase: new URL('https://thetechpolitics.com'),
  title: {
    default: 'TechPolitics | China Leads USA in AI, Quantum & 6G — Africa Rising',
    template: '%s | TechPolitics',
  },
  description:
    'China now files 3× more AI patents than the US. Exclusive analysis on quantum, 6G, semiconductors — plus Africa’s AI, fintech & startup revolution.',
  keywords: primaryKeywords,
  authors: [{ name: 'TechPolitics', url: 'https://thetechpolitics.com/about' }],
  creator: 'TechPolitics',
  publisher: 'TechPolitics',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    title: 'China Surpasses USA in AI, Quantum & 6G | TechPolitics',
    description: 'Deep policy analysis. Daily updates. 50,000+ readers.',
    url: 'https://thetechpolitics.com',
    siteName: 'TechPolitics',
    images: [
      {
        url: '/og-china-lead.jpg',
        width: 1200,
        height: 630,
        alt: 'China Leads USA in AI, Quantum, 6G – TechPolitics',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TechPolitics',
    creator: '@TechPolitics',
    title: 'China Now Leads USA in AI & Quantum | Africa Rising',
    description: '3× more AI patents. 6G race won. Africa’s AI boom. Daily.',
    images: ['/og-china-lead.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'TechPolitics',
  alternateName: 'China Tech vs USA | Africa Tech News',
  url: 'https://thetechpolitics.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://thetechpolitics.com/logo.png',
    width: 512,
    height: 512,
  },
  description:
    'Leading source on China’s tech dominance in AI, quantum, 6G, semiconductors — and Africa’s innovation surge.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'editor@thetechpolitics.com',
    contactType: 'Editorial',
  },
  sameAs: [
    'https://twitter.com/TechPolitics',
    'https://linkedin.com/company/techpolitics',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preload" href="/og-china-lead.jpg" as="image" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 min-h-screen`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Suspense>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}