import type { Position } from "unist";

export class MdxValidationError extends Error {
	readonly code: string;
	readonly column: number;
	readonly line: number;

	constructor(code: string, message: string, position?: Position | undefined) {
		super(message);
		this.name = "MdxValidationError";
		this.code = code;
		this.line = position?.start.line ?? 1;
		this.column = position?.start.column ?? 1;
	}
}
