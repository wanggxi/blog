import {
	RiCalendarLine,
	RiPriceTag3Line,
	RiTimer2Line,
	RiTranslate2,
} from "@remixicon/react";
import { type BlogPost, formatDisplayDate } from "@/lib/blog";

type PostMetaTagsProps = {
	duration?: BlogPost["duration"];
	lang?: BlogPost["lang"];
	date?: BlogPost["date"];
	tags?: BlogPost["tags"];
};

export function PostMetaTags({
	duration,
	lang,
	date,
	tags,
}: PostMetaTagsProps) {
	if (!date && !duration && !lang && !tags?.length) {
		return null;
	}
	return (
		<>
			{date ? (
				<time
					dateTime={date}
					className="inline-flex items-center gap-1 border border-border px-2 py-1 font-data"
				>
					<RiCalendarLine className="size-3"></RiCalendarLine>
					{formatDisplayDate(date)}
				</time>
			) : null}
			{duration ? (
				<span className="inline-flex items-center gap-1 border border-border px-2 py-1 font-data">
					<RiTimer2Line className="size-3" />
					{duration}
				</span>
			) : null}
			{lang ? (
				<span className="inline-flex items-center gap-1 border border-border px-2 py-1 font-data">
					<RiTranslate2 className="size-3" />
					{lang}
				</span>
			) : null}
			{tags?.map((tag) => (
				<span
					key={tag}
					className="inline-flex items-center gap-1 border border-border px-2 py-1 font-data uppercase"
				>
					<RiPriceTag3Line className="size-3" />
					{tag}
				</span>
			))}
		</>
	);
}
