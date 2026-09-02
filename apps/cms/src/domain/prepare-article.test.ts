import { describe, expect, it } from "vitest";
import { prepareArticleForSave } from "./prepare-article";

describe("prepareArticleForSave", () => {
	it("compiles safe MDX before publication", async () => {
		const result = await prepareArticleForSave({
			publishedAt: "2026-09-02T09:00:00.000Z",
			sourceMdx: "# Hello\n\nA first post.",
			status: "published",
		});

		expect(result).toMatchObject({
			compileError: null,
			formatVersion: 1,
			plainText: "Hello\nA first post.",
		});
		expect(result.renderTree).toHaveLength(2);
	});

	it("blocks unsafe MDX from publication", async () => {
		await expect(
			prepareArticleForSave({
				publishedAt: "2026-09-02T09:00:00.000Z",
				sourceMdx: "export const secret = 1",
				status: "published",
			}),
		).rejects.toMatchObject({ code: "MDX_IMPORT_FORBIDDEN" });
	});

	it("keeps unsafe MDX in a draft and records the validation error", async () => {
		const result = await prepareArticleForSave({
			sourceMdx: "export const secret = 1",
			status: "draft",
		});

		expect(result).toMatchObject({
			compileError: { code: "MDX_IMPORT_FORBIDDEN", line: 1 },
			plainText: "",
			renderTree: [],
		});
	});
});
