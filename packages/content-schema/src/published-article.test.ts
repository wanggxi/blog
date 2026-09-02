import { describe, expect, it } from "vitest";
import { publishedArticleSchema } from "./published-article";

describe("publishedArticleSchema", () => {
	const validPublishedArticle = {
		formatVersion: 1,
		id: "04e1d209-813f-4da1-828a-0ea1903f889a",
		plainText: "Hello",
		publishedAt: "2026-09-02T08:00:00.000Z",
		renderTree: [
			{
				children: [{ type: "text" as const, value: "Hello" }],
				depth: 1 as const,
				id: "hello",
				type: "heading" as const,
			},
		],
		slug: "hello-world",
		status: "published" as const,
		summary: "A first article",
		tags: [],
		title: "Hello world",
		updatedAt: "2026-09-02T08:00:00.000Z",
		version: 1,
	};

	it("rejects a public article without a safe render tree", () => {
		const result = publishedArticleSchema.safeParse({
			formatVersion: 1,
			id: "04e1d209-813f-4da1-828a-0ea1903f889a",
			plainText: "Hello",
			publishedAt: "2026-09-02T08:00:00.000Z",
			slug: "hello-world",
			status: "published",
			summary: "A first article",
			sourceMdx: "# Hello",
			tags: [],
			title: "Hello world",
			updatedAt: "2026-09-02T08:00:00.000Z",
			version: 1,
		});

		expect(result.success).toBe(false);
	});

	it("accepts a public projection without MDX source", () => {
		expect(publishedArticleSchema.safeParse(validPublishedArticle).success).toBe(true);
	});

	it("rejects MDX source in a public projection", () => {
		const result = publishedArticleSchema.safeParse({
			...validPublishedArticle,
			sourceMdx: "# Internal source",
		});

		expect(result.success).toBe(false);
	});
});
