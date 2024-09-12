import { TabAutocompleteOptions } from "./completion.type";

type ModelProvider = "ollama";

export interface LLMOptions {
  model: string;
  title?: string;
  provider: ModelProvider;
}

export interface CodeAidConfig {
  tabAutocompleteModels?: LLMOptions[];
  tabAutocompleteOptions?: Partial<TabAutocompleteOptions>;
}
