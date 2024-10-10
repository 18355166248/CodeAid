/**
 * 自动检测模板类型
 *
 * @param model 模型名称
 * @returns 模板类型，如果无法识别则返回 undefined
 */
export function autodetectTemplateType(modelName: string) {
  const lowerStr = modelName.toLowerCase();
  if (lowerStr.includes("gpt3")) {
    return undefined;
  }

  if (lowerStr.includes("llama3")) {
    return "llama3";
  }

  return undefined;
}
