import type { CollectionConfig } from "payload";
import { isAuthenticated } from "../access/access";

export const Users: CollectionConfig = {
	slug: "users",
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isAuthenticated,
		update: isAuthenticated,
	},
	admin: {
		defaultColumns: ["email", "name", "updatedAt"],
		group: "系统",
		useAsTitle: "email",
	},
	auth: {
		maxLoginAttempts: 5,
		lockTime: 10 * 60 * 1000,
		tokenExpiration: 8 * 60 * 60,
	},
	fields: [
		{ name: "name", type: "text", label: "姓名", required: true },
		{
			name: "role",
			type: "select",
			defaultValue: "owner",
			options: [{ label: "站长", value: "owner" }],
			required: true,
		},
	],
};
