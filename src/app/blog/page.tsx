import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import client from "@/lib/sanity";

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
  publishedAt: string;
}

export default async function BlogPage() {
  // Fetch all posts, sorted by published date (newest first)
  const query = `
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt
    }
  `;
  const posts: Post[] = await client.fetch(query);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Blog / News
      </h1>
      <p className="mb-6 text-base sm:text-lg text-gray-600 dark:text-gray-300">
        Browse our latest articles and updates on technology and politics.
      </p>

      {posts.length === 0 ? (
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          No posts found. Check back later for updates!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post.slug.current}`} key={post._id}>
              <article className="rounded-lg bg-white dark:bg-neutral-900 shadow hover:shadow-md transition-all duration-300">
                {post.mainImage && (
                  <div className="relative w-full h-32 sm:h-40">
                    <Image
                      src={urlFor(post.mainImage).width(400).height(300).url()}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          aria-label="View article archive"
        >
          View All Articles in Archive
        </Link>
      </div>
    </main>
  );
}