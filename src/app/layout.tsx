// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GoogleTagManager } from '@/components/GoogleTagManager';
import { Inter } from 'next/font/google';

// Primary font for better readability and SEO
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

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

// Extended keywords for maximum coverage
const primaryKeywords = [
  'techpolitics',
  'technopolitics',
  'China AI leadership',
  'US China tech war',
  'China quantum computing',
  'China 6G patents',
  'Africa tech startups',
  'China semiconductor dominance',
  'AI policy Africa',
  'China vs USA AI patents',
  'Africa fintech boom',
  'global technopolitics',
  'China tech dominance',
  'US China AI race',
  'Africa AI innovation',
  'technopolitics news',
  'tech politics Africa',
  'global tech geopolitics',
  'technology politics',
  'geopolitical technology',
  'AI supremacy',
  'quantum race',
  'semiconductor war',
  '6G technology race',
  'emerging markets tech',
  'digital sovereignty',
  'tech cold war',
  'innovation politics',
];

// Long-tail keywords for niche dominance
const longTailKeywords = [
  'who is winning the AI race China vs USA',
  'China AI patents statistics 2024',
  'Africa tech startup funding 2024',
  'quantum computing breakthrough China',
  'US semiconductor restrictions impact',
  '6G development timeline China',
  'tech policy Africa development',
  'global AI regulation comparison',
  'emerging markets digital transformation',
  'technopolitics daily newsletter',
];

export const metadata: Metadata = {
  metadataBase: new URL('https://thetechpolitics.com'),
  title: {
    default: 'TechPolitics | Technopolitics News: China Leads USA in AI, Quantum, 6G — Africa Rising',
    template: '%s | TechPolitics — Technopolitics Insights & Global Tech Geopolitics Analysis',
  },
  description:
    'Breaking technopolitics news: China files 3× more AI patents than USA in 2024. Exclusive coverage on quantum supremacy, 6G dominance, semiconductor sovereignty, and US-China tech war. Plus, Africa\'s fintech revolution, AI innovation boom, and startup ecosystem growth. Your premier source for global tech geopolitics decoded.',
  keywords: [...primaryKeywords, ...longTailKeywords].join(', '),
  authors: [
    { name: 'TechPolitics Editorial Team', url: 'https://thetechpolitics.com/about' },
    { name: 'Ekemini Thompson', url: 'https://thetechpolitics.com/author/ekemini' },
  ],
  creator: 'Ekemini Thompson',
  publisher: 'TechPolitics Media Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      'notranslate': true,
      'noimageindex': false,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'en': '/',
    },
  },
  openGraph: {
    title: 'TechPolitics | Technopolitics: China Surpasses USA in AI, Quantum & 6G | Africa Rising',
    description:
      'Breaking: China leads with 3× more AI patents than USA. Quantum computing breakthroughs, 6G patent dominance, semiconductor control, and Africa\'s tech revolution. Daily expert analysis on global technopolitics.',
    url: 'https://thetechpolitics.com',
    siteName: 'TechPolitics — Technopolitics News & Analysis',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-technopolitics-china-lead.jpg',
        width: 1200,
        height: 630,
        alt: 'China Leads USA in AI, Quantum, 6G – Technopolitics & Africa Rising | TechPolitics',
        type: 'image/jpeg',
      },
      {
        url: '/og-technopolitics-global.jpg',
        width: 1200,
        height: 630,
        alt: 'Global Technopolitics Analysis | TechPolitics',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TechPolitics',
    creator: '@EkeminiT',
    title: 'Breaking: China Now Leads USA in AI & Quantum | Africa Tech Rising',
    description:
      'Exclusive: China files 3× AI patents vs USA. Quantum supremacy achieved. 6G race won. Africa fintech boom 2024. Daily technopolitics intelligence.',
    images: ['/og-technopolitics-china-lead.jpg'],
  },
  verification: {
    google: 'your-google-site-verification-code-here', // IMPORTANT: Add your GSC code
    yandex: 'your-yandex-verification-code',
  },
  category: 'Technology News',
  classification: 'Technology Politics',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#dc2626',
  colorScheme: 'dark light',
};

