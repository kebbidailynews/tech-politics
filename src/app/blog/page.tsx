import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import client from "@/lib/sanity";
import { Clock } from "lucide-react";

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
  publishedAt?: string;     // may be missing
  _createdAt: string;       // almost always present
}

// ── Helpers ──
function getDisplayDate(post: Post): string {
  const dateStr = post.publishedAt || post._createdAt;
  return new Date(dateStr).toISOString();
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;

  // Older posts → short readable date
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const query = `
    *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      _createdAt
    }
  `;

  const posts: Post[] = await client.fetch(query);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Blog / News
      </h1>
      <p className="mb-8 text-base sm:text-lg text-gray-600 dark:text-gray-300">
        Latest articles and updates covering technology, politics, and more.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No posts found. Check back later for fresh updates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link
              href={`/post/${post.slug.current}`}
              key={post._id}
              className="group block"
            >
              <article className="rounded-xl bg-white dark:bg-neutral-900 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                {post.mainImage ? (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400/50 dark:text-neutral-600/50">
                      News
                    </span>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <time dateTime={getDisplayDate(post)}>
                      {formatRelativeTime(getDisplayDate(post))}
                    </time>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition underline underline-offset-4"
        >
          ← Back to Homepage
        </Link>
      </div>
    </main>
  );
}