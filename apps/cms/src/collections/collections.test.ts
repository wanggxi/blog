import { describe, expect, it } from "vitest";
import { Articles } from "./Articles";
import { AuditEvents } from "./AuditEvents";
import { Media } from "./Media";
import { Projects } from "./Projects";
import { Tags } from "./Tags";
import { Users } from "./Users";

describe("CMS collections", () => {
	it("denies anonymous article changes while exposing published articles", async () => {
		expect(await Articles.access?.create?.({ req: { user: null } } as never)).toBe(false);
		expect(await Articles.access?.read?.({ req: { user: null } } as never)).toEqual({
			publicationStatus: { equals: "published" },
		});
	});

	it("keeps audit events append-only from the admin API", async () => {
		expect(await AuditEvents.access?.create?.({ req: { user: { id: 1 } } } as never)).toBe(false);
		expect(await AuditEvents.access?.update?.({ req: { user: { id: 1 } } } as never)).toBe(false);
		expect(await AuditEvents.access?.delete?.({ req: { user: { id: 1 } } } as never)).toBe(false);
	});

	it("uses stable collection slugs consumed by relations and APIs", () => {
		expect([
			Users.slug,
			Articles.slug,
			Projects.slug,
			Tags.slug,
			Media.slug,
			AuditEvents.slug,
		]).toEqual(["users", "articles", "projects", "tags", "media", "audit-events"]);
	});
});
