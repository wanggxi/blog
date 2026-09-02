import Image from "next/image";
import type { HTMLAttributes } from "react";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";
export function UserAvatar({ className }: HTMLAttributes<HTMLDivElement>) {
	return (
		<ViewTransition name="site-avatar" share="site-avatar-morph">
			<div
				className={cn(
					"size-24 overflow-hidden rounded-full border border-border bg-muted p-1",
					className,
				)}
			>
				<Image
					src="/imgs/avatar.webp"
					width="640"
					height={640}
					alt="Wankong 的头像"
					priority
					className="size-full rounded-full object-cover"
				/>
			</div>
		</ViewTransition>
	);
}
