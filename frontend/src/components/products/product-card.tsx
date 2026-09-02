import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import { ProductActions } from "@/components/products/product-actions";
import { ProductIcon } from "@/components/products/product-icon";
import { ProductStatus } from "@/components/products/product-status";
import { ProductTags } from "@/components/products/product-tags";
import type { Product } from "@/lib/products";

export function FeaturedProductCard({ product }: { product: Product }) {
	return (
		<Link
			href={`/products#${product.slug}`}
			className="group grid min-h-48 border border-border bg-card p-4 transition-[border-color,background-color] hover:border-foreground/35 hover:bg-muted/50"
		>
			<header className="flex items-start justify-between gap-3">
				<div>
					<ProductIcon
						product={product}
						className="mb-4 size-9"
						iconClassName="size-4"
					/>
					<h3 className="font-medium font-ui leading-tight transition-colors group-hover:text-foreground">
						{product.name}
					</h3>
				</div>
				<ProductStatus product={product} />
			</header>
			<p className="mt-5 max-w-[18rem] text-muted-foreground text-sm leading-6">
				{product.tagline}
			</p>
			<RiArrowRightUpLine className="group-hover:-translate-y-0.5 mt-auto size-4 self-end justify-self-end text-muted-foreground opacity-45 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100" />
		</Link>
	);
}

export function ProductArchiveCard({
	product,
	index,
}: {
	product: Product;
	index: number;
}) {
	return (
		<article
			id={product.slug}
			className="blog-card-enter scroll-mt-24 border border-border bg-card transition-colors hover:border-foreground/35"
			style={{ animationDelay: `${120 + index * 60}ms` }}
		>
			<div className="grid gap-3 p-3 sm:p-4">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 gap-3">
						<ProductIcon
							product={product}
							className="size-9"
							iconClassName="size-4.5"
						/>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-3">
								<span className="font-data text-muted-foreground text-xs uppercase tracking-[0.12em]">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h2 className="font-semibold font-ui text-lg leading-tight">
									{product.name}
								</h2>
								<ProductStatus product={product} showDot />
							</div>
							<p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-6">
								{product.description}
							</p>
						</div>
					</div>

					<ProductActions product={product} />
				</header>

				<ProductTags product={product} />
			</div>
		</article>
	);
}
