import { cn } from "@/lib/utils";

type Row = {
	name: string;
	status: number | string;
	type?: string;
	time?: string;
};

type NetworkPanelProps = {
	rows: Row[];
};

function statusTone(status: number | string) {
	const code = Number(status);
	if (Number.isNaN(code)) return "text-muted-foreground";
	if (code >= 500) return "text-destructive";
	if (code >= 400) return "text-destructive";
	if (code >= 200 && code < 300)
		return "text-emerald-600 dark:text-emerald-400";
	return "text-muted-foreground";
}

function isError(status: number | string) {
	const code = Number(status);
	return !Number.isNaN(code) && code >= 400;
}

export function NetworkPanel({ rows }: NetworkPanelProps) {
	return (
		<div className="not-prose my-8 overflow-hidden border border-border bg-card">
			<div className="flex items-center gap-2 border-border border-b bg-muted/40 px-3 py-2">
				<span className="size-2.5 rounded-full bg-destructive/70" />
				<span className="size-2.5 rounded-full bg-amber-500/70" />
				<span className="size-2.5 rounded-full bg-emerald-500/70" />
				<span className="ml-2 font-data text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					Network · Fetch/XHR
				</span>
			</div>

			<div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-border border-b px-3 py-1.5 font-data text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
				<span>Name</span>
				<span className="text-right">Status</span>
				<span className="hidden text-right sm:inline">Type</span>
				<span className="text-right">Time</span>
			</div>

			<div className="divide-y divide-border/60">
				{rows.map((row) => (
					<div
						key={row.name}
						className={cn(
							"grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-3 py-2 font-data text-xs",
							isError(row.status) && "bg-destructive/5",
						)}
					>
						<span
							className={cn(
								"min-w-0 truncate",
								isError(row.status)
									? "font-medium text-destructive"
									: "text-foreground/80",
							)}
						>
							{row.name}
						</span>
						<span
							className={cn("text-right tabular-nums", statusTone(row.status))}
						>
							{row.status}
						</span>
						<span className="hidden text-right text-muted-foreground sm:inline">
							{row.type ?? "fetch"}
						</span>
						<span className="text-right text-muted-foreground tabular-nums">
							{row.time ?? "—"}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
