"use client";

import { RiCloseLine, RiZoomInLine } from "@remixicon/react";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ImageZoomProps = ComponentPropsWithoutRef<"img">;

export function ImageZoom({ alt = "", className, ...props }: ImageZoomProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	return (
		<>
			<button
				aria-label="Zoom image"
				className="group relative inline-block max-w-full cursor-zoom-in overflow-hidden rounded-none border-0 bg-transparent p-0 text-left align-top"
				onClick={() => setIsOpen(true)}
				type="button"
			>
				{/* biome-ignore lint/performance/noImgElement: MDX images do not always provide width and height for next/image. */}
				<img
					alt={alt}
					className={cn(
						"m-0 my-0 block h-auto max-w-full border-0 transition duration-300 motion-reduce:transition-none",
						className,
					)}
					{...props}
				/>
				<span
					className="absolute right-3 bottom-3 grid size-8 place-items-center border border-border bg-background/85 text-muted-foreground opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
					aria-hidden="true"
				>
					<RiZoomInLine className="size-4" />
				</span>
			</button>

			{isMounted && isOpen
				? createPortal(
						<div
							className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8"
							aria-modal="true"
							role="dialog"
						>
							<button
								aria-label="Close image"
								className="absolute inset-0 cursor-zoom-out bg-background/88 backdrop-blur-md"
								onClick={() => setIsOpen(false)}
								type="button"
							/>
							<button
								aria-label="Close image"
								className="fixed top-4 right-4 z-50 grid size-10 cursor-pointer place-items-center rounded-none border border-border bg-background/90 text-foreground backdrop-blur-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2"
								onClick={() => setIsOpen(false)}
								type="button"
							>
								<RiCloseLine className="size-5" />
							</button>
							<button
								aria-label="Close image"
								className="relative cursor-zoom-out border-0 bg-transparent p-0 shadow-2xl"
								onClick={() => setIsOpen(false)}
								type="button"
							>
								{/* biome-ignore lint/performance/noImgElement: The preview mirrors the original MDX image source without requiring fixed dimensions. */}
								<img
									alt={alt}
									className="h-auto max-h-[min(86vh,56rem)] max-w-[min(92vw,72rem)] object-contain"
									{...props}
								/>
							</button>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
