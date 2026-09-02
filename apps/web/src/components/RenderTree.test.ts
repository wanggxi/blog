import type { RenderNode } from "@blog/content-schema";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import RenderTree from "./RenderTree.astro";

describe("RenderTree", () => {
	it("renders semantic HTML while escaping stored text", async () => {
		const nodes: RenderNode[] = [
			{
				children: [{ type: "text", value: "A <script>safe</script> heading" }],
				depth: 2,
				id: "safe-heading",
				type: "heading",
			},
			{
				children: [
					{
						children: [{ type: "text", value: "Archive" }],
						href: "/blog",
						type: "link",
					},
				],
				type: "paragraph",
			},
		];
		const container = await AstroContainer.create();

		const html = await container.renderToString(RenderTree, { props: { nodes } });

		expect(html).toContain('<h2 id="safe-heading">');
		expect(html).toContain("A &lt;script&gt;safe&lt;/script&gt; heading");
		expect(html).toContain('<a href="/blog">Archive</a>');
	});

	it("renders block, media, list, and registered component nodes", async () => {
		const nodes: RenderNode[] = [
			{
				children: [
					{
						children: [{ type: "text", value: "Quoted" }],
						type: "paragraph",
					},
				],
				type: "blockquote",
			},
			{ language: "ts", type: "code", value: "const safe = true" },
			{ alt: "Example", src: "/media/example.webp", type: "image" },
			{
				children: [
					{
						children: [
							{
								children: [{ type: "text", value: "Item" }],
								type: "paragraph",
							},
						],
						type: "listItem",
					},
				],
				ordered: false,
				type: "list",
			},
			{ type: "thematicBreak" },
			{
				children: [
					{
						children: [{ type: "text", value: "Take care" }],
						type: "paragraph",
					},
				],
				name: "Notice",
				props: { title: "Careful", type: "warning" },
				type: "component",
			},
		];
		const container = await AstroContainer.create();

		const html = await container.renderToString(RenderTree, { props: { nodes } });

		expect(html).toContain("<blockquote>");
		expect(html).toContain('<code data-language="ts">const safe = true</code>');
		expect(html).toContain('<img src="/media/example.webp" alt="Example"');
		expect(html).toContain("<ul><li>");
		expect(html).toContain("<hr>");
		expect(html).toContain('data-component="Notice"');
		expect(html).toContain("Careful");
	});
});
