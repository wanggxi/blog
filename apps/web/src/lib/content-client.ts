import {
	type Project,
	type PublishedArticle,
	projectSchema,
	publishedArticleSchema,
} from "@blog/content-schema";
import { z } from "zod";

const articleListSchema = z
	.object({
		items: z.array(publishedArticleSchema),
		total: z.int().nonnegative(),
	})
	.strict();
const projectListSchema = z
	.object({
		items: z.array(projectSchema),
		total: z.int().nonnegative(),
	})
	.strict();

export class ContentApiError extends Error {
	readonly code: string;

	constructor(code: string, message: string) {
		super(message);
		this.name = "ContentApiError";
		this.code = code;
	}
}

export type ContentClient = {
	getArticle(slug: string): Promise<PublishedArticle | null>;
	listArticles(): Promise<{ items: PublishedArticle[]; total: number }>;
	listProjects(): Promise<{ items: Project[]; total: number }>;
};

type ContentClientOptions = {
	baseUrl: string;
	fetch: typeof globalThis.fetch;
};

export function createContentClient({ baseUrl, fetch }: ContentClientOptions): ContentClient {
	async function request(path: string): Promise<Response> {
		try {
			return await fetch(new URL(path, baseUrl));
		} catch {
			throw new ContentApiError("CONTENT_API_UNAVAILABLE", "The content service is unavailable");
		}
	}

	return {
		async listProjects() {
			const response = await request("/api/content/v1/projects");
			if (!response.ok) {
				throw new ContentApiError("CONTENT_API_UNAVAILABLE", "The content service is unavailable");
			}

			const result = projectListSchema.safeParse(await response.json());
			if (!result.success) {
				throw new ContentApiError(
					"INVALID_CONTENT_RESPONSE",
					"The content service returned an invalid project list",
				);
			}
			return result.data;
		},
		async listArticles() {
			const response = await request("/api/content/v1/articles");
			if (!response.ok) {
				throw new ContentApiError("CONTENT_API_UNAVAILABLE", "The content service is unavailable");
			}

			const result = articleListSchema.safeParse(await response.json());
			if (!result.success) {
				throw new ContentApiError(
					"INVALID_CONTENT_RESPONSE",
					"The content service returned an invalid article list",
				);
			}
			return result.data;
		},
		async getArticle(slug) {
			const response = await request(`/api/content/v1/articles/${encodeURIComponent(slug)}`);
			if (response.status === 404) {
				return null;
			}

			if (!response.ok) {
				throw new ContentApiError("CONTENT_API_UNAVAILABLE", "The content service is unavailable");
			}

			const result = publishedArticleSchema.safeParse(await response.json());
			if (!result.success) {
				throw new ContentApiError(
					"INVALID_CONTENT_RESPONSE",
					"The content service returned an invalid article",
				);
			}

			return result.data;
		},
	};
}

export const contentClient = createContentClient({
	baseUrl:
		import.meta.env.INTERNAL_CMS_URL ?? import.meta.env.PUBLIC_CMS_URL ?? "http://localhost:3000",
	fetch: globalThis.fetch,
});
