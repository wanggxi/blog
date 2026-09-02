import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Route } from "next";
import { cache } from "react";

const POSTS_DIR = path.join(process.cwd(), "src/posts");
const POST_EXTENSIONS = new Set([".md", ".mdx"]);

export type BlogPostMeta = {
	slug: string;
	href: Route<string>;
	hidden: boolean;
	title: string;
	description?: string;
	date: string;
	displayDate: string;
	year: string;
	lang?: string;
	duration?: string;
	updated?: string;
	tags: string[];
};

export type BlogPost = BlogPostMeta & {
	content: string;
	filePath: string;
};

export type BlogYearSection = {
	year: string;
	posts: BlogPostMeta[];
};

type Frontmatter = Record<string, unknown>;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

function getString(data: Frontmatter, key: string) {
	const value = data[key];
	return typeof value === "string" ? value : undefined;
}

function getStringList(data: Frontmatter, key: string) {
	const value = data[key];

	if (typeof value === "string") {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	if (Array.isArray(value)) {
		return value
			.filter((item): item is string => typeof item === "string")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
}

export function getDate(data: Frontmatter, key: string) {
	const value = data[key];
	const date =
		value instanceof Date ||
		typeof value === "string" ||
		typeof value === "number"
			? new Date(value)
			: null;

	return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

export function formatDisplayDate(date: Date | string | undefined) {
	const _date = date
		? typeof date === "string"
			? new Date(date)
			: date
		: new Date(0);
	return dateFormatter.format(_date).replaceAll("/", ".");
}

function toPostMeta(slug: string, data: Frontmatter): BlogPostMeta {
	const date = getDate(data, "date") ?? new Date(0);
	const updated = getDate(data, "updated");

	return {
		slug,
		href: `/blog/${slug}` as Route<string>,
		title: getString(data, "title") ?? slug,
		hidden: !!data.hidden,
		description: getString(data, "description"),
		date: date.toISOString(),
		displayDate: formatDisplayDate(date),
		year: String(date.getFullYear()),
		lang: getString(data, "lang"),
		duration: getString(data, "duration"),
		updated: updated?.toISOString(),
		tags: getStringList(data, "tags"),
	};
}

async function readPostFile(filename: string): Promise<BlogPost> {
	const filePath = path.join(POSTS_DIR, filename);
	const raw = await fs.readFile(filePath, "utf8");
	const { content, data } = matter(raw);
	const slug = path.basename(filename, path.extname(filename));

	return {
		...toPostMeta(slug, data),
		content,
		filePath,
	};
}

export const getAllBlogPosts = cache(async () => {
	const filenames = await fs.readdir(POSTS_DIR);
	const postFiles = filenames.filter((filename) =>
		POST_EXTENSIONS.has(path.extname(filename)),
	);
	const posts = await Promise.all(postFiles.map(readPostFile));

	return posts
		.filter((item) => !item.hidden)
		.sort(
			(left, right) =>
				new Date(right.date).getTime() - new Date(left.date).getTime(),
		);
});

export async function getBlogPostBySlug(slug: string) {
	const posts = await getAllBlogPosts();
	return posts.find((post) => post.slug === slug);
}

export async function getLatestBlogPosts(count: number) {
	const posts = await getAllBlogPosts();
	return posts.slice(0, count);
}

export async function getBlogYearSections(): Promise<BlogYearSection[]> {
	const posts = await getAllBlogPosts();
	const sections = new Map<string, BlogPostMeta[]>();

	for (const post of posts) {
		const yearPosts = sections.get(post.year) ?? [];
		yearPosts.push(post);
		sections.set(post.year, yearPosts);
	}

	return Array.from(sections, ([year, yearPosts]) => ({
		year,
		posts: yearPosts,
	}));
}
