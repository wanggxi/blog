"use client";

import { RiArrowUpLine } from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD_RATIO = 1;
const CLICK_ANIMATION_DURATION = 360;

const buttonClassName =
	"group fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-grid size-11 translate-y-4 scale-[0.9] cursor-pointer place-items-center overflow-hidden rounded-none border border-border/80 bg-background/88 text-muted-foreground opacity-0 shadow-[0_0.55rem_1.6rem_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.55)] backdrop-blur-md transition-[opacity,transform,border-color,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none hover:-translate-y-1 hover:scale-100 hover:border-foreground/45 hover:bg-card hover:text-foreground hover:shadow-[0_0.75rem_1.8rem_rgb(0_0_0/0.12),inset_0_1px_0_rgb(255_255_255/0.65)] active:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-card/82 dark:shadow-[0_0.75rem_2rem_rgb(0_0_0/0.34),inset_0_1px_0_rgb(255_255_255/0.08)] dark:hover:bg-muted/70 motion-reduce:transition-none motion-reduce:data-[clicking=true]:animate-none data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:scale-100 data-[visible=true]:opacity-100 data-[clicking=true]:-translate-y-1 data-[clicking=true]:scale-95 data-[clicking=true]:animate-back-top-click";

const haloClassName =
	"absolute inset-1 scale-75 border border-border/70 bg-muted/45 opacity-0 transition-[opacity,transform,border-color] duration-200 ease-out group-hover:scale-100 group-hover:border-foreground/25 group-hover:opacity-100 group-active:scale-105 motion-reduce:transition-none group-data-[clicking=true]:scale-105 group-data-[clicking=true]:opacity-100";

const cornerClassName =
	"absolute top-1.5 left-1.5 size-1.5 border-foreground/35 border-t border-l opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-data-[clicking=true]:opacity-100";

const oppositeCornerClassName =
	"absolute right-1.5 bottom-1.5 size-1.5 border-foreground/35 border-r border-b opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-data-[clicking=true]:opacity-100";

const iconClassName =
	"relative size-4.5 stroke-[2.2] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-active:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-data-[clicking=true]:animate-none group-data-[clicking=true]:animate-back-top-arrow";

export const BackTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [isClicking, setIsClicking] = useState(false);
	const frameRef = useRef<number | null>(null);
	const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const syncVisibility = () => {
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop || 0;
			const threshold = window.innerHeight * SCROLL_THRESHOLD_RATIO;

			setIsVisible(scrollTop >= threshold);
			frameRef.current = null;
		};

		const handleScroll = () => {
			if (frameRef.current !== null) {
				return;
			}

			frameRef.current = window.requestAnimationFrame(syncVisibility);
		};

		syncVisibility();
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);

			if (frameRef.current !== null) {
				window.cancelAnimationFrame(frameRef.current);
			}

			if (clickTimerRef.current !== null) {
				clearTimeout(clickTimerRef.current);
			}
		};
	}, []);

	const handleBackTop = useCallback(() => {
		setIsClicking(true);
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (clickTimerRef.current !== null) {
			clearTimeout(clickTimerRef.current);
		}

		clickTimerRef.current = setTimeout(() => {
			setIsClicking(false);
		}, CLICK_ANIMATION_DURATION);
	}, []);

	return (
		<button
			aria-label="Back to top"
			className={buttonClassName}
			data-clicking={isClicking}
			data-visible={isVisible}
			onClick={handleBackTop}
			tabIndex={isVisible ? 0 : -1}
			title="返回顶部"
			type="button"
		>
			<span className={haloClassName} />
			<span className={cornerClassName} />
			<span className={oppositeCornerClassName} />
			<RiArrowUpLine aria-hidden="true" className={iconClassName} />
		</button>
	);
};
