import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { PostMetaTags } from "@/components/blog/post-meta-tags";
import type { BlogPost } from "@/lib/blog";
import { UserAvatar } from "../user-avatar/UserAvatar";

export function BlogPostHeader({ post }: { post: BlogPost }) {
	return (
		<>
			<Link
				href="/blog"
				className="inline-flex items-center gap-2 border border-border px-3 py-2 font-data text-muted-foreground text-xs transition-colors hover:border-foreground hover:text-foreground"
			>
				<RiArrowLeftLine className="size-3.5" />
				返回博客
			</Link>
			<header className="blog-enter mt-4 border-border border-b pb-6">
				<h1 className="font-semibold font-ui text-3xl leading-tight sm:text-5xl">
					{post.title}
				</h1>
				{post.description ? (
					<p className="mt-4 text-base text-muted-foreground leading-7">
						{post.description}
					</p>
				) : null}
				<div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
					<div className="inline-flex items-center gap-1 border border-border px-2 py-1 font-data">
						<UserAvatar className="size-4 p-0"></UserAvatar>
						<span>wankong</span>
					</div>
					<PostMetaTags
						date={post.date}
						duration={post.duration}
						lang={post.lang}
						tags={post.tags}
					/>
				</div>
			</header>
		</>
	);
}
