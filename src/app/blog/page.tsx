import BlogPageClient from "@/components/blog/BlogPageClient";
import { getBlogIndexItems } from "@/lib/blog/loadPost";

export default async function BlogPage() {
  const items = await getBlogIndexItems();
  return <BlogPageClient items={items} />;
}
