// src/app/post/[slug]/page.tsx
export const runtime = "nodejs";

import client from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  PortableText,
  PortableTextComponents,
  PortableTextBlock,
} from "@portabletext/react";

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
  body: PortableTextBlock[];
}

export default async function PostPage({
  params,
}: {
  params: { slug?: string };
}) {
  const slug = params?.slug;

  // 🔒 HARD GUARD — prevents Sanity "$slug=undefined" crash
  if (!slug || typeof slug !== "string") {
    notFound();
  }

  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      mainImage,
      body
    }
  `;

  const post: Post | null = await client.fetch(query, { slug });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(1200).url()}
          alt={post.title}
          width={1200}
          height={600}
          className="rounded-lg mb-6"
          priority
        />
      )}

      <PortableText value={post.body} components={components} />
    </article>
  );
}

// Custom components for PortableText
const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-lg leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-lg leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-lg leading-relaxed">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
  },
};
