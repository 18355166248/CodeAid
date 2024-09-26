import { ChatMessage, PromptLog } from "./chat.type";
import { TabAutocompleteOptions } from "./completion.type";

export type ModelProvider = "ollama" | "openai";

// 大模型配置
export interface LLMOptions {
  model: string;
  title?: string;
  completionOptions?: CompletionOptions;
}

export interface CLLM extends LLMOptions {
  streamComplete(
    prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string>;

  streamChat(
    messages: ChatMessage[],
    completionOptions: CompletionOptions,
  ): AsyncGenerator<ChatMessage, PromptLog>;
}

export interface CompletionOptions extends BaseCompletionOptions {
  model?: string;
}

// https://github.com/ollama/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values
export interface BaseCompletionOptions {
  options?: {
    temperature?: number;
    mirostat?: number;
    mirostat_eta?: number;
    mirostat_tau?: number;
    num_ctx?: number;
    seed?: number;
    stop?: string[];
    tfs_z?: number;
    num_predict?: number;
    top_k?: number;
    top_p?: number;
    min_p?: number;
  };
  format?: string;
  keep_alive?: number;
  raw?: boolean;
  stream?: boolean;
  context?: number[];
}

// 模型本地json配置
export interface ModelDescription {
  model: string;
  title?: string;
  provider: ModelProvider;
}

// 序列化json
export interface SerializedCodeAidConfig {
  models: ModelDescription[];
  tabAutocompleteModel?: ModelDescription;
}

// 配置文件
export interface CodeAidConfig {
  models: CLLM[];
  tabAutocompleteModels?: CLLM[];
  tabAutocompleteOptions?: Partial<TabAutocompleteOptions>;
}
