import type { GlobalConfig } from "payload";
import { isAuthenticated } from "../access/access";

export const SiteSettings: GlobalConfig = {
	slug: "site-settings",
	label: "站点设置",
	access: { read: () => true, update: isAuthenticated },
	admin: { group: "网站", hidden: false },
	fields: [
		{ name: "siteName", type: "text", defaultValue: "我的博客", label: "站点名称", required: true },
		{ name: "tagline", type: "text", label: "站点简介", maxLength: 200 },
		{ name: "avatar", type: "relationship", label: "头像", relationTo: "media" },
		{ name: "about", type: "textarea", label: "关于我" },
		{
			name: "socialLinks",
			type: "array",
			label: "社交链接",
			fields: [
				{ name: "label", type: "text", required: true },
				{ name: "url", type: "text", required: true },
			],
		},
		{
			name: "seo",
			type: "group",
			label: "默认 SEO",
			fields: [
				{ name: "title", type: "text", maxLength: 160 },
				{ name: "description", type: "textarea", maxLength: 320 },
				{ name: "image", type: "relationship", relationTo: "media" },
			],
		},
	],
};
