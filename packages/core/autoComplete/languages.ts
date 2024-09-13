export interface AutoCompleteLanguageInfo {
  name: string;
  topLevelKeywords: string[];
  singleLineComment: string;
  endOfLine: string[];
}

// TypeScript
export const Typescript = {
  name: "TypeScript",
  topLevelKeywords: ["function", "class", "module", "export", "import"],
  singleLineComment: "//",
  endOfLine: [";"],
};

export const LANGUAGES: Record<string, AutoCompleteLanguageInfo> = {
  ts: Typescript,
  js: Typescript,
  tsx: Typescript,
  jsx: Typescript,
};
