import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getLatestBlogPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { WordRotate } from "../ui/word-rotate";

export async function BlogSection() {
	const posts = await getLatestBlogPosts(2);

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
					></WordRotate>
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
