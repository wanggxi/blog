import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { ConsoleView } from "@/components/mdx/console-view";
import {
	ScrollFadeDemo,
	ShimmerDemo,
} from "@/components/mdx/css-scroll-fade-shimmer-demo";
import { GithubCard } from "@/components/mdx/github-card";
import { ImageZoom } from "@/components/mdx/image-zoom";
import { Kbd } from "@/components/mdx/kbd";
import { NetworkInspector } from "@/components/mdx/network-inspector";
import { NetworkPanel } from "@/components/mdx/network-panel";
import { Notice } from "@/components/mdx/notice";
import { JourneyTimeline } from "@/components/mdx/project-story";
import { ScriptInstall } from "@/components/mdx/script-install";
import { Step, Steps } from "@/components/mdx/steps";

const components: MDXComponents = {
	a: (props: ComponentPropsWithoutRef<"a">) => (
		<a {...props} target="_blank" rel="noreferrer" />
	),
	img: ImageZoom,
	pre: CodeBlock,
	ScriptInstall,
	GithubCard,
	Callout,
	Steps,
	Step,
	Kbd,
	NetworkPanel,
	NetworkInspector,
	ConsoleView,
	Notice,
	JourneyTimeline,
	ScrollFadeDemo,
	ShimmerDemo,
};

export function useMDXComponents(): MDXComponents {
	return components;
}
