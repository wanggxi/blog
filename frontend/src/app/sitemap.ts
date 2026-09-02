import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

const SITE_URL = "https://www.wankong.top";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllBlogPosts();

	return [
		{
			url: SITE_URL,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/blog`,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/products`,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		...posts.map((post) => ({
			url: `${SITE_URL}${post.href}`,
			lastModified: post.updated ?? post.date,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}
