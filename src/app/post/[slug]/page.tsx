// src/app/post/[slug]/page.tsx
import client, { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { PortableText, PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";

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

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-extrabold mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-800">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6 text-gray-600">{children}</blockquote>
    ),
    code: ({ children }) => (
      <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-x-auto my-4">
        <code>{children}</code>
      </pre>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="mb-2">{children}</li>
    ),
    number: ({ children }) => (
      <li className="mb-2">{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  types: {
    image: ({ value }) => {
      const src = urlFor(value).width(800).url();
      const alt = value.alt || "Blog post image";
      return (
        <div className="my-6">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={450}
            className="rounded-lg mx-auto"
            style={{ objectFit: "contain" }}
          />
          {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
        </div>
      );
    },
    code: ({ value }) => {
      return (
        <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-x-auto my-4">
          <code>{value.code}</code>
        </pre>
      );
    },
  },
};

export default async function PostPage(props: { params: { slug: string } }) {
  const { slug } = await props.params;

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

      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} components={components} />
      </div>
    </article>
  );
}
