import { ChatMessage, PromptLog } from "../types/chat.type";
import { CLLM, CompletionOptions, LLMOptions } from "../types/config.type";
import { DEFAULT_CONTEXT_LENGTH, DEFAULT_MAX_TOKENS } from "./constants";

export class BaseLLM implements CLLM {
  private _llmOptions: LLMOptions;
  model: string;
  title?: string;
  completionOptions: CompletionOptions;
  contextLength: number;

  constructor(options: LLMOptions) {
    this._llmOptions = options;
    this.model = options.model;
    this.title = options.title;
    this.contextLength =
      options.completionOptions?.options?.num_ctx || DEFAULT_CONTEXT_LENGTH;
    this.completionOptions = {
      ...options.completionOptions,
      options: {
        ...options.completionOptions?.options,
        num_predict:
          options.completionOptions?.options?.num_predict || DEFAULT_MAX_TOKENS,
      },
    };
  }

  async *streamComplete(
    _prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    let completion = "";
    for await (const chunk of this._streamComplete(_prompt, options)) {
      completion += chunk;
      yield chunk;
    }
    return {
      completion,
    };
  }

  protected async *_streamComplete(
    _prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    throw new Error("_streamComplete Not implemented");
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    completionOptions: CompletionOptions = {},
    cancelToken?: AbortSignal,
  ): AsyncGenerator<ChatMessage> {
    throw new Error("_streamChat Not implemented");
  }

  async *streamChat(
    messages: ChatMessage[],
    completionOptions: CompletionOptions = {},
    cancelToken?: AbortSignal,
  ): AsyncGenerator<ChatMessage, PromptLog> {
    const prompt = this._formatChatMessages(messages);
    let completion = "";
    try {
      for await (const chunk of this._streamChat(
        messages,
        completionOptions,
        cancelToken,
      )) {
        completion += chunk;
        yield chunk;
      }
    } catch (error) {
      console.log("🚀 ~ BaseLLM ~ error:", error);
      throw error;
    }
    return {
      prompt,
      completion,
      modelTitle: this.title ?? completionOptions.model ?? "",
      completionOptions,
    };
  }

  getModel(): string {
    return this.model;
  }

  private _formatChatMessages(messages: ChatMessage[]): string {
    const messagesCopy = messages ? messages.map((v) => ({ ...v })) : [];
    let formatStr = "";
    for (const msg of messagesCopy) {
      formatStr += `<${msg.role}>\n${msg.content || ""}\n\n`;
    }

    return formatStr;
  }
}
