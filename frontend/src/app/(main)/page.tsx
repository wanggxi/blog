import { AboutSection } from "@/components/home/about-section";
import { BlogSection } from "@/components/home/blog-section";
import { HomeHero } from "@/components/home/home-hero";
import { ProductSection } from "@/components/home/product-section";

export default function Home() {
	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6">
			<HomeHero />
			<AboutSection />
			<BlogSection />
			<ProductSection />
		</div>
	);
}
