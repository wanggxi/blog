import {
	type Project,
	type PublishedArticle,
	projectSchema,
	publishedArticleSchema,
} from "@blog/content-schema";
import type { Endpoint, PayloadHandler } from "payload";

type RecordValue = Record<string, unknown>;

const cacheHeaders = { "Cache-Control": "public, max-age=2, stale-while-revalidate=30" };

function record(value: unknown): RecordValue {
	return typeof value === "object" && value !== null ? (value as RecordValue) : {};
}

function relationId(value: unknown): string | undefined {
	if (typeof value === "string") return value;
	const id = record(value).id;
	return typeof id === "string" ? id : undefined;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

function tagNames(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		const name = record(item).name;
		return typeof name === "string" ? [name] : [];
	});
}

export function toPublishedArticle(value: unknown): PublishedArticle {
	const doc = record(value);
	const seo = record(doc.seo);
	return publishedArticleSchema.parse({
		canonicalUrl: optionalString(seo.canonicalUrl),
		coverMediaId: relationId(doc.coverMedia),
		formatVersion: doc.formatVersion,
		id: doc.id,
		plainText: doc.plainText,
		publishedAt: doc.publishedAt,
		renderTree: doc.renderTree,
		scheduledAt: optionalString(doc.scheduledAt),
		seoDescription: optionalString(seo.description),
		seoTitle: optionalString(seo.title),
		slug: doc.slug,
		status: doc.publicationStatus,
		summary: doc.summary,
		tags: tagNames(doc.tags),
		title: doc.title,
		updatedAt: doc.updatedAt,
		version: doc.version,
	});
}

export function toPublicProject(value: unknown): Project {
	const doc = record(value);
	return projectSchema.parse({
		description: doc.description,
		featured: doc.featured,
		iconKey: optionalString(doc.iconKey),
		iconMediaId: relationId(doc.iconMedia),
		id: doc.id,
		liveUrl: optionalString(doc.liveUrl),
		name: doc.name,
		platform: doc.platform,
		published: doc.published,
		relatedArticleId: relationId(doc.relatedArticle),
		repositoryUrl: optionalString(doc.repositoryUrl),
		slug: doc.slug,
		sortOrder: doc.sortOrder,
		status: doc.status,
		tagline: doc.tagline,
		tags: tagNames(doc.tags),
		year: doc.year,
	});
}

export const articleListHandler: PayloadHandler = async (req) => {
	const result = await req.payload.find({
		collection: "articles",
		depth: 1,
		limit: 100,
		overrideAccess: false,
		req,
		sort: "-publishedAt",
		where: { publicationStatus: { equals: "published" } },
	});
	const items = result.docs.map(toPublishedArticle);
	return Response.json({ items, total: items.length }, { headers: cacheHeaders });
};

export const articleDetailHandler: PayloadHandler = async (req) => {
	const slug = req.routeParams?.slug;
	if (typeof slug !== "string") return Response.json({ error: "Not found" }, { status: 404 });

	const result = await req.payload.find({
		collection: "articles",
		depth: 1,
		limit: 1,
		overrideAccess: false,
		req,
		where: { and: [{ slug: { equals: slug } }, { publicationStatus: { equals: "published" } }] },
	});
	const doc = result.docs[0];
	if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json(toPublishedArticle(doc), { headers: cacheHeaders });
};

export const projectListHandler: PayloadHandler = async (req) => {
	const result = await req.payload.find({
		collection: "projects",
		depth: 1,
		limit: 100,
		overrideAccess: false,
		req,
		sort: "sortOrder",
		where: { published: { equals: true } },
	});
	const items = result.docs.map(toPublicProject);
	return Response.json({ items, total: items.length }, { headers: cacheHeaders });
};

export const contentEndpoints: Endpoint[] = [
	{ handler: articleListHandler, method: "get", path: "/content/v1/articles" },
	{ handler: articleDetailHandler, method: "get", path: "/content/v1/articles/:slug" },
	{ handler: projectListHandler, method: "get", path: "/content/v1/projects" },
];
