import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import SiteLayout from "./SiteLayout.astro";

describe("SiteLayout", () => {
	it("renders core navigation and metadata", async () => {
		const container = await AstroContainer.create();

		const html = await container.renderToString(SiteLayout, {
			props: {
				description: "A personal site built with Astro",
				title: "Home",
			},
		});

		expect(html).toContain("<title>Home · Personal Index</title>");
		expect(html).toContain('href="#main-content"');
		expect(html).toContain('aria-label="Primary navigation"');
		expect(html).toContain('href="/blog"');
		expect(html).toContain('href="/projects"');
	});
});
