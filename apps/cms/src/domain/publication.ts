export type PublicationState = {
	publishedAt?: string | null;
	scheduledAt?: string | null;
	status: "draft" | "scheduled" | "published" | "archived";
};

export type PublicationError = {
	message: string;
	path: "publishedAt" | "scheduledAt";
};

export function validatePublication(state: PublicationState): PublicationError | null {
	if (state.status === "published" && !state.publishedAt) {
		return {
			message: "Published articles require a publication date",
			path: "publishedAt",
		};
	}

	if (state.status === "scheduled" && !state.scheduledAt) {
		return {
			message: "Scheduled articles require a scheduled date",
			path: "scheduledAt",
		};
	}

	return null;
}
