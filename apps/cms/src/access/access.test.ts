import { describe, expect, it } from "vitest";
import { isAuthenticated, publishedOrAuthenticated } from "./access";

describe("collection access", () => {
	it("rejects anonymous mutations", () => {
		expect(isAuthenticated({ req: { user: null } } as never)).toBe(false);
	});

	it("allows an authenticated owner", () => {
		expect(isAuthenticated({ req: { user: { id: 1 } } } as never)).toBe(true);
	});

	it("limits anonymous reads to published records", () => {
		expect(publishedOrAuthenticated({ req: { user: null } } as never)).toEqual({
			publicationStatus: { equals: "published" },
		});
	});
});
