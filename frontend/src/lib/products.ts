import {
	SiGooglechrome,
	SiGooglechromeHex,
	SiRaycast,
	SiRaycastHex,
	SiTiktok,
	SiTiktokHex,
} from "@icons-pack/react-simple-icons";
import { Doubao } from "@lobehub/icons";
import { RiRadarLine, RiShapesLine } from "@remixicon/react";
import type { ComponentType } from "react";

export type Product = {
	slug: string;
	name: string;
	status: string;
	statusTone: "live" | "beta";
	tagline: string;
	description: string;
	platform: string;
	year: string;
	tags: string[];
	githubUrl?: string;
	liveUrl?: string;
	postSlug?: string;
	icon?: ComponentType<{ className?: string; color?: string }>;
	iconUrl?: string;
	iconColor?: string;
	iconClassName?: string;
	accentClassName: string;
};

const iconFrameClassName = "border-border bg-background";

export const products = [
	{
		slug: "imoment",
		name: "意刻",
		status: "已上线",
		statusTone: "live",
		tagline: "搜索问题，理解答案",
		description:
			"一个基于全文检索与多模型 AI 解读的智能问答平台，提供题目搜索、答案解析、用户与积分体系、开放 API 及多语言 SDK。",
		platform: "Web Platform",
		year: "2026",
		tags: ["TanStack Start", "PostgreSQL", "Meilisearch", "AI SDK"],
		liveUrl: "https://imoment.top",
		postSlug: "imoment-builer",
		iconUrl: "https://imoment.top/logo.svg",
		iconClassName: "size-6",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "fuck-douyin",
		name: "抖音净化",
		status: "已上线",
		statusTone: "live",
		tagline: "让抖音网页版清清爽爽的油猴脚本",
		description:
			"一个油猴脚本，刷视频时自动跳过广告、直播与购物推荐并强制最高画质，进直播间则挡掉满屏礼物动画与高级弹幕，所有开关都收在可拖拽的悬浮面板里，即改即生效。",
		platform: "Userscript",
		year: "2026",
		tags: ["Tampermonkey", "Douyin", "TypeScript", "Vite"],
		githubUrl: "https://github.com/wan-kong/fuck-douyin",
		liveUrl:
			"https://greasyfork.org/zh-CN/scripts/583463-%E6%8A%96%E9%9F%B3%E5%87%80%E5%8C%96-douyin",
		postSlug: "fuck-douyin",
		icon: SiTiktok,
		iconColor: SiTiktokHex,
		accentClassName: iconFrameClassName,
	},
	{
		slug: "codex-reset-monitor",
		name: "Codex 重置监测",
		status: "已上线",
		statusTone: "live",
		tagline: "监测 Codex 额度重置并及时发送提醒",
		description:
			"定时监测 Codex 额度重置状态的在线服务，提供邮件订阅提醒、历史记录与统计展示，便于及时获知可用额度变化。",
		platform: "Web Service",
		year: "2026",
		tags: ["Codex", "ChatGPT", "Next.js"],
		githubUrl: "https://github.com/wan-kong/codex-reset-monitor",
		liveUrl: "https://codex.imoment.top",
		postSlug: "codex-reset-monitor",
		icon: RiRadarLine,
		iconClassName: "text-emerald-500",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "doubao-nomark",
		name: "豆包去水印",
		status: "已上线",
		statusTone: "live",
		tagline: "一键去除豆包生成图片的水印",
		description:
			"在线工具，上传豆包生成的图片即可自动识别并去除水印，支持批量处理和本地处理，保护图片隐私。",
		platform: "Web Tool",
		year: "2026",
		tags: ["Next.js", "TypeScript", "Tailwind CSS", "Image Processing"],
		githubUrl: "https://github.com/wan-kong/doubao-nomark-online",
		liveUrl: "https://doubao.wankong.top",
		icon: Doubao,
		iconClassName: "text-sky-500",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "find-your-repo",
		name: "Find Your Repo",
		status: "已上线",
		statusTone: "live",
		tagline: "从 Git 地址直接定位本地仓库",
		description:
			"一个 Raycast 插件，把复制来的 Git 地址变成可打开的本地路径，适合经常在多个代码目录之间切换的开发工作流。",
		platform: "Raycast Extension",
		year: "2025",
		tags: ["Raycast", "TypeScript", "Git"],
		githubUrl: "https://github.com/wan-kong/find-your-repo",
		icon: SiRaycast,
		iconColor: SiRaycastHex,
		accentClassName: iconFrameClassName,
	},
	{
		slug: "sf-symbols",
		name: "SF Symbols",
		status: "已上线",
		statusTone: "live",
		tagline: "在线预览 Apple's SF Symbols",
		description:
			"面向设计和前端实现的小工具，用更轻的方式检索、预览和确认 SF Symbols，在写界面时少打断一点节奏。",
		platform: "Web Tool",
		year: "2025",
		tags: ["Icon Preview", "Next.js", "Search"],
		githubUrl: "https://github.com/wan-kong/sf-symbols-online",
		liveUrl: "https://sf-symbols-online-web.vercel.app/",
		icon: RiShapesLine,
		iconClassName: "text-fuchsia-500",
		accentClassName: iconFrameClassName,
	},
	{
		slug: "can-i-chat",
		name: "Can I Chat",
		status: "Beta",
		statusTone: "beta",
		tagline: "基于浏览器原生能力的轻量 ChatBox",
		description:
			"用 Chrome 原生 API 和大模型能力做一个尽量直接的聊天入口，重点放在低摩擦交互和可被继续扩展的浏览器侧体验。",
		platform: "Chrome Extension",
		year: "2024",
		tags: ["Chrome API", "LLM", "React"],
		githubUrl: "https://github.com/wan-kong/cani.chat",
		liveUrl: "https://cani-chat.vercel.app/",
		icon: SiGooglechrome,
		iconColor: SiGooglechromeHex,
		accentClassName: iconFrameClassName,
	},
] satisfies Product[];

export function getFeaturedProducts(limit = products.length) {
	return products.slice(0, limit);
}
