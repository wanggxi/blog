import { compileMdx, MdxValidationError } from "@blog/mdx-pipeline";
import { type PublicationState, validatePublication } from "./publication";

export type ArticleInput = PublicationState & {
	sourceMdx?: string | null;
};

export type CompileError = {
	code: string;
	column: number;
	line: number;
	message: string;
};

export async function prepareArticleForSave(input: ArticleInput) {
	const publicationError = validatePublication(input);
	if (publicationError) {
		throw new Error(publicationError.message);
	}

	try {
		const compiled = await compileMdx(input.sourceMdx ?? "");
		return {
			...compiled,
			compileError: null,
			formatVersion: 1,
		};
	} catch (error) {
		if (!(error instanceof MdxValidationError) || input.status !== "draft") {
			throw error;
		}

		return {
			compileError: {
				code: error.code,
				column: error.column,
				line: error.line,
				message: error.message,
			} satisfies CompileError,
			formatVersion: 1,
			plainText: "",
			renderTree: [],
		};
	}
}
