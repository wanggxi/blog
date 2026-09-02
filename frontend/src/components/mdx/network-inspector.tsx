"use client";

import { RiCloseLine } from "@remixicon/react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type KV = { name: string; value: string };

type PayloadSection = {
	title: string;
	items?: KV[];
	raw?: string;
};

type NetworkRequest = {
	name: string;
	method: string;
	status: number;
	statusText: string;
	type: string;
	time: string;
	size: string;
	url: string;
	remoteAddress: string;
	responseHeaders: KV[];
	requestHeaders: KV[];
	payload?: PayloadSection[];
	responseBody: string;
	responseKind: "json" | "html";
};

const REQUESTS: NetworkRequest[] = [
	{
		name: "list?page=1&size=20&category=phone",
		method: "GET",
		status: 200,
		statusText: "OK",
		type: "fetch",
		time: "126 ms",
		size: "2.4 kB",
		url: "https://api.shop.com/goods/list?page=1&size=20&category=phone",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "application/json; charset=utf-8" },
			{ name: "content-length", value: "2417" },
			{ name: "cache-control", value: "no-cache" },
			{ name: "date", value: "Tue, 23 Jun 2026 06:30:11 GMT" },
		],
		requestHeaders: [
			{ name: "accept", value: "application/json" },
			{ name: "authorization", value: "Bearer eyJhbGci...c2VyMDAx" },
			{ name: "referer", value: "https://shop.com/goods" },
		],
		payload: [
			{
				title: "查询字符串参数",
				items: [
					{ name: "page", value: "1" },
					{ name: "size", value: "20" },
					{ name: "category", value: "phone" },
				],
			},
		],
		responseKind: "json",
		responseBody: `{
  "code": 0,
  "message": "success",
  "data": {
    "total": 58,
    "list": [
      { "id": 1001, "title": "某品牌手机 Pro", "price": 4999 },
      { "id": 1002, "title": "某品牌手机 Air", "price": 3299 }
    ]
  }
}`,
	},
	{
		name: "create",
		method: "POST",
		status: 500,
		statusText: "Internal Server Error",
		type: "xhr",
		time: "311 ms",
		size: "186 B",
		url: "https://api.shop.com/order/create",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "application/json; charset=utf-8" },
			{ name: "content-length", value: "92" },
			{ name: "date", value: "Tue, 23 Jun 2026 06:30:42 GMT" },
		],
		requestHeaders: [
			{ name: "accept", value: "application/json" },
			{ name: "authorization", value: "Bearer eyJhbGci...c2VyMDAx" },
			{ name: "content-type", value: "application/json" },
			{ name: "origin", value: "https://shop.com" },
		],
		payload: [
			{
				title: "请求负载",
				raw: `{
  "goodsId": 1001,
  "count": 1,
  "addressId": null,
  "couponId": "NEW20"
}`,
			},
		],
		responseKind: "json",
		responseBody: `{
  "code": 500,
  "message": "收货地址不能为空",
  "traceId": "a1b2c3d4e5"
}`,
	},
	{
		name: "login",
		method: "POST",
		status: 401,
		statusText: "Unauthorized",
		type: "xhr",
		time: "204 ms",
		size: "124 B",
		url: "https://api.shop.com/auth/login",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "application/json; charset=utf-8" },
			{ name: "content-length", value: "78" },
			{ name: "www-authenticate", value: "Bearer" },
		],
		requestHeaders: [
			{ name: "accept", value: "application/json" },
			{
				name: "content-type",
				value: "application/x-www-form-urlencoded",
			},
			{ name: "origin", value: "https://shop.com" },
		],
		payload: [
			{
				title: "表单数据",
				items: [
					{ name: "username", value: "test001" },
					{ name: "password", value: "••••••••" },
				],
			},
		],
		responseKind: "json",
		responseBody: `{
  "code": 401,
  "message": "用户名或密码错误"
}`,
	},
	{
		name: "info",
		method: "GET",
		status: 200,
		statusText: "OK",
		type: "fetch",
		time: "88 ms",
		size: "412 B",
		url: "https://api.shop.com/user/info",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "application/json; charset=utf-8" },
			{ name: "content-length", value: "318" },
			{ name: "cache-control", value: "private, max-age=60" },
		],
		requestHeaders: [
			{ name: "accept", value: "application/json" },
			{ name: "authorization", value: "Bearer eyJhbGci...c2VyMDAx" },
		],
		responseKind: "json",
		responseBody: `{
  "code": 0,
  "data": {
    "id": 10086,
    "name": "测试账号",
    "role": "user",
    "vip": false
  }
}`,
	},
	{
		name: "available?userId=10086",
		method: "GET",
		status: 403,
		statusText: "Forbidden",
		type: "fetch",
		time: "97 ms",
		size: "96 B",
		url: "https://api.shop.com/coupon/available?userId=10086",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "application/json; charset=utf-8" },
			{ name: "content-length", value: "64" },
		],
		requestHeaders: [
			{ name: "accept", value: "application/json" },
			{ name: "authorization", value: "Bearer eyJhbGci...c2VyMDAx" },
		],
		payload: [
			{
				title: "查询字符串参数",
				items: [{ name: "userId", value: "10086" }],
			},
		],
		responseKind: "json",
		responseBody: `{
  "code": 403,
  "message": "当前账号无权领取该优惠券"
}`,
	},
	{
		name: "report",
		method: "GET",
		status: 404,
		statusText: "Not Found",
		type: "document",
		time: "61 ms",
		size: "1.1 kB",
		url: "https://api.shop.com/legacy/report",
		remoteAddress: "47.95.12.34:443",
		responseHeaders: [
			{ name: "content-type", value: "text/html; charset=utf-8" },
			{ name: "content-length", value: "1064" },
			{ name: "server", value: "nginx" },
		],
		requestHeaders: [
			{ name: "accept", value: "text/html,application/xhtml+xml" },
			{ name: "referer", value: "https://shop.com/old-report" },
		],
		responseKind: "html",
		responseBody: `<html>
  <head><title>404 Not Found</title></head>
  <body>
    <center><h1>404 Not Found</h1></center>
    <hr><center>nginx</center>
  </body>
</html>`,
	},
];

