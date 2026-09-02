import { ProductArchiveCard } from "@/components/products/product-card";
import { products } from "@/lib/products";

export function ProductShowcase() {
	return (
		<>
			<ProductShowcaseHeader />
			<section className="grid gap-3 pt-10" aria-label="Products">
				{products.map((product, index) => (
					<ProductArchiveCard
						key={product.slug}
						product={product}
						index={index}
					/>
				))}
			</section>
		</>
	);
}

function ProductShowcaseHeader() {
	return (
		<section className="flex justify-between gap-8 border-border border-b pt-10 pb-10 sm:pt-16">
			<div className="flex min-w-0 flex-col justify-between gap-6">
				<header>
					<p className="blog-enter font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
						Product Archive
					</p>
					<h1
						className="blog-enter mt-3 font-semibold font-ui text-lg leading-tight sm:text-2xl"
						style={{ animationDelay: "50ms" }}
					>
						<span className="product-title-reveal">
							正在做的东西，和一些已经能用的东西
						</span>
					</h1>
				</header>
				<div
					className="blog-enter hidden items-center gap-3 text-muted-foreground sm:flex"
					style={{ animationDelay: "100ms" }}
				>
					<span className="ml-1 font-data text-[10px] uppercase tracking-[0.14em]">
						build / ship / iterate
					</span>
				</div>
			</div>
			<ProductCount />
		</section>
	);
}

function ProductCount() {
	return (
		<aside
			className="blog-enter hidden h-fit shrink-0 border border-border bg-card px-4 py-3 sm:block"
			style={{ animationDelay: "80ms" }}
		>
			<p className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
				Total
			</p>
			<p className="mt-2 font-semibold font-ui text-2xl leading-none">
				{String(products.length).padStart(2, "0")}
			</p>
			<p className="mt-1 font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
				products
			</p>
		</aside>
	);
}
