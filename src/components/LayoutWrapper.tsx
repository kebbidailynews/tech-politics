// src/app/layout-wrapper.tsx  (or src/components/LayoutWrapper.tsx)
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
      sanityFetch<Category[]>(
        `*[_type == "category" && defined(slug.current)] | order(title asc) {
          _id,
          title,
          slug
        }`,
        ['global', 'categories'],
        86400 // 1 day fallback
      ),

      sanityFetch<TrendingPost[]>(
        `*[_type == "post" && views > 0] 
         | order(views desc, publishedAt desc)[0...5] {
          title,
          "slug": slug.current,
          views
        }`,
        ['global', 'trending', 'posts'],
        1800 // 30 min fallback
      ),

      sanityFetch<string[]>(
        `*[_type == "post"] | order(publishedAt desc)[0...10].title`,
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

    return (
      <ClientLayout
        categories={cleanCategories}
        trending={trending}
        headlines={headlines}
      >
        {children}
      </ClientLayout>
    );
  } catch (error) {
    console.error('LayoutWrapper fetch failed:', error);
    return (
      <ClientLayout categories={[]} trending={[]} headlines={[]}>
        {children}
      </ClientLayout>
    );
  }
}