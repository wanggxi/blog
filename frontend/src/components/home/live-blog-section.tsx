"use client";

import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import type { BlogPostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { WordRotate } from "../ui/word-rotate";

type PublishedArticle = {
	slug: string;
	title: string;
	summary: string;
	publishedAt: string;
	tags?: string[];
};

function cmsUrl() {
	if (process.env.NEXT_PUBLIC_CMS_URL) return process.env.NEXT_PUBLIC_CMS_URL;
	return `${window.location.protocol}//${window.location.hostname}:3000`;
}

function toPostMeta(article: PublishedArticle): BlogPostMeta {
	const date = new Date(article.publishedAt);
	return {
		slug: article.slug,
		href: `/blog/${article.slug}` as Route<string>,
		hidden: false,
		title: article.title,
		description: article.summary,
		date: date.toISOString(),
		displayDate: date.toLocaleDateString("zh-CN").replaceAll("/", "."),
		year: String(date.getFullYear()),
		tags: article.tags ?? [],
	};
}

export function LiveBlogSection({
	initialPosts,
}: {
	initialPosts: BlogPostMeta[];
}) {
	const [posts, setPosts] = useState(initialPosts);

	useEffect(() => {
		const controller = new AbortController();
		fetch(`${cmsUrl()}/api/content/v1/articles`, {
			signal: controller.signal,
		})
			.then((response) => {
				if (!response.ok)
					throw new Error(`CMS request failed: ${response.status}`);
				return response.json() as Promise<{ items?: PublishedArticle[] }>;
			})
			.then((payload) => {
				const cmsPosts = (payload.items ?? []).map(toPostMeta);
				if (cmsPosts.length > 0) setPosts(cmsPosts.slice(0, 2));
			})
			.catch(() => {
				// Keep the build-time posts visible when the CMS is temporarily unavailable.
			});

		return () => controller.abort();
	}, []);

	return (
		<section className="grid gap-4 border-border border-t pt-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8">
			<div>
				<p className="font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
					博客
				</p>
				<div className="mt-2 flex items-center font-semibold font-ui text-2xl">
					写点东西，记录
					<WordRotate
						words={["当下", "自己"]}
						duration={3000}
						className="font-semibold font-ui text-2xl"
					/>
				</div>
			</div>
			<div className="grid gap-3">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={post.href}
						className="group grid gap-3 border border-border p-4 transition-[border-color,background-color] hover:border-foreground/35 hover:bg-muted/50 sm:grid-cols-[6rem_1fr_auto] sm:items-start"
					>
						<span className="font-data text-muted-foreground text-xs uppercase tracking-[0.08em] sm:pt-1">
							{post.displayDate}
						</span>
						<span className="min-w-0 border-border border-l pl-3 sm:border-l-0 sm:pl-0">
							<span className="block font-medium font-ui leading-tight transition-colors group-hover:text-foreground">
								{post.title}
							</span>
							<span className="mt-1 block text-muted-foreground text-sm leading-6">
								{post.description}
							</span>
						</span>
						<RiArrowRightUpLine className="group-hover:-translate-y-0.5 size-4 justify-self-end text-muted-foreground opacity-45 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100 sm:mt-1" />
					</Link>
				))}
				<Link
					href="/blog"
					className={cn(
						buttonVariants({ variant: "link", size: "sm" }),
						"ml-auto w-fit gap-1 text-right text-muted-foreground",
					)}
				>
					查看更多
					<RiArrowRightUpLine className="size-3" />
				</Link>
			</div>
		</section>
	);
}
