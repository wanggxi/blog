import type { CollectionConfig } from "payload";
import { isAuthenticated } from "../access/access";

const deny = () => false;

export const AuditEvents: CollectionConfig = {
	slug: "audit-events",
	access: { create: deny, delete: deny, read: isAuthenticated, update: deny },
	admin: {
		defaultColumns: ["action", "actorEmail", "createdAt"],
		group: "系统",
		useAsTitle: "action",
	},
	fields: [
		{ name: "action", type: "text", index: true, label: "操作", required: true },
		{ name: "actor", type: "relationship", label: "操作者", relationTo: "users" },
		{ name: "actorEmail", type: "email", label: "操作者邮箱" },
		{ name: "targetCollection", type: "text", label: "对象类型" },
		{ name: "targetId", type: "text", label: "对象 ID" },
		{ name: "metadata", type: "json", label: "附加信息" },
	],
};
