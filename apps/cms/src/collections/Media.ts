import type { CollectionConfig } from "payload";
import { isAuthenticated } from "../access/access";

export const Media: CollectionConfig = {
	slug: "media",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: () => true,
		update: isAuthenticated,
	},
	admin: { defaultColumns: ["filename", "alt", "mimeType", "updatedAt"], group: "媒体" },
	fields: [
		{ name: "alt", type: "text", label: "替代文字", required: true },
		{ name: "caption", type: "textarea", label: "说明" },
		{ name: "contentHash", type: "text", admin: { readOnly: true }, index: true },
	],
	trash: true,
	upload: {
		imageSizes: [
			{ name: "thumbnail", width: 480, withoutEnlargement: true },
			{ name: "card", width: 960, withoutEnlargement: true },
			{ name: "wide", width: 1600, withoutEnlargement: true },
		],
		mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
	},
};
