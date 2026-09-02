import { describe, expect, it } from "vitest";
import { ContentApiError, type ContentClient } from "./content-client";
import { loadHomeContent } from "./load-content";

describe("loadHomeContent", () => {
	it("returns an explicit offline state when the CMS is unavailable", async () => {
		const client: ContentClient = {
			getArticle: async () => null,
			listArticles: async () => {
				throw new ContentApiError("CONTENT_API_UNAVAILABLE", "offline");
			},
			listProjects: async () => ({ items: [], total: 0 }),
		};

		await expect(loadHomeContent(client)).resolves.toEqual({
			articles: [],
			offline: true,
			projects: [],
		});
	});

	it("does not hide an invalid CMS response", async () => {
		const client: ContentClient = {
			getArticle: async () => null,
			listArticles: async () => {
				throw new ContentApiError("INVALID_CONTENT_RESPONSE", "invalid");
			},
			listProjects: async () => ({ items: [], total: 0 }),
		};

		await expect(loadHomeContent(client)).rejects.toMatchObject({
			code: "INVALID_CONTENT_RESPONSE",
		});
	});
});
