import { describe, expect, it } from "vitest";
import { validatePublication } from "./publication";

describe("validatePublication", () => {
	it("requires a publication date for published content", () => {
		expect(validatePublication({ status: "published" })).toEqual({
			message: "Published articles require a publication date",
			path: "publishedAt",
		});
	});

	it("requires a schedule date for scheduled content", () => {
		expect(validatePublication({ status: "scheduled" })).toEqual({
			message: "Scheduled articles require a scheduled date",
			path: "scheduledAt",
		});
	});
});
