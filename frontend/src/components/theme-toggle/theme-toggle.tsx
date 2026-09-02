"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const THEME_STORAGE_KEY = "wankong-theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const getSystemTheme = () =>
	window.matchMedia("(prefers-color-scheme: dark)").matches
		? DARK_THEME
		: LIGHT_THEME;

const applyTheme = (theme: string) => {
	const isDark = theme === DARK_THEME;

	document.documentElement.classList.toggle(DARK_THEME, isDark);
	document.documentElement.style.colorScheme = theme;
};

export const ThemeToggle = () => {
	const [theme, setTheme] = useState<string | null>(null);

	useEffect(() => {
		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		const initialTheme =
			storedTheme === DARK_THEME || storedTheme === LIGHT_THEME
				? storedTheme
				: getSystemTheme();

		applyTheme(initialTheme);
		setTheme(initialTheme);
	}, []);

	const handleToggle = useCallback(() => {
		setTheme((currentTheme) => {
			const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

			applyTheme(nextTheme);
			localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

			return nextTheme;
		});
	}, []);

	const isDark = theme === DARK_THEME;

	return (
		<button
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			aria-pressed={isDark}
			onClick={handleToggle}
			className={cn(
				buttonVariants({ size: "icon", variant: "ghost" }),
				"rounded-md",
			)}
			type="button"
		>
			{isDark ? (
				<RiMoonLine aria-hidden="true" className={cn("size-4")} />
			) : (
				<RiSunLine aria-hidden="true" className={cn("size-4")} />
			)}
		</button>
	);
};
