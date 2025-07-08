import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ✅ Sanity client
const client = createClient({
  projectId: "cxbzjc9x",           // ← your actual project ID
  dataset: "production",
  apiVersion: "2023-07-01",        // You can update this to current date
  useCdn: true,
});

// ✅ Image URL builder
const builder = imageUrlBuilder(client);

// ✅ Helper to build image URLs from Sanity
export const urlFor = (source: SanityImageSource) => builder.image(source);

// ✅ Default export for client use
export default client;
