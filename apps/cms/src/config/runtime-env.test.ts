import { describe, expect, it } from "vitest";
import { readRuntimeEnv } from "./runtime-env";

describe("readRuntimeEnv", () => {
	it("rejects missing database and authentication secrets", () => {
		expect(() => readRuntimeEnv({})).toThrow("DATABASE_URL is required");
		expect(() => readRuntimeEnv({ DATABASE_URL: "postgresql://localhost/blog" })).toThrow(
			"PAYLOAD_SECRET is required",
		);
	});

	it("returns complete server-only settings", () => {
		expect(
			readRuntimeEnv({
				DATABASE_URL: "postgresql://localhost/blog",
				PAYLOAD_SECRET: "a-secure-random-value",
			}),
		).toEqual({
			databaseUrl: "postgresql://localhost/blog",
			payloadSecret: "a-secure-random-value",
		});
	});

	it("requires a complete S3 configuration when object storage is enabled", () => {
		expect(() =>
			readRuntimeEnv({
				DATABASE_URL: "postgresql://localhost/blog",
				PAYLOAD_SECRET: "a-secure-random-value",
				S3_ENDPOINT: "https://example.r2.cloudflarestorage.com",
			}),
		).toThrow("is required");
	});

	it("loads an R2-compatible media configuration", () => {
		const result = readRuntimeEnv({
			DATABASE_URL: "postgresql://localhost/blog",
			MEDIA_PUBLIC_URL: "https://media.example.com",
			PAYLOAD_SECRET: "a-secure-random-value",
			S3_ACCESS_KEY_ID: "access",
			S3_BUCKET: "media",
			S3_ENDPOINT: "https://account.r2.cloudflarestorage.com",
			S3_REGION: "auto",
			S3_SECRET_ACCESS_KEY: "secret",
		});

		expect(result.media).toEqual({
			accessKeyId: "access",
			bucket: "media",
			endpoint: "https://account.r2.cloudflarestorage.com",
			publicUrl: "https://media.example.com",
			region: "auto",
			secretAccessKey: "secret",
		});
	});
});
