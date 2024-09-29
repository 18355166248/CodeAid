import { ChatMessage, MessageContent } from "./chat.type";
import { CompletionOptions } from "./config.type";

export type IProtocol = Record<string, [any, any]>;

export type ProtocolGeneratorType<T> = AsyncGenerator<{
  done?: boolean;
  content: T;
}>;

export type ToCoreFromIdeOrWebviewProtocol = {
  abort: [undefined, void];

  "llm/streamChat": [
    {
      messages: ChatMessage[];
      completionOptions: CompletionOptions;
      title: string;
    },
    ProtocolGeneratorType<MessageContent>,
  ];
  test: [string, string];
};

export type ToIdeFromWebviewProtocol = {};

// webview
export type FromWebviewProtocol = ToCoreFromIdeOrWebviewProtocol;

// core
export type ToCoreProtocol = ToCoreFromIdeOrWebviewProtocol;
export type FromCoreProtocol = {};
