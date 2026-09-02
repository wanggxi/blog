import type { Project, PublishedArticle } from "@blog/content-schema";
import { ContentApiError, type ContentClient } from "./content-client";

export type HomeContent = {
	articles: PublishedArticle[];
	offline: boolean;
	projects: Project[];
};

export async function loadHomeContent(client: ContentClient): Promise<HomeContent> {
	try {
		const [articles, projects] = await Promise.all([client.listArticles(), client.listProjects()]);
		return { articles: articles.items, offline: false, projects: projects.items };
	} catch (error) {
		if (error instanceof ContentApiError && error.code === "CONTENT_API_UNAVAILABLE") {
			return { articles: [], offline: true, projects: [] };
		}
		throw error;
	}
}
