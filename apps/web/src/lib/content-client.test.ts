import { describe, expect, it } from "vitest";
import { createContentClient } from "./content-client";

describe("ContentClient", () => {
	const article = {
		formatVersion: 1,
		id: "04e1d209-813f-4da1-828a-0ea1903f889a",
		plainText: "Hello",
		publishedAt: "2026-09-02T08:00:00.000Z",
		renderTree: [],
		slug: "hello-world",
		status: "published",
		summary: "A first article",
		tags: ["Astro"],
		title: "Hello world",
		updatedAt: "2026-09-02T08:00:00.000Z",
		version: 1,
	};

	it("rejects a malformed article response", async () => {
		const client = createContentClient({
			baseUrl: "https://cms.example.com",
			fetch: async () => Response.json({ broken: true }),
		});

		await expect(client.getArticle("hello-world")).rejects.toMatchObject({
			code: "INVALID_CONTENT_RESPONSE",
		});
	});

	it("returns null when an article does not exist", async () => {
		const client = createContentClient({
			baseUrl: "https://cms.example.com",
			fetch: async () => new Response(null, { status: 404 }),
		});

		await expect(client.getArticle("missing")).resolves.toBeNull();
	});

	it("returns a validated article list", async () => {
		const client = createContentClient({
			baseUrl: "https://cms.example.com",
			fetch: async () => Response.json({ items: [article], total: 1 }),
		});

		await expect(client.listArticles()).resolves.toEqual({ items: [article], total: 1 });
	});

	it("returns a validated project list", async () => {
		const project = {
			description: "A useful project",
			featured: true,
			id: "66cce406-c59a-4051-9c78-253227259f74",
			name: "Example",
			platform: "Web",
			published: true,
			slug: "example",
			sortOrder: 0,
			status: "live",
			tagline: "An example project",
			tags: ["Astro"],
			year: "2026",
		};
		const client = createContentClient({
			baseUrl: "https://cms.example.com",
			fetch: async () => Response.json({ items: [project], total: 1 }),
		});

		await expect(client.listProjects()).resolves.toEqual({ items: [project], total: 1 });
	});

	it("normalizes a network failure", async () => {
		const client = createContentClient({
			baseUrl: "https://cms.example.com",
			fetch: async () => {
				throw new TypeError("fetch failed");
			},
		});

		await expect(client.listArticles()).rejects.toMatchObject({
			code: "CONTENT_API_UNAVAILABLE",
		});
	});
});
