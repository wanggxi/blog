import type { Access } from "payload";

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const publishedOrAuthenticated: Access = ({ req }) =>
	req.user ? true : { publicationStatus: { equals: "published" } };
