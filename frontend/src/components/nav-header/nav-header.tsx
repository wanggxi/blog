import type { Route } from "next";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavList: {
	name: string;
	path: Route<string>;
}[] = [
	{
		name: "首页",
		path: "/",
	},
	{
		name: "博客",
		path: "/blog",
	},
	{
		name: "产品",
		path: "/products",
	},
	{
		name: "关于",
		path: "/#about",
	},
];
export const NavHeader = () => {
	return (
		<header className="mx-auto w-full px-4 py-4 sm:px-6">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
				<Link href="/" aria-label="Wankong 首页">
					{/* <Logo /> */}
				</Link>
				<nav className="flex items-center justify-center gap-1 sm:gap-2">
					{NavList.map((item) => (
						<Link
							key={item.name}
							href={item.path}
							className={cn(
								buttonVariants({ variant: "link", size: "lg" }),
								"px-1 text-muted-foreground text-sm hover:text-foreground sm:px-2 sm:text-base",
							)}
						>
							{item.name}
						</Link>
					))}
					<AnimatedThemeToggler
						variant="rectangle"
						className="ml-2 pb-0.5"
					></AnimatedThemeToggler>
				</nav>
			</div>
		</header>
	);
};
