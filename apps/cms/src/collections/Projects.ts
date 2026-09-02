import type { CollectionConfig } from "payload";
import { isAuthenticated } from "../access/access";

const publicProjects = ({ req }: Parameters<typeof isAuthenticated>[0]) =>
	req.user ? true : { published: { equals: true } };

export const Projects: CollectionConfig = {
	slug: "projects",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: publicProjects,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["name", "status", "featured", "sortOrder"],
		group: "内容",
		useAsTitle: "name",
	},
	fields: [
		{ name: "name", type: "text", label: "名称", maxLength: 120, required: true },
		{ name: "slug", type: "text", index: true, label: "网址标识", required: true, unique: true },
		{ name: "tagline", type: "text", label: "一句话介绍", maxLength: 200, required: true },
		{ name: "description", type: "textarea", label: "详细介绍", maxLength: 2000, required: true },
		{
			name: "status",
			type: "select",
			defaultValue: "building",
			options: ["planned", "building", "beta", "live", "archived"],
			required: true,
		},
		{ name: "year", type: "text", label: "年份", required: true },
		{ name: "platform", type: "text", label: "平台", required: true },
		{ name: "tags", type: "relationship", hasMany: true, relationTo: "tags" },
		{ name: "repositoryUrl", type: "text", label: "代码仓库" },
		{ name: "liveUrl", type: "text", label: "访问地址" },
		{ name: "relatedArticle", type: "relationship", relationTo: "articles" },
		{ name: "iconKey", type: "text", label: "内置图标" },
		{ name: "iconMedia", type: "relationship", label: "图标图片", relationTo: "media" },
		{ name: "featured", type: "checkbox", defaultValue: false, label: "精选" },
		{ name: "sortOrder", type: "number", defaultValue: 0, label: "排序", min: 0, required: true },
		{ name: "published", type: "checkbox", defaultValue: false, label: "公开显示" },
	],
	trash: true,
};
