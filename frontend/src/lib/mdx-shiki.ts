export const shikiOptions = {
	themes: {
		light: "github-light",
		dark: "github-dark",
	},
	defaultColor: "light-dark()",
	defaultLanguage: "text",
	fallbackLanguage: "text",
	addLanguageClass: true,
	langAlias: {
		bash: "shellscript",
		sh: "shellscript",
		zsh: "shellscript",
	},
} as const;
