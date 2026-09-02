import { describe, expect, it } from "vitest";
import { projectSchema } from "./project";

describe("projectSchema", () => {
	it("rejects executable component data", () => {
		const result = projectSchema.safeParse({
			description: "A useful project",
			featured: true,
			icon: () => null,
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
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]).toMatchObject({
				code: "unrecognized_keys",
				keys: ["icon"],
			});
		}
	});
});
