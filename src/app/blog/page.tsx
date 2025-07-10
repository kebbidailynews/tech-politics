import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Blog / News</h1>
      <p className="mb-4 text-lg">Here you can browse all our latest articles and updates.</p>
      {/* You can integrate your posts list here or link to your HomePage with posts */}
      <p>
        Visit the <Link href="/">Home page</Link> to see featured and latest posts.
      </p>
    </main>
  );
}
