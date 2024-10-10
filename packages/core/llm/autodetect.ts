import { TemplateType } from "../types/chat.type";
import { deepseekEditPrompt, llama3EditPrompt } from "./templates/edit";

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
  explicitTemplate?: string,
) {
  const templateType = explicitTemplate ?? autodetectTemplateType(modelName);
  const templates: Record<string, any> = {};

  let editTemplate = null;

  if (templateType === "llama3") {
    editTemplate = llama3EditPrompt;
  } else if (templateType === "deepseek") {
    editTemplate = deepseekEditPrompt;
  }

  if (editTemplate !== null) {
    templates.edit = editTemplate;
  }
  return templates;
}
