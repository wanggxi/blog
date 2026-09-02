export type TableOfContentsItem = {
	title: string;
	url: string;
	depth: number;
};

type MarkdownNode = {
	type?: string;
	value?: string;
	children?: MarkdownNode[];
	data?: {
		hProperties?: Record<string, unknown>;
		[key: string]: unknown;
	};
};

function createSlugger() {
	const counts = new Map<string, number>();

	return (value: string) => {
		const base =
			value
				.trim()
				.toLowerCase()
				.replace(/<[^>]+>/g, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.replace(/\s+/g, "-") || "section";
		const count = counts.get(base) ?? 0;
		counts.set(base, count + 1);

		return count === 0 ? base : `${base}-${count}`;
	};
}

function getTextContent(node: MarkdownNode): string {
	if (typeof node.value === "string") {
		return node.value;
	}

	return node.children?.map(getTextContent).join("") ?? "";
}

function visitHeadings(
	node: MarkdownNode,
	visitor: (node: MarkdownNode) => void,
) {
	if (node.type === "heading") {
		visitor(node);
	}

	for (const child of node.children ?? []) {
		visitHeadings(child, visitor);
	}
}

export function remarkHeadingIds() {
	return (tree: MarkdownNode) => {
		const slug = createSlugger();

		visitHeadings(tree, (node) => {
			const title = getTextContent(node);
			const id = slug(title);

			node.data = {
				...node.data,
				hProperties: {
					...node.data?.hProperties,
					id,
				},
			};
		});
	};
}

export function getTableOfContents(markdown: string): TableOfContentsItem[] {
	const slug = createSlugger();
	const items: TableOfContentsItem[] = [];
	let inCodeFence = false;

	for (const line of markdown.split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(line)) {
			inCodeFence = !inCodeFence;
			continue;
		}

		if (inCodeFence) {
			continue;
		}

		const match = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);

		if (!match) {
			continue;
		}

		const title = match[2].trim();

		items.push({
			title,
			url: `#${slug(title)}`,
			depth: match[1].length,
		});
	}

	return items;
}
