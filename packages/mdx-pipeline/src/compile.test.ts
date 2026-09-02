import { describe, expect, it } from "vitest";
import { compileMdx } from "./compile";

describe("compileMdx", () => {
	it("rejects an import with a stable source diagnostic", async () => {
		await expect(compileMdx('import Card from "./Card"\n\n# Hello')).rejects.toMatchObject({
			code: "MDX_IMPORT_FORBIDDEN",
			column: 1,
			line: 1,
		});
	});

	it("rejects a JavaScript expression", async () => {
		await expect(compileMdx("The result is {2 + 2}")).rejects.toMatchObject({
			code: "MDX_EXPRESSION_FORBIDDEN",
			line: 1,
		});
	});

	it("compiles headings and formatted paragraphs into a safe tree", async () => {
		const result = await compileMdx("# Hello, Astro!\n\nWelcome to **my blog**.");

		expect(result).toEqual({
			plainText: "Hello, Astro!\nWelcome to my blog.",
			renderTree: [
				{
					children: [{ type: "text", value: "Hello, Astro!" }],
					depth: 1,
					id: "hello-astro",
					type: "heading",
				},
				{
					children: [
						{ type: "text", value: "Welcome to " },
						{ bold: true, type: "text", value: "my blog" },
						{ type: "text", value: "." },
					],
					type: "paragraph",
				},
			],
		});
	});

	it("rejects an unregistered component", async () => {
		await expect(compileMdx("<DangerousWidget />")).rejects.toMatchObject({
			code: "MDX_COMPONENT_UNKNOWN",
			line: 1,
		});
	});

	it("compiles a registered Notice component", async () => {
		const result = await compileMdx(
			'<Notice type="warning" title="Careful">\n\nRead this.\n\n</Notice>',
		);

		expect(result).toEqual({
			plainText: "Read this.",
			renderTree: [
				{
					children: [
						{
							children: [{ type: "text", value: "Read this." }],
							type: "paragraph",
						},
					],
					name: "Notice",
					props: { title: "Careful", type: "warning" },
					type: "component",
				},
			],
		});
	});

	it("rejects an expression-valued component attribute", async () => {
		await expect(compileMdx("<Notice title={window.location.href} />")).rejects.toMatchObject({
			code: "MDX_EXPRESSION_FORBIDDEN",
			line: 1,
		});
	});

	it("rejects an event-handler attribute", async () => {
		await expect(compileMdx('<Notice onClick="alert(1)" />')).rejects.toMatchObject({
			code: "MDX_EVENT_HANDLER_FORBIDDEN",
			line: 1,
		});
	});

	it("preserves an internal Markdown link", async () => {
		const result = await compileMdx("Read [the archive](/blog).");

		expect(result.renderTree).toEqual([
			{
				children: [
					{ type: "text", value: "Read " },
					{
						children: [{ type: "text", value: "the archive" }],
						href: "/blog",
						type: "link",
					},
					{ type: "text", value: "." },
				],
				type: "paragraph",
			},
		]);
	});

	it("rejects an unsafe Markdown link", async () => {
		await expect(compileMdx("[run](javascript:alert(1))")).rejects.toMatchObject({
			code: "MDX_URL_FORBIDDEN",
			line: 1,
		});
	});
});
