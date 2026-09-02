"use client";

import {
	RiAlertFill,
	RiArrowDownSLine,
	RiArrowRightSLine,
	RiErrorWarningFill,
	RiInformationFill,
} from "@remixicon/react";
import { type ComponentType, useState } from "react";
import { cn } from "@/lib/utils";

type Level = "error" | "warning" | "info" | "log";

type LogEntry = {
	level: Level;
	message: string;
	source?: string;
	stack?: string[];
	count?: number;
};

const ENTRIES: LogEntry[] = [
	{
		level: "info",
		message: "[HMR] Waiting for update signal from WDS...",
		source: "client.js:52",
	},
	{
		level: "log",
		message: "用户进入商品详情页 goodsId=1001",
		source: "track.js:18",
	},
	{
		level: "warning",
		message:
			'[Vue warn]: Invalid prop: type check failed for prop "price". Expected Number with value NaN, got String.',
		source: "vue.runtime.js:619",
	},
	{
		level: "error",
		message:
			"GET https://api.shop.com/order/create 500 (Internal Server Error)",
		source: "request.js:88",
	},
	{
		level: "error",
		message:
			"Uncaught TypeError: Cannot read properties of undefined (reading 'name')",
		source: "OrderDetail.jsx:42",
		stack: [
			"at OrderDetail (OrderDetail.jsx:42:31)",
			"at renderWithHooks (react-dom.development.js:15486)",
			"at mountIndeterminateComponent (react-dom.development.js:20103)",
			"at beginWork (react-dom.development.js:21626)",
		],
	},
	{
		level: "error",
		message:
			"Access to fetch at 'https://api.shop.com/coupon' from origin 'https://shop.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.",
		source: "coupon.js:24",
	},
	{
		level: "error",
		message:
			"Failed to load resource: the server responded with a status of 404 (Not Found)",
		source: "banner.png:1",
		count: 3,
	},
];

const META: Record<
	Level,
	{
		icon?: ComponentType<{ className?: string }>;
		text: string;
		row: string;
		accent: string;
	}
> = {
	error: {
		icon: RiErrorWarningFill,
		text: "text-destructive",
		row: "border-l-destructive bg-destructive/5",
		accent: "text-destructive",
	},
	warning: {
		icon: RiAlertFill,
		text: "text-amber-700 dark:text-amber-300",
		row: "border-l-amber-500 bg-amber-500/5",
		accent: "text-amber-600 dark:text-amber-400",
	},
	info: {
		icon: RiInformationFill,
		text: "text-foreground/80",
		row: "border-l-transparent",
		accent: "text-muted-foreground",
	},
	log: {
		text: "text-foreground/80",
		row: "border-l-transparent",
		accent: "text-muted-foreground",
	},
};

const FILTERS: { key: Level | "all"; label: string }[] = [
	{ key: "all", label: "全部" },
	{ key: "error", label: "错误" },
	{ key: "warning", label: "警告" },
	{ key: "info", label: "信息" },
];

export function ConsoleView() {
	const [filter, setFilter] = useState<Level | "all">("all");
	const [expanded, setExpanded] = useState<Set<number>>(new Set());

	const errorCount = ENTRIES.filter((entry) => entry.level === "error").length;
	const warnCount = ENTRIES.filter((entry) => entry.level === "warning").length;

	function toggle(index: number) {
		setExpanded((current) => {
			const next = new Set(current);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	}

	const visible = ENTRIES.map((entry, index) => ({ entry, index })).filter(
		({ entry }) => filter === "all" || entry.level === filter,
	);

	return (
		<div className="not-prose my-8 overflow-hidden border border-border bg-card">
			{/* 工具栏 */}
			<div className="flex items-center gap-2 border-border border-b bg-muted/40 px-3 py-2">
				<span className="size-2.5 rounded-full bg-destructive/70" />
				<span className="size-2.5 rounded-full bg-amber-500/70" />
				<span className="size-2.5 rounded-full bg-emerald-500/70" />
				<span className="ml-2 font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					DevTools · Console
				</span>
				<span className="ml-auto flex items-center gap-3 font-data text-[11px]">
					<span className="flex items-center gap-1 text-destructive">
						<RiErrorWarningFill className="size-3.5" />
						{errorCount}
					</span>
					<span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
						<RiAlertFill className="size-3.5" />
						{warnCount}
					</span>
				</span>
			</div>

			{/* 级别筛选 */}
			<div className="flex items-center gap-1.5 overflow-x-auto border-border border-b px-3 py-1.5">
				{FILTERS.map((item) => (
					<button
						type="button"
						key={item.key}
						onClick={() => setFilter(item.key)}
						className={cn(
							"shrink-0 border px-2 py-0.5 font-data text-[10px] uppercase tracking-[0.08em] transition-colors",
							filter === item.key
								? "border-foreground bg-foreground text-background"
								: "border-border text-muted-foreground hover:text-foreground",
						)}
					>
						{item.label}
					</button>
				))}
			</div>

			{/* 日志流 */}
			<div className="divide-y divide-border/40">
				{visible.map(({ entry, index }) => {
					const meta = META[entry.level];
					const Icon = meta.icon;
					const isOpen = expanded.has(index);
					const hasStack = !!entry.stack?.length;
					return (
						<div key={index} className={cn("border-l-2", meta.row)}>
							<button
								type="button"
								disabled={!hasStack}
								onClick={() => hasStack && toggle(index)}
								className={cn(
									"flex w-full items-start gap-2 px-3 py-1.5 text-left font-data text-[12px] leading-5",
									hasStack && "cursor-pointer",
								)}
							>
								<span className="mt-0.5 flex w-3.5 shrink-0 justify-center">
									{hasStack ? (
										isOpen ? (
											<RiArrowDownSLine className="size-3.5 text-muted-foreground" />
										) : (
											<RiArrowRightSLine className="size-3.5 text-muted-foreground" />
										)
									) : null}
								</span>
								{Icon ? (
									<Icon
										className={cn("mt-0.5 size-3.5 shrink-0", meta.accent)}
									/>
								) : (
									<span className="mt-0.5 w-3.5 shrink-0" />
								)}
								{entry.count ? (
									<span className="mt-0.5 inline-flex h-4 shrink-0 items-center rounded-full bg-muted px-1.5 font-data text-[10px] text-muted-foreground">
										{entry.count}
									</span>
								) : null}
								<span className={cn("min-w-0 flex-1 break-words", meta.text)}>
									{entry.message}
								</span>
								{entry.source ? (
									<span className="ml-2 hidden shrink-0 text-muted-foreground underline decoration-dotted underline-offset-2 sm:inline">
										{entry.source}
									</span>
								) : null}
							</button>

							{hasStack && isOpen ? (
								<ul className="pb-1.5 pl-12">
									{entry.stack?.map((line) => (
										<li
											key={line}
											className="py-0.5 font-data text-[11px] text-muted-foreground leading-5"
										>
											{line}
										</li>
									))}
								</ul>
							) : null}
						</div>
					);
				})}
			</div>

			{/* 输入行 */}
			<div className="flex items-center gap-2 border-border border-t px-3 py-1.5 font-data text-[12px] text-muted-foreground">
				<RiArrowRightSLine className="size-4 text-emerald-600 dark:text-emerald-400" />
				<span className="text-muted-foreground/60">
					红色为错误，点击带 ▸ 的错误可展开调用栈
				</span>
			</div>
		</div>
	);
}
