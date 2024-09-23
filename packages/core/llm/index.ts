import { CLLM, CompletionOptions, LLMOptions } from "../types/config.type";
import { DEFAULT_CONTEXT_LENGTH, DEFAULT_MAX_TOKENS } from "./constants";

export class BaseLLM implements CLLM {
  private _llmOptions: LLMOptions;
  model: string;
  title?: string | undefined;
  completionOptions: CompletionOptions;
  contextLength: number;

  constructor(options: LLMOptions) {
    this._llmOptions = options;
    this.model = options.model;
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
    throw new Error("Not implemented");
  }
}
