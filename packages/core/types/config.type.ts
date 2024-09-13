import { TabAutocompleteOptions } from "./completion.type";

type ModelProvider = "ollama";

export interface LLMOptions {
  model: string;
  title?: string;
  provider: ModelProvider;
}

export interface CLLM extends LLMOptions {
  streamComplete(prompt: string): AsyncGenerator<string>;
}

export interface CodeAidConfig {
  tabAutocompleteModels?: CLLM[];
  tabAutocompleteOptions?: Partial<TabAutocompleteOptions>;
}
