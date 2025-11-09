// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import client from '@/lib/sanity'; // ← Fixed: changed from { client } to default import

interface SanitySlug {
  current: string;
}

interface Post {
  slug: SanitySlug;
  _updatedAt: string;
}

interface Category {
  slug: SanitySlug;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://thetechpolitics.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://thetechpolitics.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://thetechpolitics.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://thetechpolitics.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://thetechpolitics.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Fetch dynamic blog posts
  const posts: Post[] = await client.fetch(`
    *[_type == "post" && defined(slug.current)] {
      slug,
      _updatedAt
    }
  `);

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://thetechpolitics.com/blog/${post.slug.current}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Fetch categories
  const categories: Category[] = await client.fetch(`
    *[_type == "category" && defined(slug.current)] {
      slug
    }
  `);

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `https://thetechpolitics.com/category/${cat.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Combine all
  return [...staticPages, ...blogPosts, ...categoryPages];
}