'use client'

import client from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

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
}

export default async function HomePage() {
  const query = `*[_type == "post"] | order(publishedAt desc){
    _id, title, slug, mainImage, body
  }`;
  const posts: Post[] = await client.fetch(query);
  const [featured, ...latest] = posts;

  return (
    <div className="bg-gray-100 dark:bg-neutral-950 text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">TechPolitics</span>
          </h1>
          <div className="flex space-x-4 sm:space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
            <Link href="/categories" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition">Categories</Link>
            <Link href="/about" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="sticky top-16 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5">
              <h3 className="text-base font-bold mb-3">Trending Topics</h3>
              <ul className="space-y-2">
                {["AI Governance", "Tech Regulation", "Digital Privacy", "Innovation Trends"].map((topic, index) => (
                  <li key={index}>
                    <Link href={`/category/${topic.toLowerCase().replace(/\s/g, '-')}`} className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition">
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5">
              <h3 className="text-base font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/archive" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition">Article Archive</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          {/* Compact Hero Section */}
          {featured && (
            <section className="mb-10">
              <Link href={`/post/${featured.slug.current}`}>
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
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                      {featured.title}
                    </h2>
                  </div>
                </article>
              </Link>
            </section>
          )}

          {/* Latest Posts - Compact Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((post) => (
              <Link href={`/post/${post.slug.current}`} key={post._id}>
                <article className="rounded-lg bg-white dark:bg-neutral-900 shadow hover:shadow-md transition-all duration-300">
                  {post.mainImage && (
                    <div className="relative w-full h-32">
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
                  </div>
                </article>
              </Link>
            ))}
          </section>

          {/* Newsletter CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 mt-10 rounded-lg p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Join the TechPolitics Community</h3>
            <p className="text-sm sm:text-base text-blue-100 mb-4 max-w-xl mx-auto">
              Stay updated with 5,000 readers on AI governance, tech regulation, and global innovation trends.
            </p>
            <form action="https://YOUR_MAILERLITE_FORM_URL" method="post" target="_blank" className="max-w-sm mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-white/90 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 transition"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-100 dark:bg-neutral-900 dark:text-blue-300 dark:hover:bg-neutral-800 transition"
              >
                Subscribe
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}