const TABS = ["标头", "载荷", "预览", "响应", "启动器", "时间", "Cookie"];
const ACTIVE_TABS = new Set(["标头", "载荷", "预览", "响应"]);

function statusTone(status: number) {
	if (status >= 400) return "text-destructive";
	if (status >= 200 && status < 300)
		return "text-emerald-600 dark:text-emerald-400";
	return "text-muted-foreground";
}

function methodTone(method: string) {
	if (method === "POST") return "text-amber-600 dark:text-amber-400";
	return "text-muted-foreground";
}

function colorizeJson(src: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const regex =
		/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;
	let last = 0;
	let key = 0;
	let match: RegExpExecArray | null = regex.exec(src);
	while (match !== null) {
		if (match.index > last) nodes.push(src.slice(last, match.index));
		if (match[1] !== undefined) {
			const isKey = match[2] !== undefined;
			nodes.push(
				<span
					key={key++}
					className={
						isKey ? "text-foreground" : "text-emerald-600 dark:text-emerald-400"
					}
				>
					{match[1]}
				</span>,
			);
			if (match[2] !== undefined) nodes.push(match[2]);
		} else if (match[3] !== undefined) {
			nodes.push(
				<span key={key++} className="text-amber-600 dark:text-amber-400">
					{match[3]}
				</span>,
			);
		} else if (match[4] !== undefined) {
			nodes.push(
				<span key={key++} className="text-amber-600 dark:text-amber-400">
					{match[4]}
				</span>,
			);
		}
		last = regex.lastIndex;
		match = regex.exec(src);
	}
	if (last < src.length) nodes.push(src.slice(last));
	return nodes;
}

