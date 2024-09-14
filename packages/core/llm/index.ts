import { CLLM, LLMOptions } from "../types/config.type";

export class BaseLLM implements CLLM {
  private _llmOptions: LLMOptions;
  model: string;
  title?: string | undefined;

  constructor(options: LLMOptions) {
    this._llmOptions = options;
    this.model = options.model;
  }

  async *streamComplete(_prompt: string): AsyncGenerator<string> {}

  protected async *_streamComplete(_prompt: string): AsyncGenerator<string> {
    throw new Error("Not implemented");
  }
}
