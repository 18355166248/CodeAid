import { BaseLLM } from "../llm";
import { llmFromDescription } from "../llm/list";
import { CodeAidConfig, SerializedCodeAidConfig } from "../types/config.type";

async function intermediateToFinalConfig(config?: SerializedCodeAidConfig) {
  let tabAutocompleteModels: BaseLLM[] = [];
  let models: BaseLLM[] = [];
  if (config?.models) {
    models = (
      await Promise.all(
        config.models.map(async (desc) => {
          const llm = await llmFromDescription(desc);
          return llm;
        }),
      )
    ).filter((x) => x !== undefined);
  }
  if (config?.tabAutocompleteModel) {
    tabAutocompleteModels = (
      await Promise.all(
        [config.tabAutocompleteModel].map(async (desc) => {
          const llm = await llmFromDescription(desc);
          return llm;
        }),
      )
    ).filter((x) => x !== undefined);
  }

  return {
    ...config,
    models,
    tabAutocompleteModels,
  };
}

export async function loadFullConfigNode(
  overrideConfigJson?: SerializedCodeAidConfig,
): Promise<CodeAidConfig> {
  const finalConfig = await intermediateToFinalConfig(overrideConfigJson);
  return finalConfig;
}
