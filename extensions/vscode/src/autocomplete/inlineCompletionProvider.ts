import vscode, { InlineCompletionItem, ProviderResult } from "vscode";

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
    const selectedCompletionInfo = context.selectedCompletionInfo;
    const startPos = selectedCompletionInfo?.range.start ?? position;
    const completionRange = new vscode.Range(
      startPos,
      startPos.translate(0, 10),
    );
    const completionItem = new vscode.InlineCompletionItem(
      "1234567890",
      completionRange,
    );
    return [completionItem];
  }
}
