const SCROLL_ITEMS = [
	{
		title: "顶部没有渐隐",
		meta: "scrollTop = 0",
		body: "内容正贴着起点，顶部遮罩厚度还是 0px。",
	},
	{
		title: "向下滚动一点",
		meta: "timeline 12%",
		body: "scroll(self y) 开始把顶部 fade 从 0px 插值到目标尺寸。",
	},
	{
		title: "中段阅读状态",
		meta: "timeline 35%",
		body: "上下边缘都保留柔和遮罩，暗示两端仍有内容。",
	},
	{
		title: "不用监听 scroll",
		meta: "CSS only",
		body: "遮罩状态来自滚动时间线，浏览器负责驱动动画进度。",
	},
	{
		title: "@property 生效",
		meta: "typed custom property",
		body: "自定义属性能按长度连续插值，所以 fade 不会突然跳变。",
	},
	{
		title: "接近底部",
		meta: "timeline 82%",
		body: "底部 fade 开始收起，避免给出“下面还有内容”的错误提示。",
	},
	{
		title: "到达终点",
		meta: "scrollEnd",
		body: "底部遮罩归零，只保留顶部渐隐。",
	},
];

const SHIMMER_LINES = [
	{ text: "shimmer", tone: "text-chart-1" },
	{ text: "currentColor", tone: "text-chart-2" },
	{ text: "background-position", tone: "text-chart-3" },
	{ text: "once / reverse / none", tone: "text-chart-4" },
];

export function ScrollFadeDemo() {
	return (
		<div className="not-prose my-8 overflow-hidden border border-border bg-card">
			<div className="flex items-center justify-between gap-3 border-border border-b bg-muted/40 px-3 py-2">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					CSS · Scroll Fade
				</span>
				<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
					尝试向下滚动查看更多效果
				</span>
			</div>
			<div className="bg-muted/15">
				<section
					className="max-h-96 overflow-y-auto scroll-fade p-3"
					aria-label="scroll fade demo"
				>
					<div className="space-y-2">
						{SCROLL_ITEMS.map((item, index) => (
							<div
								key={item.title}
								className="grid gap-2 border border-border bg-background p-3 sm:grid-cols-[2.75rem_1fr]"
							>
								<span className="font-data text-muted-foreground text-xs tabular-nums">
									{String(index + 1).padStart(2, "0")}
								</span>
								<div className="min-w-0">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<strong className="font-medium font-ui text-sm">
											{item.title}
										</strong>
										<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.08em]">
											{item.meta}
										</span>
									</div>
									<p className="mt-2 text-foreground/75 text-xs leading-6">
										{item.body}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

export function ShimmerDemo() {
	return (
		<div className="not-prose my-8 overflow-hidden border border-border bg-card">
			<div className="flex items-center justify-between gap-3 border-border border-b bg-muted/40 px-3 py-2">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					CSS · Shimmer
				</span>
				<span className="font-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
					Text Background
				</span>
			</div>
			<div className="grid gap-0 sm:grid-cols-[1fr_0.72fr]">
				<div className="border-border border-b p-5 sm:border-r sm:border-b-0">
					<p className="font-semibold font-ui text-3xl leading-tight sm:text-4xl">
						<span className="shimmer">文字自己发光</span>
					</p>
					<p className="mt-3 max-w-md text-foreground/70 text-sm leading-7">
						背景渐变被裁进文字形状里，动画只移动 background-position。
					</p>
				</div>
				<div className="divide-y divide-border">
					{SHIMMER_LINES.map((line) => (
						<div key={line.text} className="px-4 py-3">
							<span
								className={`shimmer font-data text-sm uppercase tracking-[0.08em]  ${line.tone}`}
							>
								{line.text}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
