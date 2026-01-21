// src/app/category/[slug]/page.tsx
export const runtime = "nodejs";

import client from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SanityImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImage | null;
}

interface Category {
  _id: string;
  title: string;
  posts: Post[];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Fetch category and associated posts
  const query = `
    *[_type == "category" && slug.current == $slug][0]{
      _id,
      title,
      "posts": *[_type == "post" && $slug in categories[]->slug.current]{
        _id,
        title,
        slug,
        mainImage
      }
    }
  `;

  const category: Category | null = await client.fetch(query, { slug });

  if (!category) {
    notFound();
  }

  return (
    <section className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {category.title}
      </h2>

      {category.posts.length === 0 ? (
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          No posts found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.posts.map((post) => (
            <Link href={`/post/${post.slug.current}`} key={post._id}>
              <article className="rounded-lg bg-white dark:bg-neutral-900 shadow hover:shadow-md transition-all duration-300">
                {post.mainImage && (
                  <div className="relative w-full h-32">
                    <Image
                      src={urlFor(post.mainImage)
                        .width(400)
                        .height(300)
                        .url()}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
