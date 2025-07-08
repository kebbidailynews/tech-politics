// src/app/post/[slug]/page.tsx
import client from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";

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

interface Params {
  slug: string;
}

// Use @ts-ignore just for this one parameter destructure, then define properly:
export default async function PostPage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any } /* cast below to Params */
) {
  // Cast params to Params to satisfy usage:
  const safeParams = params as Params;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id, title, slug, mainImage, body
  }`;

  const post: Post = await client.fetch(query, { slug: safeParams.slug });

  if (!post) {
    return <div className="p-6">Post not found.</div>;
  }

  return (
    <article className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(1200).url()}
          alt={post.title}
          width={1200}
          height={600}
          className="rounded-lg mb-6"
        />
      )}
      <div className="prose prose-lg">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}