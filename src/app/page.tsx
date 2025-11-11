// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import client  from '@/lib/sanity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  mainImage?: { asset: { url: string } };
  category?: { title: string; slug: string };
  readingTime?: number;
  views?: number;
}

// ── Server Component: Fetch Data ──
async function getHomeData() {
  const posts = await client.fetch<Post[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      mainImage { asset-> { url } },
      "category": category-> { title, "slug": slug.current },
      readingTime,
      views
    }`
  );

  const hero = posts[0];
  const featured = posts.slice(1, 4);
  const trending = posts.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const latest = posts.slice(4, 10);

  return { hero, featured, trending, latest };
}

// ── Hero Card Component ──
function HeroPost({ post }: { post: Post }) {
  const time = new Date(post.publishedAt).toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-2xl">
      {post.mainImage ? (
        <Image
          src={post.mainImage.asset.url}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full h-96 object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="bg-gradient-to-br from-red-600 to-orange-600 h-96 flex items-center justify-center">
          <span className="text-white text-4xl font-black">TP</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {post.category && (
          <Badge className="mb-2 bg-red-600">{post.category.title}</Badge>
        )}
        <h1 className="text-3xl md:text-5xl font-black leading-tight">
          <Link href={`/post/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h1>
        <p className="mt-2 text-sm opacity-90 line-clamp-2">{post.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time} WAT
          </span>
          {post.readingTime && <span>• {post.readingTime} min read</span>}
          {post.views && <span>• {post.views.toLocaleString()} views</span>}
        </div>
      </div>
    </div>
  );
}

// ── Featured Grid ──
function FeaturedGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden hover:shadow-xl transition">
          {post.mainImage ? (
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="bg-gray-200 h-48" />
          )}
          <CardHeader>
            {post.category && (
              <Badge variant="secondary" className="w-fit">
                {post.category.title}
              </Badge>
            )}
            <CardTitle className="line-clamp-2">
              <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {new Date(post.publishedAt).toLocaleDateString('en-NG', {
                timeZone: 'Africa/Lagos',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Trending Sidebar ──
function TrendingSidebar({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6">
      <h2 className="flex items-center gap-2 text-xl font-black text-red-600 mb-4">
        <TrendingUp className="w-6 h-6" /> Trending in Nigeria
      </h2>
      <ol className="space-y-3">
        {posts.map((post, i) => (
          <li key={post._id} className="flex gap-3 group">
            <span className="font-black text-2xl text-red-600 w-8">{i + 1}</span>
            <div>
              <Link
                href={`/post/${post.slug}`}
                className="font-medium hover:text-red-600 transition line-clamp-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {post.views?.toLocaleString()} views
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Main Homepage ──
export default async function HomePage() {
  const { hero, featured, trending, latest } = await getHomeData();

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="mb-12">
        {hero ? <HeroPost post={hero} /> : <div className="h-96 bg-gray-200 rounded-xl" />}
      </section>

      {/* === LIVE TIME BANNER (NIGERIA) === */}
      <div className="bg-red-600 text-white py-2 text-center font-bold text-sm">
        <Clock className="inline w-4 h-4 mr-1" />
        LIVE: {new Date().toLocaleTimeString('en-NG', {
          timeZone: 'Africa/Lagos',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })} WAT • Tuesday, November 11, 2025
      </div>

      {/* === FEATURED GRID + TRENDING === */}
      <section className="my-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            Featured Stories <ChevronRight className="w-5 h-5 text-red-600" />
          </h2>
          <FeaturedGrid posts={featured} />
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading trending...</div>}>
            <TrendingSidebar posts={trending} />
          </Suspense>
        </div>
      </section>

      {/* === LATEST NEWS === */}
      <section className="my-12">
        <h2 className="text-2xl font-black mb-6">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((post) => (
            <Card key={post._id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-NG', {
                      timeZone: 'Africa/Lagos',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {post.readingTime && <span>{post.readingTime} min</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </section>
    </>
  );
}