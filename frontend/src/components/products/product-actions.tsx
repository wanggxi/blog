import { SiGithub } from "@icons-pack/react-simple-icons";
import { RiArticleLine, RiExternalLinkLine } from "@remixicon/react";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductActions({ product }: { product: Product }) {
	return (
		<nav
			className="flex gap-2 sm:justify-end"
			aria-label={`${product.name} links`}
		>
			{product.postSlug ? (
				<Link
					href={`/blog/${product.postSlug}`}
					aria-label={`${product.name} 文章`}
					className={actionClassName}
					title={`${product.name} 文章`}
				>
					<RiArticleLine className="size-3.5" />
				</Link>
			) : null}
			{product.githubUrl ? (
				<ProductAction
					href={product.githubUrl}
					icon={<SiGithub className="size-3.5" />}
					label={`${product.name} GitHub`}
				/>
			) : null}
			{product.liveUrl ? (
				<ProductAction
					href={product.liveUrl}
					icon={<RiExternalLinkLine className="size-3.5" />}
					label={`${product.name} 线上地址`}
				/>
			) : null}
		</nav>
	);
}

const actionClassName =
	"group inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-[border-color,color,background-color] hover:border-foreground/35 hover:bg-muted/50 hover:text-foreground";

function ProductAction({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<a
			href={href}
			aria-label={label}
			className={actionClassName}
			rel="noreferrer"
			target="_blank"
			title={label}
		>
			{icon}
		</a>
	);
}
