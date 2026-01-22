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
  publishedAt?: string;
  _createdAt: string;
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

  const hero = posts[0];
  const secondary = posts.slice(1, 4);
  const rest = posts.slice(4);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Latest News
      </h1>

      {posts.length === 0 ? (
        <p className="text-center py-12 text-gray-600 dark:text-gray-400">
          No posts found. Check back later.
        </p>
      ) : (
        <>
          {/* ── TOP SECTION (FOX NEWS STYLE) ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Hero Story */}
            {hero && (
              <Link
                href={`/post/${hero.slug.current}`}
                className="lg:col-span-2 group"
              >
                <article className="relative h-full rounded-xl overflow-hidden">
                  {hero.mainImage && (
                    <Image
                      src={urlFor(hero.mainImage).width(900).height(500).url()}
                      alt={hero.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                      {hero.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-200">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {formatRelativeTime(getDisplayDate(hero))}
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary Stories */}
            <div className="space-y-4">
              {secondary.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post.slug.current}`}
                  className="group flex gap-4"
                >
                  {post.mainImage && (
                    <div className="relative w-24 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={urlFor(post.mainImage)
                          .width(200)
                          .height(150)
                          .url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 line-clamp-2">
                      {post.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(getDisplayDate(post))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── ALL STORIES ── */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              More Stories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post.slug.current}`}
                  className="group"
                >
                  <article className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col">
                    {post.mainImage && (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={urlFor(post.mainImage)
                            .width(600)
                            .height(400)
                            .url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <div className="mt-auto pt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {formatRelativeTime(getDisplayDate(post))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
