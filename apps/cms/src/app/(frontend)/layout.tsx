import type React from "react";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh-CN">
			<body>{children}</body>
		</html>
	);
}
