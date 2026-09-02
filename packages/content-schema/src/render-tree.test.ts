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
});