function HeaderSection({ title, items }: { title: string; items: KV[] }) {
	return (
		<div className="border-border border-b last:border-b-0">
			<div className="bg-muted/40 px-3 py-1.5 font-data text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
				{title}
			</div>
			<dl className="divide-y divide-border/50">
				{items.map((item) => (
					<div
						key={item.name}
						className="grid grid-cols-[10rem_1fr] gap-x-3 px-3 py-1.5"
					>
						<dt className="truncate font-data text-[11px] text-muted-foreground">
							{item.name}
						</dt>
						<dd className="break-all font-data text-[11px] text-foreground/90">
							{item.value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

function DetailBody({
	request,
	tab,
}: {
	request: NetworkRequest;
	tab: string;
}) {
	if (tab === "标头") {
		return (
			<div>
				<HeaderSection
					title="常规"
					items={[
						{ name: "请求网址", value: request.url },
						{ name: "请求方法", value: request.method },
						{
							name: "状态代码",
							value: `${request.status} ${request.statusText}`,
						},
						{ name: "远程地址", value: request.remoteAddress },
					]}
				/>
				<HeaderSection title="响应标头" items={request.responseHeaders} />
				<HeaderSection title="请求标头" items={request.requestHeaders} />
			</div>
		);
	}

	if (tab === "载荷") {
		if (!request.payload?.length) {
			return (
				<div className="p-4 font-data text-[11px] text-muted-foreground">
					此请求没有载荷。
				</div>
			);
		}
		return (
			<div>
				{request.payload.map((section) => (
					<div
						key={section.title}
						className="border-border border-b last:border-b-0"
					>
						<div className="bg-muted/40 px-3 py-1.5 font-data text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
							{section.title}
						</div>
						{section.items ? (
							<dl className="divide-y divide-border/50">
								{section.items.map((item) => (
									<div
										key={item.name}
										className="grid grid-cols-[8rem_1fr] gap-x-3 px-3 py-1.5"
									>
										<dt className="truncate font-data text-[11px] text-muted-foreground">
											{item.name}
										</dt>
										<dd className="break-all font-data text-[11px] text-foreground/90">
											{item.value}
										</dd>
									</div>
								))}
							</dl>
						) : null}
						{section.raw ? (
							<pre className="overflow-x-auto px-3 py-2 font-data text-[11px] text-foreground/90 leading-5">
								{colorizeJson(section.raw)}
							</pre>
						) : null}
					</div>
				))}
			</div>
		);
	}

	if (tab === "预览") {
		return (
			<pre className="overflow-x-auto px-3 py-2 font-data text-[11px] leading-5">
				{request.responseKind === "json"
					? colorizeJson(request.responseBody)
					: request.responseBody}
			</pre>
		);
	}

	// 响应
	return (
		<pre className="overflow-x-auto px-3 py-2 font-data text-[11px] text-foreground/80 leading-5">
			{request.responseBody}
		</pre>
	);
}

export function NetworkInspector() {
	const [selected, setSelected] = useState<number | null>(null);
	const [tab, setTab] = useState("标头");

	const request = selected !== null ? REQUESTS[selected] : null;
	const open = request !== null;

	function selectRow(index: number) {
		setSelected((current) => (current === index ? null : index));
		setTab("标头");
	}

	return (
		<div className="not-prose my-8 overflow-hidden border border-border bg-card">
			{/* 工具栏 */}
			<div className="flex items-center gap-2 border-border border-b bg-muted/40 px-3 py-2">
				<span className="size-2.5 rounded-full bg-destructive/70" />
				<span className="size-2.5 rounded-full bg-amber-500/70" />
				<span className="size-2.5 rounded-full bg-emerald-500/70" />
				<span className="ml-2 font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					DevTools · Network
				</span>
			</div>

			{/* 筛选条 */}
			<div className="flex items-center gap-1.5 overflow-x-auto border-border border-b px-3 py-1.5">
				{["全部", "Fetch/XHR", "JS", "CSS", "文档", "图片"].map((chip) => (
					<span
						key={chip}
						className={cn(
							"shrink-0 border px-2 py-0.5 font-data text-[10px] uppercase tracking-[0.08em]",
							chip === "Fetch/XHR"
								? "border-foreground bg-foreground text-background"
								: "border-border text-muted-foreground",
						)}
					>
						{chip}
					</span>
				))}
			</div>

			<div className="flex flex-col md:flex-row">
				{/* 请求列表 */}
				<div
					className={cn("min-w-0", open ? "md:w-[42%] md:shrink-0" : "w-full")}
				>
					{/* 列头 */}
					<div
						className={cn(
							"grid gap-x-3 border-border border-b px-3 py-1.5 font-data text-[10px] text-muted-foreground uppercase tracking-[0.1em]",
							open
								? "grid-cols-[1fr_auto]"
								: "grid-cols-[1fr_auto_auto_auto_auto]",
						)}
					>
						<span>Name</span>
						<span className="text-right">Status</span>
						{!open ? (
							<>
								<span className="hidden text-right sm:inline">Method</span>
								<span className="hidden text-right sm:inline">Type</span>
								<span className="text-right">Time</span>
							</>
						) : null}
					</div>

					<div className="divide-y divide-border/50">
						{REQUESTS.map((row, index) => {
							const isSelected = selected === index;
							const isError = row.status >= 400;
							return (
								<button
									type="button"
									key={row.url}
									onClick={() => selectRow(index)}
									className={cn(
										"grid w-full items-center gap-x-3 px-3 py-2 text-left font-data text-xs transition-colors",
										open
											? "grid-cols-[1fr_auto]"
											: "grid-cols-[1fr_auto_auto_auto_auto]",
										isSelected
											? "border-l-2 border-l-foreground bg-muted pl-[10px]"
											: "border-l-2 border-l-transparent hover:bg-muted/50",
										isError && !isSelected && "bg-destructive/5",
									)}
								>
									<span
										className={cn(
											"min-w-0 truncate",
											isError
												? "font-medium text-destructive"
												: "text-foreground/80",
										)}
									>
										{row.name}
									</span>
									<span
										className={cn(
											"text-right tabular-nums",
											statusTone(row.status),
										)}
									>
										{row.status}
									</span>
									{!open ? (
										<>
											<span
												className={cn(
													"hidden text-right sm:inline",
													methodTone(row.method),
												)}
											>
												{row.method}
											</span>
											<span className="hidden text-right text-muted-foreground sm:inline">
												{row.type}
											</span>
											<span className="text-right text-muted-foreground tabular-nums">
												{row.time}
											</span>
										</>
									) : null}
								</button>
							);
						})}
					</div>

					{!open ? (
						<div className="border-border border-t px-3 py-1.5 font-data text-[10px] text-muted-foreground">
							点击任意请求查看详情 · 共 {REQUESTS.length} 个请求
						</div>
					) : null}
				</div>

				{/* 详情面板 */}
				{request ? (
					<div className="flex min-w-0 flex-1 flex-col border-border border-t md:border-t-0 md:border-l">
						{/* 详情头 + Tab */}
						<div className="flex items-center gap-2 border-border border-b pr-1 pl-3">
							<div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
								{TABS.map((name) => {
									const active = tab === name;
									const enabled = ACTIVE_TABS.has(name);
									const hidden = name === "载荷" && !request.payload?.length;
									if (hidden) return null;
									return (
										<button
											type="button"
											key={name}
											disabled={!enabled}
											onClick={() => enabled && setTab(name)}
											className={cn(
												"shrink-0 border-b-2 px-2 py-2 font-data text-[11px] transition-colors",
												active
													? "border-b-foreground text-foreground"
													: "border-b-transparent",
												enabled
													? "text-muted-foreground hover:text-foreground"
													: "cursor-not-allowed text-muted-foreground/40",
											)}
										>
											{name}
										</button>
									);
								})}
							</div>
							<button
								type="button"
								onClick={() => setSelected(null)}
								aria-label="关闭详情"
								className="flex size-7 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							>
								<RiCloseLine className="size-4" />
							</button>
						</div>

						{/* Tab 内容 */}
						<div className="max-h-80 overflow-auto">
							<DetailBody request={request} tab={tab} />
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
