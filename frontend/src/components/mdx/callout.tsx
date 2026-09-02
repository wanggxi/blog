import {
	RiAlertLine,
	RiCheckboxCircleLine,
	RiErrorWarningLine,
	RiInformationLine,
	RiLightbulbFlashLine,
} from "@remixicon/react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "info" | "tip" | "warning" | "danger" | "success";

const VARIANTS: Record<
	Variant,
	{ label: string; icon: ComponentType<{ className?: string }>; accent: string }
> = {
	info: {
		label: "提示",
		icon: RiInformationLine,
		accent: "text-foreground",
	},
	tip: {
		label: "小技巧",
		icon: RiLightbulbFlashLine,
		accent: "text-emerald-600 dark:text-emerald-400",
	},
	warning: {
		label: "注意",
		icon: RiAlertLine,
		accent: "text-amber-600 dark:text-amber-400",
	},
	danger: {
		label: "警告",
		icon: RiErrorWarningLine,
		accent: "text-destructive",
	},
	success: {
		label: "推荐做法",
		icon: RiCheckboxCircleLine,
		accent: "text-emerald-600 dark:text-emerald-400",
	},
};

type CalloutProps = {
	type?: Variant;
	title?: string;
	children: ReactNode;
};

export function Callout({ type = "info", title, children }: CalloutProps) {
	const { label, icon: Icon, accent } = VARIANTS[type];

	return (
		<div className="not-prose my-6 flex gap-3 border border-border border-l-2 border-l-foreground bg-card p-4">
			<Icon className={cn("mt-0.5 size-4 shrink-0", accent)} />
			<div className="min-w-0 flex-1">
				<div className="font-data text-muted-foreground text-xs uppercase tracking-[0.12em]">
					{title ?? label}
				</div>
				<div className="mt-2 text-foreground/90 text-sm leading-7 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-data [&_code]:text-[0.85em]">
					{children}
				</div>
			</div>
		</div>
	);
}
