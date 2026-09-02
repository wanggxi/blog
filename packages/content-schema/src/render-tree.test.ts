import { describe, expect, it } from "vitest";
import { renderTreeSchema } from "./render-tree";

describe("renderTreeSchema", () => {
	it("rejects an impossible heading depth", () => {
		const result = renderTreeSchema.safeParse([
			{
				children: [{ type: "text", value: "Too deep" }],
				depth: 7,
				id: "too-deep",
				type: "heading",
			},
		]);

		expect(result.success).toBe(false);
	});

	it("accepts an internal link", () => {
		const result = renderTreeSchema.safeParse([
			{
				children: [{ type: "text", value: "Read more" }],
				href: "/blog/read-more",
				type: "link",
			},
		]);

		expect(result.success).toBe(true);
	});

	it("rejects a JavaScript link", () => {
		const result = renderTreeSchema.safeParse([
			{
				children: [{ type: "text", value: "Run" }],
				href: "javascript:alert(1)",
				type: "link",
			},
		]);

		expect(result.success).toBe(false);
	});

	it("accepts a site-local image", () => {
		const result = renderTreeSchema.safeParse([
			{
				alt: "Example",
				src: "/media/example.webp",
				type: "image",
			},
		]);

		expect(result.success).toBe(true);
	});

	it("rejects a data URL image", () => {
		const result = renderTreeSchema.safeParse([
			{
				alt: "Embedded",
				src: "data:image/svg+xml,<svg onload=alert(1)></svg>",
				type: "image",
			},
		]);

		expect(result.success).toBe(false);
	});
});
