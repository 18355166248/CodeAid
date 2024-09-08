import vscode, { CompletionItem, ProviderResult } from "vscode";

export class CompletionProvider implements vscode.CompletionItemProvider {
  constructor() {
    console.log("🚀 ~ CompletionProvider:", CompletionProvider);
  }

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
    // @ts-ignore
  ): ProviderResult<CompletionItem[]> {
    const completionItems = [];
    const completionItem = new vscode.CompletionItem("HelloWorld");
    console.log("🚀 ~ CompletionProvider ~ completionItem:", completionItem);
    completionItem.insertText = "Hello, World!";
    completionItems.push(completionItem);

    return completionItems;
  }
}
