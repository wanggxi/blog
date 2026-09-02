import {
	SiDocker,
	SiDockerHex,
	SiNextdotjs,
	SiNodedotjs,
	SiNodedotjsHex,
	SiPython,
	SiPythonHex,
	SiReact,
	SiReactHex,
	SiTypescript,
	SiTypescriptHex,
	SiVite,
	SiViteHex,
	SiVuedotjs,
	SiVuedotjsHex,
} from "@icons-pack/react-simple-icons";
import { RiArrowRightUpLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { SkillBadge } from "@/components/skill-badge/skill-badge";
import { buttonVariants } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import { cn } from "@/lib/utils";

const SKILLS = [
	{
		icon: <SiVuedotjs color={SiVuedotjsHex}></SiVuedotjs>,
		name: "Vue",
	},
	{
		icon: <SiVite color={SiViteHex}></SiVite>,
		name: "Vite",
	},
	{
		icon: <SiReact color={SiReactHex}></SiReact>,
		name: "React",
	},
	{
		icon: <SiNextdotjs className="text-black dark:text-white"></SiNextdotjs>,
		name: "Next.js",
	},
	{
		icon: <SiTypescript color={SiTypescriptHex}></SiTypescript>,
		name: "TypeScript",
	},
	{
		icon: "/imgs/logos/bun.svg",
		name: "Bun",
	},
	{
		icon: <SiNodedotjs color={SiNodedotjsHex}></SiNodedotjs>,
		name: "Node.js",
	},
	{
		icon: <SiDocker color={SiDockerHex}></SiDocker>,
		name: "Docker",
	},
	{
		icon: <SiPython color={SiPythonHex}></SiPython>,
		name: "Python",
	},
];

function TimelineItem({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-2 sm:grid-cols-[3.5rem_1fr]">
			<span className="font-data text-[11px] text-muted-foreground">
				{label}
			</span>
			{children}
		</div>
	);
}

export function AboutSection() {
	return (
		<section
			id="about"
			className="grid gap-6 border-border border-y py-10 sm:grid-cols-[0.82fr_1.18fr] sm:gap-10"
		>
			<div className="flex flex-col justify-between gap-2">
				<p className="font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
					关于我
				</p>
				<div className="flex justify-between border border-border bg-card p-4">
					<span className="font-medium font-ui text-xl leading-none">
						前端工程师
					</span>
					<span className="text-right font-medium font-ui text-sm">
						HangZhou
					</span>
				</div>
				<div className="flex items-center justify-between gap-3">
					<p className="font-data text-muted-foreground text-xs uppercase tracking-[0.2em]">
						Skills
					</p>
					<span className="h-px flex-1 bg-border" />
				</div>
				<div className="flex flex-wrap gap-2">
					{SKILLS.map((skill) => (
						<SkillBadge key={skill.name} skill={skill} />
					))}
				</div>
			</div>
			<div className="grid content-start gap-5">
				<div className="flex items-end justify-between gap-4">
					<div>
						<p className="font-data text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
							Now
						</p>
						<h2 className="mt-2 font-semibold font-ui text-2xl">
							最近在做什么
						</h2>
					</div>
					<span className="hidden h-px flex-1 bg-border sm:block" />
				</div>
				<div className="grid gap-5 border-border border-l pl-4 sm:pl-5">
					<TimelineItem label="01 / Build">
						<p className="flex items-center text-sm leading-7">
							构建一个和 AI 融合的
							<Link
								href="/blog/imoment-builer"
								target="_blank"
								className={cn(
									buttonVariants({
										variant: "link",
										size: "lg",
									}),
									"text-sm",
									"ml-0 p-0",
								)}
							>
								<Image
									alt="imoment"
									width={16}
									height={16}
									className="h-4 w-4"
									src="https://imoment.top/logo.svg"
								/>
								<span> 题库检索系统</span>
								<RiArrowRightUpLine></RiArrowRightUpLine>
							</Link>
						</p>
					</TimelineItem>
					<TimelineItem label="02 / Write">
						<p className="text-sm leading-7">持续整理个人产品与工程笔记。</p>
					</TimelineItem>
					<TimelineItem label="03 / Study">
						<p className="text-sm leading-7">学习AI+产品设计+开发</p>
					</TimelineItem>
					<TimelineItem label="04 / Train">
						<div className="text-sm leading-7">
							健身，练出硕大的肌肉💪，可以来
							<LinkPreview
								url="https://gym.wankong.top"
								imageSrc="/imgs/gym.webp"
								isStatic
								className={cn(
									buttonVariants({ variant: "link", size: "lg" }),
									"px-1 text-sm",
								)}
							>
								这里
							</LinkPreview>
							监督我的健身打卡记录
						</div>
					</TimelineItem>
				</div>
			</div>
		</section>
	);
}
