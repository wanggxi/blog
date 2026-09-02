"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	isValidElement,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

type CodeBlockProps = ComponentPropsWithoutRef<"pre">;

const LANGUAGE_LABELS: Record<string, string> = {
	js: "JavaScript",
	jsx: "JSX",
	ts: "TypeScript",
	tsx: "TSX",
	css: "CSS",
	html: "HTML",
	json: "JSON",
	md: "Markdown",
	mdx: "MDX",
	sh: "Shell",
	bash: "Shell",
	zsh: "Shell",
	shellscript: "Shell",
	vue: "Vue",
};

function getLanguage(children: CodeBlockProps["children"]) {
	if (!isValidElement<{ className?: string }>(children)) {
		return "Text";
	}

	const className = children.props.className ?? "";
	const language = className
		.split(/\s+/)
		.find((item) => item.startsWith("language-"))
		?.replace("language-", "");

	if (!language) {
		return "Text";
	}

	return LANGUAGE_LABELS[language] ?? language.toUpperCase();
}

export function CodeBlock({
	children,
	className,
	style,
	...props
}: CodeBlockProps) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);
	const language = getLanguage(children);
	const code = isValidElement<ComponentPropsWithoutRef<"code">>(children)
		? cloneElement(children, {
				className: "font-code",
				style: {
					...children.props.style,
					fontFamily: "var(--font-code)",
					fontVariantLigatures: "none",
				},
			})
		: children;

	const handleCopy = async () => {
		const code = preRef.current?.innerText ?? "";

		if (!code) {
			return;
		}

		await navigator.clipboard.writeText(code);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<div className="not-prose my-6 overflow-hidden rounded-none border border-border bg-background">
			<div className="flex h-10 items-center justify-between border-border border-b bg-muted/55 px-3">
				<span className="font-data text-[0.68rem] text-muted-foreground uppercase tracking-[0.18em]">
					{language}
				</span>
				<button
					aria-label={copied ? "Copied code" : "Copy code"}
					className="inline-grid size-7 cursor-pointer place-items-center rounded-none border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2"
					onClick={handleCopy}
					type="button"
				>
					{copied ? (
						<RiCheckLine aria-hidden="true" className="size-3.5" />
					) : (
						<RiFileCopyLine aria-hidden="true" className="size-3.5" />
					)}
				</button>
			</div>
			<pre
				className={cn(
					"m-0 overflow-x-auto rounded-none border-0 px-4 py-3 text-sm leading-relaxed",
					className,
				)}
				ref={preRef}
				style={{
					...style,
					fontFamily: "var(--font-code)",
					fontVariantLigatures: "none",
				}}
				{...props}
			>
				{code}
			</pre>
		</div>
	);
}
