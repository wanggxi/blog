import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductStatus({
	product,
	showDot = false,
}: {
	product: Product;
	showDot?: boolean;
}) {
	const isLive = product.statusTone === "live";

	return (
		<span
			className={cn(
				"shrink-0 border px-2 py-0.5 font-data text-[11px] uppercase tracking-[0.08em]",
				showDot && "inline-flex items-center gap-1.5",
				isLive
					? "border-emerald-500/45 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
					: "border-amber-500/45 bg-amber-500/10 text-amber-700 dark:text-amber-300",
			)}
		>
			{showDot ? (
				<span
					className={cn("size-1.5", isLive ? "bg-emerald-500" : "bg-amber-500")}
				/>
			) : null}
			{product.status}
		</span>
	);
}
