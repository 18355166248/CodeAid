export function getLanguageForFile(filepath: string): string {
  const ext = filepath.split(".").pop();
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "py":
      return "python";
    case "java":
      return "java";
    case "go":
      return "go";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    default:
      return ext ?? "";
  }
}
