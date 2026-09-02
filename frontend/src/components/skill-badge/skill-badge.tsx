import Image from "next/image";
import { cn } from "@/lib/utils";

export type SkillBadgeItem = {
	icon: React.ReactNode | string;
	name: string;
	url?: string;
};

export function SkillBadge({
	skill,
	size = "default",
}: {
	skill: SkillBadgeItem;
	size?: "default" | "sm";
}) {
	const icon = skill.icon;
	const isImageIcon = typeof icon === "string";
	const iconSize = size === "sm" ? 14 : 16;

	return (
		<div
			className={cn(
				"inline-flex items-center border border-border bg-background font-data transition-colors hover:border-foreground hover:bg-muted dark:hover:bg-muted/70",
				size === "sm"
					? "h-7 gap-1.5 px-2 text-[11px]"
					: "h-9 gap-2 px-3 text-xs",
			)}
		>
			<span
				className={cn(
					"flex shrink-0 items-center justify-center",
					size === "sm" ? "size-3.5 [&_svg]:size-3.5" : "size-4 [&_svg]:size-4",
				)}
			>
				{isImageIcon ? (
					<Image
						src={icon}
						width={iconSize}
						alt={skill.name}
						height={iconSize}
						className={size === "sm" ? "size-3.5" : "size-4"}
					/>
				) : (
					icon
				)}
			</span>
			<span className="font-mono">{skill.name}</span>
		</div>
	);
}
