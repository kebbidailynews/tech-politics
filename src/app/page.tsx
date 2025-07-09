import client from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';

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
  body: unknown;
  publishedAt: string;
}

export default async function HomePage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const query = `*[_type == "post"] | order(publishedAt desc){
      _id, title, slug, mainImage, body, publishedAt
    }`;
    posts = await client.fetch(query);
  } catch (err) {
    console.error('Sanity fetch error:', err);
    error = 'Failed to load posts. Please try again later.';
  }

  const [featured, ...latest] = posts.length > 0 ? posts : [];

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 py-4">
          {error}
        </div>
      )}

      {/* Featured Story */}
      {featured ? (
        <section className="mb-10">
          <Link href={`/post/${featured.slug.current}`} aria-label={`Read full article: ${featured.title}`}>
            <article className="rounded-lg bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4">
              {featured.mainImage && (
                <div className="relative w-full sm:w-1/3 h-32 sm:h-40">
                  <Image
                    src={urlFor(featured.mainImage).width(400).height(300).url()}
                    alt={featured.title}
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase mb-1">Featured Story</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {featured.title}
                </h2>
              </div>
            </article>
          </Link>
        </section>
      ) : (
        !error && <p className="text-center text-gray-600 dark:text-gray-400">No featured post available</p>
      )}

      {/* Latest Posts */}
      {latest.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((post) => (
            <Link href={`/post/${post.slug.current}`} key={post._id} aria-label={`Read full article: ${post.title}`}>
              <article className="rounded-lg bg-white dark:bg-neutral-900 shadow hover:shadow-md transition-all duration-300">
                {post.mainImage && (
                  <div className="relative w-full h-32">
                    <Image
                      src={urlFor(post.mainImage).width(400).height(300).url()}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
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
        </section>
      ) : (
        !error && <p className="text-center text-gray-600 dark:text-gray-400">No posts available</p>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 mt-10 rounded-lg p-6 sm:p-8 text-center text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Join the TechPolitics Community</h3>
        <p className="text-sm sm:text-base text-blue-100 mb-4 max-w-xl mx-auto">
          Stay updated with 5,000 readers on AI governance, tech regulation, and global innovation trends.
        </p>
        <form
          action="https://YOUR_MAILERLITE_FORM_URL"
          method="post"
          target="_blank"
          className="max-w-sm mx-auto flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md bg-white/90 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 transition"
            required
            aria-label="Email address for newsletter subscription"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-100 dark:bg-neutral-900 dark:text-blue-300 dark:hover:bg-neutral-800 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TechPolitics',
            url: 'https://yourwebsite.com', // Replace with actual URL
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://yourwebsite.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}