import type { ReactNode } from "react";

type KbdProps = {
	children: ReactNode;
};

export function Kbd({ children }: KbdProps) {
	const keys = typeof children === "string" ? children.split("+") : [children];

	return (
		<span className="not-prose inline-flex items-center gap-1 align-middle">
			{keys.map((key, index) => (
				<kbd
					// biome-ignore lint/suspicious/noArrayIndexKey: static key labels, order is stable
					key={index}
					className="inline-flex min-w-6 items-center justify-center border border-border border-b-2 bg-muted px-1.5 py-0.5 font-data text-[11px] text-foreground leading-none"
				>
					{typeof key === "string" ? key.trim() : key}
				</kbd>
			))}
		</span>
	);
}
