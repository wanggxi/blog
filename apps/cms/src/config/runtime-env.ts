export type RuntimeEnv = {
	databaseUrl: string;
	media?: {
		accessKeyId: string;
		bucket: string;
		endpoint: string;
		publicUrl: string;
		region: string;
		secretAccessKey: string;
	};
	payloadSecret: string;
};

type EnvSource = Readonly<Record<string, string | undefined>>;

function required(source: EnvSource, name: string): string {
	const value = source[name]?.trim();
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export function readRuntimeEnv(source: EnvSource): RuntimeEnv {
	const storageEnabled = [
		"S3_ENDPOINT",
		"S3_BUCKET",
		"S3_ACCESS_KEY_ID",
		"S3_SECRET_ACCESS_KEY",
		"MEDIA_PUBLIC_URL",
	].some((name) => Boolean(source[name]?.trim()));
	const media = storageEnabled
		? {
				accessKeyId: required(source, "S3_ACCESS_KEY_ID"),
				bucket: required(source, "S3_BUCKET"),
				endpoint: required(source, "S3_ENDPOINT"),
				publicUrl: required(source, "MEDIA_PUBLIC_URL"),
				region: source.S3_REGION?.trim() || "auto",
				secretAccessKey: required(source, "S3_SECRET_ACCESS_KEY"),
			}
		: undefined;

	return {
		databaseUrl: required(source, "DATABASE_URL"),
		...(media ? { media } : {}),
		payloadSecret: required(source, "PAYLOAD_SECRET"),
	};
}
