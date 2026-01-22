import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import client from '@/lib/sanity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  _createdAt: string;
  mainImage?: { asset: { url: string } };
  category?: { title: string; slug: string };
  readingTime?: number;
}

function getDisplayDate(post: Post): string {
  const dateStr = post.publishedAt || post._createdAt;
  return new Date(dateStr).toISOString();
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}

function truncateHeadline(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

async function getHomeData() {
  const posts = await client.fetch<Post[]>(`
    *[_type == "post"]
    | order(publishedAt desc, _createdAt desc)
    {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      _createdAt,
      mainImage { asset-> { url } },
      "category": category-> { title, "slug": slug.current },
      readingTime
    }
  `);

  return {
    hero: posts[0],
    featured: posts.slice(1, 4),
    sideHeadlines: posts.slice(1, 5),
    trending: posts.slice(1, 6),
    latest: posts.slice(4, 10),
  };
}

// ────────────────────────────────────────────────
function HeroPost({ post, sideHeadlines }: { post: Post; sideHeadlines: Post[] }) {
  return (
    <div className="relative bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Main hero image + content */}
        <div className="lg:col-span-2 relative">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[520px]">
            {post.mainImage ? (
              <Image
                src={post.mainImage.asset.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-900 to-red-900 h-full flex items-center justify-center">
                <Image src="/favicon.ico" alt="Logo" width={100} height={100} className="opacity-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <Badge className="mb-2 sm:mb-3 bg-red-600 text-white font-bold uppercase text-xs sm:text-sm tracking-wide">
              {post.category?.title || 'Breaking News'}
            </Badge>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2 sm:mb-3">
              <Link href={`/post/${post.slug}`} className="hover:text-red-400 transition-colors">
                {truncateHeadline(post.title, 100)}
              </Link>
            </h1>
            <p className="text-gray-200 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-3">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatRelativeTime(getDisplayDate(post))}
              </span>
              {post.readingTime && <span>• {post.readingTime} min read</span>}
            </div>
          </div>
        </div>

        {/* Side headlines – scrollable on mobile */}
        <div className="bg-gray-900 p-5 sm:p-6 max-h-[420px] lg:max-h-[520px] overflow-y-auto">
          <h3 className="text-red-500 font-black text-lg sm:text-xl border-b-2 border-red-600 pb-2 mb-4 sticky top-0 bg-gray-900 z-10">
            TOP HEADLINES
          </h3>
          <div className="space-y-4">
            {sideHeadlines.map((item) => (
              <div key={item._id} className="border-b border-gray-700 pb-3 last:border-0">
                <Link href={`/post/${item.slug}`}>
                  <h4 className="text-white font-semibold text-sm sm:text-base leading-tight hover:text-red-400 transition line-clamp-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(getDisplayDate(item))}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
function FeaturedGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {posts.map((post) => (
        <Link key={post._id} href={`/post/${post.slug}`} className="group block">
          <div className="relative overflow-hidden rounded bg-black mb-3">
            <div className="relative aspect-[4/3]">
              {post.mainImage ? (
                <Image
                  src={post.mainImage.asset.url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <Image src="/favicon.ico" alt="Logo" width={60} height={60} className="opacity-30" />
                </div>
              )}
            </div>
            {post.category && (
              <Badge className="absolute top-2 left-2 bg-red-600 text-xs font-bold uppercase">
                {post.category.title}
              </Badge>
            )}
          </div>
          <h3 className="font-black text-base sm:text-lg leading-tight mb-2 group-hover:text-red-600 transition line-clamp-3">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2 hidden sm:block">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(getDisplayDate(post))}
          </div>
        </Link>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
function TrendingSidebar({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm sm:shadow-lg">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 sm:py-4">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-black uppercase tracking-wide">
          <TrendingUp className="w-5 h-5" /> Trending Now
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-neutral-800">
        {posts.map((post, i) => (
          <Link
            key={post._id}
            href={`/post/${post.slug}`}
            className="block p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition group"
          >
            <div className="flex gap-3">
              <span className="font-black text-2xl sm:text-3xl text-red-600 leading-none flex-shrink-0 pt-1">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base leading-tight group-hover:text-red-600 transition line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(getDisplayDate(post))}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
function LatestList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="flex gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-200 dark:border-neutral-800 group">
          <Link href={`/post/${post.slug}`} className="relative w-32 sm:w-40 h-24 sm:h-28 flex-shrink-0 overflow-hidden rounded bg-black">
            {post.mainImage ? (
              <Image
                src={post.mainImage.asset.url}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="160px"
              />
            ) : (
              <div className="h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <Image src="/favicon.ico" alt="Logo" width={48} height={48} className="opacity-30" />
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            {post.category && (
              <Badge variant="outline" className="mb-1.5 sm:mb-2 text-xs font-bold border-red-600 text-red-600">
                {post.category.title}
              </Badge>
            )}
            <h3 className="font-black text-lg sm:text-xl leading-tight mb-1.5 sm:mb-2 group-hover:text-red-600 transition line-clamp-2">
              <Link href={`/post/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2 hidden sm:block">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(getDisplayDate(post))}
              </span>
              {post.readingTime && <span>• {post.readingTime} min</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
export default async function HomePage() {
  const { hero, featured, sideHeadlines, trending, latest } = await getHomeData();

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="mb-6 sm:mb-8">
        {hero ? (
          <HeroPost post={hero} sideHeadlines={sideHeadlines} />
        ) : (
          <div className="h-64 sm:h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
            <Image src="/favicon.ico" alt="Logo" width={100} height={100} className="opacity-20" />
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 pb-2 sm:pb-3 border-b-4 border-red-600">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Featured Stories</h2>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <FeaturedGrid posts={featured} />
        </section>

        {/* Latest + Trending */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 pb-2 sm:pb-3 border-b-4 border-blue-800">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Latest Updates</h2>
            </div>
            <LatestList posts={latest} />
            <div className="text-center mt-8 sm:mt-10">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wide">
                <Link href="/blog">View All Stories</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Suspense fallback={
              <div className="bg-neutral-800/50 rounded-lg h-80 sm:h-96 animate-pulse flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            }>
              <TrendingSidebar posts={trending} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}