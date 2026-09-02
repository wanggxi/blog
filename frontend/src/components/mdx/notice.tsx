import {
	RiCheckboxCircleLine,
	RiErrorWarningLine,
	RiInformationLine,
} from "@remixicon/react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type NoticeType = "success" | "warning" | "info";

const CONFIG: Record<
	NoticeType,
	{
		icon: ComponentType<{ className?: string }>;
		accent: string;
		border: string;
	}
> = {
	success: {
		icon: RiCheckboxCircleLine,
		accent: "text-emerald-600 dark:text-emerald-400",
		border: "border-l-emerald-600 dark:border-l-emerald-400",
	},
	warning: {
		icon: RiErrorWarningLine,
		accent: "text-amber-600 dark:text-amber-400",
		border: "border-l-amber-600 dark:border-l-amber-400",
	},
	info: {
		icon: RiInformationLine,
		accent: "text-foreground",
		border: "border-l-foreground",
	},
};

type NoticeProps = {
	type?: NoticeType;
	title?: string;
	children: ReactNode;
};

export function Notice({ type = "info", title, children }: NoticeProps) {
	const { icon: Icon, accent, border } = CONFIG[type];

	return (
		<div
			className={cn(
				"not-prose my-6 border border-border border-l-2 bg-card p-4",
				border,
			)}
		>
			<div className="flex items-center gap-2.5">
				<Icon className={cn("size-4 shrink-0", accent)} />
				{title && (
					<span className="font-semibold font-ui text-foreground/90 text-sm">
						{title}
					</span>
				)}
			</div>
			<div className="mt-3 text-foreground/85 text-sm leading-7 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-data [&_code]:text-[0.85em] [&_strong]:font-semibold [&_strong]:font-ui [&_strong]:text-foreground">
				{children}
			</div>
		</div>
	);
}
