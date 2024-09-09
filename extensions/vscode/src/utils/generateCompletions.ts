export function generateCompletions(text: string) {
  // 这里可以根据具体需求实现复杂的补全逻辑
  if (text.endsWith("console")) {
    console.log("🚀 ~ generateCompletions ~ text:", text);
    return [".log()", ".error()", ".warn()"];
  }
  return [];
}
