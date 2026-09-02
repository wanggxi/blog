import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { zh } from "payload/i18n/zh";
import sharp from "sharp";
import { Articles } from "./collections/Articles";
import { AuditEvents } from "./collections/AuditEvents";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { readRuntimeEnv } from "./config/runtime-env";
import { contentEndpoints } from "./endpoints/content";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const env = readRuntimeEnv(process.env);
const allowedOrigins = [process.env.PUBLIC_SITE_URL, process.env.PUBLIC_CMS_URL].filter(
	(value): value is string => Boolean(value),
);
const mediaBaseUrl = env.media?.publicUrl.replace(/\/$/, "");

export default buildConfig({
	admin: {
		importMap: { baseDir: path.resolve(dirname) },
		meta: { titleSuffix: "— 博客管理后台" },
		user: Users.slug,
	},
	collections: [Users, Articles, Projects, Tags, Media, AuditEvents],
	cors: allowedOrigins,
	// The CMS is currently accessed directly over HTTP by IP (port 3000).
	// Payload rejects cookie-authenticated requests that omit Origin and
	// Sec-Fetch-Site when CSRF origins are configured, which makes the admin
	// client loop back to /admin/login in browsers that do not send those
	// headers. CORS remains restricted above; HTTPS + a hostname should restore
	// an explicit CSRF allowlist.
	csrf: [],
	db: postgresAdapter({ idType: "uuid", pool: { connectionString: env.databaseUrl } }),
	editor: lexicalEditor(),
	endpoints: contentEndpoints,
	globals: [SiteSettings],
	i18n: {
		fallbackLanguage: "zh",
		supportedLanguages: { zh },
	},
	plugins: env.media
		? [
				s3Storage({
					alwaysInsertFields: true,
					bucket: env.media.bucket,
					collections: {
						media: {
							generateFileURL: ({ filename, prefix }) =>
								`${mediaBaseUrl}/${prefix ? `${prefix}/` : ""}${filename}`,
							prefix: "media",
						},
					},
					config: {
						credentials: {
							accessKeyId: env.media.accessKeyId,
							secretAccessKey: env.media.secretAccessKey,
						},
						endpoint: env.media.endpoint,
						forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
						region: env.media.region,
					},
				}),
			]
		: [],
	secret: env.payloadSecret,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
