import { MessageContent } from "../types/chat.type";

/**
 * 从消息内容中移除所有图片，只保留文本内容
 * @param content 消息内容
 * @returns 过滤后的文本内容
 */
export function stripImages(content: MessageContent): string {
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n");
  }
  return content;
}
