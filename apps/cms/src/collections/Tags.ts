import type { CollectionConfig } from "payload";
import { isAuthenticated } from "../access/access";

export const Tags: CollectionConfig = {
	slug: "tags",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: () => true,
		update: isAuthenticated,
	},
	admin: { defaultColumns: ["name", "slug", "updatedAt"], group: "内容", useAsTitle: "name" },
	fields: [
		{ name: "name", type: "text", label: "名称", maxLength: 40, required: true },
		{ name: "slug", type: "text", index: true, label: "网址标识", required: true, unique: true },
		{ name: "description", type: "textarea", label: "说明", maxLength: 240 },
	],
};
