import { Range } from "../types/base.type";

export function getRangeInString(content: string, range: Range): string {
  const lines = content.split("\n");

  if (range.start.line === range.end.line) {
    return (
      lines[range.start.line].substring(
        range.start.character,
        range.end.character + 1,
      ) ?? ""
    );
  }

  const firstLine =
    lines[range.start.line]?.substring(
      range.start.character,
      lines[range.start.line].length,
    ) ?? "";
  const middleLines = lines.slice(range.start.line + 1, range.end.line);
  const endLine =
    lines[range.end.line]?.substring(0, range.end.character) ?? "";

  return [firstLine, ...middleLines, endLine].join("\n");
}
