import { TemplateType } from "../types/chat.type";
import { ModelProvider } from "../types/config.type";
import {
  deepseekTemplateMessages,
  llama3TemplateMessages,
  openchatTemplateMessages,
} from "./templates/chat";
import {
  deepseekEditPrompt,
  llama3EditPrompt,
  osModelsEditPrompt,
  openchatEditPrompt,
} from "./templates/edit";

const USES_OS_MODELS_EDIT_PROMPT: TemplateType[] = ["deepseek", "llama3"];

const PROVIDER_HANDLES_TEMPLATING: ModelProvider[] = ["openchat", "ollama"];

/**
 * 自动检测模板类型
 *
 * @param model 模型名称
 * @returns 模板类型，如果无法识别则返回 undefined
 */
export function autodetectTemplateType(
  modelName: string,
): TemplateType | undefined {
  const lowerStr = modelName.toLowerCase();
  if (lowerStr.includes("gpt3")) {
    return undefined;
  }

  if (lowerStr.includes("llama3")) {
    return "llama3";
  }

  return undefined;
}

/**
 * 自动检测提示模板
 *
 * @param model 模型名称
 * @param explicitTemplate 显式指定的模板类型，可选参数，默认为undefined
 * @returns 包含编辑模板的对象
 */
export function autodetectPromptTemplate(
  modelName: string,
  explicitTemplate?: TemplateType,
) {
  const templateType = explicitTemplate ?? autodetectTemplateType(modelName);
  const templates: Record<string, any> = {};

  let editTemplate = null;

  if (templateType && USES_OS_MODELS_EDIT_PROMPT.includes(templateType)) {
    editTemplate = osModelsEditPrompt;
  } else if (templateType === "openchat") {
    editTemplate = openchatEditPrompt;
  }

  // TODO: 后续需要删除
  // if (templateType === "llama3") {
  //   editTemplate = llama3EditPrompt;
  // } else if (templateType === "deepseek") {
  //   editTemplate = deepseekEditPrompt;
  // }

  if (editTemplate !== null) {
    templates.edit = editTemplate;
  }
  return templates;
}

/**
 * 自动检测模板函数
 * @param model 模型名称
 * @param provider 模型提供者
 * @param explicitTemplate 显式指定的模板类型，可选
 * @returns 模板消息对象，若未检测到合适的模板则返回 null
 */
export function autodetectTemplateFunction(
  model: string,
  provider: ModelProvider,
  explicitTemplate: TemplateType | undefined = undefined,
) {
  if (
    explicitTemplate === undefined &&
    PROVIDER_HANDLES_TEMPLATING.includes(provider)
  ) {
    return null;
  }

  const templateType = explicitTemplate ?? autodetectTemplateType(model);

  if (templateType) {
    const mapping: Record<TemplateType, any> = {
      deepseek: deepseekTemplateMessages,
      llama3: llama3TemplateMessages,
      openchat: openchatTemplateMessages,
    };

    return mapping[templateType];
  }

  return null;
}
