import { SiGithub } from "@icons-pack/react-simple-icons";
import {
	RiArrowRightUpLine,
	RiGitForkLine,
	RiStarLine,
} from "@remixicon/react";

type GithubCardProps = {
	repo: string;
	description?: string;
	language?: string;
	languageColor?: string;
	stars?: string;
	forks?: string;
	href?: string;
};

export function GithubCard({
	repo,
	description,
	language,
	languageColor = "#8b5cf6",
	stars,
	forks,
	href,
}: GithubCardProps) {
	const [owner, name] = repo.split("/");
	const url = href ?? `https://github.com/${repo}`;

	return (
		<a
			href={url}
			target="_blank"
			rel="noreferrer"
			className="group not-prose my-8 block border border-border bg-card p-4 no-underline transition-[border-color,background-color] hover:border-foreground/35 hover:bg-muted/50"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5 font-data text-sm">
					<SiGithub className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
					<span className="truncate">
						<span className="text-muted-foreground">{owner}/</span>
						<span className="font-medium text-foreground">{name}</span>
					</span>
				</div>
				<RiArrowRightUpLine className="size-4 shrink-0 text-muted-foreground opacity-45 transition-[color,opacity,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100" />
			</div>

			{description ? (
				<p className="mt-3 line-clamp-2 text-muted-foreground text-sm leading-6">
					{description}
				</p>
			) : null}

			{language || stars || forks ? (
				<div className="mt-4 flex flex-wrap items-center gap-4 font-data text-muted-foreground text-xs">
					{language ? (
						<span className="inline-flex items-center gap-1.5">
							<span
								className="size-2.5 rounded-full"
								style={{ backgroundColor: languageColor }}
							/>
							{language}
						</span>
					) : null}
					{stars ? (
						<span className="inline-flex items-center gap-1">
							<RiStarLine className="size-3.5" />
							{stars}
						</span>
					) : null}
					{forks ? (
						<span className="inline-flex items-center gap-1">
							<RiGitForkLine className="size-3.5" />
							{forks}
						</span>
					) : null}
				</div>
			) : null}
		</a>
	);
}
