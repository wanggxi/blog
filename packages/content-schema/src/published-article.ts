import { z } from "zod";
import { articleFieldsSchema } from "./article";
import { renderTreeSchema } from "./render-tree";

export const publishedArticleSchema = articleFieldsSchema
	.omit({ sourceMdx: true })
	.extend({
		plainText: z.string(),
		publishedAt: z.iso.datetime(),
		renderTree: renderTreeSchema,
		status: z.literal("published"),
	})
	.strict();

export type PublishedArticle = z.infer<typeof publishedArticleSchema>;
