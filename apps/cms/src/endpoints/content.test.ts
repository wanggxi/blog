import { describe, expect, it } from "vitest";
import { articleDetailHandler, articleListHandler, projectListHandler } from "./content";

const article = {
	compileError: null,
	createdAt: "2026-09-02T08:00:00.000Z",
	formatVersion: 1,
	id: "aabf0d78-b8ad-46d5-bdc9-8bdde1a4540a",
	plainText: "Hello",
	publicationStatus: "published",
	publishedAt: "2026-09-02T09:00:00.000Z",
	renderTree: [{ children: [{ type: "text", value: "Hello" }], type: "paragraph" }],
	scheduledAt: null,
	seo: { canonicalUrl: null, description: null, title: null },
	slug: "hello",
	sourceMdx: "Hello",
	summary: "First post",
	tags: [{ id: "d8325e5c-1845-403f-a73c-419b361379eb", name: "Notes", slug: "notes" }],
	title: "Hello",
	updatedAt: "2026-09-02T09:00:00.000Z",
	version: 1,
};

const project = {
	createdAt: "2026-09-02T08:00:00.000Z",
	description: "A useful project",
	featured: true,
	id: "33204bb7-330c-4bca-bd1a-44fe4ab40b25",
	iconKey: null,
	iconMedia: null,
	liveUrl: "https://example.com",
	name: "Example",
	platform: "Web",
	published: true,
	relatedArticle: null,
	repositoryUrl: null,
	slug: "example",
	sortOrder: 0,
	status: "live",
	tagline: "A small example",
	tags: [{ id: "d8325e5c-1845-403f-a73c-419b361379eb", name: "Notes", slug: "notes" }],
	updatedAt: "2026-09-02T09:00:00.000Z",
	year: "2026",
};

function requestWith(docs: unknown[], routeParams?: Record<string, unknown>) {
	return {
		payload: {
			find: async () => ({
				docs,
				hasNextPage: false,
				hasPrevPage: false,
				limit: 20,
				nextPage: null,
				page: 1,
				pagingCounter: 1,
				prevPage: null,
				totalDocs: docs.length,
				totalPages: 1,
			}),
		},
		routeParams,
	};
}

describe("public Content API", () => {
	it("returns the strict public article projection without source MDX", async () => {
		const response = await articleListHandler(requestWith([article]) as never);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({ items: [{ slug: "hello", tags: ["Notes"] }], total: 1 });
		expect(body.items[0]).not.toHaveProperty("sourceMdx");
	});

	it("returns 404 when an article slug is not published", async () => {
		const response = await articleDetailHandler(requestWith([], { slug: "missing" }) as never);
		expect(response.status).toBe(404);
	});

	it("returns projects using the shared frontend contract", async () => {
		const response = await projectListHandler(requestWith([project]) as never);
		expect(await response.json()).toMatchObject({
			items: [{ name: "Example", tags: ["Notes"] }],
			total: 1,
		});
	});
});
