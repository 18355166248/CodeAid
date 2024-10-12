import { streamDiff } from "../diff/streamDiff";
import { streamLines } from "../diff/utils";
import { gptEditPrompt } from "../llm/templates/edit";
import { ChatMessage } from "../types/chat.type";
import { CLLM } from "../types/config.type";
import { DiffLine } from "../types/diff.type";
import {
  filterCodeBlockLines,
  filterEnglishLinesAtStart,
  skipLines,
  stopAtLines,
} from "./lineStream";

export async function* streamDiffLines(
  prefix: string,
  highlighted: string,
  suffix: string,
  llm: CLLM,
  input: string,
  language?: string,
): AsyncGenerator<DiffLine> {
  // 根据 highlighted 文本的长度，决定如何初始化 oldLines。如果 highlighted 为空，则将 prefix 和 suffix 拼接后拆分最后一行作为 oldLines；如果不为空，则直接将 highlighted 按行拆分。同时，移除每行末尾的空白字符。
  let oldLines =
    highlighted.length > 0
      ? highlighted.split("\n")
      : [(prefix + suffix).split("\n")[prefix.split("\n").length - 1]];

  if (oldLines.length === 1 && oldLines[0].trim() === "") {
    oldLines = [];
  }

  oldLines = oldLines.map((line) => line.trimEnd());

  const prompt = constructPrompt(
    prefix,
    highlighted,
    suffix,
    llm,
    input,
    language,
  );

  // 获取流式结果
  const completion =
    typeof prompt === "string"
      ? llm.streamComplete(prompt, { raw: true })
      : llm.streamChat(prompt, {});

  let lines = streamLines(completion);
  lines = filterEnglishLinesAtStart(lines);
  lines = filterCodeBlockLines(lines);
  lines = stopAtLines(lines, () => {});
  lines = skipLines(lines);

  let diffLines = streamDiff(oldLines, lines);

  for await (const diffLine of diffLines) {
    yield diffLine;
  }
}

/**
 * 构建提示语
 *
 * @param prefix 提示语前缀
 * @param highlighted 需要高亮显示的代码片段
 * @param suffix 提示语后缀
 * @param llm ILLM接口实例
 * @param userInput 用户输入
 * @param language 语言类型，可选参数
 * @returns 返回字符串或ChatMessage数组，具体取决于llm.renderPromptTemplate的实现
 */
function constructPrompt(
  prefix: string,
  highlighted: string,
  suffix: string,
  llm: CLLM,
  userInput: string,
  language?: string,
): string | ChatMessage[] {
  const template = llm.promptTemplates?.edit ?? gptEditPrompt;
  // packages/core/llm/index.ts:118
  return llm.renderPromptTemplate(template, [], {
    userInput,
    prefix,
    codeToEdit: highlighted,
    suffix,
    language: language ?? "",
  });
}
