import client, { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import { notFound } from "next/navigation";

// Define types
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

// Use params in function body (not in argument destructure)
export default async function PostPage(props: { params: { slug: string } }) {
  const { slug } = await props.params; // 👈 important fix

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id, title, slug, mainImage, body
  }`;

  const post: Post = await client.fetch(query, { slug });

  if (!post) return notFound();

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
