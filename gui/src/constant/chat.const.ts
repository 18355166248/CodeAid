type ChatModelsType = "llama" | "gpt";

// 模型
export const ChatModelsEnum = {
  "Llama 3": {
    value: "llama3.1:latest",
    label: "llama3(本地)",
    serviceMethod: "chatOllamaGenerate",
    type: "llama" as ChatModelsType,
  },
  starcoder2: {
    value: "starcoder2",
    label: "StarCoder2(本地)",
    serviceMethod: "chatOllamaGenerate",
    type: "llama" as ChatModelsType,
  },
  "deepseek-coder": {
    value: "deepseek-coder:latest",
    label: "DeepSeekCoder(本地)",
    serviceMethod: "chatOllamaGenerate",
    type: "llama" as ChatModelsType,
  },
  azure_openai_gpt_4o: {
    value: "azure_openai_gpt_4o",
    label: "Gpt-4o 128上下文",
    serviceMethod: "chatYiTianMultiModels",
    type: "gpt" as ChatModelsType,
  },
};

export type ChatModelsKey = keyof typeof ChatModelsEnum;