// Enhanced Schema.org structured data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'TechPolitics',
  alternateName: ['Technopolitics News', 'China Tech vs USA Analysis', 'Africa Tech Rising'],
  url: 'https://thetechpolitics.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://thetechpolitics.com/logo.png',
    width: 512,
    height: 512,
    caption: 'TechPolitics Logo',
  },
  image: 'https://thetechpolitics.com/og-technopolitics-china-lead.jpg',
  description: 'Premier technopolitics platform decoding China\'s lead in AI, quantum computing, 6G, semiconductors — and Africa\'s fintech/AI/startup surge amid US-China tech war. Breaking news, exclusive analysis, and expert insights.',
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    name: 'Global',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'editor@thetechpolitics.com',
    contactType: 'Editorial',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://twitter.com/TechPolitics',
    'https://linkedin.com/company/techpolitics',
    'https://x.com/TechPolitics',
    'https://facebook.com/TechPolitics',
    'https://instagram.com/TechPolitics',
  ],
  keywords: [...primaryKeywords, ...longTailKeywords].join(', '),
  knowsAbout: [
    'Artificial Intelligence',
    'Quantum Computing',
    '6G Technology',
    'Semiconductors',
    'Geopolitics',
    'Technology Policy',
    'African Tech Ecosystem',
    'US-China Relations',
  ],
  award: 'Top Technopolitics News Source 2024',
  publisher: {
    '@type': 'Organization',
    name: 'TechPolitics Media Ltd',
    logo: {
      '@type': 'ImageObject',
      url: 'https://thetechpolitics.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://thetechpolitics.com',
  },
};

// Additional Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://thetechpolitics.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Technopolitics News',
      item: 'https://thetechpolitics.com/category/technopolitics',
    },
  ],
};

// FAQ Schema for better featured snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is technopolitics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Technopolitics refers to the intersection of technology and geopolitical power dynamics, covering how nations use technological advancements (AI, quantum computing, semiconductors, 6G) to gain strategic advantages in global affairs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is China really leading in AI patents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, according to recent WIPO data, China filed 3 times more AI patents than the United States in 2023-2024, with particular strength in computer vision, natural language processing, and AI infrastructure.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Africa\'s tech scene growing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Africa\'s tech ecosystem is experiencing exponential growth, with fintech leading at $3.2B in 2023 funding. AI startups increased by 47%, and tech hubs in Lagos, Nairobi, and Cape Town are driving innovation across the continent.',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preload" href="/og-technopolitics-china-lead.jpg" as="image" type="image/jpeg" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preconnect for critical domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Manifest and PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="TechPolitics" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TechPolitics" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="slurp" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="language" content="English" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="revisit-after" content="1 days" />
        
        {/* Article-specific meta for homepage */}
        <meta property="article:published_time" content="2024-01-01T00:00:00+00:00" />
        <meta property="article:modified_time" content={new Date().toISOString()} />
        <meta property="article:author" content="Ekemini Thompson" />
        <meta property="article:section" content="Technology" />
        <meta property="article:tag" content="Technopolitics" />
        
        {/* Additional Open Graph */}
        <meta property="og:locale:alternate" content="zh_CN" />
        <meta property="og:locale:alternate" content="fr_FR" />
        
        {/* Twitter additional */}
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Ekemini Thompson" />
        <meta name="twitter:label2" content="Est. reading time" />
        <meta name="twitter:data2" content="5 minutes" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://thetechpolitics.com" />
        
        {/* AMP alternative (if applicable) */}
        <link rel="amphtml" href="https://thetechpolitics.com/amp" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="TechPolitics RSS Feed" href="/rss.xml" />
        
        {/* Mobile specific */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Security headers (simulated via meta tags) */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' https://*.sanity.io https://*.vercel-analytics.com https://*.vercel-insights.com https://*.googletagmanager.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.vercel-analytics.com;" />
      </head>

      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 min-h-screen selection:bg-red-600 selection:text-white`}>
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId="GTM-XXXXXXX" /> {/* Replace with your GTM ID */}
        
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Suspense>

        <Analytics />
        <SpeedInsights />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        {/* Additional Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TechPolitics',
              url: 'https://thetechpolitics.com',
              logo: 'https://thetechpolitics.com/logo.png',
              sameAs: [
                'https://twitter.com/TechPolitics',
                'https://www.linkedin.com/company/techpolitics',
                'https://www.facebook.com/TechPolitics',
                'https://www.instagram.com/TechPolitics',
              ],
            }),
          }}
        />
        
        {/* WebPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'TechPolitics | Technopolitics News & Analysis',
              description: metadata.description,
              url: 'https://thetechpolitics.com',
              isPartOf: {
                '@type': 'WebSite',
                name: 'TechPolitics',
                url: 'https://thetechpolitics.com',
              },
              inLanguage: 'en-US',
              datePublished: '2024-01-01T00:00:00+00:00',
              dateModified: new Date().toISOString(),
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbSchema.itemListElement,
              },
            }),
          }}
        />
      </body>
    </html>
  );
}