import type { ReactNode } from "react";
import { Children, isValidElement } from "react";

type StepsProps = {
	children: ReactNode;
};

export function Steps({ children }: StepsProps) {
	const items = Children.toArray(children).filter(isValidElement);

	return (
		<div className="not-prose my-8 flex flex-col">
			{items.map((child, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static MDX children, order is stable
					key={index}
					className="relative flex gap-4 pb-8 last:pb-0"
				>
					{index < items.length - 1 ? (
						<span className="absolute top-9 bottom-0 left-[15px] w-px bg-border" />
					) : null}
					<span className="z-10 flex size-8 shrink-0 items-center justify-center border border-foreground bg-background font-data text-sm">
						{index + 1}
					</span>
					<div className="min-w-0 flex-1 pt-0.5">{child}</div>
				</div>
			))}
		</div>
	);
}

type StepProps = {
	title: string;
	children: ReactNode;
};

export function Step({ title, children }: StepProps) {
	return (
		<div>
			<h4 className="font-medium font-ui text-base leading-tight">{title}</h4>
			<div className="mt-2 text-muted-foreground text-sm leading-7 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-data [&_code]:text-[0.85em] [&_strong]:text-foreground">
				{children}
			</div>
		</div>
	);
}
