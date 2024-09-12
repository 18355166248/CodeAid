import vscode, { InlineCompletionItem, ProviderResult } from "vscode";
import { AutocompleteInput } from "core";
import { v4 as uuidv4 } from "uuid";
import { CompletionProvider } from 'core/autoComplete/completionProvider';

export class InlineCompletionProvider implements vscode.InlineCompletionItemProvider {
  private completionProvider: CompletionProvider;
  constructor(
    
  ) {
    this.completionProvider = new CompletionProvider();
  }

  public async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken,
    // @ts-ignore
  ): ProviderResult<InlineCompletionItem[]> {
    try {
      const selectedCompletionInfo = context.selectedCompletionInfo;
      const startPos = selectedCompletionInfo?.range.start ?? position;
      const completionRange = new vscode.Range(
        startPos,
        startPos.translate(0, 10),
      );

      const abortController = new AbortController();
      const signal = abortController.signal;
      // 取消请求
      token.onCancellationRequested(() => abortController.abort());

      const input: AutocompleteInput = {
        completionId: uuidv4(),
        filepath: document.uri.fsPath,
        pos: position,
      };

      const completionItem = new vscode.InlineCompletionItem(
        "1234567890",
        completionRange,
      );
      return [completionItem];
    } catch (error) {}
  }
}
