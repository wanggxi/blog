import { describe, expect, it } from "vitest";
import { publishedArticleSchema } from "./published-article";

describe("publishedArticleSchema", () => {
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
});
