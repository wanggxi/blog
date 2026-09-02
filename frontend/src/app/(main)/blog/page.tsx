import type { Metadata } from "next";
import { BlogArchive } from "@/components/blog/blog-archive";
import { getBlogYearSections } from "@/lib/blog";

export const metadata: Metadata = {
	title: "博客 / Wankong",
	description: "Wankong 的前端工程记录与产品思考。",
};

export default async function BlogIndexPage() {
	const sections = await getBlogYearSections();

	return (
		<main className="min-h-screen px-4 pb-20 sm:px-6">
			<BlogArchive sections={sections} />
		</main>
	);
}
