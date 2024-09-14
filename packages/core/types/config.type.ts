import { TabAutocompleteOptions } from "./completion.type";

export type ModelProvider = "ollama" | "openai";

// 大模型配置
export interface LLMOptions {
  model: string;
  title?: string;
}

export interface CLLM extends LLMOptions {
  streamComplete(prompt: string): AsyncGenerator<string>;
}

// 模型本地json配置
export interface ModelDescription {
  model: string;
  title?: string;
  provider: ModelProvider;
}

// 序列化json
export interface SerializedCodeAidConfig {
  tabAutocompleteModel?: ModelDescription;
}

// 配置文件
export interface CodeAidConfig {
  tabAutocompleteModels?: CLLM[];
  tabAutocompleteOptions?: Partial<TabAutocompleteOptions>;
}
