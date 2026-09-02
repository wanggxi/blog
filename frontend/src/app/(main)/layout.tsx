import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { BackTop } from "@/components/back-top/back-top";
import { NavHeader } from "@/components/nav-header/nav-header";
import { buttonVariants } from "@/components/ui/button";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { cn } from "@/lib/utils";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{/* <ArtPlum></ArtPlum> */}
			<NoiseTexture noiseOpacity={0.3}></NoiseTexture>
			<NavHeader />
			<main>{children}</main>
			<footer className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 sm:px-6">
				<div className="text-muted-foreground text-sm">
					<Link href="https://beian.miit.gov.cn/">皖ICP备19001128号-2</Link>
					<span>
						&nbsp;2018 至今，<Link href="/">WanKong</Link>
					</span>
				</div>
				<Link
					href="https://github.com/wan-kong/"
					className={cn(
						buttonVariants({
							variant: "link",
						}),
					)}
					target="_blank"
				>
					<SiGithub className="text-pretty"></SiGithub>
				</Link>
			</footer>
			<BackTop></BackTop>
		</>
	);
}
