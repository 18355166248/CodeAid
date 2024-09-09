import vscode, { InlineCompletionItem, ProviderResult } from "vscode";
import { generateCompletions } from "../utils/generateCompletions";

export class InlineCompletionProvider
  implements vscode.InlineCompletionItemProvider
{
  constructor() {}

  public async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken,
    // @ts-ignore
  ): ProviderResult<InlineCompletionItem[]> {
    const textBeforeCursor = document.getText(
      new vscode.Range(position.with(undefined, 0), position),
    );
    console.log("🚀 ~ textBeforeCursor:", textBeforeCursor);
    // const completionItems = [];
    // const completionItem = new vscode.InlineCompletionItem("HelloWorld");
    // console.log(
    //   "🚀 ~ InlineCompletionProvider ~ completionItem:",
    //   completionItem,
    // );
    // completionItem.insertText = "Hello, World!";
    // completionItems.push(completionItem);

    // 根据文本和上下文生成补全项
    const completions = generateCompletions(textBeforeCursor);

    return completions.map(
      (completion) => new vscode.InlineCompletionItem(completion),
    );
  }
}
