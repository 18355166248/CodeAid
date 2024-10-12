import { distance } from "fastest-levenshtein";
import { ChatMessage, LineStream } from "../types/chat.type";

export type MatchLineResult = {
  /**
   * -1 if it's a new line, otherwise the index of the first match
   * in the old lines.
   */
  matchIndex: number;
  isPerfectMatch: boolean;
  newLine: string;
};

const END_BRACKETS = ["}", "});", "})"];

export async function* streamLines(
  streamCompletion: AsyncGenerator<string | ChatMessage>,
): LineStream {
  let buffer = "";

  for await (const update of streamCompletion) {
    if (typeof update === "string") {
      buffer += update;
      console.log("buffer:", buffer);
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        yield line;
      }
    } else {
      break;
    }
  }
  if (buffer.length > 0) {
    yield buffer;
  }
}

/**
 * 判断两行字符串是否完全相同且非空
 *
 * @param lineA 第一行字符串
 * @param lineB 第二行字符串
 * @returns 如果两行字符串完全相同且非空，则返回 true；否则返回 false
 */
function linesMatchPerfectly(lineA: string, lineB: string): boolean {
  return lineA === lineB && lineA !== "";
}

function linesMatch(lineA: string, lineB: string, linesBetween = 0): boolean {
  // Require a perfect (without padding) match for these lines
  // Otherwise they are edit distance 1 from empty lines and other single char lines (e.g. each other)
  if (["}", "*", "});", "})"].includes(lineA.trim())) {
    return lineA.trim() === lineB.trim();
  }

  const d = distance(lineA, lineB);

  return (
    // Should be more unlikely for lines to fuzzy match if they are further away
    (d / Math.max(lineA.length, lineB.length) <=
      Math.max(0, 0.48 - linesBetween * 0.06) ||
      lineA.trim() === lineB.trim()) &&
    lineA.trim() !== ""
  );
}

/**
 * Used to find a match for a new line in an array of old lines.
 *
 * Return the index of the first match and whether it is a perfect match
 * Also return a version of the line with correct indentation if needs fixing
 */
/**
 * 匹配一行文本与旧行文本数组中的某一行
 *
 * @param newLine 要匹配的新行文本
 * @param oldLines 旧行文本数组
 * @param permissiveAboutIndentation 是否允许宽松缩进匹配，默认为 false
 * @returns 匹配结果，包含匹配索引、是否完全匹配以及新行文本
 */
export function matchLine(
  newLine: string,
  oldLines: string[],
  permissiveAboutIndentation = false,
): MatchLineResult {
  // 仅当下一行为空行时才匹配空行
  // Only match empty lines if it's the next one:
  if (newLine.trim() === "" && oldLines[0]?.trim() === "") {
    return {
      matchIndex: 0,
      isPerfectMatch: true,
      newLine: newLine.trim(),
    };
  }

  // 判断当前行是否为结束括号行
  const isEndBracket = END_BRACKETS.includes(newLine.trim());

  for (let i = 0; i < oldLines.length; i++) {
    // 如果当前行是结束括号行且距离太远，则不匹配
    // Don't match end bracket lines if too far away
    if (i > 4 && isEndBracket) {
      return { matchIndex: -1, isPerfectMatch: false, newLine };
    }

    // 如果当前行与旧行完全匹配
    if (linesMatchPerfectly(newLine, oldLines[i])) {
      return { matchIndex: i, isPerfectMatch: true, newLine };
    }
    // 如果当前行与旧行部分匹配
    if (linesMatch(newLine, oldLines[i], i)) {
      // 修正缩进，但仅对足够长的行以避免匹配空白或短行
      // This is a way to fix indentation, but only for sufficiently long lines to avoid matching whitespace or short lines
      if (
        newLine.trimStart() === oldLines[i].trimStart() &&
        (permissiveAboutIndentation || newLine.trim().length > 8)
      ) {
        return {
          matchIndex: i,
          isPerfectMatch: true,
          newLine: oldLines[i],
        };
      }
      return { matchIndex: i, isPerfectMatch: false, newLine };
    }
  }

  // 没有找到匹配的行
  return { matchIndex: -1, isPerfectMatch: false, newLine };
}
