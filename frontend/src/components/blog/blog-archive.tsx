import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import { PostMetaTags } from "@/components/blog/post-meta-tags";
import type { BlogPostMeta, BlogYearSection } from "@/lib/blog";
import { UserAvatar } from "../user-avatar/UserAvatar";

function BlogArchiveHero() {
	return (
		<section className="flex justify-between gap-8 border-border border-b pt-10 pb-10 sm:pt-16">
			<div className="blog-enter">
				<p className="font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
					Blog Archive
				</p>
				<h1 className="mt-3 font-semibold font-ui text-lg leading-tight sm:text-2xl">
					写点东西，记录当下，记录自己
				</h1>
			</div>
			<UserAvatar></UserAvatar>
		</section>
	);
}

function BlogArchiveCard({
	post,
	animationDelay,
}: {
	post: BlogPostMeta;
	animationDelay: string;
}) {
	return (
		<Link
			href={post.href}
			className="blog-card-enter group relative overflow-hidden border border-border/80 bg-card px-4 py-4 transition-[border-color,background-color,box-shadow] duration-300 hover:border-foreground/35 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 sm:items-start sm:px-5 sm:py-4"
			style={{ animationDelay }}
		>
			<span className="min-w-0">
				<span className="block font-medium font-ui text-lg leading-tight transition-colors group-hover:text-foreground sm:text-xl">
					{post.title}
				</span>
				{post.description ? (
					<span className="mt-2 block text-muted-foreground text-sm leading-6">
						{post.description}
					</span>
				) : null}
				<span className="mt-3 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
					<PostMetaTags
						date={post.date}
						duration={post.duration}
						lang={post.lang}
						tags={post.tags}
					/>
				</span>
			</span>
			<div className="absolute top-4 right-4 flex size-8 items-center justify-center border border-border bg-background text-muted-foreground transition-[border-color,color,transform] duration-300 group-hover:border-foreground/40 group-hover:text-foreground sm:justify-self-end">
				<RiArrowRightUpLine className="size-4" />
			</div>
		</Link>
	);
}

function BlogArchiveYear({
	section,
	sectionIndex,
}: {
	section: BlogYearSection;
	sectionIndex: number;
}) {
	return (
		<section
			className="blog-enter grid gap-5 sm:grid-cols-[8rem_1fr]"
			style={{ animationDelay: `${140 + sectionIndex * 80}ms` }}
		>
			<div className="flex items-center gap-3 sm:block">
				<h2 className="font-semibold font-ui text-2xl">{section.year}</h2>
				<span className="h-px flex-1 bg-border sm:mt-4 sm:block" />
			</div>
			<div className="grid gap-3">
				{section.posts.map((post, postIndex) => (
					<BlogArchiveCard
						key={post.slug}
						post={post}
						animationDelay={`${180 + sectionIndex * 80 + postIndex * 45}ms`}
					/>
				))}
			</div>
		</section>
	);
}

export function BlogArchive({ sections }: { sections: BlogYearSection[] }) {
	return (
		<div className="mx-auto max-w-5xl">
			<BlogArchiveHero />
			<div className="grid gap-10 pt-10">
				{sections.map((section, sectionIndex) => (
					<BlogArchiveYear
						key={section.year}
						section={section}
						sectionIndex={sectionIndex}
					/>
				))}
			</div>
		</div>
	);
}
