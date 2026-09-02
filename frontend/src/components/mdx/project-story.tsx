type JourneyItem = {
	date: string;
	label?: string;
	title: string;
	description: string;
};

type JourneyTimelineProps = {
	title?: string;
	items: JourneyItem[];
};

export function JourneyTimeline({
	title = "PROJECT LOG",
	items,
}: JourneyTimelineProps) {
	return (
		<section
			aria-label={title}
			className="not-prose my-8 border border-border bg-card"
		>
			<header className="flex items-center justify-between gap-4 border-border border-b bg-muted/30 px-4 py-3">
				<span className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
					{title}
				</span>
				<span className="font-data text-[10px] text-muted-foreground tabular-nums">
					{String(items.length).padStart(2, "0")} ENTRIES
				</span>
			</header>

			<ol className="divide-y divide-border/70">
				{items.map((item) => (
					<li
						key={`${item.date}-${item.title}`}
						className="grid gap-3 px-4 py-4 sm:grid-cols-[7.25rem_1fr] sm:gap-5"
					>
						<div className="flex items-start gap-3 sm:block">
							<span className="font-data text-[11px] text-muted-foreground tabular-nums">
								{item.date}
							</span>
							{item.label ? (
								<span className="border border-border px-1.5 py-0.5 font-data text-[9px] text-muted-foreground uppercase tracking-[0.1em] sm:mt-2 sm:inline-flex">
									{item.label}
								</span>
							) : null}
						</div>

						<div className="relative border-border border-l pl-4">
							<span className="-left-[3px] absolute top-1.5 size-[5px] bg-foreground" />
							<h4 className="font-medium font-ui text-foreground text-sm leading-5">
								{item.title}
							</h4>
							<p className="mt-1.5 text-muted-foreground text-sm leading-6">
								{item.description}
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
