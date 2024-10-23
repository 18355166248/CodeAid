// tokens计算相关

import { Tiktoken, encodingForModel as _encodingForModel } from "js-tiktoken";
import { MessageContent } from "../types/chat.type";
import { autodetectTemplateType } from "./autodetect";
import llamaTokenizer from "llama-tokenizer-js";

interface Encoding {
  encode: Tiktoken["encode"];
  decode: Tiktoken["decode"];
}

class LlamaEncoding implements Encoding {
  encode(text: string) {
    return llamaTokenizer.encode(text);
  }
  decode(tokens: number[]) {
    return llamaTokenizer.decode(tokens);
  }
}

let gptEncoding: Encoding;
const llamaEncoding = new LlamaEncoding();

/**
 * 从提示的顶部删除行，直到剩余的总标记数不超过最大标记数限制。
 *
 * @param prompt 输入的文本提示
 * @param maxTokens 最大标记数限制
 * @param modelName 模型名称，用于计算标记数
 * @returns 处理后的文本提示
 */
export function pruneLinesFromTop(
  prompt: string,
  maxTokens: number,
  modelName: string,
): string {
  let totalTokens = countTokens(prompt, modelName);
  const lines = prompt.split("\n");
  while (totalTokens > maxTokens && lines.length > 0) {
    const firstLine = lines.shift()!;
    totalTokens -= countTokens(firstLine, modelName);
  }
  return lines.join("\n");
}

/**
 * 计算给定内容中的标记数量
 *
 * @param content 要计算标记数量的消息内容
 * @param modelName 模型名称，默认为 "llama2"，因为分词器倾向于产生更多的标记
 * @returns 标记的数量
 */
function countTokens(prompt: MessageContent, modelName = "llama2") {
  const encoding = encodingForModel(modelName);
  if (Array.isArray(prompt)) {
    throw new Error("暂不支持");
  } else {
    return encoding.encode(prompt ?? "", "all", []).length;
  }
}

/**
 * 根据模型名称获取对应的编码方式
 *
 * @param modelName 模型名称
 * @returns 返回对应模型的编码方式
 */
function encodingForModel(modelName: string) {
  const modelType = autodetectTemplateType(modelName);
  if (!modelType) {
    if (!gptEncoding) {
      gptEncoding = _encodingForModel("gpt-4");
    }
    return gptEncoding;
  }

  return llamaEncoding;
}
