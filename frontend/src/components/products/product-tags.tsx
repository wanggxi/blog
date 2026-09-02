import {
	SiGit,
	SiGitHex,
	SiGooglechrome,
	SiGooglechromeHex,
	SiMeilisearch,
	SiMeilisearchHex,
	SiNextdotjs,
	SiPostgresql,
	SiPostgresqlHex,
	SiRaycast,
	SiRaycastHex,
	SiReact,
	SiReactHex,
	SiTailwindcss,
	SiTailwindcssHex,
	SiTampermonkey,
	SiTampermonkeyHex,
	SiTanstack,
	SiTanstackHex,
	SiTiktok,
	SiTiktokHex,
	SiTypescript,
	SiTypescriptHex,
	SiVite,
	SiViteHex,
} from "@icons-pack/react-simple-icons";
import { Codex, OpenAI } from "@lobehub/icons";
import {
	RiAiGenerate,
	RiImageEditLine,
	RiSearchLine,
	RiShapesLine,
} from "@remixicon/react";
import {
	SkillBadge,
	type SkillBadgeItem,
} from "@/components/skill-badge/skill-badge";
import type { Product } from "@/lib/products";

const TECH_BADGES: Record<string, SkillBadgeItem> = {
	"Chrome API": {
		icon: <SiGooglechrome color={SiGooglechromeHex} />,
		name: "Chrome API",
	},
	Git: {
		icon: <SiGit color={SiGitHex} />,
		name: "Git",
	},
	"Icon Preview": {
		icon: <RiShapesLine />,
		name: "Icon Preview",
	},
	"Image Processing": {
		icon: <RiImageEditLine />,
		name: "Image Processing",
	},
	LLM: {
		icon: <RiAiGenerate />,
		name: "LLM",
	},
	"AI SDK": {
		icon: <RiAiGenerate />,
		name: "AI SDK",
	},
	Meilisearch: {
		icon: <SiMeilisearch color={SiMeilisearchHex} />,
		name: "Meilisearch",
	},
	"Next.js": {
		icon: <SiNextdotjs className="text-black dark:text-white" />,
		name: "Next.js",
	},
	PostgreSQL: {
		icon: <SiPostgresql color={SiPostgresqlHex} />,
		name: "PostgreSQL",
	},
	Raycast: {
		icon: <SiRaycast color={SiRaycastHex} />,
		name: "Raycast",
	},
	React: {
		icon: <SiReact color={SiReactHex} />,
		name: "React",
	},
	Search: {
		icon: <RiSearchLine />,
		name: "Search",
	},
	"TanStack Start": {
		icon: <SiTanstack color={SiTanstackHex} />,
		name: "TanStack Start",
	},
	"Tailwind CSS": {
		icon: <SiTailwindcss color={SiTailwindcssHex} />,
		name: "Tailwind CSS",
	},
	TypeScript: {
		icon: <SiTypescript color={SiTypescriptHex} />,
		name: "TypeScript",
	},
	ChatGPT: {
		icon: <OpenAI />,
		name: "ChatGPt",
	},
	Codex: {
		icon: <Codex.Color></Codex.Color>,
		name: "Codex",
	},
	Douyin: {
		icon: <SiTiktok color={SiTiktokHex} />,
		name: "Douyin",
	},
	Tampermonkey: {
		icon: <SiTampermonkey color={SiTampermonkeyHex} />,
		name: "Tampermonkey",
	},
	Vite: {
		icon: <SiVite color={SiViteHex} />,
		name: "Vite",
	},
};

export function ProductTags({ product }: { product: Product }) {
	return (
		<ul className="flex flex-wrap gap-2">
			{product.tags.map((tag) => (
				<li key={tag}>
					<SkillBadge
						size="sm"
						skill={TECH_BADGES[tag] ?? fallbackSkill(tag)}
					/>
				</li>
			))}
		</ul>
	);
}

function fallbackSkill(name: string): SkillBadgeItem {
	return {
		icon: <RiShapesLine />,
		name,
	};
}
