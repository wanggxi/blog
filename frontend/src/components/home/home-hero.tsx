import { RiArrowRightUpLine, RiBox3Line } from "@remixicon/react";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { SplittingText } from "@/components/animate-ui/primitives/texts/splitting";
import { buttonVariants } from "@/components/ui/button";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar/UserAvatar";

const HERO_DESCRIPTION = "只有你也想见我的时候，我们的相遇才有意义。";

function HeroUserAvatar({ className }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn(className)}>
			<UserAvatar></UserAvatar>

			<div className="my-5">
				<div className="relative font-mono">
					<SplittingText
						text={HERO_DESCRIPTION}
						aria-hidden="true"
						className="block max-w-2xl font-semibold text-neutral-200 text-xl leading-tight sm:text-2xl dark:text-neutral-800"
						disableAnimation
					/>
					<SplittingText
						text={HERO_DESCRIPTION}
						className="absolute inset-0 max-w-2xl font-semibold text-xl leading-tight sm:text-2xl"
						type="chars"
						inView
						initial={{ y: 0, opacity: 0, x: 0, filter: "blur(10px)" }}
						animate={{ y: 0, opacity: 1, x: 0, filter: "blur(0px)" }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					/>
				</div>
			</div>
		</div>
	);
}

export function HomeHero() {
	return (
		<section className="pt-10 pb-14 sm:pt-16">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<div>
					你好，这里是 <span className="font-bold text-primary">晚空</span> /{" "}
					<EncryptedText
						text="Wankong"
						className="font-bold text-primary"
					></EncryptedText>{" "}
				</div>
			</div>
			<HeroUserAvatar className="mt-8" />
			<div className="mt-6 flex flex-wrap gap-3">
				<Link
					href="/blog"
					className={cn(buttonVariants({ size: "lg" }), "gap-2")}
				>
					阅读博客
					<RiArrowRightUpLine className="size-4" />
				</Link>
				<Link
					href="/products"
					className={cn(
						buttonVariants({ variant: "outline", size: "lg" }),
						"gap-2",
					)}
				>
					查看产品
					<RiBox3Line className="size-4" />
				</Link>
			</div>
		</section>
	);
}
