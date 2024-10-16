import { LineStream } from "../types/chat.type";

export const CODE_KEYWORDS_ENDING_IN_SEMICOLON = ["def"];

export const ENGLISH_START_PHRASES = [
  "here is",
  "here's",
  "sure, here",
  "sure thing",
  "sure!",
  "to fill",
  "certainly",
  "of course",
  "the code should",
];
export const LINES_TO_REMOVE_BEFORE_START = [
  "<COMPLETION>",
  "[CODE]",
  "<START EDITING HERE>",
];
export const CODE_START_BLOCK = "[/CODE]";
export const LINES_TO_SKIP = ["</START EDITING HERE>"];
export const LINES_TO_STOP_AT = ["# End of file.", "<STOP EDITING HERE"];

function isEnglishFirstLine(line: string) {
  line = line.trim().toLowerCase();

  if (
    line.endsWith(":") &&
    !CODE_KEYWORDS_ENDING_IN_SEMICOLON.some((keyword) =>
      line.startsWith(keyword),
    )
  ) {
    return true;
  }

  return ENGLISH_START_PHRASES.some((phrase) => line.startsWith(phrase));
}
/**
 * 判断给定的行是否在代码块的开始之前需要被移除
 *
 * @param line 需要判断的行文本
 * @returns 如果需要移除，则返回 true；否则返回 false
 */
function shouldRemoveLineBeforeStart(line: string): boolean {
  return (
    line.trimStart().startsWith("```") ||
    LINES_TO_REMOVE_BEFORE_START.some((l) => line.trim() === l)
  );
}
/**
 * 判断是否应该换行并停止处理当前行
 *
 * @param line 当前处理的行
 * @returns 如果应该换行并停止处理，则返回处理后的行；否则返回 undefined
 */
function shouldChangeLineAndStop(line: string): string | undefined {
  if (line.trimStart() === "```") {
    return "";
  }

  if (line.includes(CODE_START_BLOCK)) {
    return line.split(CODE_START_BLOCK)[0].trimEnd();
  }

  return undefined;
}

/**
 * 过滤掉文件开头为空的行和英文开头的行，只返回之后的行
 *
 * @param lines 文件行流
 * @returns 返回过滤后的行流
 */
export async function* filterEnglishLinesAtStart(lines: LineStream) {
  let i = 0;
  let wasEnglishFirstLine = false;
  for await (const line of lines) {
    if (i === 0 && line.trim() === "") {
      continue;
    }

    if (i === 0) {
      if (isEnglishFirstLine(line)) {
        wasEnglishFirstLine = true;
        i++;
        continue;
      }
    } else if (i === 1 && wasEnglishFirstLine && line.trim() === "") {
      i++;
      continue;
    }
    i++;
    yield line;
  }
}

/**
 * 从原始行流中过滤代码块行
 * @param rawLines 原始行流
 * @returns 过滤后的行流
 */
export async function* filterCodeBlockLines(rawLines: LineStream): LineStream {
  let seenValidLine = false;
  let waitingToSeeIfLineIsLast = undefined;

  for await (const line of rawLines) {
    // Filter out starting ```
    if (!seenValidLine) {
      if (shouldRemoveLineBeforeStart(line)) {
        continue;
      }
      seenValidLine = true;
    }

    // Filter out ending ```
    if (typeof waitingToSeeIfLineIsLast !== "undefined") {
      yield waitingToSeeIfLineIsLast;
      waitingToSeeIfLineIsLast = undefined;
    }

    const changedEndLine = shouldChangeLineAndStop(line);
    if (typeof changedEndLine === "string") {
      // TODO 不需要返回闭合标签 直接停止即可
      yield changedEndLine;
      return;
    }

    if (line.startsWith("```")) {
      waitingToSeeIfLineIsLast = line;
    } else {
      yield line;
    }
  }
}

/**
 * 在指定行停止的异步生成器函数
 * @param stream LineStream 输入流，用于逐行读取数据
 * @param fullStop 当检测到指定行时执行的回调函数
 * @param linesToStopAt 需要停止的行内容的数组，默认为 LINES_TO_STOP_AT
 * @returns 返回处理后的 LineStream，当检测到指定行时停止读取并返回之前读取的行
 */
export async function* stopAtLines(
  stream: LineStream,
  fullStop: () => void,
  linesToStopAt: string[] = LINES_TO_STOP_AT,
): LineStream {
  for await (const line of stream) {
    if (linesToStopAt.some((stopAt) => line.trim().includes(stopAt))) {
      fullStop();
      break;
    }
    yield line;
  }
}

/**
 * 跳过指定的行
 * @param stream 输入的 LineStream 对象
 * @returns 返回一个新的 LineStream 对象，其中跳过了指定要跳过的行
 */
export async function* skipLines(stream: LineStream): LineStream {
  for await (const line of stream) {
    if (!LINES_TO_SKIP.some((skipAt) => line.startsWith(skipAt))) {
      yield line;
    }
  }
}
