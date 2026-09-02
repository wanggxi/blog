import { z } from "zod";

export const projectSchema = z
	.object({
		description: z.string().trim().min(1).max(2_000),
		featured: z.boolean(),
		iconKey: z
			.string()
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
			.optional(),
		iconMediaId: z.uuid().optional(),
		id: z.uuid(),
		liveUrl: z.url().optional(),
		name: z.string().trim().min(1).max(120),
		platform: z.string().trim().min(1).max(80),
		published: z.boolean(),
		relatedArticleId: z.uuid().optional(),
		repositoryUrl: z.url().optional(),
		slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		sortOrder: z.int().nonnegative(),
		status: z.enum(["planned", "building", "beta", "live", "archived"]),
		tagline: z.string().trim().min(1).max(200),
		tags: z.array(z.string().trim().min(1).max(40)).max(12),
		year: z.string().regex(/^\d{4}$/),
	})
	.catchall(z.never());

export type Project = z.infer<typeof projectSchema>;
