import {
	SiGreasyfork,
	SiGreasyforkHex,
	SiTampermonkey,
} from "@icons-pack/react-simple-icons";
import { RiCursorLine, RiDownloadLine } from "@remixicon/react";

type ScriptInstallProps = {
	name: string;
	href: string;
	manager?: string;
	managerName?: string;
};

export function ScriptInstall({
	name,
	href,
	manager = "https://www.tampermonkey.net/",
	managerName = "Tampermonkey",
}: ScriptInstallProps) {
	return (
		<div className="not-prose my-8 border border-border bg-card">
			<div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
				<div className="flex min-w-0 items-center gap-3">
					<span
						className="flex size-10 shrink-0 items-center justify-center border border-border"
						style={{ color: SiGreasyforkHex }}
					>
						<SiGreasyfork className="size-5" />
					</span>
					<div className="min-w-0">
						<div className="truncate font-medium font-ui text-sm leading-tight">
							{name}
						</div>
						<div className="mt-0.5 font-data text-muted-foreground text-xs uppercase tracking-[0.12em]">
							Greasy Fork · Userscript
						</div>
					</div>
				</div>

				<a
					href={href}
					target="_blank"
					rel="noreferrer"
					className="group inline-flex shrink-0 items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-2.5 font-data text-background text-sm uppercase tracking-[0.08em] transition-[transform,opacity] hover:opacity-90 active:translate-y-px"
				>
					<RiDownloadLine className="size-4 transition-transform group-hover:translate-y-0.5" />
					一键安装
				</a>
			</div>

			<div className="flex items-center gap-2 border-border border-t bg-muted/30 px-4 py-2.5 text-muted-foreground text-xs">
				<RiCursorLine className="size-3.5 shrink-0" />
				<span className="leading-5">
					需先装好脚本管理器，推荐{" "}
					<a
						href={manager}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 text-foreground underline underline-offset-4"
					>
						<SiTampermonkey className="size-3.5" />
						{managerName}
					</a>
					，再点上方按钮即可。
				</span>
			</div>
		</div>
	);
}
