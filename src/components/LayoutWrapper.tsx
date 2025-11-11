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
    // Fetch categories, trending posts, and latest headlines in parallel
    const [categories, trending, headlines] = await Promise.all([
      client.fetch<Category[]>(
        `*[_type == "category" && defined(slug.current)]{
          _id,
          title,
          slug
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
        .catch(() => []),
    ]);

    // Add relative /category/ prefix for internal links
    const cleanCategories = categories
      .map((c) => ({
        _id: c._id,
        title: c.title,
        slug: c.slug?.current ? `/category/${c.slug.current}` : '',
      }))
      .filter((c) => c.slug); // remove any invalid slugs

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
    console.error('Error fetching layout data:', error);

    // Fallback to empty arrays
    return (
      <ClientLayout categories={[]} trending={[]} headlines={[]}>
        {children}
      </ClientLayout>
    );
  }
}
