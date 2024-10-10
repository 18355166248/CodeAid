import { CompletionOptions } from "./config.type";

export type ChatMessageRole = "user" | "assistant" | "system";

export type TemplateType = "deepseek" | "llama3";

export interface MessagePart {
  type: "text" | "imageUrl";
  text?: string;
  imageUrl?: { url: string };
}

export type MessageContent = string | MessagePart[];

export interface ChatMessage {
  role: ChatMessageRole;
  content: MessageContent;
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
