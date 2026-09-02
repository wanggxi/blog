import { getLatestBlogPosts } from "@/lib/blog";
import { LiveBlogSection } from "./live-blog-section";

export async function BlogSection() {
	const posts = await getLatestBlogPosts(2);
	return <LiveBlogSection initialPosts={posts} />;
}
