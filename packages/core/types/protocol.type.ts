import { ChatMessage, MessageContent } from "./chat.type";
import { CompletionOptions } from "./config.type";
import {
  ToWebviewFromIdeOrCoreProtocol,
  ToWebviewFromIdeProtocol,
} from "./ideWebview.type";

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
// 从webview到Ide或者到core的协议
export type FromWebviewProtocol = ToCoreFromIdeOrWebviewProtocol;
// 从webview来的协议
export type ToWebviewProtocol = ToWebviewFromIdeOrCoreProtocol &
  ToWebviewFromIdeProtocol;

// core
export type ToCoreProtocol = ToCoreFromIdeOrWebviewProtocol;
export type FromCoreProtocol = {};
