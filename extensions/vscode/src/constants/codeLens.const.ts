import { ToWebviewProtocol } from "core";

export const CodeLensNames: {
  title: string;
  command: keyof ToWebviewProtocol;
}[] = [
  {
    title: "函数注释",
    command: "extension.addComment",
  },
  {
    title: "生成单测",
    command: "extension.generateTest",
  },
  {
    title: "代码解释",
    command: "extension.explainCode",
  },
];
