// lib/sanity-queries.ts
import client from "./sanity";

// Fetch trending posts (most recent posts as trending for now)
export async function getTrendingPosts(limit: number = 10): Promise<{
  title: string;
  slug: string;
  views?: number;
}[]> {
  try {
    // Get recent posts since we don't have view tracking yet
    const query = `*[_type == "post"] | order(_createdAt desc)[0...${limit}] {
      title,
      "slug": slug.current,
      _createdAt
    }`;
    
    const posts = await client.fetch(query);
    
    // Add dummy view counts for now
    return posts.map((post: any, index: number) => ({
      ...post,
      views: Math.floor(Math.random() * 5000) + 1000, // Random views for demo
    }));
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<{
  _id: string;
  title: string;
  slug: string;
}[]> {
  try {
    const query = `*[_type == "category"] {
      _id,
      title,
      "slug": "/category/" + slug.current
    }`;
    
    const categories = await client.fetch(query);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch headlines for ticker
export async function getHeadlines(limit: number = 5): Promise<string[]> {
  try {
    const query = `*[_type == "post"] | order(_createdAt desc)[0...${limit}] {
      title
    }`;
    
    const posts = await client.fetch(query);
    return posts.map((post: any) => post.title);
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return ['Breaking tech news', 'Latest technology updates'];
  }
}

// Fetch all posts for a category
export async function getPostsByCategory(categorySlug: string, limit: number = 20) {
  try {
    const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(_createdAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{name, image},
      categories[]->{title, slug}
    }`;
    
    return await client.fetch(query, { categorySlug });
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
}