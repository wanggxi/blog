import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import { FeaturedProductCard } from "@/components/products/product-card";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductSection() {
	const products = getFeaturedProducts(3);

	return (
		<section className="py-10">
			<div className="mb-4 flex items-end justify-between gap-4">
				<div>
					<p className="font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
						产品
					</p>
					<h2 className="mt-2 font-semibold font-ui text-2xl">
						正在构建的东西
					</h2>
				</div>
				<Link
					href="/products"
					className={cn(
						buttonVariants({ variant: "link", size: "sm" }),
						"gap-1 text-muted-foreground",
					)}
				>
					全部
					<RiArrowRightUpLine className="size-3" />
				</Link>
			</div>
			<div className="grid gap-3 sm:grid-cols-3">
				{products.map((product) => (
					<FeaturedProductCard key={product.slug} product={product} />
				))}
			</div>
		</section>
	);
}
