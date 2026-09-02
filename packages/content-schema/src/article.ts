import { z } from "zod";

const optionalText = (maximum: number) => z.string().trim().min(1).max(maximum).optional();

export const articleFieldsSchema = z.object({
	canonicalUrl: z.url().optional(),
	coverMediaId: z.uuid().nullable().optional(),
	formatVersion: z.int().positive(),
	id: z.uuid(),
	publishedAt: z.iso.datetime().optional(),
	scheduledAt: z.iso.datetime().optional(),
	seoDescription: optionalText(320),
	seoTitle: optionalText(160),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	status: z.enum(["draft", "scheduled", "published", "archived"]),
	summary: z.string().trim().min(1).max(320),
	sourceMdx: z.string().max(1_000_000),
	tags: z.array(z.string().trim().min(1).max(40)).max(12),
	title: z.string().trim().min(1).max(160),
	updatedAt: z.iso.datetime(),
	version: z.int().positive(),
});

export const articleSchema = articleFieldsSchema.strict().superRefine((article, context) => {
	if (article.status === "published" && article.publishedAt === undefined) {
		context.addIssue({
			code: "custom",
			message: "Published articles require a publication date",
			path: ["publishedAt"],
		});
	}

	if (article.status === "scheduled" && article.scheduledAt === undefined) {
		context.addIssue({
			code: "custom",
			message: "Scheduled articles require a scheduled date",
			path: ["scheduledAt"],
		});
	}
});

export type Article = z.infer<typeof articleSchema>;
