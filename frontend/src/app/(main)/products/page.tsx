import type { Metadata } from "next";
import { ProductShowcase } from "@/components/products/product-showcase";

export const metadata: Metadata = {
	title: "产品 / Wankong",
	description: "Wankong 的小产品与项目展示。",
};

export default function ProductsPage() {
	return (
		<div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
			<ProductShowcase />
		</div>
	);
}
