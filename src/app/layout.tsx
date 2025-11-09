import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';

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

const primaryKeywords = [
  'China tech leadership',
  'China vs USA AI',
  'China quantum computing',
  'China 6G',
  'Africa tech startups',
  'China tech dominance',
  'US China tech war',
  'Africa AI innovation',
  'China semiconductor lead',
  'China tech policy'
];

export const metadata: Metadata = {
  title: {
    default: 'TechPolitics: China Leads USA in AI, Quantum & 6G | Africa Rising',
    template: '%s | TechPolitics',
  },
  description: 'China now leads the US in AI patents, quantum tech, 6G, and semiconductors. Exclusive analysis + Africa’s tech boom: startups, fintech, AI, and policy.',
  keywords: primaryKeywords,
  authors: [{ name: 'TechPolitics', url: 'https://thetechpolitics.com/about' }],
  creator: 'TechPolitics',

  // === Open Graph ===
  openGraph: {
    title: 'China Surpasses USA in AI, Quantum & 6G | TechPolitics',
    description: 'Deep dives into China’s tech dominance over the US + Africa’s rising innovation ecosystem.',
    url: 'https://thetechpolitics.com',
    siteName: 'TechPolitics',
    images: [
      {
        url: 'https://thetechpolitics.com/og-china-lead.jpg',
        width: 1200,
        height: 630,
        alt: 'China Leads USA in AI, Quantum Computing, and 6G – TechPolitics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // === Twitter Cards ===
  twitter: {
    card: 'summary_large_image',
    site: '@TechPolitics',
    title: 'China Now Leads USA in AI & Quantum | Africa Tech Rising',
    description: 'China files 3x more AI patents than US. Africa’s fintech & AI boom. Daily updates.',
    images: ['https://thetechpolitics.com/og-china-lead.jpg'],
  },

  // === Robots ===
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

  alternates: {
    canonical: 'https://thetechpolitics.com',
  },

  // === Favicon & App Icons ===
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// === Structured Data ===
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechPolitics",
  alternateName: "China Tech vs USA | Africa Tech News",
  url: "https://thetechpolitics.com",
  description: "China leads USA in AI, quantum computing, 6G, and semiconductors. In-depth policy analysis + Africa's tech startup and innovation boom.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://thetechpolitics.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: "TechPolitics",
    logo: {
      "@type": "ImageObject",
      url: "https://thetechpolitics.com/logo.png",
      width: 512,
      height: 512
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 min-h-screen`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />

        {/* ✅ Structured Data (Safe placement) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* ✅ Optional: Preload critical image */}
        <link rel="preload" href="/og-china-lead.jpg" as="image" />
      </body>
    </html>
  );
}
