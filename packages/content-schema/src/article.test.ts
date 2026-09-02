import { describe, expect, it } from "vitest";
import { articleSchema } from "./article";

describe("articleSchema", () => {
	const validDraft = {
		formatVersion: 1,
		id: "04e1d209-813f-4da1-828a-0ea1903f889a",
		slug: "hello-world",
		status: "draft",
		summary: "A first article",
		sourceMdx: "# Hello",
		tags: ["Astro"],
		title: "Hello world",
		updatedAt: "2026-09-02T08:00:00.000Z",
		version: 1,
	};

	it("rejects a published article without a publication date", () => {
		const result = articleSchema.safeParse({
			...validDraft,
			status: "published",
		});

		expect(result.success).toBe(false);
	});

	it("rejects a scheduled article without a scheduled date", () => {
		const result = articleSchema.safeParse({
			...validDraft,
			status: "scheduled",
		});

		expect(result.success).toBe(false);
	});

	it.each([
		["id", { id: "not-a-uuid" }],
		["slug", { slug: "Hello World" }],
		["title", { title: " " }],
		["summary", { summary: " " }],
		["status", { status: "deleted" }],
		["updatedAt", { updatedAt: "yesterday" }],
		["version", { version: 0 }],
		["formatVersion", { formatVersion: 0 }],
	])("rejects an invalid %s", (path, override) => {
		const result = articleSchema.safeParse({ ...validDraft, ...override });

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.path[0]).toBe(path);
		}
	});
});
