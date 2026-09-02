"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/lib/mdx-toc";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
	items: TableOfContentsItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>();

	useEffect(() => {
		const headings = items
			.map((item) => document.getElementById(item.url.slice(1)))
			.filter((heading): heading is HTMLElement => heading !== null);

		if (headings.length === 0) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);

				if (visible) {
					setActiveId(visible.target.id);
				}
			},
			{
				rootMargin: "-96px 0px -65% 0px",
				threshold: 0.01,
			},
		);

		for (const heading of headings) {
			observer.observe(heading);
		}

		return () => observer.disconnect();
	}, [items]);

	if (items.length === 0) {
		return null;
	}

	return (
		<nav
			aria-label="Article contents"
			className="blog-enter border-border border-l pl-4 text-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
		>
			<div className="mb-3 font-data text-muted-foreground text-xs uppercase tracking-[0.18em]">
				CONTENTS
			</div>
			<ol className="grid gap-2">
				{items.map((item) => {
					const id = item.url.slice(1);

					return (
						<li
							key={item.url}
							className={cn(
								item.depth === 2 && "pl-0",
								item.depth === 3 && "pl-3",
								item.depth >= 4 && "pl-6",
							)}
						>
							<a
								href={item.url}
								data-active={activeId === id}
								className="before:-left-4 relative block text-muted-foreground leading-snug transition-colors before:absolute before:top-0.5 before:h-[calc(100%-0.25rem)] before:w-px before:bg-transparent before:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 data-[active=true]:text-foreground data-[active=true]:before:bg-foreground"
							>
								{item.title}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
