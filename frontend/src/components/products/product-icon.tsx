import Image from "next/image";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductIcon({
	product,
	className,
	iconClassName,
}: {
	product: Product;
	className?: string;
	iconClassName?: string;
}) {
	const Icon = product.icon;

	return (
		<span
			className={cn(
				"flex shrink-0 items-center justify-center border text-foreground",
				product.accentClassName,
				className,
			)}
		>
			{product.iconUrl ? (
				<Image
					src={product.iconUrl}
					alt=""
					width={24}
					height={24}
					className={cn("object-contain", iconClassName, product.iconClassName)}
				/>
			) : Icon ? (
				<Icon
					className={cn(iconClassName, product.iconClassName)}
					color={product.iconColor}
				/>
			) : null}
		</span>
	);
}
