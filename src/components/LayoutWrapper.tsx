// src/app/layout-wrapper.tsx
import client from '@/lib/sanity';
import ClientLayout from './client-layout';

interface Category {
  _id: string;
  title: string;
  slug?: { current: string } | null;
}

interface TrendingPost {
  title: string;
  slug: string;
  views?: number;
}

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default async function LayoutWrapper({ children }: LayoutWrapperProps) {
  try {
    // Parallel fetch: categories, trending posts, and latest headlines
    const [categories, trending, headlines] = await Promise.all([
      client.fetch<Category[]>(
        `*[_type == "category" && defined(slug.current)]{
          _id,
          title,
          "slug": slug.current
        }`
      ),
      client.fetch<TrendingPost[]>(
        `*[_type == "post"] | order(views desc, publishedAt desc)[0...5]{
          title,
          "slug": slug.current,
          views
        }`
      ),
      client
        .fetch<string[]>(
          `*[_type == "post"] | order(publishedAt desc)[0...10].title`
        )
        .catch(() => []), // Graceful fallback
    ]);

    // Normalize categories: ensure valid slug + add /category/ prefix
    const cleanCategories = categories
      .filter((c): c is { _id: string; title: string; slug: string } => 
        !!c.slug && typeof c.slug === 'string'
      )
      .map((c) => ({
        _id: c._id,
        title: c.title,
        slug: `/category/${c.slug}`,
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
    console.error('LayoutWrapper: Failed to fetch data', error);

    // Full fallback — prevents runtime crash
    return (
      <ClientLayout
        categories={[]}
        trending={[]}
        headlines={[]}
      >
        {children}
      </ClientLayout>
    );
  }
}