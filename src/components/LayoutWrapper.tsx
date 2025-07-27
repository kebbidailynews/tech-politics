// src/app/layout-wrapper.tsx
import client from "@/lib/sanity"; // Ensure this is the correct import path
import ClientLayout from "./client-layout";

interface Category {
  _id: string;
  title: string;
  slug?: { current: string } | null;
}

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default async function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Fetch categories from Sanity
  const query = `*[_type == "category" && defined(slug.current)]{
    _id,
    title,
    slug
  }`;
  const categories: Category[] = await client.fetch(query);

  return <ClientLayout categories={categories} children={children} />;
}