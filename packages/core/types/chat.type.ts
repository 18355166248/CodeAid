import { CompletionOptions } from "./config.type";

export type ChatMessageRole = "user" | "assistant" | "system";

export type TemplateType = "deepseek" | "llama3" | "openchat";

export interface MessagePart {
  type: "text" | "imageUrl";
  text?: string;
  imageUrl?: { url: string };
}

export type MessageContent = string | MessagePart[];

export interface ChatMessage {
  role: ChatMessageRole;
  content: MessageContent;
  rangeInFileWithContents?: RangeInFileWithContents;
}

export interface PromptLog {
  modelTitle: string;
  completionOptions: CompletionOptions;
  prompt: string;
  completion: string;
}

export type PromptTemplate =
  | string
  | ((
      history: ChatMessage[],
      otherData: Record<string, string>,
    ) => string | ChatMessage[]);

export type LineStream = AsyncGenerator<string>;

export interface RangeInFileWithContents {
  filepath: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  contents: string;
}
