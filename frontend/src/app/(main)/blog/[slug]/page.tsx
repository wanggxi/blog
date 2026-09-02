import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { TableOfContents } from "@/components/mdx/table-of-contents";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { shikiOptions } from "@/lib/mdx-shiki";
import { getTableOfContents, remarkHeadingIds } from "@/lib/mdx-toc";
import { useMDXComponents } from "@/mdx-components";

type BlogPostPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
	const posts = await getAllBlogPosts();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		return {
			title: "文章不存在 / Wankong",
		};
	}

	return {
		title: `${post.title} / Wankong`,
		description: post.description,
		keywords: post.tags,
	};
}

async function renderMdx(content: string) {
	const { default: MDXContent } = await evaluate(content, {
		...runtime,
		baseUrl: import.meta.url,
		remarkPlugins: [remarkGfm, remarkHeadingIds],
		rehypePlugins: [[rehypeShiki, shikiOptions]],
	});

	return <MDXContent components={useMDXComponents()} />;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const toc = getTableOfContents(post.content);
	const content = await renderMdx(post.content);

	return (
		<article className="mx-auto min-h-screen max-w-5xl px-4 sm:px-6">
			<BlogPostHeader post={post} />
			<div className="relative mt-6">
				<div className="blog-enter prose prose-neutral dark:prose-invert prose-img:my-0 max-w-none prose-headings:scroll-mt-24 prose-pre:rounded-none prose-pre:border prose-pre:border-border prose-a:underline prose-a:underline-offset-4">
					{content}
				</div>
				<aside className="absolute top-0 bottom-0 left-full ml-8 hidden w-56 xl:block">
					<TableOfContents items={toc} />
				</aside>
			</div>
			<footer className="blog-enter mt-12 border-border border-t pt-6">
				<Link
					href="/blog"
					className="group flex items-center justify-between gap-4 border border-border bg-card px-4 py-3 font-data text-sm transition-[border-color,background-color,color] duration-300 hover:border-foreground/45 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
					aria-label="返回博客列表"
				>
					<span className="flex min-w-0 items-center gap-2 text-foreground">
						<span className="text-muted-foreground transition-colors group-hover:text-foreground">
							&gt;
						</span>
						<span className="truncate uppercase">CD ../</span>
					</span>
					<span className="shrink-0 text-muted-foreground text-xs uppercase tracking-[0.18em] transition-colors group-hover:text-foreground">
						BLOG INDEX
					</span>
				</Link>
			</footer>
		</article>
	);
}
