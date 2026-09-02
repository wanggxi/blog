import type { RenderNode } from "@blog/content-schema";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Node, Parent } from "unist";
import { registeredComponentNames } from "./components";
import { MdxValidationError } from "./errors";

export type CompiledMdx = {
	plainText: string;
	renderTree: RenderNode[];
};

function hasChildren(node: Node): node is Parent {
	return "children" in node && Array.isArray(node.children);
}

function nodeAttributes(node: Node): Array<Record<string, unknown>> {
	if (!("attributes" in node) || !Array.isArray(node.attributes)) {
		return [];
	}

	return node.attributes.filter(
		(attribute): attribute is Record<string, unknown> =>
			typeof attribute === "object" && attribute !== null,
	);
}

function isSafeLink(value: string): boolean {
	if (/^(?:\/|#|\.\.?\/)/.test(value)) {
		return true;
	}

	try {
		return ["http:", "https:", "mailto:"].includes(new URL(value).protocol);
	} catch {
		return false;
	}
}

function rejectForbiddenSyntax(node: Node): void {
	if (node.type === "mdxjsEsm") {
		throw new MdxValidationError(
			"MDX_IMPORT_FORBIDDEN",
			"MDX imports and exports are not allowed",
			node.position,
		);
	}

	if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
		throw new MdxValidationError(
			"MDX_EXPRESSION_FORBIDDEN",
			"JavaScript expressions are not allowed in MDX",
			node.position,
		);
	}

	if (node.type === "link") {
		const url = "url" in node && typeof node.url === "string" ? node.url : "";
		if (!isSafeLink(url)) {
			throw new MdxValidationError(
				"MDX_URL_FORBIDDEN",
				"Link URL uses an unsafe or unsupported protocol",
				node.position,
			);
		}
	}

	if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
		const name = "name" in node && typeof node.name === "string" ? node.name : "";
		if (!registeredComponentNames.has(name)) {
			throw new MdxValidationError(
				"MDX_COMPONENT_UNKNOWN",
				`The component ${name || "fragment"} is not registered`,
				node.position,
			);
		}

		for (const attribute of nodeAttributes(node)) {
			const attributeName = typeof attribute.name === "string" ? attribute.name : "";
			if (attribute.type === "mdxJsxExpressionAttribute" || typeof attribute.value === "object") {
				throw new MdxValidationError(
					"MDX_EXPRESSION_FORBIDDEN",
					"JavaScript expressions are not allowed in component attributes",
					node.position,
				);
			}

			if (/^on/i.test(attributeName)) {
				throw new MdxValidationError(
					"MDX_EVENT_HANDLER_FORBIDDEN",
					"Event handler attributes are not allowed",
					node.position,
				);
			}
		}
	}

	if (hasChildren(node)) {
		for (const child of node.children) {
			rejectForbiddenSyntax(child);
		}
	}
}

type TextMarks = {
	bold?: true;
	code?: true;
	italic?: true;
};

function nodeValue(node: Node): string {
	if ("value" in node && typeof node.value === "string") {
		return node.value;
	}

	if (hasChildren(node)) {
		return node.children.map(nodeValue).join("");
	}

	return "";
}

function textNode(value: string, marks: TextMarks = {}): RenderNode {
	return {
		...marks,
		type: "text",
		value,
	};
}

function mapInline(node: Node, marks: TextMarks = {}): RenderNode[] {
	switch (node.type) {
		case "text":
			return [textNode(nodeValue(node), marks)];
		case "strong":
			return hasChildren(node)
				? node.children.flatMap((child) => mapInline(child, { ...marks, bold: true }))
				: [];
		case "emphasis":
			return hasChildren(node)
				? node.children.flatMap((child) => mapInline(child, { ...marks, italic: true }))
				: [];
		case "inlineCode":
			return [textNode(nodeValue(node), { ...marks, code: true })];
		case "link": {
			const href = "url" in node && typeof node.url === "string" ? node.url : "";
			return [
				{
					children: hasChildren(node)
						? node.children.flatMap((child) => mapInline(child, marks))
						: [],
					href,
					type: "link",
				},
			];
		}
		default:
			return hasChildren(node) ? node.children.flatMap((child) => mapInline(child, marks)) : [];
	}
}

function headingId(node: Node): string {
	const normalized = nodeValue(node)
		.normalize("NFKC")
		.toLowerCase()
		.replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
		.trim()
		.replace(/[\s-]+/g, "-");

	return normalized || "section";
}

function componentProps(node: Node): Record<string, string | number | boolean | null> {
	const props: Record<string, string | number | boolean | null> = {};
	for (const attribute of nodeAttributes(node)) {
		if (attribute.type !== "mdxJsxAttribute" || typeof attribute.name !== "string") {
			continue;
		}

		props[attribute.name] = attribute.value === null ? true : String(attribute.value);
	}
	return props;
}

function mapBlock(node: Node): RenderNode[] {
	switch (node.type) {
		case "heading": {
			const depth = "depth" in node && typeof node.depth === "number" ? node.depth : 1;
			return [
				{
					children: hasChildren(node) ? node.children.flatMap((child) => mapInline(child)) : [],
					depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
					id: headingId(node),
					type: "heading",
				},
			];
		}
		case "paragraph":
			return [
				{
					children: hasChildren(node) ? node.children.flatMap((child) => mapInline(child)) : [],
					type: "paragraph",
				},
			];
		case "mdxJsxFlowElement":
		case "mdxJsxTextElement": {
			const name = "name" in node && typeof node.name === "string" ? node.name : "";
			return [
				{
					children: hasChildren(node) ? node.children.flatMap((child) => mapBlock(child)) : [],
					name,
					props: componentProps(node),
					type: "component",
				},
			];
		}
		default:
			return [];
	}
}

function renderNodeText(node: RenderNode): string {
	if (node.type === "text" || node.type === "code") {
		return node.value;
	}

	if ("children" in node) {
		return node.children.map(renderNodeText).join("");
	}

	return node.type === "image" ? node.alt : "";
}

export async function compileMdx(source: string): Promise<CompiledMdx> {
	const root = unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(source);
	rejectForbiddenSyntax(root);
	const renderTree = root.children.flatMap((child) => mapBlock(child));

	return {
		plainText: renderTree.map(renderNodeText).filter(Boolean).join("\n"),
		renderTree,
	};
}
