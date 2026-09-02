import { RiHomeLine, RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { NavHeader } from "@/components/nav-header/nav-header";
import { buttonVariants } from "@/components/ui/button";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { cn } from "@/lib/utils";

export default function NotFound() {
	return (
		<>
			<NoiseTexture noiseOpacity={0.3}></NoiseTexture>
			<NavHeader />
			<main className="relative overflow-hidden px-4 py-10 text-foreground sm:px-6">
				<div className="mx-auto flex w-full max-w-5xl items-center">
					<section className="w-full border-border border-y py-12 sm:py-16">
						<div className="flex items-center gap-3 font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
							<span className="inline-flex size-8 items-center justify-center">
								<RiSearchLine className="size-3.5" aria-hidden="true" />
							</span>
							<span> PAGE NOT FOUND / 404</span>
						</div>
						<p className="mt-6 text-muted-foreground text-sm leading-7 sm:text-base">
							这个地址可能已经移动、被删除，或还没有被发布。
						</p>
						<div className="mt-8 flex justify-end gap-3 align-bottom">
							<Link
								href="/"
								className={cn(buttonVariants({ size: "lg" }), "gap-2")}
							>
								<RiHomeLine className="size-4" aria-hidden="true" />
								返回首页
							</Link>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
