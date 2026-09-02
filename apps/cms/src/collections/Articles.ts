import type { CollectionConfig } from "payload";
import { isAuthenticated, publishedOrAuthenticated } from "../access/access";
import { prepareArticleForSave } from "../domain/prepare-article";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const Articles: CollectionConfig = {
	slug: "articles",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: publishedOrAuthenticated,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["title", "publicationStatus", "publishedAt", "updatedAt"],
		group: "内容",
		useAsTitle: "title",
	},
	fields: [
		{ name: "title", type: "text", label: "标题", maxLength: 160, required: true },
		{
			name: "slug",
			type: "text",
			index: true,
			label: "网址标识",
			required: true,
			unique: true,
			validate: (value: string | null | undefined) =>
				typeof value === "string" && slugPattern.test(value)
					? true
					: "仅支持小写字母、数字和连字符",
		},
		{ name: "summary", type: "textarea", label: "摘要", maxLength: 320, required: true },
		{
			name: "coverMedia",
			type: "relationship",
			label: "封面",
			relationTo: "media",
		},
		{
			name: "sourceMdx",
			type: "code",
			admin: { language: "markdown" },
			label: "正文（MDX）",
			required: true,
		},
		{ name: "renderTree", type: "json", admin: { readOnly: true }, label: "安全渲染树" },
		{ name: "plainText", type: "textarea", admin: { hidden: true, readOnly: true } },
		{ name: "compileError", type: "json", admin: { readOnly: true }, label: "MDX 校验结果" },
		{
			name: "publicationStatus",
			type: "select",
			defaultValue: "draft",
			label: "发布状态",
			options: [
				{ label: "草稿", value: "draft" },
				{ label: "定时", value: "scheduled" },
				{ label: "已发布", value: "published" },
				{ label: "已归档", value: "archived" },
			],
			required: true,
		},
		{
			name: "publishedAt",
			type: "date",
			admin: { date: { pickerAppearance: "dayAndTime" } },
			label: "发布时间",
		},
		{
			name: "scheduledAt",
			type: "date",
			admin: { date: { pickerAppearance: "dayAndTime" } },
			label: "定时发布时间",
		},
		{ name: "tags", type: "relationship", hasMany: true, label: "标签", relationTo: "tags" },
		{
			name: "seo",
			type: "group",
			label: "SEO",
			fields: [
				{ name: "title", type: "text", maxLength: 160 },
				{ name: "description", type: "textarea", maxLength: 320 },
				{ name: "canonicalUrl", type: "text" },
			],
		},
		{
			name: "version",
			type: "number",
			admin: { readOnly: true },
			defaultValue: 1,
			min: 1,
			required: true,
		},
		{
			name: "formatVersion",
			type: "number",
			admin: { readOnly: true },
			defaultValue: 1,
			min: 1,
			required: true,
		},
	],
	hooks: {
		beforeValidate: [
			async ({ data }) => {
				if (!data || typeof data.publicationStatus !== "string") return data;
				const prepared = await prepareArticleForSave({
					publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : null,
					scheduledAt: typeof data.scheduledAt === "string" ? data.scheduledAt : null,
					sourceMdx: typeof data.sourceMdx === "string" ? data.sourceMdx : "",
					status: data.publicationStatus as "draft" | "scheduled" | "published" | "archived",
				});
				return { ...data, ...prepared };
			},
		],
	},
	trash: true,
	versions: {
		drafts: { autosave: { interval: 1500 }, schedulePublish: true },
		maxPerDoc: 50,
	},
};
