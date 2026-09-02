import { z } from "zod";

export type RenderNode =
	| {
			type: "text";
			value: string;
			bold?: boolean | undefined;
			italic?: boolean | undefined;
			code?: boolean | undefined;
	  }
	| { type: "paragraph"; children: RenderNode[] }
	| { type: "heading"; depth: 1 | 2 | 3 | 4 | 5 | 6; id: string; children: RenderNode[] }
	| { type: "blockquote"; children: RenderNode[] }
	| { type: "code"; language?: string | undefined; value: string }
	| {
			type: "image";
			src: string;
			alt: string;
			width?: number | undefined;
			height?: number | undefined;
	  }
	| { type: "link"; href: string; children: RenderNode[] }
	| { type: "list"; ordered: boolean; children: RenderNode[] }
	| { type: "listItem"; checked?: boolean | undefined; children: RenderNode[] }
	| { type: "thematicBreak" }
	| {
			type: "component";
			name: string;
			props: Record<string, string | number | boolean | null>;
			children: RenderNode[];
	  };

const scalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const renderNodeSchema: z.ZodType<RenderNode> = z.lazy(() =>
	z.discriminatedUnion("type", [
		z.object({
			bold: z.boolean().optional(),
			code: z.boolean().optional(),
			italic: z.boolean().optional(),
			type: z.literal("text"),
			value: z.string(),
		}),
		z.object({ type: z.literal("paragraph"), children: z.array(renderNodeSchema) }),
		z.object({
			children: z.array(renderNodeSchema),
			depth: z.union([
				z.literal(1),
				z.literal(2),
				z.literal(3),
				z.literal(4),
				z.literal(5),
				z.literal(6),
			]),
			id: z.string().min(1),
			type: z.literal("heading"),
		}),
		z.object({ type: z.literal("blockquote"), children: z.array(renderNodeSchema) }),
		z.object({
			language: z.string().min(1).optional(),
			type: z.literal("code"),
			value: z.string(),
		}),
		z.object({
			alt: z.string(),
			height: z.int().positive().optional(),
			src: z.url(),
			type: z.literal("image"),
			width: z.int().positive().optional(),
		}),
		z.object({
			children: z.array(renderNodeSchema),
			href: z.url(),
			type: z.literal("link"),
		}),
		z.object({
			children: z.array(renderNodeSchema),
			ordered: z.boolean(),
			type: z.literal("list"),
		}),
		z.object({
			checked: z.boolean().optional(),
			children: z.array(renderNodeSchema),
			type: z.literal("listItem"),
		}),
		z.object({ type: z.literal("thematicBreak") }),
		z.object({
			children: z.array(renderNodeSchema),
			name: z.string().regex(/^[A-Z][A-Za-z0-9]*$/),
			props: z.record(z.string(), scalarSchema),
			type: z.literal("component"),
		}),
	]),
);

export const renderTreeSchema = z.array(renderNodeSchema);
