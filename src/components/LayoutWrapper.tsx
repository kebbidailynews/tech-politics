// src/components/LayoutWrapper.tsx
import { draftMode } from 'next/headers';
import client from '@/lib/sanity';
import ClientLayout from './client-layout';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface TrendingPost {
  title: string;
  slug: string;
  views?: number;
}

interface LayoutWrapperProps {
  children: React.ReactNode;
}

async function sanityFetch<T>(
  query: string,
  tags: string[],
  revalidateSeconds?: number
): Promise<T> {
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  if (isEnabled) {
    return client.fetch<T>(query, {}, { cache: 'no-store' });
  }

  return client.fetch<T>(query, {}, {
    next: {
      tags,
      revalidate: revalidateSeconds ?? 3600,
    },
  });
}

export default async function LayoutWrapper({ children }: LayoutWrapperProps) {
  try {
    const [categories, trending, headlines] = await Promise.all([
      // Categories query
      sanityFetch<Category[]>(
        `*[_type == "category" && defined(slug.current)] | order(title asc) {
          _id,
          title,
          slug
        }`,
        ['global', 'categories'],
        86400 // 1 day fallback
      ),

      // Trending posts query - UPDATED: get recent posts
      sanityFetch<TrendingPost[]>(
        `*[_type == "post"] 
         | order(_createdAt desc)[0...10] {
          title,
          "slug": slug.current,
          _createdAt
        }`,
        ['global', 'trending', 'posts'],
        1800 // 30 min fallback
      ),

      // Headlines query
      sanityFetch<string[]>(
        `*[_type == "post"] | order(_createdAt desc)[0...10].title`,
        ['global', 'headlines', 'posts'],
        900 // 15 min fallback
      ).catch(() => []),
    ]);

    const cleanCategories = categories
      .filter((c): c is Category => !!c.slug?.current)
      .map((c) => ({
        _id: c._id,
        title: c.title,
        slug: `/category/${c.slug.current}`,
      }));

    // Add dummy view counts to trending posts for display
    const trendingWithViews = trending.map((post, index) => ({
      ...post,
      views: Math.floor(Math.random() * 5000) + 1000 + (index * 100), // Higher views for newer posts
    }));

    return (
      <ClientLayout
        categories={cleanCategories}
        trending={trendingWithViews}
        headlines={headlines}
      >
        {children}
      </ClientLayout>
    );
  } catch (error) {
    console.error('LayoutWrapper fetch failed:', error);
    // Return fallback data
    const fallbackTrending = [
      { title: "China Files 3x More AI Patents Than USA", slug: "china-ai-patents-lead", views: 5240 },
      { title: "Africa's Fintech Boom Hits $3.2B in Funding", slug: "africa-fintech-boom-2024", views: 4875 },
      { title: "Quantum Computing Breakthrough: China Achieves Supremacy", slug: "china-quantum-supremacy", views: 4210 },
      { title: "6G Race: Who Will Dominate Next-Gen Networks?", slug: "6g-race-analysis", views: 3985 },
      { title: "Semiconductor War: US-China Tech Cold War Escalates", slug: "semiconductor-war-us-china", views: 3760 },
    ];
    
    return (
      <ClientLayout 
        categories={[]} 
        trending={fallbackTrending} 
        headlines={fallbackTrending.map(p => p.title)}
      >
        {children}
      </ClientLayout>
    );
  }
}