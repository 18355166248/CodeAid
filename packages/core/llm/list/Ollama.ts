import { BaseLLM } from "..";
import { LLMOptions, ModelProvider } from "../../types/config.type";

export class Ollama extends BaseLLM {
  static providerName: ModelProvider = "ollama";

  constructor(options: LLMOptions) {
    super(options);
  }

  protected async *_streamComplete(_prompt: string): AsyncGenerator<string> {
    throw new Error("Ollama Method not implemented.");
  }
}
